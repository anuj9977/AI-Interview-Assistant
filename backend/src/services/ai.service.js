const { GoogleGenerativeAI } = require("@google/generative-ai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
require("dotenv").config();


const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);

async function invokeGeminiAi(prompt) {
  // Array of models to try in order of preference
  const modelsToTry = [

    "gemini-3-flash-preview", // Latest 2026 model

  ];

  let lastError;

  for (const modelName of modelsToTry) {
    try {
      console.log(`Attempting request with ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      lastError = error;
      // If it's a 503 (Overloaded) or 404 (Not Found), try the next model
      if (error.message.includes("503") || error.message.includes("404")) {
        console.warn(`${modelName} is busy or unavailable. Trying next model...`);
        continue;
      }
      // If it's a different error (like API Key invalid), stop immediately
      throw error;
    }
  }

  console.error("All models failed.");
  throw new Error(`Gemini Service Unavailable: ${lastError.message}`);
}

// Schema for Gemini (Clean JSON Schema format)
const interviewReportSchema = {
  type: "object",
  properties: {
    matchScore: { type: "number", description: "Numerical score 0-100" },
    technicalQuestions: {
      description: "Array of technical questions with intention and answer",
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string", description: "The technical question asked in the interview" },
          intention: { type: "string", description: "The intention behind asking this question, e.g., assessing problem-solving skills, coding ability, etc." },
          answer: { type: "string", description: "The candidate's answer for this question included how to approach the problem and explanation." }
        },
        required: ["question", "intention", "answer"]
      }
    },
    behavioralQuestions: {
      description: "Array of behavioral questions with intention and answer",
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          intention: { type: "string" },
          answer: { type: "string" }
        },
        required: ["question", "intention", "answer"]
      }
    },
    skillGaps: {
      description: "Array of skill gaps with severity",
      type: "array",
      items: {
        type: "object",
        properties: {
          skill: { type: "string" },
          severity: { type: "string", enum: ["low", "medium", "high"] }
        },
        required: ["skill", "severity"]
      }
    },
    preparationPlan: {
      description: "Array of preparation tasks by day",
      type: "array",
      items: {
        type: "object",
        properties: {
          day: { type: "string" },
          tasks: { type: "array", items: { type: "string" } },
          focus: { type: "string" }
        },
        required: ["day", "tasks", "focus"]
      }
    },
    title: {
      type: "string",
      description: "A concise title for the interview report, ideally reflecting the target role or company, e.g., 'Software Engineer at Google - 2026'. This helps users quickly identify and differentiate between multiple reports in their history."

    }

  },
  required: ["matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan"]
};

async function generateInterviewReport({ jobDescription, resume, selfDescription }) {
  const prompt = `
    Generate a comprehensive interview report based on the following inputs:
    Job Description: ${jobDescription}
    Resume: ${resume}
    Self Description: ${selfDescription}
  `;

  const modelsToTry = ["gemini-3-flash-preview", "gemini-1.5-flash", "gemini-2.0-flash-exp"]; // Use stable versions available in your tier

  let lastError;

  for (const modelName of modelsToTry) {
    try {
      console.log(`Attempting request with ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });

      // ✅ FIX: The structure must follow the SDK expectations
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: interviewReportSchema, // This should match the schema name defined in the model configuration
        },
      });
      const response = await result.response;
      const text = response.text();

      console.log("RAW:", text);

      // 🔥 CLEAN TEXT
      const cleaned = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      // 🔥 SAFE PARSE
      let parsed;
      try {
        parsed = JSON.parse(cleaned);
      } catch (err) {
        console.error("PARSE ERROR:", cleaned);
        throw new Error("Invalid AI JSON");
      }

      return parsed;

      return JSON.parse(text); // Return the parsed JSON object

    } catch (error) {
      lastError = error;
      if (error.message.includes("503") || error.message.includes("404")) {
        console.warn(`${modelName} is busy or unavailable. Trying next model...`);
        continue;
      }
      // Log full error details for debugging
      console.error("Gemini Request Error:", error);
      throw error;
    }
  }
}

module.exports = { invokeGeminiAi, generateInterviewReport };