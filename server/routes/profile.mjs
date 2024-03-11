import mongoose from "mongoose";
import Grid from "gridfs-stream";
import multer from "multer";
import path from "path";
import fs from "fs";
import connectionPromise from "../db.mjs";

let gfs, upload;

// Initialize MongoDB connection
connectionPromise
  .then(() => {
    // Create GridFS stream using native MongoDB connection
    gfs = new Grid(mongoose.connection.db, mongoose.mongo);

    // Define uploadImage function
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "uploads/");
      },
      filename: function (req, file, cb) {
        const userId = req.body.userId;
        const filename = `${userId}.jpg`;
        cb(null, filename);
      },
    });

    upload = multer({ storage }).single("image");
  })
  .catch((error) => {
    console.error(`Failed to connect to MongoDB due to:\n${error}`);
  });

// Upload an image
export const uploadImage = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.log("Error uploading file:", err);
      return res.status(500).json({
        success: false,
        message: "Error uploading file",
        severity: "error",
      });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Create a write stream
    const writestream = gfs.createWriteStream({
      filename: req.file.originalname,
    });

    // Read the file from disk and pipe it to GridFS
    fs.createReadStream(path.join(__dirname, "uploads", req.file.filename))
      .on("error", (err) => {
        console.log("Error reading file:", err);
        return res.status(500).json({
          success: false,
          message: "Error uploading file",
          severity: "error",
        });
      })
      .pipe(writestream)
      .on("error", (err) => {
        console.log("Error uploading file to GridFS:", err);
        return res.status(500).json({
          success: false,
          message: "Error uploading file",
          severity: "error",
        });
      })
      .on("finish", () => {
        fs.unlinkSync(path.join(__dirname, "uploads", req.file.filename));
        return res.status(200).json({
          success: true,
          message: "File uploaded successfully",
          severity: "success",
        });
      });
  });
};

// Fetch an image
export const fetchImage = async (req, res) => {
  try {
    const fileName = req.params.filename; // Example filename without extension

    // Search for any file with a filename that matches the provided filename (regardless of extension)
    const file = await gfs.files.findOne({
      filename: fileName,
    });
    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
        severity: "error",
      });
    }

    // Stream the file directly to the response
    gfs.createReadStream(file.filename).pipe(res);
  } catch (error) {
    console.error("Error fetching file from GridFS:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching file",
      severity: "error",
    });
  }
};

// Delete an image
export const deleteImage = async (req, res) => {
  try {
    const fileName = req.params.filename; // Example filename without extension

    // Search for any file with a filename that matches the provided filename (regardless of extension)
    const file = await gfs.files.findOne({
      filename: fileName,
    });
    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
        severity: "error",
      });
    }

    // Remove the file from GridFS
    gfs.remove({ _id: file._id }, (err) => {
      if (err) {
        console.error("Error removing file from GridFS:", err);
        return res.status(500).json({
          success: false,
          message: "Error removing file",
          severity: "error",
        });
      }
      return res.status(200).json({
        success: true,
        message: "File removed successfully",
        severity: "success",
      });
    });
  } catch (error) {
    console.error("Error fetching file from GridFS:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching file",
      severity: "error",
    });
  }
};
