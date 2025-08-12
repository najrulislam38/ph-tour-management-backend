/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utilities/catchAsync";
import { sendResponse } from "../../utilities/sendResponse";
import jwt, { JwtPayload } from "jsonwebtoken";
import { verifiedToken } from "../../utilities/jwt";
import { envVariables } from "../../../config/env";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User created successfully. from send response handler",
      data: user,
    });

    // res.status(httpStatus.CREATED).json({
    //   success: true,
    //   message: "User created successfully.",
    //   data: user,
    // });
  }
);

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    // const token = req.headers.authorization;
    // const verifiedToked = verifiedToken(
    //   token as string,
    //   envVariables.JWT_ACCESS_SECRET
    // ) as JwtPayload;
    const verifiedToked = req.user;

    const payload = req.body;
    const user = await UserServices.updateUser(
      userId,
      payload,
      verifiedToked as JwtPayload
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User updated successfully.",
      data: user,
    });

    // res.status(httpStatus.CREATED).json({
    //   success: true,
    //   message: "User created successfully.",
    //   data: user,
    // });
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

const getSingleUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const result = await UserServices.getSingleUser(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User retrieved successfully.",
      data: result.data,
    });
  }
);
const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const result = await UserServices.getMe(decodedToken.userId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Your profile retrieved successfully.",

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
  getSingleUser,
  updateUser,
  getMe,
};
