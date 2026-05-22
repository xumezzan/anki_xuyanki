import React from "react";
import { 
  Gamepad2, 
  Sparkles, 
  HelpCircle, 
  Check, 
  X, 
  Hourglass, 
  RotateCcw, 
  Heart,
  Lightbulb,
  ArrowRight,
  ChevronLeft,
  Volume2
} from "lucide-react";
import { Word } from "../types";

export interface GamesScreenProps {
  allWords: Word[];
  customWords: Word[];
  onAwardPoints: (pts: number) => void;
  onUnlockAchievement: (id: string) => void;
}

type GameType = "letters" | "choices" | "matching" | "sprint" | null;

export default function GamesScreen({
  allWords,
  customWords,
  onAwardPoints,
  onUnlockAchievement
}: GamesScreenProps) {
  const [activeGame, setActiveGame] = React.useState<GameType>(null);
  const [gameScore, setGameScore] = React.useState(0);
  const [roundsPlayed, setRoundsPlayed] = React.useState(0);

  // Combine static and voice-added custom vocabulary pools
  const wordsPool = React.useMemo(() => {
    return [...allWords, ...customWords];
  }, [allWords, customWords]);

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // --- GAME 1: SCRABBLE LETTERS STATE ---
  const [lettersState, setLettersState] = React.useState<{
    wordObj: Word;
    scrambled: string[];
    userSpelled: string[];
    correctOrder: string[];
  } | null>(null);

  const initLettersGame = () => {
    if (wordsPool.length === 0) return;
    const randomWord = wordsPool[Math.floor(Math.random() * wordsPool.length)];
    const wordClean = randomWord.word.trim().toLowerCase();
    
    // Split into characters and shuffle them
    const chars = wordClean.split("");
    const shuffled = [...chars].sort(() => Math.random() - 0.5);
    
    setLettersState({
      wordObj: randomWord,
      scrambled: shuffled,
      userSpelled: [],
      correctOrder: chars
    });
  };

  const handleLetterTap = (letter: string, index: number) => {
    if (!lettersState) return;

    const newSpelled = [...lettersState.userSpelled, letter];
    const newScrambled = [...lettersState.scrambled];
    newScrambled.splice(index, 1);

    setLettersState(prev => prev ? {
      ...prev,
      userSpelled: newSpelled,
      scrambled: newScrambled
    }: null);

    // If spelled fully, inspect correctness
    if (newScrambled.length === 0) {
      const spellStr = newSpelled.join("");
      const correctStr = lettersState.correctOrder.join("");
      
      if (spellStr === correctStr) {
        onAwardPoints(10);
        setGameScore(s => s + 10);
        speak(lettersState.wordObj.word);
        alert("Правильно! +10 XP 🎉");
        setRoundsPlayed(r => r + 1);
        initLettersGame();
      } else {
        alert(`Неверно. Верное слово: ${lettersState.wordObj.word.toUpperCase()}`);
        initLettersGame();
      }
    }
  };

  const resetLetterSpell = () => {
    if (!lettersState) return;
    initLettersGame();
  };

  // --- GAME 2: MULTIPLE OPTION CHOICES ---
  const [choicesState, setChoicesState] = React.useState<{
    wordObj: Word;
    options: string[];
    correctIndex: number;
    clickedIndex: number | null;
  } | null>(null);

  const initChoicesGame = () => {
    if (wordsPool.length < 4) return;
    
    const randomWord = wordsPool[Math.floor(Math.random() * wordsPool.length)];
    // Make distractor options
    const listOthers = wordsPool.filter(w => w.word !== randomWord.word);
    const shuffledOthers = [...listOthers].sort(() => Math.random() - 0.5);
    const distractors = shuffledOthers.slice(0, 3).map(w => w.translation);
    
    const options = [randomWord.translation, ...distractors].sort(() => Math.random() - 0.5);
    const correctIndex = options.indexOf(randomWord.translation);

    setChoicesState({
      wordObj: randomWord,
      options,
      correctIndex,
      clickedIndex: null
    });
  };

  const handleChoiceSelect = (index: number) => {
    if (!choicesState || choicesState.clickedIndex !== null) return;

    setChoicesState(prev => prev ? { ...prev, clickedIndex: index } : null);

    if (index === choicesState.correctIndex) {
      onAwardPoints(10);
      setGameScore(s => s + 10);
      speak(choicesState.wordObj.word);
    }

    setTimeout(() => {
      setRoundsPlayed(r => r + 1);
      initChoicesGame();
    }, 1500);
  };


  // --- GAME 3: WORD PAIR MATCHING ---
  const [matchingState, setMatchingState] = React.useState<{
    engNodes: { id: string; text: string; cleared: boolean }[];
    rusNodes: { id: string; text: string; cleared: boolean }[];
    selectedEng: string | null;
    selectedRus: string | null;
  } | null>(null);

  const initMatchingGame = () => {
    if (wordsPool.length < 4) return;
    // Select 4 random words
    const chosen = [...wordsPool].sort(() => Math.random() - 0.5).slice(0, 4);
    
    const engNodes = chosen.map(w => ({ id: w.word, text: w.word, cleared: false })).sort(() => Math.random() - 0.5);
    const rusNodes = chosen.map(w => ({ id: w.word, text: w.translation, cleared: false })).sort(() => Math.random() - 0.5);

    setMatchingState({
      engNodes,
      rusNodes,
      selectedEng: null,
      selectedRus: null
    });
  };

  const handleMatchTap = (id: string, isEng: boolean) => {
    if (!matchingState) return;

    let nextEng = matchingState.selectedEng;
    let nextRus = matchingState.selectedRus;

    if (isEng) {
      nextEng = id;
    } else {
      nextRus = id;
    }

    setMatchingState(prev => prev ? {
      ...prev,
      selectedEng: nextEng,
      selectedRus: nextRus
    } : null);

    // If both matched, check correctness
    if (nextEng && nextRus) {
      if (nextEng === nextRus) {
        // Correct match! Mark as cleared
        setTimeout(() => {
          setMatchingState(prev => {
            if (!prev) return null;
            const updatedEng = prev.engNodes.map(n => n.id === nextEng ? { ...n, cleared: true } : n);
            const updatedRus = prev.rusNodes.map(n => n.id === nextRus ? { ...n, cleared: true } : n);
            
            // Check if all are cleared
            const allDone = updatedEng.every(n => n.cleared);
            if (allDone) {
              onAwardPoints(20);
              setGameScore(s => s + 20);
              onUnlockAchievement("polyglot");
              setTimeout(() => {
                alert("Раунд пройден! +20 XP ✨");
                setRoundsPlayed(r => r + 1);
                initMatchingGame();
              }, 400);
            }

            return {
              engNodes: updatedEng,
              rusNodes: updatedRus,
              selectedEng: null,
              selectedRus: null
            };
          });
        }, 300);
      } else {
        // Incorrect pairing
        setTimeout(() => {
          setMatchingState(prev => prev ? {
            ...prev,
            selectedEng: null,
            selectedRus: null
          } : null);
        }, 600);
      }
    }
  };


  // --- GAME 4: SPEED SPRINT CHALLENGE ---
  const [sprintState, setSprintState] = React.useState<{
    wordObj: Word;
    shownTranslation: string;
    isCorrect: boolean;
    timeLeft: number;
    gameEnded: boolean;
  } | null>(null);

  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const initSprintGame = () => {
    if (wordsPool.length < 2) return;
    
    const wordObj = wordsPool[Math.floor(Math.random() * wordsPool.length)];
    const isCorrect = Math.random() > 0.5;
    
    let shownTranslation = wordObj.translation;
    if (!isCorrect) {
      // Pick another distractor
      const listOthers = wordsPool.filter(w => w.word !== wordObj.word);
      shownTranslation = listOthers[Math.floor(Math.random() * listOthers.length)].translation;
    }

    setSprintState({
      wordObj,
      shownTranslation,
      isCorrect,
      timeLeft: 30,
      gameEnded: false
    });

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSprintState(prev => {
        if (!prev) return null;
        if (prev.timeLeft <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return { ...prev, timeLeft: 0, gameEnded: true };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
  };

  const handleSprintSubmit = (userVal: boolean) => {
    if (!sprintState || sprintState.gameEnded) return;

    const correct = userVal === sprintState.isCorrect;
    if (correct) {
      onAwardPoints(5);
      setGameScore(s => s + 5);
      speak(sprintState.wordObj.word);
    }

    // Set next word retaining timer state
    const nextWordObj = wordsPool[Math.floor(Math.random() * wordsPool.length)];
    const nextIsCorrect = Math.random() > 0.5;
    let nextShownTranslation = nextWordObj.translation;
    if (!nextIsCorrect) {
      const listOthers = wordsPool.filter(w => w.word !== nextWordObj.word);
      nextShownTranslation = listOthers[Math.floor(Math.random() * listOthers.length)].translation;
    }

    setSprintState(prev => prev ? {
      ...prev,
      wordObj: nextWordObj,
      shownTranslation: nextShownTranslation,
      isCorrect: nextIsCorrect
    }: null);
  };

  const stopSprintGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSprintState(null);
    setActiveGame(null);
  };

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);


  const startSelectedGame = (type: GameType) => {
    setGameScore(0);
    setRoundsPlayed(0);
    setActiveGame(type);

    if (type === "letters") initLettersGame();
    if (type === "choices") initChoicesGame();
    if (type === "matching") initMatchingGame();
    if (type === "sprint") initSprintGame();
  };

  const quitGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setActiveGame(null);
    setSprintState(null);
    setLettersState(null);
    setChoicesState(null);
    setMatchingState(null);
  };


  // --- MAIN LAYOUT GAME CHANNELS ---

  if (activeGame === "letters" && lettersState) {
    return (
      <div className="flex flex-col p-5 gap-6 flex-1 select-none animate-fadeIn">
        <div className="flex justify-between items-center w-full">
          <button onClick={quitGame} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition cursor-pointer">
            <ChevronLeft className="w-4 h-4" />
            <span>Назад к играм</span>
          </button>
          
          <div className="text-xs font-semibold text-indigo-400 font-mono">
            ОЧКИ: {gameScore} XP
          </div>
        </div>

        <div className="bg-[#121522]/80 border border-slate-800 rounded-3xl p-5 flex flex-col items-center gap-6 mt-4 relative">
          <span className="text-4xl">{lettersState.wordObj.emoji}</span>
          <div className="text-center flex flex-col gap-1">
            <p className="text-[10px] text-slate-400 uppercase font-mono tracking-widest">Перевод</p>
            <h3 className="text-xl font-bold text-white">{lettersState.wordObj.translation}</h3>
            {lettersState.wordObj.explanation && (
              <p className="text-xs text-slate-400 max-w-[260px] mx-auto mt-1 leading-normal italic">
                &ldquo;{lettersState.wordObj.explanation}&rdquo;
              </p>
            )}
          </div>

          {/* Spell input tray */}
          <div className="w-full flex flex-wrap justify-center gap-2 py-3 bg-slate-950/40 border border-slate-850 rounded-2xl min-h-[50px] items-center">
            {lettersState.userSpelled.map((letter, idx) => (
              <span 
                key={idx}
                className="text-lg font-bold font-mono px-3.5 py-1.5 bg-indigo-650 rounded-xl text-white shadow-sm shadow-indigo-700/10 animate-scaleIn select-none"
              >
                {letter.toUpperCase()}
              </span>
            ))}
          </div>

          {/* Choosable character selectors */}
          <div className="flex flex-wrap justify-center gap-2.5 mt-2">
            {lettersState.scrambled.map((letter, idx) => (
              <button
                key={idx}
                onClick={() => handleLetterTap(letter, idx)}
                className="w-12 h-12 bg-slate-850 hover:bg-slate-750 active:scale-90 border border-slate-700 rounded-xl text-md font-bold text-white transition flex items-center justify-center cursor-pointer shadow-md shadow-black/25"
              >
                {letter.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={resetLetterSpell}
            className="text-[10px] font-bold tracking-widest uppercase text-slate-500 hover:text-slate-300 transition mt-4 cursor-pointer"
          >
            Сбросить / Пропустить раунд
          </button>
        </div>
      </div>
    );
  }

  if (activeGame === "choices" && choicesState) {
    const isAnswered = choicesState.clickedIndex !== null;
    return (
      <div className="flex flex-col p-5 gap-6 flex-1 select-none animate-fadeIn">
        <div className="flex justify-between items-center w-full">
          <button onClick={quitGame} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition cursor-pointer">
            <ChevronLeft className="w-4 h-4" />
            <span>Назад</span>
          </button>
          
          <div className="text-xs font-semibold text-indigo-400 font-mono">
            ОЧКИ: {gameScore} XP
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 mt-4 flex-1 justify-center">
          <span className="text-5xl animate-bounce">{choicesState.wordObj.emoji}</span>
          <div className="text-center flex flex-col gap-1 mb-4">
            <h3 className="text-3xl font-extrabold text-white tracking-wide">{choicesState.wordObj.word}</h3>
            <p className="text-sm font-mono text-cyan-400">{choicesState.wordObj.transcription}</p>
          </div>

          <div className="w-full flex flex-col gap-3 max-w-[340px]">
            {choicesState.options.map((opt, idx) => {
              let btnStyle = "bg-slate-800/40 border-slate-700 hover:border-slate-500 text-slate-200";
              
              if (isAnswered) {
                if (idx === choicesState.correctIndex) {
                  btnStyle = "bg-emerald-600/20 border-emerald-500 text-emerald-300 font-bold";
                } else if (idx === choicesState.clickedIndex) {
                  btnStyle = "bg-rose-600/20 border-rose-500 text-rose-300";
                } else {
                  btnStyle = "bg-slate-900/40 border-slate-850 opacity-40 text-slate-500";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleChoiceSelect(idx)}
                  className={`w-full p-4.5 rounded-2xl border text-left text-sm font-medium transition duration-200 active:scale-[0.98] cursor-pointer flex justify-between items-center ${btnStyle}`}
                  disabled={isAnswered}
                >
                  <span>{opt}</span>
                  {isAnswered && idx === choicesState.correctIndex && (
                    <span className="text-emerald-400 animate-scaleIn">✓</span>
                  )}
                  {isAnswered && idx === choicesState.clickedIndex && idx !== choicesState.correctIndex && (
                    <span className="text-rose-400">✗</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (activeGame === "matching" && matchingState) {
    return (
      <div className="flex flex-col p-5 gap-6 flex-1 select-none animate-fadeIn">
        <div className="flex justify-between items-center w-full">
          <button onClick={quitGame} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition cursor-pointer">
            <ChevronLeft className="w-4 h-4" />
            <span>Назад</span>
          </button>
          
          <div className="text-xs font-semibold text-indigo-400 font-mono">
            ОЧКИ: {gameScore} XP
          </div>
        </div>

        <div className="flex flex-col gap-5 mt-4">
          <div className="text-center flex flex-col gap-1 bg-[#101323] p-4 rounded-2xl border border-slate-800">
            <h3 className="text-xs font-bold font-mono tracking-wider text-indigo-400 uppercase">Соедини пары</h3>
            <p className="text-[11px] text-slate-400 mt-1">Тайпай слово на английском, а затем перевод, чтобы убрать картчки со сцены</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            
            {/* English list cards */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] text-slate-500 tracking-wider font-bold mb-1 block pl-1 uppercase">ENGLISH</span>
              {matchingState.engNodes.map(node => (
                <button
                  key={node.id}
                  onClick={() => handleMatchTap(node.id, true)}
                  className={`p-4 rounded-2xl border text-xs font-bold font-sans tracking-wide text-center uppercase transition cursor-pointer min-h-[56px] flex items-center justify-center ${
                    node.cleared 
                      ? "opacity-0 scale-90 border-transparent bg-transparent pointer-events-none" 
                      : matchingState.selectedEng === node.id
                      ? "bg-indigo-600/30 border-indigo-400 text-indigo-300 shadow-md shadow-indigo-500/10" 
                      : "bg-[#141829] border-slate-800 hover:border-slate-700 text-white"
                  }`}
                  disabled={node.cleared}
                >
                  {node.text}
                </button>
              ))}
            </div>

            {/* Russian list cards */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] text-slate-500 tracking-wider font-bold mb-1 block pl-1 uppercase">РУССКИЙ</span>
              {matchingState.rusNodes.map(node => (
                <button
                  key={node.id}
                  onClick={() => handleMatchTap(node.id, false)}
                  className={`p-4 rounded-2xl border text-xs font-semibold text-center transition cursor-pointer min-h-[56px] flex items-center justify-center ${
                    node.cleared 
                      ? "opacity-0 scale-90 border-transparent bg-transparent pointer-events-none" 
                      : matchingState.selectedRus === node.id
                      ? "bg-indigo-600/30 border-indigo-400 text-indigo-300 shadow-md shadow-indigo-500/10" 
                      : "bg-[#141829] border-slate-800 hover:border-slate-700 text-slate-300"
                  }`}
                  disabled={node.cleared}
                >
                  {node.text}
                </button>
              ))}
            </div>

          </div>
        </div>
      </div>
    );
  }

  if (activeGame === "sprint" && sprintState) {
    return (
      <div className="flex flex-col p-5 gap-6 flex-1 select-none animate-fadeIn h-full">
        <div className="flex justify-between items-center w-full">
          <button onClick={stopSprintGame} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition cursor-pointer">
            <ChevronLeft className="w-4 h-4" />
            <span>Закончить</span>
          </button>
          
          <div className="flex items-center gap-2 font-mono text-cyan-400 text-sm font-bold bg-[#181d32] border border-slate-800 px-3 py-1 rounded-full">
            <Hourglass className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: "5s" }} />
            <span>{sprintState.timeLeft}s</span>
          </div>
        </div>

        {sprintState.gameEnded ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-5 my-auto animate-scaleIn">
            <span className="text-6xl">⏱️</span>
            <div>
              <h3 className="text-2xl font-bold text-white">Время вышло!</h3>
              <p className="text-sm text-slate-400 mt-2">Вы набрали за этот раунд:</p>
              <div className="text-4xl font-extrabold text-indigo-400 mt-1 font-mono">{gameScore} XP</div>
            </div>
            
            <button
              onClick={initSprintGame}
              className="mt-4 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-xs font-semibold text-white tracking-wide shadow-md cursor-pointer flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Играть еще раз</span>
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-4 gap-6">
            <div className="bg-[#121524] border border-slate-800 rounded-3xl p-6 w-full max-w-[340px] flex flex-col items-center gap-6 relative shadow-md">
              <span className="text-6xl">{sprintState.wordObj.emoji}</span>
              
              <div className="text-center flex flex-col gap-1.5 leading-none">
                <h4 className="text-2xl font-bold text-white">{sprintState.wordObj.word}</h4>
                <p className="text-xs text-slate-500 mt-1">Означает ли это:</p>
                <h3 className="text-3xl font-bold text-indigo-400 mt-2.5">{sprintState.shownTranslation}</h3>
              </div>
            </div>

            {/* Yes/No controllers */}
            <div className="flex gap-4 w-full max-w-[340px] mt-4">
              <button
                onClick={() => handleSprintSubmit(false)}
                className="flex-1 py-4.5 bg-gradient-to-b from-rose-500/15 to-rose-600/5 hover:from-rose-500/25 active:scale-95 border border-rose-500/35 hover:border-rose-500/50 text-rose-400 font-bold text-sm tracking-wide uppercase rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <X className="w-4.5 h-4.5" />
                <span>Неверно</span>
              </button>

              <button
                onClick={() => handleSprintSubmit(true)}
                className="flex-1 py-4.5 bg-gradient-to-b from-emerald-500/15 to-emerald-600/5 hover:from-emerald-500/25 active:scale-95 border border-emerald-500/35 hover:border-emerald-500/50 text-emerald-400 font-bold text-sm tracking-wide uppercase rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <Check className="w-4.5 h-4.5 stroke-[3]" />
                <span>Верно</span>
              </button>
            </div>
            
            <p className="text-[10px] text-slate-500 font-medium">Текущие очки раунда: {gameScore} XP</p>
          </div>
        )}
      </div>
    );
  }

  // --- STANDARD GRID GAME SELECTOR ---
  return (
    <div className="flex flex-col p-5 gap-6 select-none animate-fadeIn">
      
      <div className="bg-gradient-to-br from-[#1b1c2b] to-[#121422]/90 border border-slate-800 rounded-3xl p-5 flex flex-col gap-1 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl" />
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-bold text-white leading-tight">Игровой Центр</h2>
        </div>
        <p className="text-xs text-slate-400 mt-1 leading-normal">
          Геймифицированная тренировка для ускоренного усвоения материала. Зарабатывай бонусы XP!
        </p>
      </div>

      {wordsPool.length < 4 ? (
        <div className="bg-indigo-950/20 border border-indigo-500/15 p-5 rounded-2xl flex flex-col items-center justify-center text-center gap-3 mt-4">
          <span className="text-3xl">🧩</span>
          <p className="text-xs text-indigo-300 leading-relaxed font-sans max-w-[270px]">
            Чтобы разблокировать игровой режим, добавьте как минимум 4 слова в ваш словарь обучения (сейчас доступно {wordsPool.length}).
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          
          {/* Game letters */}
          <button 
            onClick={() => startSelectedGame("letters")}
            className="bg-[#121522]/80 hover:bg-[#121522]/95 border border-slate-800 hover:border-slate-705 p-4 rounded-2xl flex items-center justify-between text-left transition select-none cursor-pointer group"
          >
            <div className="flex items-center gap-4.5">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-xl shadow-md group-hover:scale-105 transition">
                📝
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-bold text-white tracking-wide">Собери слово</span>
                <span className="text-[10px] text-slate-400 leading-none mt-0.5">Буквенная головоломка</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
          </button>

          {/* Game choices */}
          <button 
            onClick={() => startSelectedGame("choices")}
            className="bg-[#121522]/80 hover:bg-[#121522]/95 border border-slate-800 hover:border-slate-705 p-4 rounded-2xl flex items-center justify-between text-left transition select-none cursor-pointer group"
          >
            <div className="flex items-center gap-4.5">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center text-xl shadow-md group-hover:scale-105 transition">
                🎯
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-bold text-white tracking-wide">Выбери перевод</span>
                <span className="text-[10px] text-slate-400 leading-none mt-0.5">Викторина из 4-х вариантов</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
          </button>

          {/* Game matching */}
          <button 
            onClick={() => startSelectedGame("matching")}
            className="bg-[#121522]/80 hover:bg-[#121522]/95 border border-slate-800 hover:border-slate-705 p-4 rounded-2xl flex items-center justify-between text-left transition select-none cursor-pointer group"
          >
            <div className="flex items-center gap-4.5">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center text-xl shadow-md group-hover:scale-105 transition">
                🔗
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-bold text-white tracking-wide">Соедини пары</span>
                <span className="text-[10px] text-slate-400 leading-none mt-0.5">Сопряжение английских и русских карт</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
          </button>

          {/* Game sprint */}
          <button 
            onClick={() => startSelectedGame("sprint")}
            className="bg-[#121522]/80 hover:bg-[#121522]/95 border border-slate-800 hover:border-slate-705 p-4 rounded-2xl flex items-center justify-between text-left transition select-none cursor-pointer group"
          >
            <div className="flex items-center gap-4.5">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center text-xl shadow-md group-hover:scale-105 transition">
                ⚡
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-bold text-white tracking-wide">Спринт-Игра</span>
                <span className="text-[10px] text-slate-400 leading-none mt-0.5">Правда/Ложь тест на 30 секунд</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
          </button>

        </div>
      )}
    </div>
  );
}
