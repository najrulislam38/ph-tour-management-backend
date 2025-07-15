import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "./user.controller";
import { createUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middleware/validateRequest";
import AppError from "../../errorHelpers/AppError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Role } from "./user.interface";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserController.createUser
);
router.get(
  "/all-users",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = await req.headers.authorization;

      if (!accessToken) {
        throw new AppError(403, "No token retrieve");
      }

      const verifiedToked = await jwt.verify(accessToken, "secret");

      if ((verifiedToked as JwtPayload).role !== Role.ADMIN) {
        throw new AppError(404, "You are not permitted to view this route");
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  UserController.getAllUsers
);

export const UserRoutes = router;
