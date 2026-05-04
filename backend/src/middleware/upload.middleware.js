const multer     = require("multer");
const path       = require("path");
const cloudinary = require("../config/cloudinary");

// Store in memory for Cloudinary upload
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|pdf/;
  const ext     = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime    = allowed.test(file.mimetype);

  if (ext && mime) return cb(null, true);
  cb(new Error("Only images (jpg, png, gif) and PDF files are allowed"));
};

const upload = multer({
  storage,
  limits:     { fileSize: 10 * 1024 * 1024 },   // 10 MB
  fileFilter,
});

// Upload buffer to Cloudinary
const uploadToCloudinary = (buffer, folder, resourceType = "auto") => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    ).end(buffer);
  });
};

module.exports = { upload, uploadToCloudinary };
