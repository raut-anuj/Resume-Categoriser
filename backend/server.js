import express from "express";
import cors from "cors";
import multer from "multer";
import { extractPdfText } from "./pdfExtractor.js";
import { categorizeResume } from "./categorize.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend requests
app.use(cors());
app.use(express.json());

// Configure Multer for in-memory file handling (parsed directly in memory, clean & safe)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB limit
  },
  fileFilter: (req, file, cb) => {
    const isPdf =
      file.mimetype === "application/pdf" ||
      file.originalname.toLowerCase().endsWith(".pdf");
    if (isPdf) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed."));
    }
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Resume upload and categorization endpoint
app.post("/api/categorize", (req, res) => {
  upload.single("resume")(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          error: "File size exceeds the 10MB limit."
        });
      }
      return res.status(400).json({ success: false, error: err.message });
    } else if (err) {
      return res.status(400).json({ success: false, error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Please upload a PDF resume file."
      });
    }

    try {
      // Extract text from uploaded PDF buffer
      const pdfData = await extractPdfText(req.file.buffer);
      const extractedText = pdfData.text || "";

      if (!extractedText.trim()) {
        return res.status(422).json({
          success: false,
          error: "Unable to extract readable text from this PDF. Please ensure the PDF has selectable text."
        });
      }

      // Categorize resume content
      const analysis = categorizeResume(extractedText);

      return res.json({
        success: true,
        fileName: req.file.originalname,
        fileSizeKB: Math.round(req.file.size / 1024),
        pages: pdfData.numpages || 1,
        category: analysis.category,
        confidence: analysis.confidence,
        matchedKeywords: analysis.matchedKeywords,
        topScores: Object.entries(analysis.categoryScores)
          .filter(([_, score]) => score > 0)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([cat, score]) => ({ category: cat, score: Math.round(score) }))
      });
    } catch (parseError) {
      console.error("PDF Parsing error:", parseError);
      return res.status(500).json({
        success: false,
        error: "An error occurred while parsing the PDF file. Please try another resume."
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
