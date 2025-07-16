import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.mode";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { envVariables } from "../../../config/env";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist.");
  }

  const hashPass = await bcryptjs.hash(
    password as string,
    envVariables.BCRYPT_SALT_ROUND
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
};

// route matching -> controller -> service -> model -> database/DB
