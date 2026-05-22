import React from "react";
import { 
  Compass, 
  RotateCcw, 
  Gamepad2, 
  User, 
  BookOpen, 
  MoreVertical, 
  X,
  Wifi,
  Battery,
  Sparkles,
  Mic,
  Send,
  Volume2,
  ChevronRight,
  TrendingUp,
  Award,
  Plus
} from "lucide-react";
import { ActiveScreen, Word } from "../types";

export interface TelegramFrameProps {
  children: React.ReactNode;
  activeScreen: ActiveScreen;
  setScreen: (screen: ActiveScreen) => void;
  streak: number;
  points: number;
  learnedCount: number;
  totalWordsCount: number;
  onStartCategory: (category: string | null) => void;
  onAddCustomWord: (word: Word) => void;
}

export default function TelegramFrame({
  children,
  activeScreen,
  setScreen,
  streak,
  points,
  learnedCount,
  totalWordsCount,
  onStartCategory,
  onAddCustomWord
}: TelegramFrameProps) {
  // Current real-time clock state
  const [timeStr, setTimeStr] = React.useState("18:10");

  // Sidebar translator state
  const [sidebarInput, setSidebarInput] = React.useState("");
  const [sidebarListening, setSidebarListening] = React.useState(false);
  const [sidebarLoading, setSidebarLoading] = React.useState(false);
  const [sidebarError, setSidebarError] = React.useState("");
  const [sidebarResult, setSidebarResult] = React.useState<Word | null>(null);

  React.useEffect(() => {
    const updateClock = () => {
      const d = new Date();
      let hrs = d.getHours().toString().padStart(2, '0');
      let mins = d.getMinutes().toString().padStart(2, '0');
      setTimeStr(`${hrs}:${mins}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 60000);
    return () => clearInterval(interval);
  }, []);

  // Speech Recognition API config for sidebar
  const toggleSidebarSpeech = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Голосовое распознавание не поддерживается в вашем браузере. Вы можете ввести слово вручную!");
      return;
    }

    if (sidebarListening) {
      setSidebarListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = "ru-RU";
      recognition.interimResults = false;

      recognition.onstart = () => {
        setSidebarListening(true);
        setSidebarError("");
      };

      recognition.onerror = () => {
        setSidebarListening(false);
        setSidebarError("Ошибка распознавания");
      };

      recognition.onend = () => {
        setSidebarListening(false);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSidebarInput(transcript);
        handleSidebarProcessWord(transcript);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setSidebarListening(false);
    }
  };

  const handleSidebarProcessWord = async (inputVal?: string) => {
    const text = inputVal || sidebarInput;
    if (!text.trim()) return;

    setSidebarLoading(true);
    setSidebarError("");
    setSidebarResult(null);

    try {
      const res = await fetch("/api/ai/process-word", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: text.trim() })
      });

      const data = await res.json();
      if (data.success && data.word) {
        setSidebarResult(data.word);
        onAddCustomWord(data.word);
        setSidebarInput("");
      } else {
        setSidebarError(data.error || "Не распознано");
      }
    } catch (err) {
      setSidebarError("Ошибка соединения");
    } finally {
      setSidebarLoading(false);
    }
  };

  // Compute daily parameters
  const targetGoal = 20;
  const progressPercent = Math.min(100, Math.round((learnedCount / targetGoal) * 100));

  // Static list for dynamic categories selector inside right sidebar
  const sidebarCategories = [
    { id: "IT", label: "IT & Код", emoji: "💻", color: "border-blue-500/10 text-blue-400 font-bold" },
    { id: "Travel", label: "Туризм", emoji: "✈️", color: "border-emerald-500/10 text-emerald-400 font-bold" },
    { id: "Business", label: "Бизнес", emoji: "💼", color: "border-amber-500/10 text-amber-500 font-bold" },
    { id: "Movies", label: "Фильмы", emoji: "🍿", color: "border-rose-500/10 text-rose-400 font-bold" }
  ];

  return (
    <div id="tma-app-container" className="min-h-screen bg-[#08080A] text-slate-100 font-sans flex items-center justify-center p-0 lg:p-6 overflow-x-hidden antialiased select-none relative">
      
      {/* Background ambient radial glow layers */}
      <div className="absolute top-[10%] left-[5%] -z-10 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none animate-float" />
      <div className="absolute bottom-[10%] right-[5%] -z-10 w-[500px] h-[500px] bg-indigo-650/5 rounded-full blur-[140px] pointer-events-none animate-float" style={{ animationDelay: "2s" }} />

      {/* Main Multi-Column Outer Container */}
      <div className="w-full max-w-7xl h-full flex items-center justify-center gap-6">

        {/* ================= LEFT SIDEBAR ================= */}
        <div className="w-[300px] h-[800px] hidden lg:flex flex-col gap-5">
          
          {/* Progress Tracker Card */}
          <div className="bg-white/5 border border-white/10 rounded-[32px] p-5 backdrop-blur-xl flex flex-col gap-3.5 shadow-xl shadow-black/30">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xl font-bold italic shadow-lg shadow-blue-500/25 text-white">
                {learnedCount > 0 ? "🏆" : "🧠"}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-white/50 uppercase tracking-widest font-semibold font-mono">Академия Слов</p>
                <h2 className="text-sm font-bold text-white truncate">Ученик Английского</h2>
              </div>
            </div>
            
            <div className="h-px bg-white/10 my-1" />
            
            <div className="flex justify-between items-center text-xs">
              <span className="text-white/70">Дневная цель</span>
              <span className="font-mono font-bold text-blue-400">{learnedCount}/{targetGoal} слов</span>
            </div>

            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-700 ease-out" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Dedicated AI Voice Assistant card */}
          <div className="bg-white/5 border border-white/10 rounded-[32px] p-5 backdrop-blur-xl flex-1 flex flex-col justify-between shadow-xl shadow-black/30 overflow-y-auto scrollbar-none">
            
            <div className="flex flex-col gap-2.5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-1 font-mono">Голосовой ИИ</h3>
              
              <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl">
                <p className="text-xs italic text-white/80 leading-relaxed font-medium">
                  &ldquo;Скажите слово по-русски, и я добавлю его в вашу тренировку с контекстом...&rdquo;
                </p>
              </div>

              {/* Translation Inputs inside sidebar */}
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex items-center gap-1.5 bg-black/30 border border-white/10 focus-within:border-white/20 p-1 rounded-xl transition-all">
                  <input
                    type="text"
                    value={sidebarInput}
                    onChange={(e) => setSidebarInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSidebarProcessWord();
                    }}
                    placeholder={sidebarListening ? "Слушаю..." : "Слово по-русски..."}
                    className="flex-1 bg-transparent border-none text-xs text-white placeholder-white/30 outline-none px-2 py-1 min-w-[50px]"
                    disabled={sidebarListening || sidebarLoading}
                  />

                  <button
                    onClick={() => handleSidebarProcessWord()}
                    disabled={sidebarLoading || !sidebarInput.trim()}
                    className="p-1.5 bg-indigo-650/80 hover:bg-indigo-600 rounded-lg text-white transition disabled:opacity-40"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>

                {sidebarError && (
                  <p className="text-[10px] text-rose-400 bg-rose-500/5 py-1 px-2 rounded-lg border border-rose-500/10">{sidebarError}</p>
                )}

                {sidebarResult && (
                  <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-2.5 text-[10px] text-emerald-300 animate-fadeIn mt-1">
                    <p className="font-bold text-white mb-0.5">{sidebarResult.word} ({sidebarResult.emoji})</p>
                    <p className="leading-tight">— {sidebarResult.translation}</p>
                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={toggleSidebarSpeech}
              className={`w-full py-3.5 border rounded-2xl flex items-center justify-center gap-2.5 transition-all duration-150 active:scale-95 cursor-pointer mt-4 ${
                sidebarListening 
                  ? "bg-red-500/20 border-red-500/40 text-red-400 animate-pulse" 
                  : "bg-white/10 hover:bg-white/15 border-white/10 text-white font-medium text-xs"
              }`}
            >
              <div className={`w-2.5 h-2.5 rounded-full ${sidebarListening ? "bg-red-400 animate-ping" : "bg-red-500"}`} />
              <span>{sidebarListening ? "Запись..." : "Голосовой ввод"}</span>
            </button>
          </div>

        </div>

        {/* ================= CENTER: TMA SMARTPHONE VIEWPORT ================= */}
        <div id="tma-smartphone-wrapper" className="w-full max-w-[420px] h-[800px] lg:border-[8px] lg:border-[#222227]/90 lg:rounded-[52px] lg:bg-[#111114] shadow-2xl relative overflow-hidden flex flex-col">
          
          {/* TMA Mock Phone Header */}
          <div id="tma-status-bar" className="flex justify-between items-center px-6 pt-3 pb-2 text-[10px] font-mono tracking-wider text-slate-400 select-none bg-[#0a0b0f] box-border border-b border-white/5">
            <span>{timeStr}</span>
            <div className="flex items-center gap-1.5">
              <Wifi className="w-3 h-3 text-cyan-400" />
              <span className="text-[9px]">TMA 5G</span>
              <Battery className="w-4 h-4 ml-1 text-emerald-400" />
            </div>
          </div>

          {/* Telegram-style Toolbar wrapper */}
          <div id="tma-header-bar" className="flex justify-between items-center px-4 py-3 border-b border-white/5 bg-[#0e1017]/95 backdrop-blur-md sticky top-0 z-50">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold tracking-wide text-white font-sans truncate">EngWordBot</span>
                <span className="text-[9px] text-slate-400 font-mono truncate">telegram mini app</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full text-[10px] font-medium text-slate-205">
                <span>🔥 {streak}д</span>
                <span className="text-white/20">•</span>
                <span className="text-cyan-400 font-bold font-mono">⚡ {points}XP</span>
              </div>
              
              <button className="p-1.5 rounded-full text-slate-400 hover:text-white transition">
                <MoreVertical className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setScreen("home")} className="p-1.5 rounded-full text-slate-400 hover:text-white transition">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Scrollable Container with custom padding for the app UI */}
          <div id="tma-screen-content" className="flex-1 overflow-y-auto overflow-x-hidden pb-4 scrollbar-none flex flex-col bg-[#0e1017]">
            {children}
          </div>

          {/* Sleek Rounded Navigation Bar */}
          <div id="tma-bottom-nav" className="relative z-50 flex-shrink-0 px-3 pb-3 pt-2 bg-[#090a0f]">
            <div className="flex justify-around items-center bg-[#151824]/95 border border-white/10 backdrop-blur-xl py-2 px-1.5 rounded-2xl shadow-xl shadow-black/40">
              
              {/* Home tab */}
              <button 
                id="nav-btn-home"
                onClick={() => setScreen("home")}
                className={`flex flex-col items-center gap-1 flex-1 py-1 px-1 transition duration-200 ${
                  activeScreen === "home" ? "text-indigo-400 scale-105" : "text-slate-400 hover:text-slate-205"
                }`}
              >
                <Compass className={`w-5 h-5 ${activeScreen === "home" ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
                <span className="text-[9px] font-bold uppercase tracking-wider">Домой</span>
              </button>

              {/* Learn tab */}
              <button 
                id="nav-btn-learn"
                onClick={() => setScreen("learn")}
                className={`flex flex-col items-center gap-1 flex-1 py-1 px-1 transition duration-200 ${
                  activeScreen === "learn" ? "text-indigo-400 scale-105" : "text-slate-400 hover:text-slate-205"
                }`}
              >
                <BookOpen className={`w-5 h-5 ${activeScreen === "learn" ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
                <span className="text-[9px] font-bold uppercase tracking-wider">Учить</span>
              </button>

              {/* Repeat tab */}
              <button 
                id="nav-btn-repeat"
                onClick={() => setScreen("repeat")}
                className={`flex flex-col items-center gap-1 flex-1 py-1 px-1 transition duration-200 ${
                  activeScreen === "repeat" ? "text-indigo-400 scale-105" : "text-slate-400 hover:text-slate-205"
                }`}
              >
                <RotateCcw className={`w-5 h-5 ${activeScreen === "repeat" ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
                <span className="text-[9px] font-bold uppercase tracking-wider">Повтор</span>
              </button>

              {/* Games tab */}
              <button 
                id="nav-btn-games"
                onClick={() => setScreen("games")}
                className={`flex flex-col items-center gap-1 flex-1 py-1 px-1 transition duration-200 ${
                  activeScreen === "games" ? "text-indigo-400 scale-105" : "text-slate-400 hover:text-slate-205"
                }`}
              >
                <Gamepad2 className={`w-5 h-5 ${activeScreen === "games" ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
                <span className="text-[9px] font-bold uppercase tracking-wider">Игры</span>
              </button>

              {/* Profile tab */}
              <button 
                id="nav-btn-profile"
                onClick={() => setScreen("profile")}
                className={`flex flex-col items-center gap-1 flex-1 py-1 px-1 transition duration-200 ${
                  activeScreen === "profile" ? "text-indigo-400 scale-105" : "text-slate-400 hover:text-slate-205"
                }`}
              >
                <User className={`w-5 h-5 ${activeScreen === "profile" ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
                <span className="text-[9px] font-bold uppercase tracking-wider">Инфо</span>
              </button>

            </div>
          </div>

        </div>

        {/* ================= RIGHT SIDEBAR ================= */}
        <div className="w-[300px] h-[800px] hidden lg:flex flex-col gap-5">
          
          {/* Categories select list */}
          <div className="bg-white/5 border border-white/10 rounded-[32px] p-5 backdrop-blur-xl shadow-xl shadow-black/30">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3.5 font-mono">Категории</h3>
            <div className="grid grid-cols-2 gap-2.5">
              {sidebarCategories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onStartCategory(c.id)}
                  className="p-3 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-1 hover:bg-white/10 text-left transition select-none cursor-pointer group hover:scale-[1.02]"
                >
                  <span className="text-lg group-hover:scale-110 transition duration-150">{c.emoji}</span>
                  <span className="text-[10px] font-bold text-slate-300 truncate">{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Real-time Global Leaderboard simulation */}
          <div className="bg-white/5 border border-white/10 rounded-[32px] p-5 backdrop-blur-xl flex-1 flex flex-col shadow-xl shadow-black/30 overflow-hidden">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4 font-mono">Лидеры недели</h3>
            
            <div className="flex flex-col gap-3 flex-1 overflow-y-auto scrollbar-none">
              
              {/* Leader #1 */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center font-bold text-yellow-500 text-xs">1</div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-semibold text-white block truncate">Татьяна Белова</span>
                </div>
                <span className="text-[10px] font-mono text-white/40">14.2k XP</span>
              </div>

              {/* Leader #2 */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-400/10 border border-slate-400/30 flex items-center justify-center font-bold text-slate-400 text-xs">2</div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-semibold text-white block truncate">Дмитрий С.</span>
                </div>
                <span className="text-[10px] font-mono text-white/40">12.8k XP</span>
              </div>

              {/* Leader #3 */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-700/10 border border-amber-700/30 flex items-center justify-center font-bold text-amber-600 text-xs">3</div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-semibold text-white block truncate">Кирилл Ветров</span>
                </div>
                <span className="text-[10px] font-mono text-white/40">11.1k XP</span>
              </div>

              {/* Current user's dynamic insertion slot */}
              <div className="flex items-center gap-3 bg-indigo-500/10 border border-indigo-500/20 p-2.5 rounded-xl mt-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-400 text-xs">4</div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-bold text-white block truncate">Вы (Академик)</span>
                </div>
                <span className="text-[10px] font-mono text-indigo-300 font-bold">{points} XP</span>
              </div>

            </div>

            <button 
              onClick={() => alert("Ссылка для приглашения скопирована в буфер обмена! 🚀 Отправьте друзьям, чтобы получить +55 XP!")}
              className="mt-4 p-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-505 rounded-2xl text-center font-semibold text-xs text-white shadow-lg active:scale-95 transition-all text-sm cursor-pointer border-t border-white/10"
            >
              Пригласить друзей
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
