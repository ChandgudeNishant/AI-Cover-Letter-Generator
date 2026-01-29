import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import pdfParse from "pdf-parse";
import Groq from "groq-sdk";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { body, validationResult } from "express-validator";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parser middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Multer configuration for PDF uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  },
});

// Validation middleware
const validateCoverLetterInput = [
  body("userDetails.name").notEmpty().trim().withMessage("Name is required"),
  body("userDetails.email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),
  body("userDetails.education")
    .notEmpty()
    .trim()
    .withMessage("Education is required"),
  body("userDetails.tone")
    .isIn(["formal", "professional", "educational", "casual", "enthusiastic"])
    .withMessage("Invalid tone selected"),
];

// Helper function to construct Prompts
const constructPrompt = (
  jobDescription,
  userDetails,
  tone,
  action = "generate",
) => {
  const { name, email, currentCompany, education, experience } = userDetails;

  const toneInstructions = {
    formal: "Use formal language with traditional business letter structure",
    professional: "Use professional but approachable language",
    educational: "Emphasize learning, growth, and academic achievements",
    casual: "Use conversational yet respectful tone",
    enthusiastic: "Show excitement and passion for the role",
  };

  const basePrompt = `
Job Description:
${jobDescription}

Applicant Details:
- Name: ${name}
- Email: ${email}
- Current Company/Designation: ${currentCompany || "Not specified"}
- Education: ${education}
- Years of Experience: ${experience || "Not specified"}

Tone: ${tone} - ${toneInstructions[tone]}
  `;

  if (action === "generate") {
    return `${basePrompt}

Please generate a compelling cover letter that:
1. Addresses the specific job requirements mentioned
2. Highlights relevant skills and experiences
3. Maintains the specified tone throughout
4. Is approximately 250-400 words
5. Follows professional cover letter format
6. Shows genuine interest in the position
7. Creates a strong connection between the applicant's background and job requirements

Generate only the cover letter content without any additional text or explanations.`;
  } else if (action === "rephrase") {
    return `Please rephrase the following cover letter while maintaining its original meaning and key points. Keep the same tone (${tone}) but vary the sentence structure and word choices for better flow and impact.
    
    IMPORTANT: Return ONLY the rephrased content. Do not include any introductory phrases like "Here is the rephrased version" or any notes at the end.`;
  } else if (action === "grammar") {
    return `Please correct any grammar, spelling, or punctuation errors in the following cover letter while maintaining its original tone, style, and content. Only fix errors without changing the meaning or structure.
    
    IMPORTANT: Return ONLY the corrected text. Do not include any introductory phrases like "Here is the corrected version" or any notes/explanations at the end.`;
  }

  return basePrompt;
};

// PDF text extraction endpoint
app.post("/api/extract-pdf", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No PDF file uploaded" });
    }

    const pdfData = await pdfParse(req.file.buffer);
    const extractedText = pdfData.text.trim();

    if (!extractedText) {
      return res.status(400).json({ error: "Could not extract text from PDF" });
    }

    res.json({ text: extractedText });
  } catch (error) {
    console.error("PDF extraction error:", error);
    res.status(500).json({ error: "Failed to extract text from PDF" });
  }
});

// Generate cover letter endpoint
app.post(
  "/api/generate-cover-letter",
  validateCoverLetterInput,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log("Validation errors:", errors.array());
        return res.status(400).json({ errors: errors.array() });
      }

      const { jobDescription, userDetails } = req.body;

      if (!jobDescription || !jobDescription.trim()) {
        return res.status(400).json({ error: "Job description is required" });
      }

      console.log("Generating cover letter for:", userDetails.email);
      const prompt = constructPrompt(
        jobDescription,
        userDetails,
        userDetails.tone,
      );
      console.log("Calling Groq API...");

      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 1024,
      });

      const coverLetter = completion.choices[0]?.message?.content || "";
      console.log("Cover letter generated");
      res.json({ coverLetter });
    } catch (error) {
      console.error("Cover letter generation error:", error);
      res.status(500).json({
        error: "Failed to generate cover letter. Please try again.",
      });
    }
  },
);

// Rephrase cover letter endpoint
app.post("/api/rephrase", async (req, res) => {
  try {
    const { content, tone = "professional" } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: "Content to rephrase is required" });
    }

    const prompt = constructPrompt("", {}, tone, "rephrase");

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: `${prompt}\n\n${content}` }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
    });

    const rephrasedContent = completion.choices[0]?.message?.content || "";

    res.json({ content: rephrasedContent });
  } catch (error) {
    console.error("Rephrase error:", error);
    res
      .status(500)
      .json({ error: "Failed to rephrase content. Please try again." });
  }
});

// Grammar check endpoint
app.post("/api/grammar-check", async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: "Content to check is required" });
    }

    const prompt = constructPrompt("", {}, "", "grammar");
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: `${prompt}\n\n${content}` }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 1024,
    });
    // console.log(completion);
    const correctedContent = completion.choices[0]?.message?.content || "";
    // console.log(correctedContent);
    res.json({ content: correctedContent });
  } catch (error) {
    console.error("Grammar check error:", error);
    res
      .status(500)
      .json({ error: "Failed to check grammar. Please try again." });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ error: "File too large. Maximum size is 5MB." });
    }
  }

  console.error("Unhandled error:", error);
  res.status(500).json({ error: "Internal server error" });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
