import 'dotenv/config';
import express from 'express';
import { GoogleGenAI } from '@google/genai';

const app = express();
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Urutan prioritas model: dari paling utama ke fallback
const MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-preview-05-20",
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash-lite-06-17",
  "gemini-2.0-flash",
  "gemini-2.0-flash-001",
  "gemini-2.0-flash-exp",
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash-lite-001",
];

app.use(express.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server ready on http://localhost:${PORT}`));

/**
 * Helper untuk ekstrak text dari response
 */
function extractText(resp) {
  try {
    return resp?.text ?? JSON.stringify(resp, null, 2);
  } catch (err) {
    console.error("Error extracting text:", err);
    return JSON.stringify(resp, null, 2);
  }
}

/**
 * Generate dengan fallback model otomatis
 */
async function generateWithFallback(prompt) {
  let lastError = null;

  for (let i = 0; i < MODELS.length; i++) {
    const model = MODELS[i];
    try {
      console.log(`⚡ Coba model: ${model}`);
      const resp = await ai.models.generateContent({
        model,
        contents: prompt,
      });
      return { resp, model };
    } catch (err) {
      lastError = err;
      console.warn(`❌ Model ${model} gagal: ${err.message}`);
      if (err.status !== 503 && err.status !== 429) {
        // kalau error bukan 503/429, hentikan langsung
        throw err;
      }
      // kalau 503/429, lanjut ke model berikutnya
    }
  }

  // kalau semua gagal
  throw lastError || new Error("Semua model gagal dipanggil");
}

/**
 * Endpoint utama
 */
app.post('/generate-text', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const { resp, model } = await generateWithFallback(prompt);
    res.json({
      model,
      result: resp.text ?? extractText(resp),
    });
  } catch (err) {
    console.error("❌ Error in /generate-text:", err);
    res.status(500).json({ error: err.message });
  }
});
