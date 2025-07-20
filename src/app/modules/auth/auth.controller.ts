/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { AuthServices } from "./auth.services";
import { sendResponse } from "../../utilities/sendResponse";
import httpStatus from "http-status-codes";

const credentialLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const loggedInfo = await AuthServices.credentialLogin(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully.",
    data: loggedInfo,
  });
};

const getNewAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const refreshToken = req.cookies.refreshToken;
  const refreshToken = req.headers.authorization;
  const tokeInfo = await AuthServices.getNewAccessToken(refreshToken as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully.",
    data: tokeInfo,
  });
};

export const AuthControllers = {
  credentialLogin,
  getNewAccessToken,
};
