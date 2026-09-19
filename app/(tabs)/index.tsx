import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors, Fonts, Shadows } from "../../constants/theme";
import { useNetwork } from "../../hooks/useNetwork";
import { useProgress } from "../../hooks/useProgress";

export default function HomeScreen() {
  const router = useRouter();
  const { completedLetters, completedSurahs, unlockedBadges } = useProgress();
  const { isConnected } = useNetwork();

  const hijaiyahPercent = Math.round((completedLetters.length / 28) * 100);
  const surahPercent = Math.round((completedSurahs.length / 10) * 100);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Offline Alert Banner */}
      {!isConnected && (
        <View style={styles.offlineBanner}>
          <Ionicons name="wifi-outline" size={20} color="#FFFFFF" />
          <Text style={styles.offlineText}>
            Mode Offline: Modul Hijaiyah & data tersimpan tetap aktif!
          </Text>
        </View>
      )}

      {/* HERO WELCOME CARD */}
      <View style={styles.heroCard}>
        <Text style={styles.heroGreeting}>Assalamu'alaikum</Text>
        <Text style={styles.heroTitle}>
          Mari Belajar Hijaiyah & Surat Pendek
        </Text>
        <Text style={styles.heroSubtitle}>
          Media belajar interaktif tanpa login
        </Text>

        <View style={styles.heroStatsRow}>
          <View style={styles.heroStatItem}>
            <Ionicons name="trophy" size={16} color={Colors.accent} />
            <Text style={styles.heroStatText}>{unlockedBadges.length}</Text>
          </View>
          <View style={styles.heroStatItem}>
            <Ionicons name="grid" size={16} color={Colors.accent} />
            <Text style={styles.heroStatText}>{completedLetters.length}</Text>
          </View>
          <View style={styles.heroStatItem}>
            <Ionicons name="book" size={16} color={Colors.accent} />
            <Text style={styles.heroStatText}>{completedSurahs.length}</Text>
          </View>
        </View>
      </View>

      {/* PROGRESS DASHBOARD - SQUARED CARDS */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Progres Belajar</Text>
        <TouchableOpacity onPress={() => router.push("/(tabs)/progres")}>
          <Text style={styles.seeAllText}>Lihat Detail ›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        {/* Hijaiyah Card - Squared Design */}
        <TouchableOpacity
          style={styles.squaredCard}
          activeOpacity={0.8}
          onPress={() => router.push("/(tabs)/hijaiyah")}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconBadge, { backgroundColor: "#E6F4F1" }]}>
              <Ionicons name="grid" size={28} color={Colors.primary} />
            </View>
            <Text style={styles.percentText}>{hijaiyahPercent}%</Text>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Huruf Hijaiyah</Text>
            <Text style={styles.cardSubtext}>
              {completedLetters.length} / 28 Huruf
            </Text>
          </View>

          <View style={styles.progressBarOuter}>
            <View
              style={[
                styles.progressBarInner,
                { width: `${Math.min(hijaiyahPercent, 100)}%` },
              ]}
            />
          </View>
        </TouchableOpacity>

        {/* Surat Card - Squared Design */}
        <TouchableOpacity
          style={styles.squaredCard}
          activeOpacity={0.8}
          onPress={() => router.push("/(tabs)/surat")}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconBadge, { backgroundColor: "#ECFDF5" }]}>
              <Ionicons name="book" size={28} color={Colors.secondary} />
            </View>
            <Text style={[styles.percentText, { color: Colors.secondary }]}>
              {surahPercent}%
            </Text>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Surat Pendek</Text>
            <Text style={styles.cardSubtext}>
              {completedSurahs.length} / 10 Surat
            </Text>
          </View>

          <View style={styles.progressBarOuter}>
            <View
              style={[
                styles.progressBarInner,
                {
                  width: `${Math.min(surahPercent, 100)}%`,
                  backgroundColor: Colors.secondary,
                },
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
              <Text
                style={[styles.arabicLetterIcon, { color: Colors.primary }]}
              >
                أ
              </Text>
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Belajar Hijaiyah</Text>
              <Text style={styles.menuDesc}>
                28 Huruf dasar • Harakat • Audio
              </Text>
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
              <Ionicons
                name="book-outline"
                size={24}
                color={Colors.secondary}
              />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Surat-surat Pendek</Text>
              <Text style={styles.menuDesc}>
                Juz 30 • Terjemahan • Audio Ayat
              </Text>
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
              <Text style={styles.menuDesc}>
                20 Doa Harian • Arab • Latin • Arti
              </Text>
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
              <Ionicons
                name="extension-puzzle-outline"
                size={24}
                color="#D97706"
              />
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
          "Sebaik-baik kalian adalah orang yang mempelajari Al-Qur'an dan
          mengajarkannya."
        </Text>
        <Text style={styles.quoteAuthor}>— HR. Bukhari</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 140,
  },
  offlineBanner: {
    backgroundColor: Colors.danger,
    padding: 12,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 10,
  },
  offlineText: {
    fontFamily: Fonts.bold,
    color: "#FFFFFF",
    fontSize: 13,
    flex: 1,
  },
  // HERO CARD
  heroCard: {
    backgroundColor: Colors.primary,
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
  },
  heroGreeting: {
    fontFamily: Fonts.semiBold,
    color: Colors.accent,
    fontSize: 15,
    marginBottom: 8,
  },
  heroTitle: {
    fontFamily: Fonts.extraBold,
    color: "#FFFFFF",
    fontSize: 20,
    lineHeight: 28,
    marginBottom: 6,
  },
  heroSubtitle: {
    fontFamily: Fonts.regular,
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
    marginBottom: 20,
  },
  heroStatsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  heroStatItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  heroStatText: {
    fontFamily: Fonts.semiBold,
    color: "#FFFFFF",
    fontSize: 14,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: 17,
    color: Colors.textPrimary,
  },
  seeAllText: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    color: Colors.primary,
  },
  // PROGRESS DASHBOARD - SQUARED CARDS
  progressContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
  },
  squaredCard: {
    flex: 1,
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  iconBadge: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  percentText: {
    fontFamily: Fonts.extraBold,
    fontSize: 28,
    color: Colors.textPrimary,
  },
  cardContent: {
    marginBottom: 16,
  },
  cardTitle: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  cardSubtext: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  progressBarOuter: {
    height: 8,
    backgroundColor: "#E2E8F0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarInner: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },

  // MENU PEMBELAJARAN
  menuList: {
    gap: 16,
    marginBottom: 24,
  },
  menuCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  menuLeftGroup: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuIconBg: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  arabicLetterIcon: {
    fontFamily: Fonts.bold,
    fontSize: 28,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  menuDesc: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  menuArrowBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  quoteCard: {
    backgroundColor: Colors.accentLight,
    borderRadius: 20,
    padding: 18,
    alignItems: "center",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#FCD34D",
  },
  quoteIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  quoteText: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    fontStyle: "italic",
    color: Colors.textPrimary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 6,
  },
  quoteAuthor: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    color: Colors.primary,
  },
});
