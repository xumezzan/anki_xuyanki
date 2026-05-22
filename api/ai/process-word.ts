import { GoogleGenAI, Type } from "@google/genai";

const wordSchema = {
  type: Type.OBJECT,
  properties: {
    word: { type: Type.STRING, description: "Correct English word or short phrase" },
    transcription: { type: Type.STRING, description: "IPA phonetic transcription in brackets" },
    translation: { type: Type.STRING, description: "Accurate Russian translation" },
    explanation: { type: Type.STRING, description: "Short simple Russian explanation (max 15 words)" },
    example: { type: Type.STRING, description: "Example sentence in English" },
    exampleTranslation: { type: Type.STRING, description: "Russian translation of example" },
    emoji: { type: Type.STRING, description: "One representative emoji" },
    partOfSpeech: { type: Type.STRING, description: "Part of speech in lowercase" },
    category: { type: Type.STRING, description: "One of: 'IT', 'Travel', 'Business', 'Everyday', 'Movies', 'Slang'" }
  },
  required: [
    "word", "transcription", "translation", "explanation",
    "example", "exampleTranslation", "emoji", "partOfSpeech", "category"
  ]
};

let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || "MOCK_KEY",
    });
  }
  return aiClient;
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { input } = body || {};
    if (!input || typeof input !== "string" || !input.trim()) {
      res.status(400).json({ error: "Входные данные обязательны" });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(503).json({
        success: false,
        error: "AI временно недоступен. Добавьте GEMINI_API_KEY в Vercel."
      });
      return;
    }

    const trimmed = input.trim();
    const prompt = `Пользователь хочет добавить слово или выражение для изучения: "${trimmed}".
Если это русский текст — найди наиболее точный английский эквивалент.
Если это английское слово — исправь опечатки.
Сформируй карточку со всеми полями: транскрипция IPA, перевод на русский, короткое описание на русском, пример на английском, перевод примера, эмодзи, часть речи и одна категория из: 'IT', 'Travel', 'Business', 'Everyday', 'Movies', 'Slang'.`;

    const ai = getAi();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction:
          "You are an English tutor. Output strict JSON matching the schema with IPA transcription and short clear examples.",
        responseMimeType: "application/json",
        responseSchema: wordSchema,
        temperature: 0.3
      }
    });

    const text = response.text;
    if (!text) throw new Error("Пустой ответ от ИИ.");

    const parsed = JSON.parse(text.trim());
    res.status(200).json({ success: true, word: parsed });
  } catch (err: any) {
    console.error("[Gemini Vercel Error]:", err);
    res.status(500).json({
      success: false,
      error: err?.message || "Не удалось добавить слово. Попробуйте ещё раз."
    });
  }
}
