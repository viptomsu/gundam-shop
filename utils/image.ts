import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Uploads a file buffer to Cloudinary
 * @param buffer - The file buffer to upload
 * @param folder - Optional folder name in Cloudinary
 * @returns The secure URL of the uploaded image
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  folder: string = "ai-generated"
): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(error);
          return;
        }
        if (!result) {
          reject(new Error("Cloudinary upload result is empty"));
          return;
        }
        resolve(result.secure_url);
      }
    );

    uploadStream.end(buffer);
  });
}
