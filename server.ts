import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy evaluate GoogleGenAI to prevent crash on startup if GEMINI_API_KEY is missing.
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not defined!");
    }
    aiClient = new GoogleGenAI({
      apiKey: key || "MOCK_KEY_FOR_PREVIEW_SO_IT_DOES_NOT_CRASH",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Full-featured sample vocabulary cards
const DEFAULT_PREMIUM_WORDS = [
  // IT & Tech
  {
    word: "Merge",
    transcription: "[mɜːdʒ]",
    translation: "Объединять / Сливать",
    explanation: "Объединение двух или более элементов (например, веток кода) в единое целое.",
    example: "Let's merge the development branch into production.",
    exampleTranslation: "Давай зальем ветку разработки в проект.",
    emoji: "💻",
    partOfSpeech: "verb",
    category: "IT"
  },
  {
    word: "Refactoring",
    transcription: "[riːˈfæktərɪŋ]",
    translation: "Рефакторинг",
    explanation: "Улучшение структуры существующего кода без изменения его внешнего поведения.",
    example: "Clean code is critical; we need a refactoring session.",
    exampleTranslation: "Чистый код критически важен; нам нужна сессия рефакторинга.",
    emoji: "⚙️",
    partOfSpeech: "noun",
    category: "IT"
  },
  {
    word: "Deployment",
    transcription: "[dɪˈplɔɪmənt]",
    translation: "Развертывание / Деплой",
    explanation: "Процесс переноса готового кода на рабочий сервер, чтобы приложение стало доступным.",
    example: "The automatic deployment to Cloud Run was successful.",
    exampleTranslation: "Автоматический деплой на Cloud Run завершился успешно.",
    emoji: "🚀",
    partOfSpeech: "noun",
    category: "IT"
  },
  {
    word: "Repository",
    transcription: "[rɪˈpɒzɪtəri]",
    translation: "Репозиторий",
    explanation: "Место, где хранятся файлы проекта и история их изменений под контролем Git.",
    example: "Clone this repository to start working locally.",
    exampleTranslation: "Склонируй этот репозиторий, чтобы начать локальную работу.",
    emoji: "📁",
    partOfSpeech: "noun",
    category: "IT"
  },
  // Travel
  {
    word: "Wanderlust",
    transcription: "[ˈwɒndəlʌst]",
    translation: "Страсть к путешествиям",
    explanation: "Сильное, непреодолимое желание путешествовать и исследовать мир.",
    example: "His intense wanderlust makes it hard for him to stay in one place.",
    exampleTranslation: "Его безумная страсть к путешествиям мешает ему оставаться на одном месте.",
    emoji: "✈️",
    partOfSpeech: "noun",
    category: "Travel"
  },
  {
    word: "Itinerary",
    transcription: "[aɪˈtɪnərəri]",
    translation: "Маршрут / План поездки",
    explanation: "Подробный план путешествия с указанием дат, мест и активностей.",
    example: "We built an awesome cultural itinerary for our trip to Kyoto.",
    exampleTranslation: "Мы составили отличный культурный маршрут для нашей поездки в Киото.",
    emoji: "🗺️",
    partOfSpeech: "noun",
    category: "Travel"
  },
  {
    word: "Luggage",
    transcription: "[ˈlʌɡɪdʒ]",
    translation: "Багаж",
    explanation: "Чемоданы и дорожные сумки, в которых путешественник везет свои вещи.",
    example: "Please label your luggage with your contact details.",
    exampleTranslation: "Пожалуйста, снабдите свой багаж биркой с контактными данными.",
    emoji: "🧳",
    partOfSpeech: "noun",
    category: "Travel"
  },
  // Business
  {
    word: "Synergy",
    transcription: "[ˈsɪnədʒi]",
    translation: "Синергия",
    explanation: "Эффект взаимодействия, когда совместные усилия приносят гораздо больший результат.",
    example: "Our marketing and product teams achieved perfect synergy.",
    exampleTranslation: "Наши отделы маркетинга и продукта достигли идеальной синергии.",
    emoji: "💼",
    partOfSpeech: "noun",
    category: "Business"
  },
  {
    word: "Deadline",
    transcription: "[ˈdɛdlaɪn]",
    translation: "Крайний срок / Дедлайн",
    explanation: "Предельный срок завершения задачи, работы или сдачи проекта.",
    example: "We must deliver the pitch before the deadline tomorrow.",
    exampleTranslation: "Мы должны сдать презентацию до завтрашнего дедлайна.",
    emoji: "⏳",
    partOfSpeech: "noun",
    category: "Business"
  },
  {
    word: "Outsource",
    transcription: "[ˈaʊtsɔːs]",
    translation: "Передавать на аутсорс",
    explanation: "Передача определенных задач или функций внешней компании для экономии сил.",
    example: "It's more cost-effective to outsource our accounting tasks.",
    exampleTranslation: "Более выгодно отдавать наши бухгалтерские задачи на аутсорсинг.",
    emoji: "🌍",
    partOfSpeech: "verb",
    category: "Business"
  },
  // Everyday
  {
    word: "Serendipity",
    transcription: "[ˌsɛrənˈdɪpɪti]",
    translation: "Счастливая случайность",
    explanation: "Способность случайно находить ценные или приятные вещи, не ища их специально.",
    example: "Our path crossing at the cafe was pure serendipity.",
    exampleTranslation: "То, что мы пересеклись в кафе — чистейшая счастливая случайность.",
    emoji: "✨",
    partOfSpeech: "noun",
    category: "Everyday"
  },
  {
    word: "Procrastinate",
    transcription: "[prəʊˈkræstɪneɪt]",
    translation: "Откладывать на потом",
    explanation: "Постоянное оттягивание выполнения важных дел, заменяя их более приятными занятиями.",
    example: "If you procrastinate on studying, you'll regret it during exams.",
    exampleTranslation: "Если ты будешь откладывать учебу, ты пожалеешь об этом на экзаменах.",
    emoji: "🥱",
    partOfSpeech: "verb",
    category: "Everyday"
  },
  {
    word: "Cognizant",
    transcription: "[ˈkɒɡnɪzənt]",
    translation: "Осведомленный / Знающий",
    explanation: "Понимающий ситуацию, осознающий определенные факторы или угрозы.",
    example: "We are cognizant of the rules and will follow them.",
    exampleTranslation: "Мы осведомлены о правилах и будем им следовать.",
    emoji: "🧠",
    partOfSpeech: "adjective",
    category: "Everyday"
  },
  // Movies & TV Shows
  {
    word: "Cliffhanger",
    transcription: "[ˈclɪfˌhæŋ.ər]",
    translation: "Клиффхэнгер",
    explanation: "Обрыв серии или фильма на захватывающем и интригующем моменте.",
    example: "The first season ended with a major cliffhanger, shocking fans.",
    exampleTranslation: "Первый сезон завершился сильнейшим клиффхэнгером, шокировав фанатов.",
    emoji: "🎬",
    partOfSpeech: "noun",
    category: "Movies"
  },
  {
    word: "Plot twist",
    transcription: "[plɒt twɪst]",
    translation: "Поворот сюжета",
    explanation: "Резкое, неожиданное изменение хода событий в повествовании.",
    example: "No one predicted that breathtaking plot twist in the final scene.",
    exampleTranslation: "Никто не предугадал этот захватывающий поворот сюжета в финальной сцене.",
    emoji: "🔄",
    partOfSpeech: "noun",
    category: "Movies"
  },
  {
    word: "Blockbuster",
    transcription: "[ˈblɒkˌbʌs.tər]",
    translation: "Блокбастер",
    explanation: "Суперуспешный, дорогостоящий фильм, привлекающий миллионную аудиторию.",
    example: "This sci-fi film is expected to be the summer blockbusting sensation.",
    exampleTranslation: "Ожидается, что этот научно-фантастический фильм станет главным блокбастером лета.",
    emoji: "🍿",
    partOfSpeech: "noun",
    category: "Movies"
  },
  // Slang
  {
    word: "Glow up",
    transcription: "[ɡləʊ ʌp]",
    translation: "Преображение / Глоу-ап",
    explanation: "Потрясающая трансформация внешности, стиля жизни или уверенности в себе.",
    example: "Her personality glow up was even more impressive than her fashion shift.",
    exampleTranslation: "Ее внутреннее преображение было даже более впечатляющим, чем смена стиля.",
    emoji: "💎",
    partOfSpeech: "noun",
    category: "Slang"
  },
  {
    word: "No cap",
    transcription: "[nəʊ kæp]",
    translation: "Без шуток / Чистая правда",
    explanation: "Выражение, используемое чтобы подчеркнуть, что вы говорите абсолютную правду.",
    example: "Learning words with this app is incredibly fun, no cap.",
    exampleTranslation: "Учить слова с этим приложением безумно весело, честно говорю.",
    emoji: "🧢",
    partOfSpeech: "adverb",
    category: "Slang"
  },
  {
    word: "Vibe check",
    transcription: "[vaɪb tʃɛk]",
    translation: "Проверка атмосферы / настроения",
    explanation: "Оценка эмоционального фона, настроя человека или энергетики компании.",
    example: "He walked in, made an awkward joke, and failed the vibe check.",
    exampleTranslation: "Он вошел, неловко пошутил и не прошел проверку на классную атмосферу.",
    emoji: "🙌",
    partOfSpeech: "noun",
    category: "Slang"
  }
];

// Schema for Gemini SDK Structured Output
const wordSchema = {
  type: Type.OBJECT,
  properties: {
    word: { type: Type.STRING, description: "Correct English word or short phrase" },
    transcription: { type: Type.STRING, description: "IPA phonetic transcription, inside brackets, e.g. [dɪˈvɛləpmənt]" },
    translation: { type: Type.STRING, description: "Accurate Russian translation of the word" },
    explanation: { type: Type.STRING, description: "Short, engaging, simplified explanation of the word meaning in Russian (max 15 words)" },
    example: { type: Type.STRING, description: "An elegant, clear example sentence in English showing usage" },
    exampleTranslation: { type: Type.STRING, description: "Russian translation of the example sentence" },
    emoji: { type: Type.STRING, description: "One representative emoji, like 💡 or 🍔 corresponding to the theme" },
    partOfSpeech: { type: Type.STRING, description: "Part of speech, in lowercase (e.g. noun, verb, adjective, adverb)" },
    category: { type: Type.STRING, description: "Best matching category. Choose strictly one of: 'IT', 'Travel', 'Business', 'Everyday', 'Movies', 'Slang'" }
  },
  required: [
    "word",
    "transcription",
    "translation",
    "explanation",
    "example",
    "exampleTranslation",
    "emoji",
    "partOfSpeech",
    "category"
  ]
};

// --- API ENDPOINTS ---

// 1. Get default vocabulary cards
app.get("/api/words/default", (req, res) => {
  res.json(DEFAULT_PREMIUM_WORDS);
});

// 2. Gemini-powered translation/creation endpoint for new custom words
app.post("/api/ai/process-word", async (req, res) => {
  try {
    const { input } = req.body;
    if (!input || typeof input !== "string" || !input.trim()) {
      return res.status(400).json({ error: "Входные данные обязательны" });
    }

    const trimmedInput = input.trim();
    console.log(`[AI Request] Processing input: "${trimmedInput}"`);

    const ai = getAiClient();
    const prompt = `Пользователь хочет добавить слово или выражение для изучения: "${trimmedInput}".
Если это русский текст, найди наиболее популярный и точный английский эквивалент.
Если это английское слово, исправь опечатки если они есть.
Сформируй карточку для изучения, обязательно заполнив транскрипцию IPA, точный перевод на русский, простое описание на русском, пример предложения на английском, перевод примера на русский, один яркий эмодзи, часть речи и определи одну из категорий: 'IT', 'Travel', 'Business', 'Everyday', 'Movies', 'Slang'.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an ultimate English tutor and translation expert. Create precise, helpful language-learning dictionaries with phonetic transcription and highly explanatory short examples. Always follow the strict JSON schema requested.",
        responseMimeType: "application/json",
        responseSchema: wordSchema,
        temperature: 0.3
      }
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error("Не удалось получить ответ от ИИ.");
    }

    const parsedWord = JSON.parse(textOutput.trim());
    console.log(`[AI Response] Successfully created card for word "${parsedWord.word}"`);
    res.json({ success: true, word: parsedWord });
  } catch (error: any) {
    console.error("[Gemini Server Error]:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message || "Не удалось автоматически добавить слово. Пожалуйста, введите правильное слово." 
    });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// --- VITE DEV/PROD MIDDLEWARE ---
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    // Mount Vite dev server middlewares
    app.use(vite.middlewares);
    console.log("[Vite] Dev server middleware attached successfully");
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("[Express] Serving static assets from: " + distPath);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error("Failed to start server:", err);
});
