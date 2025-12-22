import "dotenv/config";
import { generateContent } from "../utils/ai";

async function main() {
  const prompt = "Hello! Are you working?";

  // Test 1: Flash model (default), No Thinking (default)
  console.log("--- Test 1: Flash (Default) + No Thinking (Minimal) ---");
  try {
    const text1 = await generateContent({ prompt }); // Defaults: model='flash', thinking=false
    if (text1) {
      console.log(text1);
    }
    console.log("\n");
  } catch (error) {
    console.error("Error in Test 1:", error);
  }

  // Test 2: Pro model, Thinking enabled
  console.log("--- Test 2: Pro + Thinking (High) ---");
  try {
    const text2 = await generateContent({
      prompt,
      model: "pro",
      thinking: true,
    });
    if (text2) {
      console.log(text2);
    }
    console.log("\n");
  } catch (error) {
    console.error("Error in Test 2:", error);
  }
}

main();
