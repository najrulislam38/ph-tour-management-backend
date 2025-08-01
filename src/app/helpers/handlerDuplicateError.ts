/* eslint-disable @typescript-eslint/no-explicit-any */
import { TGenericErrorResponse } from "../interfaces/error.types";

export const handlerDuplicateError = (err: any): TGenericErrorResponse => {
  const matchedEmail = err.message.match(/"([^"]*)"/);
  return {
    statusCode: 400,
    message: `${matchedEmail[1]} is already exists.`,
  };
};
