import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Switch
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { fetchSurahDetail } from "../../services/quranApi";
import { useAudio } from "../../hooks/useAudio";
import { useProgress } from "../../hooks/useProgress";
import { Colors, Shadows } from "../../constants/theme";

export default function SurahDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const surahNumber = parseInt(id || "114", 10);
  const flatListRef = useRef<FlatList>(null);

  const [isMurajaahMode, setIsMurajaahMode] = useState(false);
  const [playingAyahIndex, setPlayingAyahIndex] = useState<number | null>(null);
  const [isAutoPlayingAll, setIsAutoPlayingAll] = useState(false);

  const { playAudio, stopAudio, isPlaying } = useAudio();
  const { markSurahCompleted, completedSurahs } = useProgress();

  const { data: surah, isLoading, isError, refetch } = useQuery({
    queryKey: ["surahDetail", surahNumber],
    queryFn: () => fetchSurahDetail(surahNumber)
  });

  const isCompleted = completedSurahs.includes(surahNumber);

  const handlePlayAyah = (index: number) => {
    if (!surah) return;
    setIsAutoPlayingAll(false);
    setPlayingAyahIndex(index);
    const ayah = surah.ayahs[index];
    playAudio(ayah.audio, () => {
      setPlayingAyahIndex(null);
    });
  };

  const playNextSequential = (currentIndex: number) => {
    if (!surah || currentIndex >= surah.ayahs.length) {
      setIsAutoPlayingAll(false);
      setPlayingAyahIndex(null);
      markSurahCompleted(surahNumber);
      return;
    }

    setPlayingAyahIndex(currentIndex);
    try {
      flatListRef.current?.scrollToIndex({ index: currentIndex, animated: true });
    } catch (e) {
      // Ignore index scroll error
    }

    const ayah = surah.ayahs[currentIndex];
    playAudio(ayah.audio, () => {
      playNextSequential(currentIndex + 1);
    });
  };

  const handleToggleAutoPlay = () => {
    if (isAutoPlayingAll && isPlaying) {
      stopAudio();
      setIsAutoPlayingAll(false);
      setPlayingAyahIndex(null);
    } else {
      setIsAutoPlayingAll(true);
      playNextSequential(0);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: surah ? `${surah.englishName}` : "Baca Surat"
        }}
      />

      <View style={styles.container}>
        {isLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Memuat ayat-ayat surat...</Text>
          </View>
        ) : isError || !surah ? (
          <View style={styles.centerContainer}>
            <Ionicons name="alert-circle-outline" size={48} color={Colors.danger} />
            <Text style={styles.errorText}>Gagal memuat detail surat</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
              <Text style={styles.retryText}>Coba Lagi</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={surah.ayahs}
            keyExtractor={(item) => item.number.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View style={styles.headerContainer}>
                {/* Surah Header Card */}
                <View style={[styles.surahBanner, Shadows.medium]}>
                  <Text style={styles.bannerArabic}>{surah.name}</Text>
                  <Text style={styles.bannerEnglish}>{surah.englishName}</Text>
                  <Text style={styles.bannerSub}>
                    {surah.englishNameTranslation} • {surah.revelationType === "Meccan" ? "Makkiyah" : "Madaniyah"} • {surah.numberOfAyahs} Ayat
                  </Text>

                  {/* Mark Completed Button */}
                  <TouchableOpacity
                    style={[styles.completedBtn, isCompleted && styles.completedBtnDone]}
                    activeOpacity={0.8}
                    onPress={() => markSurahCompleted(surahNumber)}
                  >
                    <Ionicons
                      name={isCompleted ? "checkmark-circle" : "checkmark-circle-outline"}
                      size={18}
                      color="#FFFFFF"
                    />
                    <Text style={styles.completedBtnText}>
                      {isCompleted ? "Surat Telah Dikuasai" : "Tandai Selesai Dibaca"}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Control Action Bar */}
                <View style={styles.controlBar}>
                  <TouchableOpacity
                    style={[styles.autoPlayBtn, isAutoPlayingAll && styles.autoPlayBtnActive]}
                    activeOpacity={0.8}
                    onPress={handleToggleAutoPlay}
                  >
                    <Ionicons
                      name={isAutoPlayingAll ? "pause" : "play"}
                      size={18}
                      color="#FFFFFF"
                    />
                    <Text style={styles.autoPlayText}>
                      {isAutoPlayingAll ? "Hentikan Audio" : "Putar Semua Ayat"}
                    </Text>
                  </TouchableOpacity>

                  <View style={styles.murajaahToggle}>
                    <Text style={styles.murajaahLabel}>Murajaah</Text>
                    <Switch
                      value={isMurajaahMode}
                      onValueChange={setIsMurajaahMode}
                      trackColor={{ false: Colors.border, true: Colors.primary }}
                      thumbColor="#FFFFFF"
                    />
                  </View>
                </View>

                {/* Bismillah Header (except for Surah At-Tawbah) */}
                {surahNumber !== 9 && (
                  <View style={styles.bismillahBox}>
                    <Text style={styles.bismillahArabic}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</Text>
                  </View>
                )}
              </View>
            }
            renderItem={({ item, index }) => {
              const isAyahActive = playingAyahIndex === index && isPlaying;

              return (
                <View style={[styles.ayahCard, Shadows.small, isAyahActive && styles.activeAyahCard]}>
                  {/* Ayah Header Row */}
                  <View style={styles.ayahHeaderRow}>
                    <View style={styles.ayahNumberBadge}>
                      <Text style={styles.ayahNumberText}>{item.numberInSurah}</Text>
                    </View>

                    <TouchableOpacity
                      style={styles.ayahPlayIcon}
                      onPress={() => handlePlayAyah(index)}
                    >
                      <Ionicons
                        name={isAyahActive ? "pause-circle" : "volume-high-outline"}
                        size={28}
                        color={isAyahActive ? Colors.secondary : Colors.primary}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Text Content */}
                  {!isMurajaahMode ? (
                    <>
                      <Text style={styles.arabicText}>{item.text}</Text>
                      {item.transliteration && (
                        <Text style={styles.transliterationText}>{item.transliteration}</Text>
                      )}
                      <Text style={styles.translationText}>{item.translation}</Text>
                    </>
                  ) : (
                    <View style={styles.murajaahHiddenCard}>
                      <Ionicons name="eye-off-outline" size={24} color={Colors.textSecondary} />
                      <Text style={styles.murajaahHiddenText}>
                        Mode Murajaah Aktif — Sembunyikan Teks untuk Uji Hafalan
                      </Text>
                    </View>
                  )}
                </View>
              );
            }}
            ListFooterComponent={
              <TouchableOpacity
                style={[styles.quizFooterCard, Shadows.small]}
                activeOpacity={0.8}
                onPress={() => router.push(`/kuis/surat/${surahNumber}`)}
              >
                <View style={styles.quizFooterIconBg}>
                  <Ionicons name="extension-puzzle" size={28} color="#D97706" />
                </View>
                <View style={styles.quizFooterText}>
                  <Text style={styles.quizFooterTitle}>Kuis Hafalan Surat Ini</Text>
                  <Text style={styles.quizFooterSub}>Uji hafalan & susun potongan ayat</Text>
                </View>
                <Ionicons name="arrow-forward" size={20} color={Colors.primary} />
              </TouchableOpacity>
            }
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.textSecondary
  },
  errorText: {
    fontSize: 15,
    color: Colors.textPrimary,
    marginVertical: 12
  },
  retryBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12
  },
  retryText: {
    color: "#FFFFFF",
    fontWeight: "800"
  },
  listContent: {
    padding: 16,
    paddingBottom: 36
  },
  headerContainer: {
    marginBottom: 16
  },
  surahBanner: {
    backgroundColor: Colors.primary,
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
    marginBottom: 16
  },
  bannerArabic: {
    fontSize: 38,
    fontWeight: "700",
    color: Colors.accent,
    marginBottom: 4
  },
  bannerEnglish: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF"
  },
  bannerSub: {
    fontSize: 12,
    color: "#E2E8F0",
    marginTop: 4,
    marginBottom: 14
  },
  completedBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6
  },
  completedBtnDone: {
    backgroundColor: Colors.secondary
  },
  completedBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800"
  },
  controlBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16
  },
  autoPlayBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.secondary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    gap: 8
  },
  autoPlayBtnActive: {
    backgroundColor: Colors.danger
  },
  autoPlayText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800"
  },
  murajaahToggle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.cardBg,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8
  },
  murajaahLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: Colors.textPrimary
  },
  bismillahBox: {
    alignItems: "center",
    paddingVertical: 12
  },
  bismillahArabic: {
    fontSize: 26,
    fontWeight: "700",
    color: Colors.primary
  },
  ayahCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border
  },
  activeAyahCard: {
    borderColor: Colors.secondary,
    backgroundColor: "#F0FDF4",
    borderLeftWidth: 5,
    borderLeftColor: Colors.secondary
  },
  ayahHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14
  },
  ayahNumberBadge: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: "#E6F4F1",
    justifyContent: "center",
    alignItems: "center"
  },
  ayahNumberText: {
    fontSize: 13,
    fontWeight: "800",
    color: Colors.primary
  },
  ayahPlayIcon: {
    padding: 2
  },
  arabicText: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.textPrimary,
    textAlign: "right",
    lineHeight: 48,
    marginBottom: 12
  },
  transliterationText: {
    fontSize: 13,
    fontStyle: "italic",
    color: Colors.primary,
    marginBottom: 6,
    fontWeight: "600"
  },
  translationText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20
  },
  murajaahHiddenCard: {
    paddingVertical: 20,
    alignItems: "center",
    gap: 8
  },
  murajaahHiddenText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontStyle: "italic"
  },
  quizFooterCard: {
    backgroundColor: "#FEF9E7",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FCD34D",
    gap: 12,
    marginTop: 12
  },
  quizFooterIconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#FEF3C7",
    justifyContent: "center",
    alignItems: "center"
  },
  quizFooterText: {
    flex: 1
  },
  quizFooterTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: Colors.textPrimary
  },
  quizFooterSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2
  }
});
