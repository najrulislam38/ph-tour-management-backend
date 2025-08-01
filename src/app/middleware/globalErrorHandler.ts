/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVariables } from "../../config/env";
import AppError from "../errorHelpers/AppError";

/**
 * mongoose error
 * - duplicate
 * - Cast Error
 */

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Something went wrong !";

  const errorSources: any = [
    // {
    //   path: error.path,
    //   message: error.message
    // }
  ];

  //duplicate error
  if (err.code === 11000) {
    const matchedEmail = err.message.match(/"([^"]*)"/);
    statusCode = 400;
    message = `${matchedEmail[1]} is already exists.`;
  }

  // Object ID error / cast error
  else if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid MongoDB ObjectId. Please provide valid id";
  }
  // validation error
  else if (err.name === "ValidationError") {
    statusCode = 400;
    const errors = Object.values(err.errors);

    errors.forEach((errorObject: any) =>
      errorSources.push({
        path: errorObject.path,
        message: errorObject.message,
      })
    );
    message = err.message;
  }
  //Zod error
  else if (err.name === "ZodError") {
    statusCode = 400;
    message = "Zod Error";
    console.log(err.issues);

    err?.issues.forEach((issue: any) =>
      errorSources.push({
        path: issue.path[issue.path.length - 1],
        message: issue.message,
      })
    );
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    err,
    stack: envVariables.NODE_ENV === "development" ? err.stack : null,
  });
};
