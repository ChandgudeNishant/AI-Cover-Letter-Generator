import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const modelsToTry = [
  "gemini-1.5-flash",
  "gemini-1.5-pro",
  "gemini-pro",
  "gemini-1.0-pro",
];

async function checkModels() {
  console.log(
    "Checking models with API Key:",
    process.env.GEMINI_API_KEY ? "Loaded" : "Missing",
  );

  for (const modelName of modelsToTry) {
    console.log(`\nTesting model: ${modelName}`);
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Say hello");
      console.log(`SUCCESS: ${modelName} is working.`);
      console.log("Response:", result.response.text());
      return; // Stop after first success
    } catch (error) {
      console.error(`FAILED: ${modelName}`);
      console.error("Error:", error.message.split("\n")[0]); // Log first line of error
    }
  }
}

checkModels();
