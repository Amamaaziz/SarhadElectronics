"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'sarhad-electrics',
    api_key: process.env.CLOUDINARY_API_KEY || 'test_key',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'test_secret',
    secure: true,
});
const uploadToCloudinary = async (fileBuffer, folder = 'sarhad_electrics/products') => {
    return new Promise((resolve, reject) => {
        // If running in development without valid credentials, provide a reliable placeholder
        if (!process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY === 'test_key') {
            const mockUrl = `https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80`;
            return resolve(mockUrl);
        }
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({ folder, resource_type: 'image' }, (error, result) => {
            if (error)
                return reject(error);
            if (result?.secure_url) {
                resolve(result.secure_url);
            }
            else {
                reject(new Error('Cloudinary upload failed: No secure URL returned'));
            }
        });
        uploadStream.end(fileBuffer);
    });
};
exports.uploadToCloudinary = uploadToCloudinary;
exports.default = cloudinary_1.v2;
