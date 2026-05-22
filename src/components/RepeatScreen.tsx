import React from "react";
import { 
  RotateCcw, 
  Sparkles, 
  Volume2, 
  Check, 
  HelpCircle, 
  BookOpen, 
  TrendingUp, 
  Flame,
  X,
  Play
} from "lucide-react";
import { Word, UserProgress } from "../types";

export interface RepeatScreenProps {
  progress: UserProgress;
  onAdvanceWordToLearned: (word: string) => void;
  onKeepInDifficult: (word: string) => void;
  allWords: Word[];
  onStartLearning: () => void;
}

export default function RepeatScreen({
  progress,
  onAdvanceWordToLearned,
  onKeepInDifficult,
  allWords,
  onStartLearning
}: RepeatScreenProps) {
  // Extract real Word objects from simple difficultWords string keys
  const difficultWordsList = React.useMemo(() => {
    const combined = [...allWords, ...progress.customWords];
    return combined.filter(w => progress.difficultWords.includes(w.word));
  }, [allWords, progress.difficultWords, progress.customWords]);

  const [sessionActive, setSessionActive] = React.useState(false);
  const [sessionIndex, setSessionIndex] = React.useState(0);
  const [isFlipped, setIsFlipped] = React.useState(false);

  // Active word in current revision pool
  const activeWord = difficultWordsList[sessionIndex];

  const handleSpeak = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleResolve = (mastered: boolean) => {
    if (!activeWord) return;

    if (mastered) {
      // Promoting word into learned pool
      onAdvanceWordToLearned(activeWord.word);
    } else {
      // Retaining it inside difficult, shuffle or leave be
      onKeepInDifficult(activeWord.word);
    }

    setIsFlipped(false);
    if (sessionIndex < difficultWordsList.length - 1) {
      setSessionIndex(prev => prev + 1);
    } else {
      // Completed the active repetitive loop
      setSessionActive(false);
      setSessionIndex(0);
    }
  };

  // Dashboard status for empty list
  if (difficultWordsList.length === 0) {
    return (
      <div className="flex flex-col p-5 gap-6 flex-1 justify-center items-center my-auto animate-fadeIn">
        
        {/* Sparkle completion badge */}
        <div className="w-24 h-24 bg-gradient-to-tr from-emerald-500/20 to-teal-500/30 border border-emerald-500/30 rounded-full flex items-center justify-center text-4xl shadow-xl shadow-emerald-500/5 animate-pulse">
          ✨
        </div>

        <div className="text-center flex flex-col gap-2 max-w-[290px]">
          <h2 className="text-2xl font-bold text-white leading-tight">Ваш список пуст!</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Потрясающе! Вы повторили все сложные слова. Проблемных зон пока нет.
          </p>
        </div>

        {/* Motivational recommendation cards */}
        <div className="w-full bg-[#121522]/80 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex gap-2 items-center">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-slate-300">Чем заняться дальше?</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">
            Изучайте новые карты категорий или добавьте пользовательские слова с помощью микрофона.
          </p>
          
          <button
            onClick={onStartLearning}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl py-2.5 text-xs font-semibold transition cursor-pointer"
          >
            Учить новые слова
          </button>
        </div>

      </div>
    );
  }

  // Active Spaced Repetition Session Widget
  if (sessionActive && activeWord) {
    return (
      <div className="flex flex-col p-5 gap-6 flex-1 select-none animate-fadeIn">
        
        {/* Session Stats Header */}
        <div className="flex justify-between items-center w-full">
          <button 
            onClick={() => setSessionActive(false)}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition py-1 px-2.5 rounded-lg bg-slate-800/35 border border-slate-700/10 cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span>Прервать</span>
          </button>
          
          <span className="text-[10px] font-semibold text-emerald-400 tracking-wider font-mono bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            ПОВТОРЕНИЕ • {sessionIndex + 1}/{difficultWordsList.length}
          </span>
        </div>

        {/* Mini Flashcard representation */}
        <div className="flex-1 flex items-center justify-center min-h-[300px]">
          <div 
            onClick={() => setIsFlipped(prev => !prev)}
            className={`w-full max-w-[320px] h-[340px] rounded-3xl relative duration-500 transform cursor-pointer border border-slate-800/80 shadow-[0_12px_30px_rgba(0,0,0,0.6)] ${
              isFlipped ? "rotate-y-180" : ""
            }`}
            style={{ perspective: "1000px" }}
          >
            
            {/* FRONT (English Word only) */}
            <div className="absolute inset-0 backface-hidden bg-[#151929] rounded-3xl p-5 flex flex-col justify-between overflow-hidden">
              <div className="flex justify-between items-center">
                <span className="text-[9px] bg-slate-800 font-mono text-slate-400 px-2 py-0.5 rounded uppercase font-semibold">
                  на повторении
                </span>
                <span className="text-xl">{activeWord.emoji}</span>
              </div>

              <div className="flex flex-col items-center gap-2 flex-1 justify-center">
                <h4 className="text-2xl font-bold text-white tracking-wide">{activeWord.word}</h4>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{activeWord.transcription}</p>
                <button
                  onClick={(e) => handleSpeak(e, activeWord.word)}
                  className="w-10 h-10 mt-4 rounded-full bg-indigo-600/15 border border-indigo-500/20 hover:bg-indigo-600/30 text-indigo-400 hover:text-white flex items-center justify-center transform active:scale-95 transition cursor-pointer"
                  title="Озвучить"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <span className="text-[10px] text-slate-500 text-center font-medium block">
                Тап для перевода
              </span>
            </div>

            {/* BACK (Translation & Explanation) */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#121421] rounded-3xl p-5 flex flex-col justify-between overflow-hidden">
              <div className="flex justify-between items-center">
                <span className="text-[9px] text-cyan-400 bg-cyan-950/20 border border-cyan-950/30 px-2.5 py-0.5 rounded uppercase font-semibold">
                  {activeWord.partOfSpeech}
                </span>
                <span className="text-xl">{activeWord.emoji}</span>
              </div>

              <div className="flex flex-col gap-3 justify-center flex-1">
                <div className="flex flex-col items-center gap-1 text-center">
                  <span className="text-[8px] text-slate-500 tracking-wider font-mono">ПЕРЕВОД</span>
                  <h3 className="text-xl font-bold text-emerald-400">{activeWord.translation}</h3>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed text-center font-sans border-t border-slate-800/60 pt-2 opacity-90">
                  {activeWord.explanation}
                </p>

                <div className="bg-slate-900/40 p-2.5 rounded-xl border border-slate-800 text-[11px] text-center italic text-slate-400 leading-normal">
                  &ldquo;{activeWord.example}&rdquo;
                </div>
              </div>

              <span className="text-[10px] text-slate-500 text-center font-medium block">
                Тап для оригинала
              </span>
            </div>

          </div>
        </div>

        {/* Action controllers */}
        <div className="flex gap-4 w-full max-w-[320px] mx-auto mb-6">
          <button
            onClick={() => handleResolve(false)}
            className="flex-1 py-3.5 bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 rounded-2xl text-[11px] font-bold tracking-wider text-slate-300 uppercase flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Чуть позже</span>
          </button>
          <button
            onClick={() => handleResolve(true)}
            className="flex-1 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-white rounded-2xl text-[11px] font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-900/10 cursor-pointer"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Запомнил!</span>
          </button>
        </div>

      </div>
    );
  }

  return (
    <div className="flex flex-col p-5 gap-6 select-none animate-fadeIn">
      
      {/* Intro Dashboard */}
      <div className="bg-gradient-to-b from-[#181a29] to-[#0f111d] border border-slate-800/80 rounded-3xl p-5 flex flex-col gap-4 shadow-md relative overflow-hidden">
        
        {/* Background glow icon */}
        <div className="absolute right-[-15px] bottom-[-15px] text-8xl opacity-[0.03] rotate-12">
          🔄
        </div>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-500/15 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-teal-400 shadow-md">
            <RotateCcw className="w-5.5 h-5.5 animate-spin" style={{ animationDuration: "10s" }} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Интервальное Повторение</h2>
            <p className="text-xs text-slate-400">Закрепление наиболее сложных слов</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3.5 mt-2">
          <div className="bg-slate-900/50 p-3.5 rounded-2xl border border-slate-800/40 flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Всего трудных</span>
            <span className="text-2xl font-bold text-white font-mono mt-1">{difficultWordsList.length}</span>
          </div>
          <div className="bg-slate-900/50 p-3.5 rounded-2xl border border-slate-800/40 flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">На заучивание</span>
            <span className="text-2xl font-bold text-cyan-400 font-mono mt-1">
              {Math.min(difficultWordsList.length, 10)}
            </span>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 leading-normal bg-indigo-950/20 border border-indigo-500/5 p-3 rounded-xl mt-1">
          💡 Система алгоритмов выявляет слова, в которых вы чаще всего ошибались, и будет предлагать их до тех пор, пока вы не отметите слово полностью выученным. Это экономит до 75% времени учебы!
        </p>

        <button 
          onClick={() => setSessionActive(true)}
          className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-semibold rounded-2xl py-3.5 mt-2 transition shadow-lg shadow-emerald-950/20 active:scale-[0.98] outline-none border-t border-white/5 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Play className="w-4 h-4 fill-current stroke-none" />
          <span>Запустить повторение ({difficultWordsList.length})</span>
        </button>
      </div>

      {/* List items representation */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Ваша коллекция трудностей ({difficultWordsList.length})</h3>
        
        <div className="flex flex-col gap-2.5 max-h-[290px] overflow-y-auto scrollbar-none pr-0.5">
          {difficultWordsList.map((word) => (
            <div 
              key={word.word}
              className="bg-[#121522]/60 hover:bg-[#121522]/90 border border-slate-800/60 p-3 rounded-2xl flex items-center justify-between transition gap-2"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-2xl flex-shrink-0">{word.emoji}</span>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-white truncate">{word.word}</span>
                  <span className="text-[10px] text-slate-400 font-mono italic truncate">{word.transcription}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400 font-sans truncate mr-1">— {word.translation}</span>
                <button
                  onClick={(e) => handleSpeak(e, word.word)}
                  className="w-8 h-8 rounded-full bg-slate-800/40 border border-slate-700/10 flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
