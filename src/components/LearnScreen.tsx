import React from "react";
import { 
  Volume2, 
  Rotate3d, 
  Check, 
  X, 
  ChevronLeft, 
  Award,
  BookOpen,
  ArrowRight
} from "lucide-react";
import { Word } from "../types";

export interface LearnScreenProps {
  category: string | null; // null represents general smart selection
  allWords: Word[];
  onBackToHome: () => void;
  onMarkKnown: (word: string) => void;
  onMarkDifficult: (word: string) => void;
  learnedWordIds: string[];
}

export default function LearnScreen({
  category,
  allWords,
  onBackToHome,
  onMarkKnown,
  onMarkDifficult,
  learnedWordIds
}: LearnScreenProps) {
  // Filter active deck based on chosen category or fallback
  const filteredWords = React.useMemo(() => {
    let pool = allWords;
    if (category) {
      pool = allWords.filter(w => w.category === category);
    }
    // Prioritize unlearned words
    return pool.filter(w => !learnedWordIds.includes(w.word));
  }, [allWords, category, learnedWordIds]);

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isFlipped, setIsFlipped] = React.useState(false);
  const [transitionState, setTransitionState] = React.useState<"idle" | "swipe-left" | "swipe-right">("idle");

  const activeWord: Word | undefined = filteredWords[currentIndex];

  // Phonetic TTS pronunciation
  const speak = (e: React.MouseEvent, text: string) => {
    e.stopPropagation(); // Don't trigger flip
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.85; // highly articulate speed
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleNextWord = (isKnown: boolean) => {
    if (!activeWord) return;

    // Trigger visual swipe transitions first
    setTransitionState(isKnown ? "swipe-right" : "swipe-left");

    setTimeout(() => {
      if (isKnown) {
        onMarkKnown(activeWord.word);
      } else {
        onMarkDifficult(activeWord.word);
      }

      setIsFlipped(false);
      setTransitionState("idle");
      // Advance standard index
      if (currentIndex < filteredWords.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        // We finished the filtered deck
        setCurrentIndex(filteredWords.length);
      }
    }, 280);
  };

  const handleFlip = () => {
    setIsFlipped(prev => !prev);
  };

  // Deck ended view
  if (!activeWord || currentIndex >= filteredWords.length) {
    return (
      <div className="flex flex-col items-center justify-center p-8 gap-6 text-center flex-1 my-auto animate-fadeIn">
        <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500/20 to-purple-500/30 border border-indigo-500/30 rounded-full flex items-center justify-center text-5xl shadow-xl shadow-indigo-500/5 hover:scale-115 transition duration-300">
          🏆
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-white leading-tight">Подборка завершена!</h2>
          <p className="text-sm text-slate-400 max-w-[280px] mx-auto leading-relaxed">
            Вы выучили все слова из категории {category ? `"${category}"` : '"Случайный Поиск"'}.
          </p>
        </div>

        <button
          onClick={onBackToHome}
          className="mt-4 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl text-xs font-semibold text-white tracking-wide shadow-md shadow-indigo-600/10 cursor-pointer w-full max-w-[240px]"
        >
          Вернуться на главную
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 p-5 gap-5 select-none relative h-full">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between w-full">
        <button 
          onClick={onBackToHome}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition py-1 px-2.5 rounded-lg bg-slate-800/35 border border-slate-700/10 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Выйти</span>
        </button>
        
        <span className="text-[11px] font-semibold text-indigo-400 tracking-wider font-mono bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full uppercase">
          {category || "MIXED DECK"} • {currentIndex + 1}/{filteredWords.length}
        </span>
      </div>

      {/* 3D Animated Card Space */}
      <div className="flex-1 flex items-center justify-center my-4 relative">
        <div 
          onClick={handleFlip}
          className={`w-full max-w-[340px] h-[380px] rounded-3xl cursor-pointer relative preserve-3d duration-500 transform transition-all ${
            isFlipped ? "rotate-y-180" : ""
          } ${
            transitionState === "swipe-right" ? "translate-x-[400px] rotate-12 opacity-0" : ""
          } ${
            transitionState === "swipe-left" ? "-translate-x-[400px] -rotate-12 opacity-0" : ""
          }`}
          style={{ perspective: "1000px" }}
        >
          
          {/* FRONT SIDE (English Word) */}
          <div className="absolute inset-0 backface-hidden bg-white/5 border border-white/10 backdrop-blur-xl rounded-[32px] p-6 flex flex-col justify-between shadow-2xl shadow-black/60 z-20 overflow-hidden">
            {/* Ambient glows inside card */}
            <div className="absolute top-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl" />

            <div className="flex justify-between items-center z-10">
              <span className="text-[9px] font-bold font-mono text-cyan-400 uppercase tracking-widest bg-white/10 border border-white/5 px-2.5 py-0.5 rounded-full">
                {activeWord.partOfSpeech}
              </span>
              <BookOpen className="w-4 h-4 text-white/30" />
            </div>

            <div className="flex flex-col items-center justify-center text-center gap-1 z-10 flex-1 py-10">
              <div className="text-3xl font-bold select-all tracking-wider text-white leading-tight">
                {activeWord.word}
              </div>
              <div className="text-xs font-mono text-cyan-300 tracking-wide font-normal mt-1 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                {activeWord.transcription}
              </div>
              
              <button 
                onClick={(e) => speak(e, activeWord.word)}
                className="mt-6 w-11 h-11 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg shadow-black/20"
              >
                <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />
              </button>
            </div>

            <div className="flex justify-center items-center gap-1.5 text-[10px] text-white/40 font-bold uppercase tracking-wider font-mono z-10">
              <Rotate3d className="w-3.5 h-3.5 text-indigo-400" />
              <span>Тап для перевода</span>
            </div>
          </div>

          {/* BACK SIDE (Russian Translation + Details) */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white/5 border border-white/10 backdrop-blur-xl rounded-[32px] p-6 flex flex-col justify-between shadow-2xl shadow-black/60 z-10 overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl" />

            <div className="flex justify-between items-center z-10">
              <div className="flex items-center gap-1.5 bg-white/10 border border-white/5 px-2.5 py-0.5 rounded-full text-[9px] text-white/60 font-semibold font-mono uppercase tracking-wider">
                <span>ТЕМА:</span>
                <span className="text-purple-400 uppercase font-bold">{activeWord.category}</span>
              </div>
              <span className="text-xl">{activeWord.emoji}</span>
            </div>

            <div className="flex flex-col gap-3.5 z-10 flex-1 justify-center py-4">
              <div className="flex flex-col gap-1 items-start">
                <span className="text-[8px] uppercase tracking-widest text-white/40 font-mono font-bold">Перевод</span>
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-indigo-300">
                  {activeWord.translation}
                </h3>
              </div>

              {activeWord.explanation && (
                <div className="border-l border-white/20 pl-3 py-0.5">
                  <span className="text-[8px] uppercase tracking-widest text-white/40 font-mono font-bold block">Значение</span>
                  <p className="text-[11px] text-slate-300 leading-relaxed mt-0.5">
                    {activeWord.explanation}
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-2 p-3 bg-black/40 border border-white/5 rounded-2xl">
                <span className="text-[8px] uppercase tracking-widest text-cyan-450 font-mono font-bold">Пример</span>
                <p className="text-[11px] text-slate-200 leading-normal font-sans italic">
                  &ldquo;{activeWord.example}&rdquo;
                </p>
                <p className="text-[10px] text-slate-400 border-t border-white/5 pt-1">
                  — {activeWord.exampleTranslation}
                </p>
              </div>
            </div>

            <div className="flex justify-center items-center gap-1.5 text-[10px] text-white/40 font-bold uppercase tracking-wider font-mono z-10">
              <Rotate3d className="w-3.5 h-3.5 text-indigo-400" />
              <span>Тап для оригинала</span>
            </div>
          </div>

        </div>
      </div>

      {/* Swipe Operations & Action Buttons */}
      <div className="flex justify-center items-center gap-5 w-full max-w-[340px] mx-auto z-15 mt-3 mb-6">
        
        {/* Dislike / Not Known Button */}
        <button
          onClick={() => handleNextWord(false)}
          className="flex-1 py-4 bg-gradient-to-b from-rose-500/10 to-rose-600/5 hover:from-rose-500/20 transition-all active:scale-95 border border-rose-500/30 hover:border-rose-500/50 text-rose-400 font-bold text-xs tracking-wider uppercase rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-rose-950/10 cursor-pointer"
        >
          <X className="w-4 h-4" />
          <span>Не знаю</span>
        </button>

        {/* Like / Known Button */}
        <button
          onClick={() => handleNextWord(true)}
          className="flex-1 py-4 bg-gradient-to-b from-emerald-500/15 to-emerald-600/5 hover:from-emerald-500/25 transition-all active:scale-95 border border-emerald-500/35 hover:border-emerald-500/50 text-emerald-400 font-bold text-xs tracking-wider uppercase rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/10 cursor-pointer"
        >
          <Check className="w-4 h-4 stroke-[3]" />
          <span>Знаю</span>
        </button>

      </div>
    </div>
  );
}
