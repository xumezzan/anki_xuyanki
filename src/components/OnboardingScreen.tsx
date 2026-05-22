import React from "react";
import { BookOpen, Repeat2, Gamepad2, Mic } from "lucide-react";

interface OnboardingScreenProps {
  onComplete: (goal: number) => void;
}

const SLIDES = [
  {
    emoji: "📚",
    title: "Учи слова\nкаждый день",
    desc: "Карточки с переводом, транскрипцией и примерами. Переворачивай — запоминай.",
    color: "from-blue-600/20 to-indigo-600/10",
    accent: "#6366f1",
    icon: <BookOpen className="w-7 h-7" />,
  },
  {
    emoji: "🔁",
    title: "Повторяй\nпо системе",
    desc: "Сложные слова появляются чаще. Лёгкие уходят в долгосрочную память.",
    color: "from-violet-600/20 to-purple-600/10",
    accent: "#8b5cf6",
    icon: <Repeat2 className="w-7 h-7" />,
  },
  {
    emoji: "🎮",
    title: "Играй\nи зарабатывай XP",
    desc: "Мини-игры, серии дней, достижения. Учёба ощущается как игра.",
    color: "from-emerald-600/20 to-teal-600/10",
    accent: "#10b981",
    icon: <Gamepad2 className="w-7 h-7" />,
  },
  {
    emoji: "🎤",
    title: "Добавляй слова\nголосом",
    desc: "Скажи слово по-русски — ИИ создаст карточку с переводом и примером.",
    color: "from-rose-600/20 to-pink-600/10",
    accent: "#f43f5e",
    icon: <Mic className="w-7 h-7" />,
  },
];

const GOALS = [
  { value: 5, label: "5 слов", sub: "Лёгкий старт" },
  { value: 10, label: "10 слов", sub: "Оптимально" },
  { value: 20, label: "20 слов", sub: "Серьёзный темп" },
];

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [step, setStep] = React.useState(0); // 0-3 slides, 4 = goal select
  const [selectedGoal, setSelectedGoal] = React.useState(10);
  const [animDir, setAnimDir] = React.useState<"in" | "out">("in");
  const [visible, setVisible] = React.useState(true);

  const total = SLIDES.length; // 4 slides before goal screen

  const goNext = () => {
    setVisible(false);
    setTimeout(() => {
      setStep((s) => s + 1);
      setVisible(true);
    }, 200);
  };

  const slide = SLIDES[step];

  // Goal selection screen
  if (step === total) {
    return (
      <div className="fixed inset-0 z-[999] bg-[#08080A] flex flex-col items-center justify-center px-6 gap-8">
        {/* Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none" />

        <div
          className="flex flex-col items-center gap-2 text-center"
          style={{ opacity: visible ? 1 : 0, transition: "opacity 0.2s" }}
        >
          <span className="text-5xl mb-2">🎯</span>
          <h2 className="text-2xl font-bold text-white leading-tight">
            Сколько слов<br />учить в день?
          </h2>
          <p className="text-sm text-white/50 mt-1">Можно изменить в любой момент</p>
        </div>

        <div className="w-full flex flex-col gap-3 max-w-xs">
          {GOALS.map((g) => (
            <button
              key={g.value}
              onClick={() => setSelectedGoal(g.value)}
              className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border transition-all duration-150 ${
                selectedGoal === g.value
                  ? "bg-indigo-600/20 border-indigo-500/60 scale-[1.02]"
                  : "bg-white/5 border-white/10 hover:bg-white/8"
              }`}
            >
              <div className="flex flex-col items-start">
                <span className="text-base font-bold text-white">{g.label}</span>
                <span className="text-xs text-white/40 mt-0.5">{g.sub}</span>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  selectedGoal === g.value
                    ? "border-indigo-400 bg-indigo-500"
                    : "border-white/20 bg-transparent"
                }`}
              >
                {selectedGoal === g.value && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={() => onComplete(selectedGoal)}
          className="w-full max-w-xs py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-base shadow-lg shadow-indigo-500/30 active:scale-[0.98] transition-all"
        >
          Начать учить →
        </button>
      </div>
    );
  }

  // Slides 0-3
  return (
    <div className="fixed inset-0 z-[999] bg-[#08080A] flex flex-col">
      {/* Skip */}
      <div className="flex justify-end px-6 pt-5">
        <button
          onClick={() => onComplete(10)}
          className="text-xs text-white/30 hover:text-white/60 transition font-medium"
        >
          Пропустить
        </button>
      </div>

      {/* Slide content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-8">
        {/* Icon card */}
        <div
          className={`bg-gradient-to-b ${slide.color} border border-white/10 rounded-[40px] w-48 h-48 flex flex-col items-center justify-center gap-3 shadow-2xl transition-all duration-200 ${
            visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <span className="text-6xl">{slide.emoji}</span>
        </div>

        {/* Text */}
        <div
          className={`flex flex-col items-center text-center gap-3 transition-all duration-200 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <h2 className="text-2xl font-bold text-white leading-tight whitespace-pre-line">
            {slide.title}
          </h2>
          <p className="text-sm text-white/50 leading-relaxed max-w-[260px]">
            {slide.desc}
          </p>
        </div>
      </div>

      {/* Bottom: dots + button */}
      <div className="flex flex-col items-center gap-6 px-6 pb-10">
        {/* Progress dots */}
        <div className="flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === step ? 20 : 6,
                height: 6,
                background: i === step ? "#6366f1" : "rgba(255,255,255,0.15)",
              }}
            />
          ))}
        </div>

        <button
          onClick={goNext}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-base shadow-lg shadow-indigo-500/25 active:scale-[0.98] transition-all"
        >
          {step === total - 1 ? "Выбрать цель →" : "Далее →"}
        </button>
      </div>
    </div>
  );
}
