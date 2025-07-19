import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.mode";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { envVariables } from "../../../config/env";
import { JwtPayload } from "jsonwebtoken";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist.");
  }

  const hashPass = await bcryptjs.hash(
    password as string,
    Number(envVariables.BCRYPT_SALT_ROUND)
  );

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    password: hashPass,
    auths: [authProvider],
    ...rest,
  });
  return user;
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  /**
   * email - can not update
   * name, phone, password, address,
   * only admin, super admin - role, isDeleted
   */

  const isUserExist = await User.findById(userId);

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  if (payload.role) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUISE) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized.");
    }

    if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized.");
    }
  }

  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUISE) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized.");
    }
  }

  if (payload.password) {
    payload.password = await bcryptjs.hash(
      payload.password,
      Number(envVariables.BCRYPT_SALT_ROUND)
    );
  }

  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdatedUser;
};

const getAllUsers = async () => {
  const users = await User.find({});
  const totalUsers = await User.countDocuments();
  return {
    data: users,
    meta: totalUsers,
  };
};

export const UserServices = {
  createUser,
  getAllUsers,
  updateUser,
};

// route matching -> controller -> service -> model -> database/DB
