import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { verifiedToken } from "../utilities/jwt";
import { envVariables } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = await req.headers.authorization;

      if (!accessToken) {
        throw new AppError(403, "No token retrieve");
      }

      const verifiedToked = verifiedToken(
        accessToken,
        envVariables.JWT_ACCESS_SECRET
      ) as JwtPayload;

      if (!authRoles.includes(verifiedToked.role)) {
        throw new AppError(404, "You are not permitted to view this route");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
