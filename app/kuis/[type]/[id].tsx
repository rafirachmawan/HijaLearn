import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import hijaiyahData from "../../../data/hijaiyah.json";
import { useProgress } from "../../../hooks/useProgress";
import { ALL_BADGES } from "../../../utils/badgeRules";
import { Colors, Shadows } from "../../../constants/theme";

interface Question {
  id: number;
  prompt: string;
  arabicPrompt?: string;
  options: string[];
  correctAnswer: string;
}

export default function QuizScreen() {
  const { type, id } = useLocalSearchParams<{ type: string; id: string }>();
  const router = useRouter();
  const quizId = `${type}_${id || "1"}`;

  const { saveQuizScore } = useProgress();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [unlockedBadgeIds, setUnlockedBadgeIds] = useState<string[]>([]);

  useEffect(() => {
    let qList: Question[] = [];

    if (type === "hijaiyah") {
      const targetId = parseInt(id || "1", 10);
      const mainLetter = hijaiyahData.find((h) => h.id === targetId) || hijaiyahData[0];
      const distractors = hijaiyahData.filter((h) => h.id !== mainLetter.id);

      qList = [
        {
          id: 1,
          prompt: "Manakah nama dari huruf Hijaiyah berikut?",
          arabicPrompt: mainLetter.arabic,
          options: [
            mainLetter.name,
            distractors[0].name,
            distractors[1].name,
            distractors[2].name
          ].sort(() => Math.random() - 0.5),
          correctAnswer: mainLetter.name
        },
        {
          id: 2,
          prompt: `Manakah karakter Arab untuk huruf "${mainLetter.name}"?`,
          options: [
            mainLetter.arabic,
            distractors[0].arabic,
            distractors[1].arabic,
            distractors[2].arabic
          ].sort(() => Math.random() - 0.5),
          correctAnswer: mainLetter.arabic
        },
        {
          id: 3,
          prompt: `Manakah bentuk fathah (-َ) dari huruf "${mainLetter.name}"?`,
          options: [
            mainLetter.harakat.fathah.arabic,
            mainLetter.harakat.kasrah.arabic,
            mainLetter.harakat.dhommah.arabic,
            distractors[0].harakat.fathah.arabic
          ].sort(() => Math.random() - 0.5),
          correctAnswer: mainLetter.harakat.fathah.arabic
        },
        {
          id: 4,
          prompt: `Bagaimana bunyi bacaan dari harakat "${mainLetter.harakat.kasrah.arabic}"?`,
          options: [
            mainLetter.harakat.kasrah.sound.toUpperCase(),
            mainLetter.harakat.fathah.sound.toUpperCase(),
            mainLetter.harakat.dhommah.sound.toUpperCase(),
            "BUNYI LAIN"
          ].sort(() => Math.random() - 0.5),
          correctAnswer: mainLetter.harakat.kasrah.sound.toUpperCase()
        },
        {
          id: 5,
          prompt: `Bagaimana bunyi bacaan dari harakat "${mainLetter.harakat.dhommah.arabic}"?`,
          options: [
            mainLetter.harakat.dhommah.sound.toUpperCase(),
            mainLetter.harakat.fathah.sound.toUpperCase(),
            mainLetter.harakat.kasrah.sound.toUpperCase(),
            "SELESAI"
          ].sort(() => Math.random() - 0.5),
          correctAnswer: mainLetter.harakat.dhommah.sound.toUpperCase()
        }
      ];
    } else {
      qList = [
        {
          id: 1,
          prompt: "Lanjutkan potongan ayat surat An-Nas berikut: قُلْ أَعُوذُ بِرَبِّ ...",
          options: ["النَّاسِ", "الْفَلَقِ", "الصَّمَدُ", "الْمَلِكِ"],
          correctAnswer: "النَّاسِ"
        },
        {
          id: 2,
          prompt: "Apa arti dari bacaan 'مَلِكِ النَّاسِ'?",
          options: ["Raja Manusia", "Tuhan Manusia", "Waktu Subuh", "Suku Quraisy"],
          correctAnswer: "Raja Manusia"
        },
        {
          id: 3,
          prompt: "Berapakah jumlah ayat dalam Surat Al-Ikhlas?",
          options: ["4 Ayat", "5 Ayat", "6 Ayat", "3 Ayat"],
          correctAnswer: "4 Ayat"
        },
        {
          id: 4,
          prompt: "Surat apakah yang memiliki arti 'Waktu Subuh'?",
          options: ["Al-Falaq", "An-Nas", "Al-Fil", "Al-Kautsar"],
          correctAnswer: "Al-Falaq"
        },
        {
          id: 5,
          prompt: "Surat apakah yang mengandung bacaan 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ'?",
          options: ["Al-Kautsar", "Al-Ma'un", "Quraisy", "An-Nasr"],
          correctAnswer: "Al-Kautsar"
        }
      ];
    }

    setQuestions(qList);
  }, [type, id]);

  const currentQ = questions[currentIdx];

  const handleSelectOption = (option: string) => {
    if (selectedOption !== null) return;

    setSelectedOption(option);
    const isCorrect = option === currentQ.correctAnswer;
    const newScore = isCorrect ? score + 1 : score;
    if (isCorrect) setScore(newScore);

    setTimeout(async () => {
      if (currentIdx + 1 < questions.length) {
        setCurrentIdx(currentIdx + 1);
        setSelectedOption(null);
      } else {
        setIsFinished(true);
        const finalPercentage = Math.round((newScore / questions.length) * 100);
        const newBadges = await saveQuizScore(quizId, finalPercentage);
        setUnlockedBadgeIds(newBadges);
      }
    }, 1200);
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setScore(0);
    setSelectedOption(null);
    setIsFinished(false);
    setUnlockedBadgeIds([]);
  };

  return (
    <>
      <Stack.Screen options={{ title: `Kuis ${type === "hijaiyah" ? "Hijaiyah" : "Surat Pendek"}` }} />

      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {!isFinished && currentQ ? (
          <View>
            {/* Header info */}
            <View style={styles.quizHeaderRow}>
              <Text style={styles.questionCounter}>
                Soal {currentIdx + 1} dari {questions.length}
              </Text>
              <View style={styles.scoreLiveBadge}>
                <Ionicons name="trophy" size={14} color={Colors.accent} />
                <Text style={styles.scoreLiveText}>Skor: {score * 20}</Text>
              </View>
            </View>

            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${((currentIdx + 1) / questions.length) * 100}%` }
                ]}
              />
            </View>

            {/* Question Display */}
            <View style={[styles.questionCard, Shadows.medium]}>
              {currentQ.arabicPrompt && (
                <Text style={styles.questionArabic}>{currentQ.arabicPrompt}</Text>
              )}
              <Text style={styles.questionPrompt}>{currentQ.prompt}</Text>
            </View>

            {/* Option Pills */}
            <View style={styles.optionsList}>
              {currentQ.options.map((opt, idx) => {
                let cardStyle = [styles.optionBtn, Shadows.small];
                let isSelected = selectedOption === opt;
                let isCorrectOpt = opt === currentQ.correctAnswer;

                if (selectedOption !== null) {
                  if (isCorrectOpt) {
                    cardStyle.push(styles.optionCorrect as any);
                  } else if (isSelected && !isCorrectOpt) {
                    cardStyle.push(styles.optionWrong as any);
                  }
                }

                return (
                  <TouchableOpacity
                    key={idx}
                    style={cardStyle}
                    activeOpacity={0.8}
                    disabled={selectedOption !== null}
                    onPress={() => handleSelectOption(opt)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selectedOption !== null && isCorrectOpt && styles.textWhite,
                        selectedOption !== null && isSelected && !isCorrectOpt && styles.textWhite
                      ]}
                    >
                      {opt}
                    </Text>

                    {selectedOption !== null && isCorrectOpt && (
                      <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
                    )}
                    {selectedOption !== null && isSelected && !isCorrectOpt && (
                      <Ionicons name="close-circle" size={24} color="#FFFFFF" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ) : (
          /* Result Summary */
          <View style={[styles.resultCard, Shadows.medium]}>
            <View style={styles.trophyBg}>
              <Ionicons
                name={score >= 4 ? "trophy" : "ribbon"}
                size={54}
                color={Colors.accent}
              />
            </View>

            <Text style={styles.resultTitle}>Kuis Selesai!</Text>
            <Text style={styles.resultSubtitle}>
              Kamu berhasil menjawab {score} dari {questions.length} soal dengan benar.
            </Text>

            {/* Stars */}
            <View style={styles.starsRow}>
              <Ionicons name={score >= 2 ? "star" : "star-outline"} size={36} color={Colors.accent} />
              <Ionicons name={score >= 4 ? "star" : "star-outline"} size={44} color={Colors.accent} />
              <Ionicons name={score === 5 ? "star" : "star-outline"} size={36} color={Colors.accent} />
            </View>

            <View style={styles.finalScoreBox}>
              <Text style={styles.finalScoreNumber}>{Math.round((score / questions.length) * 100)}</Text>
              <Text style={styles.finalScoreLabel}>Skor Akhir</Text>
            </View>

            {/* Unlocked Badges */}
            {unlockedBadgeIds.length > 0 && (
              <View style={styles.badgeUnlockedBanner}>
                <Ionicons name="sparkles" size={24} color={Colors.accent} />
                <View style={styles.badgeUnlockedText}>
                  <Text style={styles.badgeUnlockedTitle}>🎉 Lencana Baru Terbuka!</Text>
                  {unlockedBadgeIds.map((bId) => {
                    const b = ALL_BADGES.find((x) => x.id === bId);
                    return (
                      <Text key={bId} style={styles.badgeUnlockedItem}>
                        • {b?.title} ({b?.description})
                      </Text>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Actions */}
            <View style={styles.resultActions}>
              <TouchableOpacity style={styles.restartBtn} activeOpacity={0.8} onPress={handleRestart}>
                <Ionicons name="refresh" size={18} color="#FFFFFF" />
                <Text style={styles.restartBtnText}>Ulangi Kuis</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.backBtn}
                activeOpacity={0.8}
                onPress={() => router.back()}
              >
                <Text style={styles.backBtnText}>Kembali ke Materi</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  content: {
    padding: 16,
    paddingBottom: 36
  },
  quizHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10
  },
  questionCounter: {
    fontSize: 13,
    fontWeight: "800",
    color: Colors.textSecondary
  },
  scoreLiveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E6F4F1",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4
  },
  scoreLiveText: {
    fontSize: 13,
    fontWeight: "800",
    color: Colors.primary
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: "#E2E8F0",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 20
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 4
  },
  questionCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border
  },
  questionArabic: {
    fontSize: 52,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 12
  },
  questionPrompt: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.textPrimary,
    textAlign: "center",
    lineHeight: 24
  },
  optionsList: {
    gap: 12
  },
  optionBtn: {
    backgroundColor: Colors.cardBg,
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1.5,
    borderColor: Colors.border
  },
  optionCorrect: {
    backgroundColor: Colors.success,
    borderColor: Colors.success
  },
  optionWrong: {
    backgroundColor: Colors.danger,
    borderColor: Colors.danger
  },
  optionText: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.textPrimary
  },
  textWhite: {
    color: "#FFFFFF"
  },
  resultCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 10
  },
  trophyBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FEF3C7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: 6
  },
  resultSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 16
  },
  starsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20
  },
  finalScoreBox: {
    backgroundColor: "#E6F4F1",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 20
  },
  finalScoreNumber: {
    fontSize: 36,
    fontWeight: "800",
    color: Colors.primary
  },
  finalScoreLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: Colors.textSecondary
  },
  badgeUnlockedBanner: {
    backgroundColor: "#FEF9E7",
    borderWidth: 1,
    borderColor: "#FCD34D",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    width: "100%",
    marginBottom: 20
  },
  badgeUnlockedText: {
    flex: 1
  },
  badgeUnlockedTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: 4
  },
  badgeUnlockedItem: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16
  },
  resultActions: {
    width: "100%",
    gap: 10
  },
  restartBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 14,
    gap: 8
  },
  restartBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800"
  },
  backBtn: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border
  },
  backBtnText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: "800"
  }
});
