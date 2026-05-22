import React from "react";

interface OnboardingScreenProps {
  onComplete: (goal: number) => void;
}

const SLIDES = [
  {
    emoji: null, // first slide uses logo
    title: "Anki Huyanki",
    desc: "Учи английские слова каждый день — быстро, удобно и весело.",
    color: "from-indigo-600/25 to-violet-600/10",
  },
  {
    emoji: "📚",
    title: "Карточки\nс переворотом",
    desc: "Сверху слово и транскрипция — нажми, чтобы увидеть перевод и пример.",
    color: "from-blue-600/20 to-indigo-600/10",
  },
  {
    emoji: "🔁",
    title: "Повторяй\nпо системе",
    desc: "Сложные слова появляются чаще. Лёгкие уходят в долгосрочную память.",
    color: "from-violet-600/20 to-purple-600/10",
  },
  {
    emoji: "🎮",
    title: "Играй\nи зарабатывай XP",
    desc: "Мини-игры, серии дней, достижения. Учёба ощущается как игра.",
    color: "from-emerald-600/20 to-teal-600/10",
  },
  {
    emoji: "🎤",
    title: "Добавляй слова\nголосом через ИИ",
    desc: "Скажи слово по-русски — ИИ создаст карточку с переводом и примером автоматически.",
    color: "from-rose-600/20 to-pink-600/10",
  },
];

const GOALS = [
  { value: 5,  label: "5 слов",  sub: "Лёгкий старт",     emoji: "🌱" },
  { value: 10, label: "10 слов", sub: "Оптимально",        emoji: "⚡" },
  { value: 20, label: "20 слов", sub: "Серьёзный темп",    emoji: "🔥" },
];

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [step, setStep] = React.useState(0);
  const [selectedGoal, setSelectedGoal] = React.useState(10);
  const [visible, setVisible] = React.useState(true);

  const total = SLIDES.length; // 5 slides, then goal
  const slide = SLIDES[step];

  const goNext = () => {
    setVisible(false);
    setTimeout(() => {
      setStep((s) => s + 1);
      setVisible(true);
    }, 180);
  };

  // ── Goal selection screen ──────────────────────────────────────────────────
  if (step === total) {
    return (
      <div className="fixed inset-0 z-[999] bg-[#08080A] flex flex-col items-center justify-center px-6 gap-7">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Logo small */}
        <img src="/logo.svg" alt="logo" className="w-16 h-16 rounded-2xl shadow-xl shadow-indigo-500/20 mb-1" />

        <div className="flex flex-col items-center text-center gap-2">
          <h2 className="text-2xl font-bold text-white leading-tight">
            Сколько слов<br />учить в день?
          </h2>
          <p className="text-sm text-white/40">Можно изменить позже в настройках</p>
        </div>

        <div className="w-full flex flex-col gap-3 max-w-xs">
          {GOALS.map((g) => (
            <button
              key={g.value}
              onClick={() => setSelectedGoal(g.value)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all duration-150 active:scale-[0.98] ${
                selectedGoal === g.value
                  ? "bg-indigo-600/20 border-indigo-500/50"
                  : "bg-white/5 border-white/10"
              }`}
            >
              <span className="text-2xl">{g.emoji}</span>
              <div className="flex flex-col items-start flex-1">
                <span className="text-base font-bold text-white">{g.label}</span>
                <span className="text-xs text-white/40">{g.sub}</span>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                selectedGoal === g.value ? "border-indigo-400 bg-indigo-500" : "border-white/20"
              }`}>
                {selectedGoal === g.value && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={() => onComplete(selectedGoal)}
          className="w-full max-w-xs py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-base shadow-lg shadow-indigo-500/25 active:scale-[0.98] transition-all"
        >
          Начать учить →
        </button>
      </div>
    );
  }

  // ── Slides ─────────────────────────────────────────────────────────────────
  const isFirst = step === 0;

  return (
    <div className="fixed inset-0 z-[999] bg-[#08080A] flex flex-col">

      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-indigo-600/8 rounded-full blur-[120px] pointer-events-none" />

      {/* Skip button */}
      <div className="flex justify-end px-6 pt-5 relative z-10">
        <button
          onClick={() => onComplete(10)}
          className="text-xs text-white/25 hover:text-white/50 transition font-medium px-2 py-1"
        >
          Пропустить
        </button>
      </div>

      {/* Slide content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-7 relative z-10">

        {/* Card */}
        <div
          className={`bg-gradient-to-b ${slide.color} border border-white/10 rounded-[40px] w-52 h-52 flex flex-col items-center justify-center gap-3 shadow-2xl transition-all duration-200 ${
            visible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-3"
          }`}
        >
          {isFirst ? (
            // First slide — logo
            <img src="/logo.svg" alt="Anki Huyanki" className="w-28 h-28 rounded-3xl shadow-xl shadow-indigo-500/30" />
          ) : (
            <span className="text-7xl select-none">{slide.emoji}</span>
          )}
        </div>

        {/* Text */}
        <div
          className={`flex flex-col items-center text-center gap-3 transition-all duration-200 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <h2 className="text-[26px] font-bold text-white leading-tight whitespace-pre-line">
            {slide.title}
          </h2>
          <p className="text-sm text-white/50 leading-relaxed max-w-[270px]">
            {slide.desc}
          </p>
        </div>
      </div>

      {/* Bottom */}
      <div className="flex flex-col items-center gap-5 px-6 pb-10 relative z-10">

        {/* Progress dots */}
        <div className="flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width:  i === step ? 22 : 6,
                height: 6,
                background: i === step ? "#6366f1" : "rgba(255,255,255,0.12)",
              }}
            />
          ))}
        </div>

        <button
          onClick={goNext}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-base shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all"
        >
          {step === total - 1 ? "Выбрать цель →" : "Далее →"}
        </button>
      </div>
    </div>
  );
}
