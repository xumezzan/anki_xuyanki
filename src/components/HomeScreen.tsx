import React from "react";
import { Mic, Sparkles, Send, Play, GraduationCap, ChevronRight, Volume2, HelpCircle } from "lucide-react";
import { Word, UserProgress } from "../types";

export interface HomeScreenProps {
  progress: UserProgress;
  onStartLearning: (category: string | null) => void;
  onAddCustomWord: (word: Word) => void;
  allWords: Word[];
}

function getTgFirstName(): string {
  try {
    const tg = (window as any).Telegram?.WebApp;
    const name = tg?.initDataUnsafe?.user?.first_name;
    return name ? name : "";
  } catch {
    return "";
  }
}

export default function HomeScreen({
  progress,
  onStartLearning,
  onAddCustomWord,
  allWords
}: HomeScreenProps) {
  const tgName = getTgFirstName();
  const [aiInput, setAiInput] = React.useState("");
  const [isListening, setIsListening] = React.useState(false);
  const [isAiLoading, setIsAiLoading] = React.useState(false);
  const [aiError, setAiError] = React.useState("");
  const [aiResult, setAiResult] = React.useState<Word | null>(null);

  // Simple category setup matching the modern gradient designs
  const categories = [
    { id: "IT", label: "IT & Код", emoji: "💻", color: "from-blue-600/10 to-indigo-600/5 text-blue-400 border-white/10 hover:border-blue-500/30" },
    { id: "Travel", label: "Туризм", emoji: "✈️", color: "from-emerald-600/10 to-teal-650/5 text-emerald-400 border-white/10 hover:border-emerald-500/30" },
    { id: "Business", label: "Бизнес", emoji: "💼", color: "from-amber-600/10 to-orange-650/5 text-amber-400 border-white/10 hover:border-amber-500/30" },
    { id: "Everyday", label: "Разговорный", emoji: "🗣️", color: "from-purple-600/10 to-fuchsia-650/5 text-purple-400 border-white/10 hover:border-purple-500/30" },
    { id: "Movies", label: "Фильмы & ТВ", emoji: "🎬", color: "from-rose-600/10 to-pink-650/5 text-rose-400 border-white/10 hover:border-rose-500/30" },
    { id: "Slang", label: "Сленг", emoji: "😎", color: "from-cyan-600/10 to-blue-650/5 text-cyan-300 border-white/10 hover:border-cyan-500/30" }
  ];

  // Calculate stats
  const wordsMatchedForCategory = (cat: string) => {
    return allWords.filter(w => w.category === cat).length;
  };

  const learnedCountForToday = progress.learnedWords.length;
  const targetWordsPerDay = 20;
  const progressPercent = Math.min(100, Math.round((learnedCountForToday / targetWordsPerDay) * 100));

  // Speech Recognition API config
  const toggleSpeech = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Голосовое распознавание не поддерживается в вашем браузере. Вы можете ввести слово текстом!");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = "ru-RU"; // Can recognize Russian or English
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setAiError("");
      };

      recognition.onerror = (e: any) => {
        console.error("Speech Recognition Error", e);
        setIsListening(false);
        setAiError("Ошибка записи звука. Пожалуйста, попробуйте еще раз.");
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setAiInput(transcript);
        handleProcessWord(transcript);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  const handleProcessWord = async (inputStr?: string) => {
    const textToQuery = inputStr || aiInput;
    if (!textToQuery.trim()) {
      setAiError("Пожалуйста, введите слово или фразу.");
      return;
    }

    setIsAiLoading(true);
    setAiError("");
    setAiResult(null);

    try {
      const res = await fetch("/api/ai/process-word", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: textToQuery.trim() })
      });

      const data = await res.json();
      if (data.success && data.word) {
        setAiResult(data.word);
        onAddCustomWord(data.word);
        setAiInput("");
      } else {
        setAiError(data.error || "Не удалось распознать слово.");
      }
    } catch (err: any) {
      setAiError("Ошибка соединения. Попробуйте еще раз.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="flex flex-col p-5 gap-6">
      
      {/* Premium Circular Progress Header */}
      <div id="home-dashboard" className="bg-white/5 border border-white/10 rounded-[32px] p-5 flex items-center justify-between relative overflow-hidden shadow-xl backdrop-blur-xl">
        
        {/* Background ambient radial glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-6 -mt-6" />
        
        <div className="flex flex-col gap-1 z-15">
          <p className="text-[10px] text-white/50 font-bold tracking-widest uppercase font-mono">Твой Прогресс Сегодня</p>
          <h2 className="text-xl font-bold text-white leading-tight">
            {tgName ? `Привет, ${tgName}! 👋` : "Привет, учение! 👋"}
          </h2>
          <p className="text-xs text-white/80 mt-1 font-medium">
            Выучено слов: <span className="text-blue-400 font-bold font-mono text-sm">{learnedCountForToday}</span> / {targetWordsPerDay}
          </p>
          {progress.streak > 0 && (
            <div className="flex items-center gap-1.5 mt-2.5 bg-white/10 border border-white/10 px-2.5 py-1 rounded-full text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider w-fit">
              <span>🔥 Серия дней: {progress.streak}д</span>
            </div>
          )}
        </div>

        {/* Circular SVG Indicator */}
        <div className="relative w-18 h-18 flex-shrink-0 z-10 select-none">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="16" fill="transparent" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="3" />
            <circle 
              cx="18" 
              cy="18" 
              r="16" 
              fill="transparent" 
              stroke="url(#gradient-cyan-violet)" 
              strokeWidth="3.2" 
              strokeDasharray="100" 
              strokeDashoffset={100 - progressPercent}
              className="transition-all duration-700 ease-out"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="gradient-cyan-violet" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-xs font-bold font-mono text-white leading-none">{progressPercent}%</span>
            <span className="text-[7px] text-white/50 mt-1 uppercase tracking-wider font-bold">цель</span>
          </div>
        </div>

      </div>

      {/* Main Start Button */}
      <button 
        id="btn-quick-start"
        onClick={() => onStartLearning(null)}
        className="w-full bg-white/10 hover:bg-white/15 active:scale-[0.98] py-4 rounded-2xl font-bold text-white text-xs uppercase tracking-widest border border-white/10 flex items-center justify-center gap-2.5 transition duration-150 cursor-pointer shadow-lg shadow-black/20"
      >
        <Play className="w-4 h-4 fill-current text-white stroke-none" />
        <span>Начать умную практику</span>
      </button>

      {/* AI Voice Addition Module */}
      <div id="ai-voice-widget" className="bg-white/5 border border-white/10 rounded-[32px] p-5 flex flex-col gap-4 shadow-xl backdrop-blur-xl relative">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center p-2 bg-white/10 rounded-xl text-white border border-white/10">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 font-mono">Голосовой ИИ переводчик</h3>
              <p className="text-[10px] text-slate-300 mt-0.5 font-medium">Скажи слово по-русски — ИИ переведет в TMA карту</p>
            </div>
          </div>
        </div>

        {/* Search bar layout */}
        <div className="flex items-center gap-2 bg-black/40 border border-white/10 focus-within:border-white/20 p-1.5 rounded-2xl transition-all">
          
          {/* Audio mic recording button */}
          <button 
            type="button"
            onClick={toggleSpeech}
            className={`p-3 rounded-xl transition duration-150 flex items-center justify-center relative cursor-pointer ${
              isListening 
                ? "bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse" 
                : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/5"
            }`}
            title="Голосовой ввод"
          >
            <Mic className="w-4 h-4" />
            {isListening && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-400 rounded-full animate-ping" />
            )}
          </button>
          
          <input 
            type="text"
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleProcessWord();
            }}
            placeholder={isListening ? "Слушаю... скажите слово" : "Введите слово или надиктуйте..."}
            className="flex-1 bg-transparent border-none text-xs text-white placeholder-white/30 outline-none px-2 min-w-[50px]"
            disabled={isListening || isAiLoading}
          />

          <button
            type="button"
            onClick={() => handleProcessWord()}
            disabled={isAiLoading || isListening || !aiInput.trim()}
            className="p-3 bg-white/10 hover:bg-white/15 disabled:opacity-30 disabled:hover:bg-white/10 text-white rounded-xl transition border border-white/10 cursor-pointer"
          >
            {isAiLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Feedback results of AI mapping */}
        {aiError && (
          <p className="text-xs font-medium text-rose-400 font-sans mt-1 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-xl">
            {aiError}
          </p>
        )}

        {aiResult && (
          <div className="bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3.5 flex flex-col gap-1 text-xs text-emerald-300 font-sans animate-fadeIn transition">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm flex items-center gap-1">
                <span>{aiResult.emoji}</span> {aiResult.word}
              </span>
              <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-emerald-400 capitalize">
                {aiResult.partOfSpeech}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">{aiResult.transcription}</p>
            <p className="text-slate-200 mt-1 font-medium">— {aiResult.translation}</p>
            <p className="text-[10px] text-slate-400 italic mt-0.5 mt-2 bg-slate-800/20 p-2 rounded-lg leading-relaxed">
              &ldquo;{aiResult.example}&rdquo; <span className="text-[9px] block text-slate-500 not-italic mt-0.5">— {aiResult.exampleTranslation}</span>
            </p>
            <span className="text-[10px] text-emerald-400 mt-2 font-semibold">✓ Слово добавлено в подборку &rdquo;{aiResult.category}&ldquo;!</span>
          </div>
        )}
      </div>

      {/* Grid Categories */}
      <div id="word-categories" className="flex flex-col gap-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest font-mono">Категории слов</h3>
          <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider font-mono">Все темы</span>
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          {categories.map((cat) => {
            const count = wordsMatchedForCategory(cat.id);
            return (
              <button
                key={cat.id}
                id={`category-card-${cat.id.toLowerCase()}`}
                onClick={() => onStartLearning(cat.id)}
                className={`bg-gradient-to-b ${cat.color} border p-4 rounded-2xl flex flex-col items-start gap-1 select-none text-left relative overflow-hidden transition duration-150 hover:brightness-110 active:scale-[0.98] outline-none group cursor-pointer`}
              >
                {/* Background watermarked emoji */}
                <div className="absolute right-2 bottom-1 text-5xl opacity-[0.05] group-hover:scale-110 group-hover:opacity-[0.1] transition duration-300">
                  {cat.emoji}
                </div>

                <span className="text-xl mt-1">{cat.emoji}</span>
                <span className="text-xs font-bold text-white tracking-widest uppercase font-sans mt-2">{cat.label}</span>
                <span className="text-[9px] font-mono opacity-80 mt-0.5 font-medium font-mono text-slate-400">{count} слов</span>

                <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition duration-200">
                  <ChevronRight className="w-3 h-3 text-white" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
