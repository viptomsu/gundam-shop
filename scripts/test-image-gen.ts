import "dotenv/config";
import { generateImage } from "../utils/ai";
import { uploadToCloudinary } from "../utils/image";

async function main() {
  const prompt =
    process.argv[2] || "A cute robot gundam holding a flower, anime style";

  console.log(`Generating image for prompt: "${prompt}"...`);

  try {
    const imageBuffer = await generateImage(prompt);

    if (!imageBuffer) {
      console.error("No image data received from Gemini.");
      return;
    }

    console.log("Image generated successfully. Uploading to Cloudinary...");

    const imageUrl = await uploadToCloudinary(imageBuffer);

    console.log("\n--- Result ---");
    console.log("Image URL:", imageUrl);
    console.log("--------------\n");
  } catch (error) {
    console.error("Process failed:", error);
  }
}

main();
