import multer from "multer";
import fs from "fs";
import path from "path";
import { allowedFileExtensions, fileTypes } from "../Common/constants/file.constants.js";

export const localUpload = () => {
  const uploadPath = path.join(process.cwd(), "uploads");

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      console.log("file info before uploading", file);
      cb(null, file.originalname);
    }
  });

const fileFilter = (req, file, cb) => {
  const fileKey = file.mimetype.split('/')[0]; // image, video, audio, application
  const fileType = fileTypes[fileKey.toUpperCase()];
  console.log("fileType:", fileType);

  if (!fileType) return cb(new Error("Invalid file type"), false);

  const fileExtension = file.mimetype.split('/')[1];
  console.log(fileExtension, "extensions:", allowedFileExtensions[fileKey]);

  if (!allowedFileExtensions[fileKey].includes(fileExtension)) {
    return cb(new Error("Invalid file extension"), false);
  }

  return cb(null, true);
};



  // return multer({limites:{files:2}, fileFilter, storage });
    return multer({fileFilter, storage });


};
