const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload image to Cloudinary
const uploadImage = async (imageData) => {
  try {
    const result = await cloudinary.uploader.upload(imageData, {
      folder: 'reddit-clone-posts',
      resource_type: 'image'
    });
    return result.secure_url;
  } catch (error) {
    throw new Error('Image upload failed');
  }
};

module.exports = { uploadImage };
