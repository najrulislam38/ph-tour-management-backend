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

export const AuthControllers = {
  credentialLogin,
};
