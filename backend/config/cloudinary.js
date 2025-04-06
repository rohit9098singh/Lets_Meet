const multer = require("multer");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadFileToCloudinary = (file) => {
    return new Promise((resolve, reject) => {  
        const options = {
            resource_type: file.mimetype.startsWith("video") ? "video" : "image"
        };

        cloudinary.uploader.upload_large(file.path, options, (error, result) => {
            if (error) {
                return reject(error);
            }
            resolve(result);
        });
    });
};

//  Multer middleware for file uploads (temporary storage in "uploads/" folder)
const multerMiddleware = multer({ dest: "uploads/" });

module.exports = { multerMiddleware, uploadFileToCloudinary };
