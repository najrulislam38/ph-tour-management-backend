/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { AuthServices } from "./auth.services";
import { sendResponse } from "../../utilities/sendResponse";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { setAuthCookie } from "../../utilities/setCookie";
import { JwtPayload } from "jsonwebtoken";
import { createUserTokens } from "../../utilities/userTokens";
import { envVariables } from "../../../config/env";

const credentialLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const loginInfo = await AuthServices.credentialLogin(req.body);

  // res.cookie("accessToken", loggedInfo.accessToken, {
  //   httpOnly: true,
  //   secure: false,
  // });

  // res.cookie("refreshToken", loggedInfo.refreshToken, {
  //   httpOnly: true,
  //   secure: false,
  // });

  setAuthCookie(res, loginInfo);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully.",
    data: loginInfo,
  });
};

const getNewAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "No refresh token received from cookies."
    );
  }
  // const refreshToken = req.headers.authorization;
  const tokeInfo = await AuthServices.getNewAccessToken(refreshToken as string);

  // res.cookie("accessToken", tokeInfo.accessToken, {
  //   httpOnly: true,
  //   secure: false,
  // });

  setAuthCookie(res, tokeInfo);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "New Access token retrieved successfully.",
    data: tokeInfo,
  });
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Logged out successfully.",
    data: null,
  });
};

const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const decodedToken = req.user;

  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  await AuthServices.resetPassword(
    oldPassword,
    newPassword,
    decodedToken as JwtPayload
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password changed successfully.",
    data: null,
  });
};

const googleCallbackController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  // console.log("user", user);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const tokenInfo = createUserTokens(user);
  setAuthCookie(res, tokenInfo);

  // sendResponse(res, {
  //   statusCode: httpStatus.OK,
  //   success: true,
  //   message: "Password changed successfully.",
  //   data: null,
  // });

  res.redirect(envVariables.FRONTEND_URL);
};

export const AuthControllers = {
  credentialLogin,
  getNewAccessToken,
  resetPassword,
  logout,
  googleCallbackController,
};
