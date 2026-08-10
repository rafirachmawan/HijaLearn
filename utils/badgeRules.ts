export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export const ALL_BADGES: Omit<Badge, "unlocked">[] = [
  {
    id: "first_step",
    title: "Langkah Pertama",
    description: "Pelajari huruf Hijaiyah pertama kamu",
    icon: "footsteps"
  },
  {
    id: "hijaiyah_master",
    title: "Khatam Hijaiyah",
    description: "Kuasai seluruh 28 huruf Hijaiyah",
    icon: "ribbon"
  },
  {
    id: "first_surah",
    title: "Surat Pertama",
    description: "Selesaikan membaca 1 Surat Pendek",
    icon: "book"
  },
  {
    id: "hafiz_junior",
    title: "Hafiz Muda",
    description: "Pelajari 5 Surat Pendek",
    icon: "school"
  },
  {
    id: "quiz_star",
    title: "Bintang Kuis",
    description: "Dapatkan nilai 100 pada salah satu kuis",
    icon: "star"
  },
  {
    id: "quiz_champion",
    title: "Juara Kuis",
    description: "Selesaikan 3 kuis dengan hasil sempurna",
    icon: "trophy"
  }
];

export function checkNewBadges(
  completedLetters: number[],
  completedSurahs: number[],
  quizScores: { quizId: string; score: number }[],
  currentlyUnlocked: string[]
): string[] {
  const newUnlocked = [...currentlyUnlocked];

  // 1. First step
  if (completedLetters.length >= 1 && !newUnlocked.includes("first_step")) {
    newUnlocked.push("first_step");
  }

  // 2. Khatam Hijaiyah
  if (completedLetters.length >= 28 && !newUnlocked.includes("hijaiyah_master")) {
    newUnlocked.push("hijaiyah_master");
  }

  // 3. First surah
  if (completedSurahs.length >= 1 && !newUnlocked.includes("first_surah")) {
    newUnlocked.push("first_surah");
  }

  // 4. Hafiz junior
  if (completedSurahs.length >= 5 && !newUnlocked.includes("hafiz_junior")) {
    newUnlocked.push("hafiz_junior");
  }

  // 5. Quiz star
  const hasPerfectScore = quizScores.some(q => q.score === 100);
  if (hasPerfectScore && !newUnlocked.includes("quiz_star")) {
    newUnlocked.push("quiz_star");
  }

  // 6. Quiz champion
  const perfectScoresCount = quizScores.filter(q => q.score === 100).length;
  if (perfectScoresCount >= 3 && !newUnlocked.includes("quiz_champion")) {
    newUnlocked.push("quiz_champion");
  }

  return newUnlocked;
}
