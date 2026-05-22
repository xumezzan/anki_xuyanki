export interface Word {
  word: string;
  transcription: string;
  translation: string;
  explanation: string;
  example: string;
  exampleTranslation: string;
  emoji: string;
  partOfSpeech: string;
  category: "IT" | "Travel" | "Business" | "Everyday" | "Movies" | "Slang" | string;
  custom?: boolean;
}

export interface UserProgress {
  learnedWords: string[]; // List of word strings marked as Known
  difficultWords: string[]; // Words marked as Don't Know for interval repeating
  customWords: Word[]; // Words added via microphone / AI
  points: number; // Experience points (XP)
  streak: number; // Daily consecutive logins
  lastActiveDate: string | null; // Date of last learning
  audioEnabled: boolean;
  unlockedAchievements: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  objective: string;
  reqValue: number;
}

export type ActiveScreen = "home" | "learn" | "repeat" | "games" | "profile";
