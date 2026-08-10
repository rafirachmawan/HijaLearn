import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import hijaiyahData from "../../data/hijaiyah.json";
import { useAudio } from "../../hooks/useAudio";
import { useProgress } from "../../hooks/useProgress";
import { Colors, Fonts, Shadows } from "../../constants/theme";

type HarakatType = "fathah" | "kasrah" | "dhommah";

export default function HijaiyahDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const letterId = parseInt(id || "1", 10);
  
  const letter = hijaiyahData.find((h) => h.id === letterId) || hijaiyahData[0];
  const [selectedHarakat, setSelectedHarakat] = useState<HarakatType>("fathah");

  const { playSpeech, isPlaying, isLoading, error } = useAudio();
  const { markLetterCompleted } = useProgress();

  useEffect(() => {
    markLetterCompleted(letter.id);
  }, [letter.id]);

  const activeHarakatData = letter.harakat[selectedHarakat];

  const handlePlayAudio = () => {
    playSpeech(activeHarakatData.arabic, "ar-SA");
  };

  const handlePrev = () => {
    if (letterId > 1) {
      router.replace(`/hijaiyah/${letterId - 1}`);
    }
  };

  const handleNext = () => {
    if (letterId < hijaiyahData.length) {
      router.replace(`/hijaiyah/${letterId + 1}`);
    }
  };

  const selectHarakatAndPlay = (harakat: HarakatType) => {
    setSelectedHarakat(harakat);
    const targetHarakat = letter.harakat[harakat];
    playSpeech(targetHarakat.arabic, "ar-SA");
  };

  return (
    <>
      <Stack.Screen options={{ title: `Huruf ${letter.name}` }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Navigation bar top */}
        <View style={styles.topNavRow}>
          <TouchableOpacity
            style={[styles.navBtn, letterId <= 1 && styles.navBtnDisabled]}
            disabled={letterId <= 1}
            onPress={handlePrev}
          >
            <Ionicons name="chevron-back" size={20} color={letterId <= 1 ? Colors.inactive : Colors.primary} />
            <Text style={[styles.navBtnText, letterId <= 1 && styles.textDisabled]}>Sebelumnya</Text>
          </TouchableOpacity>

          <View style={styles.counterBadge}>
            <Text style={styles.letterCounter}>
              Huruf {letterId} dari {hijaiyahData.length}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.navBtn, letterId >= hijaiyahData.length && styles.navBtnDisabled]}
            disabled={letterId >= hijaiyahData.length}
            onPress={handleNext}
          >
            <Text style={[styles.navBtnText, letterId >= hijaiyahData.length && styles.textDisabled]}>Selanjutnya</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={letterId >= hijaiyahData.length ? Colors.inactive : Colors.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Big Letter Display Card */}
        <View style={[styles.bigCard, Shadows.medium]}>
          <View style={styles.badgeCompletedHeader}>
            <Ionicons name="checkmark-circle" size={16} color={Colors.secondary} />
            <Text style={styles.completedHeaderText}>Tercatat Dikuasai</Text>
          </View>

          <Text style={styles.bigArabic}>{activeHarakatData.arabic}</Text>
          <Text style={styles.bigName}>{letter.name}</Text>
          <Text style={styles.soundText}>Bunyi Pelafalan: "{activeHarakatData.sound.toUpperCase()}"</Text>

          {/* Audio Button */}
          <TouchableOpacity
            style={[styles.audioButton, Shadows.small, isPlaying && styles.audioButtonPlaying]}
            activeOpacity={0.8}
            onPress={handlePlayAudio}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Ionicons name={isPlaying ? "pause" : "volume-high"} size={24} color="#FFFFFF" />
                <Text style={styles.audioBtnText}>
                  {isPlaying ? "Memutar Suara..." : "Dengarkan Pelafalan"}
                </Text>
              </>
            )}
          </TouchableOpacity>

          {error && <Text style={styles.errorLabel}>{error}</Text>}
        </View>

        {/* Harakat Selector */}
        <Text style={styles.sectionTitle}>Pilih Harakat Dasar</Text>

        <View style={styles.harakatRow}>
          <TouchableOpacity
            style={[
              styles.harakatCard,
              selectedHarakat === "fathah" && styles.harakatActive
            ]}
            onPress={() => selectHarakatAndPlay("fathah")}
          >
            <Text style={styles.harakatArabic}>{letter.harakat.fathah.arabic}</Text>
            <Text style={styles.harakatLabel}>Fathah (-َ)</Text>
            <Text style={styles.harakatSound}>Sound: {letter.harakat.fathah.sound}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.harakatCard,
              selectedHarakat === "kasrah" && styles.harakatActive
            ]}
            onPress={() => selectHarakatAndPlay("kasrah")}
          >
            <Text style={styles.harakatArabic}>{letter.harakat.kasrah.arabic}</Text>
            <Text style={styles.harakatLabel}>Kasrah (-ِ)</Text>
            <Text style={styles.harakatSound}>Sound: {letter.harakat.kasrah.sound}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.harakatCard,
              selectedHarakat === "dhommah" && styles.harakatActive
            ]}
            onPress={() => selectHarakatAndPlay("dhommah")}
          >
            <Text style={styles.harakatArabic}>{letter.harakat.dhommah.arabic}</Text>
            <Text style={styles.harakatLabel}>Dhommah (-ُ)</Text>
            <Text style={styles.harakatSound}>Sound: {letter.harakat.dhommah.sound}</Text>
          </TouchableOpacity>
        </View>

        {/* Quiz Link Banner */}
        <TouchableOpacity
          style={[styles.quizPromptCard, Shadows.small]}
          activeOpacity={0.8}
          onPress={() => router.push(`/kuis/hijaiyah/${letterId}`)}
        >
          <View style={styles.quizPromptIconBg}>
            <Ionicons name="extension-puzzle" size={28} color="#D97706" />
          </View>
          <View style={styles.quizPromptText}>
            <Text style={styles.quizPromptTitle}>Uji Pemahaman Huruf Ini</Text>
            <Text style={styles.quizPromptSub}>Ikuti kuis tebak bunyi & bentuk huruf</Text>
          </View>
          <Ionicons name="arrow-forward" size={20} color={Colors.primary} />
        </TouchableOpacity>
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
    paddingBottom: 32
  },
  topNavRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16
  },
  navBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4
  },
  navBtnDisabled: {
    opacity: 0.4
  },
  navBtnText: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    color: Colors.primary
  },
  textDisabled: {
    color: Colors.inactive
  },
  counterBadge: {
    backgroundColor: Colors.cardBg,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border
  },
  letterCounter: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    color: Colors.textSecondary
  },
  bigCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border
  },
  badgeCompletedHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-end",
    marginBottom: 8
  },
  completedHeaderText: {
    fontFamily: Fonts.bold,
    fontSize: 11,
    color: Colors.secondary
  },
  bigArabic: {
    fontSize: 88,
    fontWeight: "700",
    color: Colors.primary,
    marginVertical: 4
  },
  bigName: {
    fontFamily: Fonts.bold,
    fontSize: 22,
    color: Colors.textPrimary
  },
  soundText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 20
  },
  audioButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    gap: 10,
    width: "100%",
    justifyContent: "center"
  },
  audioButtonPlaying: {
    backgroundColor: Colors.secondary
  },
  audioBtnText: {
    fontFamily: Fonts.bold,
    color: "#FFFFFF",
    fontSize: 15
  },
  errorLabel: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: Colors.danger,
    marginTop: 8
  },
  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 12
  },
  harakatRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24
  },
  harakatCard: {
    flex: 1,
    backgroundColor: Colors.cardBg,
    borderRadius: 18,
    padding: 14,
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.border
  },
  harakatActive: {
    borderColor: Colors.primary,
    backgroundColor: "#E6F4F1"
  },
  harakatArabic: {
    fontSize: 34,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 4
  },
  harakatLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: Colors.textPrimary
  },
  harakatSound: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2
  },
  quizPromptCard: {
    backgroundColor: "#FEF9E7",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FCD34D",
    gap: 12
  },
  quizPromptIconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#FEF3C7",
    justifyContent: "center",
    alignItems: "center"
  },
  quizPromptText: {
    flex: 1
  },
  quizPromptTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: Colors.textPrimary
  },
  quizPromptSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2
  }
});
