/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { AuthServices } from "./auth.services";
import { sendResponse } from "../../utilities/sendResponse";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { setAuthCookie } from "../../utilities/setCookie";

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
    message: "User logged in successfully.",
    data: tokeInfo,
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

  await AuthServices.resetPassword(oldPassword, newPassword, decodedToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password changed successfully.",
    data: null,
  });
};

export const AuthControllers = {
  credentialLogin,
  getNewAccessToken,
  resetPassword,
};
