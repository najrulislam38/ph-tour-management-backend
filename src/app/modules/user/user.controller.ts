import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const user = await UserServices.createUser(req.body);

    res.status(httpStatus.CREATED).json({
      success: true,
      message: "User created successfully.",
      user,
    });
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).json({
      message: `Something went wrong while creating user ${error}`,
      error,
    });
  }
};

export const UserController = {
  createUser,
};
