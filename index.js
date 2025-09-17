import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';

const app = express();
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const upload = multer();

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
async function generateWithFallback(contents) {
  let lastError = null;

  for (let i = 0; i < MODELS.length; i++) {
    const model = MODELS[i];
    try {
      console.log(`⚡ Coba model: ${model}`);
      const resp = await ai.models.generateContent({
        model,
        contents
      });
      return { resp, model };
    } catch (err) {
      lastError = err;
      console.warn(`❌ Model ${model} gagal: ${err.message}`);
      if (err.status !== 503 && err.status !== 429) {
        throw err; // selain overload, hentikan langsung
      }
    }
  }

  throw lastError || new Error("Semua model gagal dipanggil");
}

/**
 * 1. Generate Text
 */
app.post('/generate-text', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    const { resp, model } = await generateWithFallback([
      { role: "user", parts: [{ text: prompt }] }
    ]);

    res.json({ model, result: extractText(resp) });
  } catch (err) {
    console.error("❌ Error in /generate-text:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * 2. Generate From Image
 */
app.post('/generate-from-image', upload.single('image'), async (req, res) => {
  try {
    const { prompt } = req.body;
    const imageBase64 = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype || "image/jpeg";

    const { resp, model } = await generateWithFallback([
      {
        role: "user",
        parts: [
          { text: prompt || "Jelaskan isi gambar ini:" },
          { inlineData: { mimeType, data: imageBase64 } }
        ]
      }
    ]);

    res.json({ model, result: extractText(resp) });
  } catch (err) {
    console.error("❌ Error in /generate-from-image:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * 3. Generate From Audio
 */
app.post('/generate-from-audio', upload.single('audio'), async (req, res) => {
  try {
    const { prompt } = req.body;
    const audioBase64 = req.file.buffer.toString('base64');

    // Deteksi manual berdasarkan ekstensi
    let mimeType = req.file.mimetype;
    if (!mimeType || mimeType === "application/octet-stream") {
      if (req.file.originalname.endsWith(".mp3")) mimeType = "audio/mpeg";
      else if (req.file.originalname.endsWith(".wav")) mimeType = "audio/wav";
      else if (req.file.originalname.endsWith(".webm")) mimeType = "audio/webm";
    }

    const { resp, model } = await generateWithFallback([
      {
        role: "user",
        parts: [
          { text: prompt || "Transkrip audio berikut:" },
          { inlineData: { mimeType, data: audioBase64 } }
        ]
      }
    ]);

    res.json({ model, result: extractText(resp) });
  } catch (err) {
    console.error("❌ Error in /generate-from-audio:", err);
    res.status(500).json({ error: err.message });
  }
});


/**
 * 4. Generate From Document
 */
app.post('/generate-from-document', upload.single('document'), async (req, res) => {
  try {
    const { prompt } = req.body;
    const docBase64 = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype || "application/pdf";

    const { resp, model } = await generateWithFallback([
      {
        role: "user",
        parts: [
          { text: prompt || "Ringkas dokumen berikut:" },
          { inlineData: { mimeType, data: docBase64 } }
        ]
      }
    ]);

    res.json({ model, result: extractText(resp) });
  } catch (err) {
    console.error("❌ Error in /generate-from-document:", err);
    res.status(500).json({ error: err.message });
  }
});
