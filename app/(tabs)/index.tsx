import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useProgress } from "../../hooks/useProgress";
import { useNetwork } from "../../hooks/useNetwork";
import { Colors, Fonts, Shadows } from "../../constants/theme";

export default function HomeScreen() {
  const router = useRouter();
  const { completedLetters, completedSurahs, unlockedBadges } = useProgress();
  const { isConnected } = useNetwork();

  const hijaiyahPercent = Math.round((completedLetters.length / 28) * 100);
  const surahPercent = Math.round((completedSurahs.length / 10) * 100);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Offline Alert Banner */}
      {!isConnected && (
        <View style={styles.offlineBanner}>
          <Ionicons name="wifi-outline" size={20} color="#FFFFFF" />
          <Text style={styles.offlineText}>
            Mode Offline: Modul Hijaiyah & data tersimpan tetap aktif!
          </Text>
        </View>
      )}

      {/* Hero Welcome Card */}
      <View style={[styles.heroCard, Shadows.small]}>
        <View style={styles.heroGreetingPill}>
          <Text style={styles.heroGreetingText}>Assalamu'alaikum 👋</Text>
        </View>
        <Text style={styles.heroTitle}>Mari Belajar Hijaiyah & Surat Pendek</Text>
        <Text style={styles.heroSubtitle}>
          Media belajar agama interaktif, mandiri, dan bebas digunakan tanpa login.
        </Text>

        <View style={styles.heroStatsRow}>
          <View style={styles.heroStatItem}>
            <Ionicons name="trophy" size={15} color={Colors.accent} />
            <Text style={styles.heroStatText}>{unlockedBadges.length} Badge</Text>
          </View>
          <View style={styles.heroStatItem}>
            <Ionicons name="grid" size={15} color={Colors.accent} />
            <Text style={styles.heroStatText}>{completedLetters.length} Huruf</Text>
          </View>
          <View style={styles.heroStatItem}>
            <Ionicons name="book" size={15} color={Colors.accent} />
            <Text style={styles.heroStatText}>{completedSurahs.length} Surat</Text>
          </View>
        </View>
      </View>

      {/* Section: Ringkasan Belajar */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Ringkasan Progres</Text>
        <TouchableOpacity onPress={() => router.push("/(tabs)/progres")}>
          <Text style={styles.seeAllText}>Lihat Detail ›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.progressRow}>
        {/* Hijaiyah Card */}
        <TouchableOpacity
          style={[styles.progressCard, Shadows.small]}
          activeOpacity={0.8}
          onPress={() => router.push("/(tabs)/hijaiyah")}
        >
          <View style={styles.progressCardTop}>
            <View style={[styles.progressIconBg, { backgroundColor: "#E6F4F1" }]}>
              <Ionicons name="grid" size={20} color={Colors.primary} />
            </View>
            <View style={styles.percentBadge}>
              <Text style={styles.percentBadgeText}>{hijaiyahPercent}%</Text>
            </View>
          </View>
          <Text style={styles.progressCardTitle}>Huruf Hijaiyah</Text>
          <Text style={styles.progressCardSub}>{completedLetters.length} dari 28 Huruf</Text>

          <View style={styles.trackBar}>
            <View style={[styles.fillBar, { width: `${Math.min(hijaiyahPercent, 100)}%` }]} />
          </View>
        </TouchableOpacity>

        {/* Surat Card */}
        <TouchableOpacity
          style={[styles.progressCard, Shadows.small]}
          activeOpacity={0.8}
          onPress={() => router.push("/(tabs)/surat")}
        >
          <View style={styles.progressCardTop}>
            <View style={[styles.progressIconBg, { backgroundColor: "#ECFDF5" }]}>
              <Ionicons name="book" size={20} color={Colors.secondary} />
            </View>
            <View style={[styles.percentBadge, { backgroundColor: "#ECFDF5" }]}>
              <Text style={[styles.percentBadgeText, { color: Colors.secondary }]}>{surahPercent}%</Text>
            </View>
          </View>
          <Text style={styles.progressCardTitle}>Surat Pendek</Text>
          <Text style={styles.progressCardSub}>{completedSurahs.length} Surat Selesai</Text>

          <View style={styles.trackBar}>
            <View
              style={[
                styles.fillBar,
                { width: `${Math.min(surahPercent, 100)}%`, backgroundColor: Colors.secondary }
              ]}
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* Section: Menu Pembelajaran */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Menu Pembelajaran</Text>
      </View>

      <View style={styles.menuList}>
        {/* Menu 1: Hijaiyah */}
        <TouchableOpacity
          style={[styles.menuCard, Shadows.small]}
          activeOpacity={0.75}
          onPress={() => router.push("/(tabs)/hijaiyah")}
        >
          <View style={styles.menuLeftGroup}>
            <View style={[styles.menuIconBg, { backgroundColor: "#E6F4F1" }]}>
              <Text style={[styles.arabicLetterIcon, { color: Colors.primary }]}>أ</Text>
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Belajar Hijaiyah</Text>
              <Text style={styles.menuDesc}>28 Huruf dasar • Harakat • Audio</Text>
            </View>
          </View>
          <View style={styles.menuArrowBtn}>
            <Ionicons name="chevron-forward" size={18} color={Colors.primary} />
          </View>
        </TouchableOpacity>

        {/* Menu 2: Surat Pendek */}
        <TouchableOpacity
          style={[styles.menuCard, Shadows.small]}
          activeOpacity={0.75}
          onPress={() => router.push("/(tabs)/surat")}
        >
          <View style={styles.menuLeftGroup}>
            <View style={[styles.menuIconBg, { backgroundColor: "#ECFDF5" }]}>
              <Ionicons name="book-outline" size={24} color={Colors.secondary} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Surat-surat Pendek</Text>
              <Text style={styles.menuDesc}>Juz 30 • Terjemahan • Audio Ayat</Text>
            </View>
          </View>
          <View style={styles.menuArrowBtn}>
            <Ionicons name="chevron-forward" size={18} color={Colors.primary} />
          </View>
        </TouchableOpacity>

        {/* Menu 3: Doa Seharian */}
        <TouchableOpacity
          style={[styles.menuCard, Shadows.small]}
          activeOpacity={0.75}
          onPress={() => router.push("/doa")}
        >
          <View style={styles.menuLeftGroup}>
            <View style={[styles.menuIconBg, { backgroundColor: "#FCE7F3" }]}>
              <Ionicons name="heart-outline" size={24} color="#DB2777" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Doa-doa Seharian</Text>
              <Text style={styles.menuDesc}>20 Doa Harian • Arab • Latin • Arti</Text>
            </View>
          </View>
          <View style={styles.menuArrowBtn}>
            <Ionicons name="chevron-forward" size={18} color={Colors.primary} />
          </View>
        </TouchableOpacity>

        {/* Menu 4: Kuis */}
        <TouchableOpacity
          style={[styles.menuCard, Shadows.small]}
          activeOpacity={0.75}
          onPress={() => router.push("/kuis/hijaiyah/1")}
        >
          <View style={styles.menuLeftGroup}>
            <View style={[styles.menuIconBg, { backgroundColor: "#FEF3C7" }]}>
              <Ionicons name="extension-puzzle-outline" size={24} color="#D97706" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Kuis & Game Interaktif</Text>
              <Text style={styles.menuDesc}>Uji Hafalan • Bintang • Badge</Text>
            </View>
          </View>
          <View style={styles.menuArrowBtn}>
            <Ionicons name="chevron-forward" size={18} color={Colors.primary} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Quote Banner */}
      <View style={styles.quoteCard}>
        <View style={styles.quoteIconBg}>
          <Ionicons name="sparkles" size={20} color={Colors.primary} />
        </View>
        <Text style={styles.quoteText}>
          "Sebaik-baik kalian adalah orang yang mempelajari Al-Qur'an dan mengajarkannya."
        </Text>
        <Text style={styles.quoteAuthor}>— HR. Bukhari</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  content: {
    padding: 16,
    paddingBottom: 140
  },
  offlineBanner: {
    backgroundColor: Colors.danger,
    padding: 12,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 10
  },
  offlineText: {
    fontFamily: Fonts.bold,
    color: "#FFFFFF",
    fontSize: 13,
    flex: 1
  },
  heroCard: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20
  },
  heroGreetingPill: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 10
  },
  heroGreetingText: {
    fontFamily: Fonts.bold,
    color: Colors.accent,
    fontSize: 12
  },
  heroTitle: {
    fontFamily: Fonts.bold,
    color: "#FFFFFF",
    fontSize: 19,
    lineHeight: 26,
    marginBottom: 6
  },
  heroSubtitle: {
    fontFamily: Fonts.medium,
    color: "rgba(255, 255, 255, 0.75)",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16
  },
  heroStatsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  heroStatItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 5
  },
  heroStatText: {
    fontFamily: Fonts.semiBold,
    color: "#FFFFFF",
    fontSize: 12
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12
  },
  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: 17,
    color: Colors.textPrimary
  },
  seeAllText: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    color: Colors.primary
  },
  progressRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24
  },
  progressCard: {
    flex: 1,
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border
  },
  progressCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12
  },
  progressIconBg: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center"
  },
  percentBadge: {
    backgroundColor: "#E6F4F1",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10
  },
  percentBadgeText: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    color: Colors.primary
  },
  progressCardTitle: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: Colors.textPrimary
  },
  progressCardSub: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
    marginBottom: 10
  },
  trackBar: {
    height: 8,
    backgroundColor: "#F1F5F9",
    borderRadius: 4,
    overflow: "hidden"
  },
  fillBar: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 4
  },
  menuList: {
    gap: 12,
    marginBottom: 8
  },
  menuCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: Colors.border
  },
  menuLeftGroup: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1
  },
  menuIconBg: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14
  },
  arabicLetterIcon: {
    fontFamily: Fonts.bold,
    fontSize: 24
  },
  menuContent: {
    flex: 1
  },
  menuTitle: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: Colors.textPrimary,
    marginBottom: 2
  },
  menuDesc: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16
  },
  menuArrowBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#E6F4F1",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10
  },
  quoteCard: {
    backgroundColor: Colors.accentLight,
    borderRadius: 20,
    padding: 18,
    alignItems: "center",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#FCD34D"
  },
  quoteIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8
  },
  quoteText: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    fontStyle: "italic",
    color: Colors.textPrimary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 6
  },
  quoteAuthor: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    color: Colors.primary
  }
});
