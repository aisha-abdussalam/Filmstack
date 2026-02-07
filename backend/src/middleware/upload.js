import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
    // Link credentials
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "FilmStack_Posters",
        allowed_formats: ["jpeg", "jpg", "png", "webp"],
        transformation: [{ width: 500, height: 750, crop: 'limit' }]
    }
});

const upload = multer({
    storage: storage
});

export { upload };