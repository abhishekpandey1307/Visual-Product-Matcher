import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

// Basic CORS (safe for demo)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "client/public")));

// 🔑 Google Vision API key
const GOOGLE_VISION_API_KEY = process.env.GOOGLE_VISION_API_KEY;

// Fail fast if key missing
if (!GOOGLE_VISION_API_KEY) {
  console.error("❌ Missing GOOGLE_VISION_API_KEY in .env");
  process.exit(1);
}

// 🔁 Google Vision proxy endpoint
app.post("/api/tags", async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: "imageUrl missing" });
    }

    const visionResponse = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requests: [
            {
              image: { source: { imageUri: imageUrl } },
              features: [{ type: "LABEL_DETECTION", maxResults: 5 }],
            },
          ],
        }),
      }
    );

    const data = await visionResponse.json();

    const labels =
      data.responses?.[0]?.labelAnnotations || [];

    // 🔁 Convert to SAME format frontend expects
    res.json({
      result: {
        tags: labels.map((l) => ({
          tag: { en: l.description.toLowerCase() },
          confidence: Math.round(l.score * 100),
        })),
      },
    });
  } catch (err) {
    console.error("Google Vision error:", err.message);
    res.status(500).json({ error: "Vision API failed" });
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
