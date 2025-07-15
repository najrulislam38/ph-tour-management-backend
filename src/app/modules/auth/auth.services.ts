import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.mode";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const credentialLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User email not exist.");
  }

  const isPasswordMatched = await bcryptjs.compare(
    password as string,
    isUserExist.password as string
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password didn't matched.");
  }

  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const accessToken = await jwt.sign(jwtPayload, "secret", {
    expiresIn: "1d",
  });

  return {
    accessToken,
  };
};

export const AuthServices = {
  credentialLogin,
};
