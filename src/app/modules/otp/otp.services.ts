import crypto from "crypto";
import { redisClient } from "../../../config/redis.config";
import { sendEmail } from "../../utilities/sendEmail";
import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.mode";

const OTP_EXPIRATION = 2 * 60; // 2 MINUTES;

const generateOTP = (length = 6) => {
  // 6 digit
  const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString();
  return otp;
};

const sendOTP = async (email: string, name: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(404, "User not exist");
  }

  if (user.isVerified) {
    throw new AppError(401, "Yor are already verified");
  }

  const otp = generateOTP();

  const redisKey = `otp:${email}`;
  await redisClient.set(redisKey, otp, {
    expiration: {
      type: "EX",
      value: OTP_EXPIRATION,
    },
  });

  await sendEmail({
    to: email,
    subject: "Yor OTP Code",
    templateName: "otp",
    templateData: {
      name: name,
      otp: otp,
    },
  });
};

const verifyOTP = async (email: string, otp: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(404, "User not exist");
  }

  if (user.isVerified) {
    throw new AppError(401, "Yor are already verified");
  }
  const redisKey = `otp:${email}`;

  const saveOtp = await redisClient.get(redisKey);

  if (!saveOtp) {
    throw new AppError(401, "Invalid OTP");
  }

  if (saveOtp !== otp) {
    throw new AppError(401, "Invalid OTP");
  }

  await Promise.all([
    User.updateOne({ email }, { isVerified: true }, { runValidators: true }),
    redisClient.del([redisKey]),
  ]);
};

export const OTPService = {
  sendOTP,
  verifyOTP,
};
