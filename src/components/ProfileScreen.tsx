import React from "react";
import { 
  User, 
  Award, 
  Settings, 
  Volume2, 
  VolumeX, 
  Flame, 
  TrendingUp, 
  History, 
  ShieldAlert,
  FolderLock,
  Compass,
  BellRing,
  CheckCircle2,
  Bookmark
} from "lucide-react";
import { UserProgress, Achievement } from "../types";

export interface ProfileScreenProps {
  progress: UserProgress;
  onToggleAudio: () => void;
  onResetProgress: () => void;
  totalAvailableWords: number;
}

export default function ProfileScreen({
  progress,
  onToggleAudio,
  onResetProgress,
  totalAvailableWords
}: ProfileScreenProps) {
  const [showNotificationAlert, setShowNotificationAlert] = React.useState(false);

  // List of standard achievable goals
  const ACHIEVEMENTS: Achievement[] = [
    {
      id: "first_words",
      title: "Первые шаги",
      description: "Выучите ваши первые 5 английских слов",
      icon: "🌱",
      objective: "Слов",
      reqValue: 5
    },
    {
      id: "streak_3",
      title: "Триумвират",
      description: "Удерживайте серию дней в течение 3 дней подряд",
      icon: "🔥",
      objective: "Серия",
      reqValue: 3
    },
    {
      id: "voice_wizard",
      title: "Голосовой Маг",
      description: "Добавьте custom-слово с помощью ИИ-помощника",
      icon: "🎙️",
      objective: "Добавлено",
      reqValue: 1
    },
    {
      id: "polyglot",
      title: "Мастер Соединений",
      description: "Очистите всю сетку в игре 'Соедини пару'",
      icon: "⚡",
      objective: "Сопряжено",
      reqValue: 1
    }
  ];

  // Dynamic status evaluation
  const userXP = progress.points;
  let userLevel = "Новичок (А1) 👨‍🎓";
  if (userXP >= 100 && userXP < 250) userLevel = "Развивающийся (А2) 🌟";
  else if (userXP >= 250 && userXP < 500) userLevel = "Уверенный (B1) 📈";
  else if (userXP >= 500) userLevel = "Мастер Слов (B2+) 👑";

  const totalLearned = progress.learnedWords.length;
  const customCount = progress.customWords.length;

  const getAchievementStatus = (ach: Achievement) => {
    // Custom check logic
    if (ach.id === "first_words") return totalLearned >= 5;
    if (ach.id === "streak_3") return progress.streak >= 3;
    if (ach.id === "voice_wizard") return customCount >= 1;
    if (ach.id === "polyglot") return progress.unlockedAchievements.includes("polyglot");
    return false;
  };

  const handleNotificationRequest = () => {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification("EngWordBot Reminders", {
            body: "Напоминание включено! Мы пришлем вам уведомление завтра в это же время.",
            icon: "🧠"
          });
        }
        setShowNotificationAlert(true);
        setTimeout(() => setShowNotificationAlert(false), 3000);
      });
    } else {
      setShowNotificationAlert(true);
      setTimeout(() => setShowNotificationAlert(false), 3000);
    }
  };

  return (
    <div className="flex flex-col p-5 gap-6 select-none animate-fadeIn font-sans">
      
      {/* Upper Profile Info Card */}
      <div id="profile-card" className="bg-gradient-to-br from-[#1c1c2e] to-[#0e0f17] border border-slate-800 rounded-3xl p-5 flex items-center gap-4 relative shadow-lg shadow-black/40">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-md shadow-indigo-650/20 shadow-lg">
          {progress.customWords[0]?.word ? "A" : "U"}
        </div>
        
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Твой Ранг</span>
          <h2 className="text-lg font-bold text-white leading-tight">{userLevel}</h2>
          <p className="text-xs text-slate-400 mt-0.5">Всего очков: <span className="font-mono font-bold text-cyan-400">{userXP} XP</span></p>
        </div>
      </div>

      {/* Stats Indicators */}
      <div className="grid grid-cols-2 gap-3.5">
        <div className="bg-[#121522]/60 border border-slate-800 p-4 rounded-2xl flex flex-col gap-0.5">
          <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">Изучено слов</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold font-mono text-white">{totalLearned}</span>
            <span className="text-xs text-slate-550 font-medium">/ {totalAvailableWords}</span>
          </div>
        </div>

        <div className="bg-[#121522]/60 border border-slate-800 p-4 rounded-2xl flex flex-col gap-0.5">
          <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">Серия дней</span>
          <div className="flex items-center gap-1.5 mt-1 text-amber-400">
            <Flame className="w-5 h-5 fill-current animate-pulse text-amber-500" />
            <span className="text-2xl font-bold font-mono">{progress.streak}д</span>
          </div>
        </div>
      </div>

      {/* Achievement module */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center pl-1">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Твои Достижения</h3>
          <span className="text-xs text-indigo-400 font-medium">Прогресс</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ACHIEVEMENTS.map((ach) => {
            const unlocked = getAchievementStatus(ach);
            return (
              <div 
                key={ach.id}
                className={`p-4 rounded-2xl border transition duration-150 flex items-start gap-3.5 relative select-none ${
                  unlocked 
                    ? "bg-[#141b2e]/90 border-emerald-500/20 shadow-md" 
                    : "bg-[#0c0d16]/60 border-slate-800/80 opacity-70"
                }`}
              >
                <div className={`text-2xl p-2.5 rounded-xl flex items-center justify-center ${
                  unlocked ? "bg-emerald-500/10" : "bg-slate-900"
                }`}>
                  {unlocked ? ach.icon : "🔒"}
                </div>
                
                <div className="flex flex-col gap-0.5">
                  <span className={`text-xs font-bold ${unlocked ? "text-emerald-300" : "text-slate-400"}`}>
                    {ach.title}
                  </span>
                  <p className="text-[10px] text-slate-400 leading-normal mt-0.5 max-w-[200px]">
                    {ach.description}
                  </p>
                  {unlocked && (
                    <span className="text-[8px] uppercase tracking-widest font-bold text-emerald-400 font-mono mt-1.5 flex items-center gap-1 leading-none">
                      <CheckCircle2 className="w-2.5 h-2.5" /> РАЗБЛОКИРОВАНО
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Basic Settings */}
      <div className="bg-[#121522]/40 border border-slate-800 rounded-2xl p-3 flex flex-col gap-1.5">
        <div className="flex items-center gap-2 p-2.5 border-b border-slate-800/60 justify-between">
          <div className="flex items-center gap-2.5">
            <Settings className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-medium text-slate-200">Системные настройки</span>
          </div>
        </div>

        {/* Audio Toggle */}
        <button 
          onClick={onToggleAudio}
          className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/30 transition flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2.5 text-xs text-slate-300">
            {progress.audioEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            <span>Озвучивать слова автоматически</span>
          </div>
          <div className={`w-8 h-4 rounded-full p-0.5 transition duration-200 ${progress.audioEnabled ? "bg-indigo-600 flex justify-end" : "bg-slate-700 flex justify-start"}`}>
            <div className="w-3 h-3 rounded-full bg-white shadow-sm" />
          </div>
        </button>

        {/* Notification Simulator */}
        <button 
          onClick={handleNotificationRequest}
          className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/30 transition flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2.5 text-xs text-slate-300">
            <BellRing className="w-4 h-4 text-amber-400 animate-swing" />
            <span>Ежедневные напоминания</span>
          </div>
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono">Активировать</span>
        </button>

        {showNotificationAlert && (
          <p className="text-[10px] text-emerald-400 p-2.5 font-medium leading-normal bg-emerald-500/5 rounded-xl border border-emerald-500/10">
            ✓ Оповещения успешно включены! Вы будете получать напоминания каждый день 🔥
          </p>
        )}

        {/* Reset Progress Action */}
        <button 
          onClick={() => {
            if (confirm("Вы уверены, что хотите сбросить весь прогресс обучения? Это действие необратимо.")) {
              onResetProgress();
            }
          }}
          className="w-full text-left p-2.5 rounded-xl hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 transition flex items-center gap-2.5 text-xs cursor-pointer mt-1"
        >
          <History className="w-4 h-4" />
          <span>Сбросить данные прогресса</span>
        </button>
      </div>

    </div>
  );
}
