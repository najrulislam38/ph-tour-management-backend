import { Request, Response } from "express";
import { catchAsync } from "../../utilities/catchAsync";
import { sendResponse } from "../../utilities/sendResponse";
import { BookingService } from "./booking.service";
import { JwtPayload } from "jsonwebtoken";

const createBooking = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const booking = await BookingService.createBooking(
    req.body,
    decodedToken.userId
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Booking created successfully.",
    data: booking,
  });
});

const getAllBookings = catchAsync(async (req: Request, res: Response) => {
  const booking = await BookingService.getAllBookings();
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Booking retrieved successfully.",
    data: booking,
  });
});

const getUserBookings = catchAsync(async (req: Request, res: Response) => {
  const booking = await BookingService.getUserBookings();
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Bookings retrieved successfully.",
    data: booking,
  });
});

const getSingleBooking = catchAsync(async (req: Request, res: Response) => {
  const booking = await BookingService.getSingleBooking();
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Bookings retrieved successfully.",
    data: booking,
  });
});

const updateBookingStatus = catchAsync(async (req: Request, res: Response) => {
  const updated = await BookingService.updateBookingStatus();
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Booking updated successfully.",
    data: updated,
  });
});

export const BookingController = {
  createBooking,
  getAllBookings,
  getUserBookings,
  getSingleBooking,
  updateBookingStatus,
};
