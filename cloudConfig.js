const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.colud_NAME,
    api_key:process.env.colud_API_KEY,
    api_secret:process.env.colud_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV',
      allowedFormats:["png", "jpg", "jpeg"],
    },
  });

  module.exports = {
    cloudinary,
    storage,
  }