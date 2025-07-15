/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utilities/catchAsync";
import { sendResponse } from "../../utilities/sendResponse";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email } = req.body;
    const user = await UserServices.createUser({ name, email });

    res.status(httpStatus.CREATED).json({
      success: true,
      message: "User created successfully.",
      data: user,
    });
  }
);

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.getAllUsers();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All users retrieved successfully.",
      meta: {
        total: result.meta,
      },
      data: result.data,
    });
  }
);

// const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const users = await UserServices.getAllUsers();

//     res.status(httpStatus.OK).json({
//       success: true,
//       message: "Users retrieved successfully.",
//       data: users,
//     });
//   } catch (error) {
//     console.log(error);

//     next(error);
//   }
// };

export const UserController = {
  createUser,
  getAllUsers,
};
