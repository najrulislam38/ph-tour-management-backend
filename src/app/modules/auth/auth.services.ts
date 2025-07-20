import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.mode";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";

import {
  createNewAccessTokenWithRefreshToken,
  createUserTokens,
} from "../../utilities/userTokens";

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

  // const jwtPayload = {
  //   userId: isUserExist._id,
  //   email: isUserExist.email,
  //   role: isUserExist.role,
  // };

  // const accessToken = generateToken(
  //   jwtPayload,
  //   envVariables.JWT_ACCESS_SECRET,
  //   envVariables.JWT_ACCESS_EXPIRES
  // );

  // const refreshToken = generateToken(
  //   jwtPayload,
  //   envVariables.JWT_REFRESH_SECRET,
  //   envVariables.JWT_REFRESh_EXPIRES
  // );

  const userTokens = createUserTokens(isUserExist);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: pass, ...rest } = isUserExist.toObject();

  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user: rest,
  };
};
const getNewAccessToken = async (refreshToken: string) => {
  // const verifiedRefreshToken = (await verifiedToken(
  //   refreshToken,
  //   envVariables.JWT_REFRESH_SECRET
  // )) as JwtPayload;

  // const isUserExist = await User.findOne({ email: verifiedRefreshToken.email });

  // if (!isUserExist) {
  //   throw new AppError(httpStatus.BAD_REQUEST, "User email not exist.");
  // }

  // if (
  //   isUserExist.isActive === IsActive.BLOCKED ||
  //   isUserExist.isActive === IsActive.INACTIVE
  // ) {
  //   throw new AppError(
  //     httpStatus.BAD_REQUEST,
  //     `User is ${isUserExist.isActive}`
  //   );
  // }

  // if (isUserExist.isDeleted) {
  //   throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
  // }

  // const jwtPayload = {
  //   userId: isUserExist._id,
  //   email: isUserExist.email,
  //   role: isUserExist.role,
  // };

  // const accessToken = generateToken(
  //   jwtPayload,
  //   envVariables.JWT_ACCESS_SECRET,
  //   envVariables.JWT_ACCESS_EXPIRES
  // );

  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );

  return {
    accessToken: newAccessToken,
  };
};

export const AuthServices = {
  credentialLogin,
  getNewAccessToken,
};
