import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { verifiedToken } from "../utilities/jwt";
import { envVariables } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";
import httpStatus from "http-status-codes";
import { IsActive } from "../modules/user/user.interface";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken =
        (await req.headers.authorization) || req.cookies.accessToken;

      if (!accessToken) {
        throw new AppError(403, "No token retrieve");
      }

      const verifiedToked = verifiedToken(
        accessToken,
        envVariables.JWT_ACCESS_SECRET
      ) as JwtPayload;

      const isUserExist = await User.findOne({
        email: verifiedToked.email,
      });

      if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User email not exist.");
      }

      if (!isUserExist.isVerified) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is not verified");
      }

      if (
        isUserExist.isActive === IsActive.BLOCKED ||
        isUserExist.isActive === IsActive.INACTIVE
      ) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `User is ${isUserExist.isActive}`
        );
      }

      if (isUserExist.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
      }

      if (!authRoles.includes(verifiedToked.role)) {
        throw new AppError(404, "You are not permitted to view this route");
      }

      req.user = verifiedToked;

      next();
    } catch (error) {
      next(error);
    }
  };
