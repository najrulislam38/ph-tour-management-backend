/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../../errorHelpers/AppError";
// import { IUser } from "../user/user.interface";
import { User } from "../user/user.mode";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";

import {
  createNewAccessTokenWithRefreshToken,
  // createUserTokens,
} from "../../utilities/userTokens";
import { JwtPayload } from "jsonwebtoken";
import { envVariables } from "../../../config/env";
import { IAuthProvider } from "../user/user.interface";

// general credential login implement
// const credentialLogin = async (payload: Partial<IUser>) => {
//   const { email, password } = payload;

//   const isUserExist = await User.findOne({ email });

//   if (!isUserExist) {
//     throw new AppError(httpStatus.BAD_REQUEST, "User email not exist.");
//   }

//   const isPasswordMatched = await bcryptjs.compare(
//     password as string,
//     isUserExist.password as string
//   );

//   if (!isPasswordMatched) {
//     throw new AppError(httpStatus.BAD_REQUEST, "Password didn't matched.");
//   }

//   // const jwtPayload = {
//   //   userId: isUserExist._id,
//   //   email: isUserExist.email,
//   //   role: isUserExist.role,
//   // };

//   // const accessToken = generateToken(
//   //   jwtPayload,
//   //   envVariables.JWT_ACCESS_SECRET,
//   //   envVariables.JWT_ACCESS_EXPIRES
//   // );

//   // const refreshToken = generateToken(
//   //   jwtPayload,
//   //   envVariables.JWT_REFRESH_SECRET,
//   //   envVariables.JWT_REFRESh_EXPIRES
//   // );

//   const userTokens = createUserTokens(isUserExist);

//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const { password: pass, ...rest } = isUserExist.toObject();

//   return {
//     accessToken: userTokens.accessToken,
//     refreshToken: userTokens.refreshToken,
//     user: rest,
//   };
// };

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

const changePassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(decodedToken.userId);

  const isOldPasswordMatch = await bcryptjs.compare(
    oldPassword,
    user!.password as string
  );

  if (!isOldPasswordMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Old password does not match.");
  }

  user!.password = await bcryptjs.hash(
    newPassword,
    Number(envVariables.JWT_ACCESS_SECRET)
  );
  user!.save();
};

const resetPassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  // const user = await User.findById(decodedToken.userId);

  // const isOldPasswordMatch = await bcryptjs.compare(
  //   oldPassword,
  //   user!.password as string
  // );

  // if (!isOldPasswordMatch) {
  //   throw new AppError(httpStatus.UNAUTHORIZED, "Old password does not match.");
  // }

  // user!.password = await bcryptjs.hash(
  //   newPassword,
  //   Number(envVariables.JWT_ACCESS_SECRET)
  // );
  // user!.save();

  return {};
};

const setPassword = async (userId: string, plainPassword: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(404, "User Not Found!");
  }

  if (
    user.password &&
    user.auths.some((providerObject) => providerObject.provider === "google")
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You have already set your password. Now you can change the password from your profile password update"
    );
  }

  const hashedPassword = await bcryptjs.hash(
    plainPassword,
    Number(envVariables.BCRYPT_SALT_ROUND)
  );

  const credentialProvider: IAuthProvider = {
    provider: "credentials",
    providerId: user.email,
  };

  const auths: IAuthProvider[] = [...user.auths, credentialProvider];

  user.auths = auths;

  await user.save();

  return {};
};

export const AuthServices = {
  // credentialLogin,
  getNewAccessToken,
  changePassword,
  resetPassword,
  setPassword,
};
