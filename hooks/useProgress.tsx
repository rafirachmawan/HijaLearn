import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ALL_BADGES, checkNewBadges, Badge } from "../utils/badgeRules";

const STORAGE_KEY = "@belajar_agama_progress_v1";

export interface ProgressState {
  completedLetters: number[];
  completedSurahs: number[];
  quizScores: { quizId: string; score: number }[];
  unlockedBadges: string[];
}

interface ProgressContextType extends ProgressState {
  markLetterCompleted: (letterId: number) => Promise<void>;
  markSurahCompleted: (surahNumber: number) => Promise<void>;
  saveQuizScore: (quizId: string, score: number) => Promise<string[]>; // Returns newly unlocked badge ids
  resetProgress: () => Promise<void>;
  getBadgesWithStatus: () => Badge[];
  isLoaded: boolean;
}

const initialProgress: ProgressState = {
  completedLetters: [],
  completedSurahs: [],
  quizScores: [],
  unlockedBadges: []
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<ProgressState>(initialProgress);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from AsyncStorage on mount
  useEffect(() => {
    async function loadStoredProgress() {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          setProgress({
            completedLetters: parsed.completedLetters || [],
            completedSurahs: parsed.completedSurahs || [],
            quizScores: parsed.quizScores || [],
            unlockedBadges: parsed.unlockedBadges || []
          });
        }
      } catch (e) {
        console.error("Gagal memuat progres dari AsyncStorage", e);
      } finally {
        setIsLoaded(true);
      }
    }
    loadStoredProgress();
  }, []);

  // Save progress helper
  const saveState = async (newState: ProgressState) => {
    // Evaluate badge rules
    const updatedBadges = checkNewBadges(
      newState.completedLetters,
      newState.completedSurahs,
      newState.quizScores,
      newState.unlockedBadges
    );

    const finalState = {
      ...newState,
      unlockedBadges: updatedBadges
    };

    setProgress(finalState);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(finalState));
    } catch (e) {
      console.error("Gagal menyimpan progres ke AsyncStorage", e);
    }
    return updatedBadges;
  };

  const markLetterCompleted = async (letterId: number) => {
    if (progress.completedLetters.includes(letterId)) return;
    const nextLetters = [...progress.completedLetters, letterId];
    await saveState({
      ...progress,
      completedLetters: nextLetters
    });
  };

  const markSurahCompleted = async (surahNumber: number) => {
    if (progress.completedSurahs.includes(surahNumber)) return;
    const nextSurahs = [...progress.completedSurahs, surahNumber];
    await saveState({
      ...progress,
      completedSurahs: nextSurahs
    });
  };

  const saveQuizScore = async (quizId: string, score: number) => {
    const existingIdx = progress.quizScores.findIndex(q => q.quizId === quizId);
    let nextScores = [...progress.quizScores];
    if (existingIdx >= 0) {
      // Update high score
      if (score > nextScores[existingIdx].score) {
        nextScores[existingIdx] = { quizId, score };
      }
    } else {
      nextScores.push({ quizId, score });
    }

    const prevBadges = [...progress.unlockedBadges];
    const newBadgesList = await saveState({
      ...progress,
      quizScores: nextScores
    });

    // Return badge IDs that were unlocked in this action
    return newBadgesList.filter(b => !prevBadges.includes(b));
  };

  const resetProgress = async () => {
    setProgress(initialProgress);
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("Gagal mereset progres di AsyncStorage", e);
    }
  };

  const getBadgesWithStatus = (): Badge[] => {
    return ALL_BADGES.map(b => ({
      ...b,
      unlocked: progress.unlockedBadges.includes(b.id)
    }));
  };

  return (
    <ProgressContext.Provider
      value={{
        ...progress,
        markLetterCompleted,
        markSurahCompleted,
        saveQuizScore,
        resetProgress,
        getBadgesWithStatus,
        isLoaded
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress harus digunakan di dalam ProgressProvider");
  }
  return context;
};
