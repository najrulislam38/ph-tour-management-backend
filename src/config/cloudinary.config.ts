/* eslint-disable @typescript-eslint/no-explicit-any */
import { v2 as cloudinary } from "cloudinary";
import { envVariables } from "./env";
import AppError from "../app/errorHelpers/AppError";

cloudinary.config({
  cloud_name: envVariables.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_key: envVariables.CLOUDINARY.CLOUDINARY_API_KEY,
  api_secret: envVariables.CLOUDINARY.CLOUDINARY_API_SECRET,
});

export const deleteImageFromCloudinary = async (url: string) => {
  try {
    const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;
    const match = url.match(regex);

    console.log({ match });

    if (match && match[1]) {
      const public_id = match[1];
      await cloudinary.uploader.destroy(public_id);

      console.log(`File ${public_id} is deleted from cloudinary.`);
    }
  } catch (error: any) {
    throw new AppError(401, "Cloudinary Image deletion failed.", error.message);
  }
};

export const cloudinaryUpload = cloudinary;

// Amader folder -> image -> form data -> File -> Multer -> Amader project / pc te Nijer ekta folder(temporary) -> Req.file

//req.file -> cloudinary(req.file) -> url -> mongoose -> mongodb

//Multer storage cloudinary
//Amader folder -> image -> form data -> File -> Multer -> storage in cloudinary -> url ->  req.file  -> url  -> mongoose -> mongodb
