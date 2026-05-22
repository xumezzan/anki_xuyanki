import React from "react";
import TelegramFrame from "./components/TelegramFrame";
import HomeScreen from "./components/HomeScreen";
import LearnScreen from "./components/LearnScreen";
import RepeatScreen from "./components/RepeatScreen";
import GamesScreen from "./components/GamesScreen";
import ProfileScreen from "./components/ProfileScreen";
import OnboardingScreen from "./components/OnboardingScreen";
import { Word, UserProgress, ActiveScreen } from "./types";

// Local static fallback lists to guarantee a pristine interface instantly
const LOCAL_SAFE_FALLBACKS: Word[] = [
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
  }
];

export default function App() {
  const [showOnboarding, setShowOnboarding] = React.useState<boolean>(() => {
    try {
      return !localStorage.getItem("tma_onboarding_done_v2");
    } catch {
      return true;
    }
  });
  const [dailyGoal, setDailyGoal] = React.useState(10);

  const [activeScreen, setActiveScreen] = React.useState<ActiveScreen>("home");
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  // Vocabulary state loading
  const [allWords, setAllWords] = React.useState<Word[]>(LOCAL_SAFE_FALLBACKS);

  // Default initial values for mock TMA user
  const DEFAULT_PROGRESS: UserProgress = {
    learnedWords: ["Merge", "Luggage"], // Seed initial learned elements
    difficultWords: [],
    customWords: [],
    points: 45, // Initial start bonuses
    streak: 4,  // Realistic continuous baseline
    lastActiveDate: new Date().toISOString(),
    audioEnabled: true,
    unlockedAchievements: []
  };

  const [progress, setProgress] = React.useState<UserProgress>(DEFAULT_PROGRESS);

  // Synchronize database fetch on initiation
  React.useEffect(() => {
    // 1. Recover locally persisted progress first
    try {
      const cached = localStorage.getItem("tma_learner_progress_v2");
      if (cached) {
        setProgress(JSON.parse(cached));
      }
    } catch (e) {
      console.error("Failed to parse progress cache", e);
    }

    // 2. Fetch standard compiled vocab items from Server API
    const fetchDefaultWords = async () => {
      try {
        const res = await fetch("/api/words/default");
        if (res.ok) {
          const fetchedData = await res.json();
          if (Array.isArray(fetchedData) && fetchedData.length > 0) {
            setAllWords(fetchedData);
          }
        }
      } catch (err) {
        console.warn("Server API not ready yet, proceeding with bulletproof local fallback deck.");
      }
    };

    fetchDefaultWords();
  }, []);

  // Sync state modifications to Local Storage
  const saveProgress = (updated: UserProgress) => {
    setProgress(updated);
    try {
      localStorage.setItem("tma_learner_progress_v2", JSON.stringify(updated));
    } catch (e) {
      console.error("Local Storage sync fail:", e);
    }
  };

  // Switch tabs cleanly
  const handleSetScreen = (screen: ActiveScreen) => {
    setActiveScreen(screen);
  };

  // Quick Action card click from homepage
  const handleStartLearning = (category: string | null) => {
    setSelectedCategory(category);
    setActiveScreen("learn");
  };

  // Handle words declared as Known
  const handleMarkWordKnown = (wordKey: string) => {
    const updatedLearned = [...progress.learnedWords];
    if (!updatedLearned.includes(wordKey)) {
      updatedLearned.push(wordKey);
    }

    // Filter out of difficult pile if located there
    const updatedDifficult = progress.difficultWords.filter(w => w !== wordKey);
    const addedXP = progress.points + 10;

    // Check milestones achievement unlocking
    const newlyUnlocked = [...progress.unlockedAchievements];
    if (updatedLearned.length >= 5 && !newlyUnlocked.includes("first_words")) {
      newlyUnlocked.push("first_words");
    }

    saveProgress({
      ...progress,
      learnedWords: updatedLearned,
      difficultWords: updatedDifficult,
      points: addedXP,
      unlockedAchievements: newlyUnlocked
    });
  };

  // Handle words declared as Difficult
  const handleMarkWordDifficult = (wordKey: string) => {
    const updatedDifficult = [...progress.difficultWords];
    if (!updatedDifficult.includes(wordKey)) {
      updatedDifficult.push(wordKey);
    }

    saveProgress({
      ...progress,
      difficultWords: updatedDifficult
    });
  };

  // Promoting difficult words back into learned cards pile during repetitions
  const handleAdvanceWordToLearned = (wordKey: string) => {
    const updatedLearned = [...progress.learnedWords];
    if (!updatedLearned.includes(wordKey)) {
      updatedLearned.push(wordKey);
    }

    const updatedDifficult = progress.difficultWords.filter(w => w !== wordKey);
    const addedXP = progress.points + 15; // Give extra XP points bounty for repetition completions!

    const newlyUnlocked = [...progress.unlockedAchievements];
    if (updatedLearned.length >= 5 && !newlyUnlocked.includes("first_words")) {
      newlyUnlocked.push("first_words");
    }

    saveProgress({
      ...progress,
      learnedWords: updatedLearned,
      difficultWords: updatedDifficult,
      points: addedXP,
      unlockedAchievements: newlyUnlocked
    });
  };

  const handleKeepWordDifficult = (wordKey: string) => {
    // Simply do nothing or log repeat triggers
    console.log(`Word "${wordKey}" retained in repetition cycle`);
  };

  // Appending smart AI Voice recorded cards
  const handleAddCustomWord = (newWord: Word) => {
    const updatedCustom = [newWord, ...progress.customWords];
    const newlyUnlocked = [...progress.unlockedAchievements];
    
    // Instantly reward and trigger achievement
    if (!newlyUnlocked.includes("voice_wizard")) {
      newlyUnlocked.push("voice_wizard");
    }

    saveProgress({
      ...progress,
      customWords: updatedCustom,
      unlockedAchievements: newlyUnlocked,
      points: progress.points + 15 // Bonus XP for AI exploration
    });
  };

  // Toggle active sound feedback option
  const handleToggleAudio = () => {
    saveProgress({
      ...progress,
      audioEnabled: !progress.audioEnabled
    });
  };

  // Manual reset functionality
  const handleResetProgress = () => {
    localStorage.removeItem("tma_learner_progress_v2");
    setProgress(DEFAULT_PROGRESS);
    setActiveScreen("home");
  };

  const handleOnboardingComplete = (goal: number) => {
    setDailyGoal(goal);
    try {
      localStorage.setItem("tma_onboarding_done_v2", "1");
    } catch {}
    setShowOnboarding(false);
  };

  const handleAwardPoints = (points: number) => {
    saveProgress({
      ...progress,
      points: progress.points + points
    });
  };

  const handleUnlockAchievement = (id: string) => {
    const newlyUnlocked = [...progress.unlockedAchievements];
    if (!newlyUnlocked.includes(id)) {
      newlyUnlocked.push(id);
      saveProgress({
        ...progress,
        unlockedAchievements: newlyUnlocked
      });
    }
  };

  if (showOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  return (
    <TelegramFrame
      activeScreen={activeScreen}
      setScreen={handleSetScreen}
      streak={progress.streak}
      points={progress.points}
      learnedCount={progress.learnedWords.length}
      totalWordsCount={allWords.length + progress.customWords.length}
      onStartCategory={handleStartLearning}
      onAddCustomWord={handleAddCustomWord}
    >
      {activeScreen === "home" && (
        <HomeScreen
          progress={progress}
          onStartLearning={handleStartLearning}
          onAddCustomWord={handleAddCustomWord}
          allWords={allWords}
          dailyGoal={dailyGoal}
        />
      )}

      {activeScreen === "learn" && (
        <LearnScreen
          category={selectedCategory}
          allWords={[...allWords, ...progress.customWords]}
          onBackToHome={() => handleSetScreen("home")}
          onMarkKnown={handleMarkWordKnown}
          onMarkDifficult={handleMarkWordDifficult}
          learnedWordIds={progress.learnedWords}
        />
      )}

      {activeScreen === "repeat" && (
        <RepeatScreen
          progress={progress}
          onAdvanceWordToLearned={handleAdvanceWordToLearned}
          onKeepInDifficult={handleKeepWordDifficult}
          allWords={allWords}
          onStartLearning={() => handleStartLearning(null)}
        />
      )}

      {activeScreen === "games" && (
        <GamesScreen
          allWords={allWords}
          customWords={progress.customWords}
          onAwardPoints={handleAwardPoints}
          onUnlockAchievement={handleUnlockAchievement}
        />
      )}

      {activeScreen === "profile" && (
        <ProfileScreen
          progress={progress}
          onToggleAudio={handleToggleAudio}
          onResetProgress={handleResetProgress}
          totalAvailableWords={allWords.length + progress.customWords.length}
        />
      )}
    </TelegramFrame>
  );
}
