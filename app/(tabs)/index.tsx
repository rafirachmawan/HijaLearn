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
import { Colors, Fonts } from "../../constants/theme";
import { useNetwork } from "../../hooks/useNetwork";
import { useProgress } from "../../hooks/useProgress";

const MENU = [
  {
    id: "hijaiyah",
    title: "Belajar Hijaiyah",
    desc: "28 Huruf dasar • Harakat • Audio",
    icon: "grid-outline" as const,
    arabic: "أ",
    route: "/(tabs)/hijaiyah" as const,
    count: "28",
  },
  {
    id: "surat",
    title: "Surat-surat Pendek",
    desc: "Juz 30 • Terjemahan • Audio Ayat",
    icon: "book-outline" as const,
    route: "/(tabs)/surat" as const,
    count: "37",
  },
  {
    id: "doa",
    title: "Doa-doa Seharian",
    desc: "20 Doa Harian • Arab • Latin • Arti",
    icon: "heart-outline" as const,
    route: "/doa" as const,
    count: "20",
  },
  {
    id: "kuis",
    title: "Kuis Interaktif",
    desc: "Uji Hafalan • Bintang • Badge",
    icon: "extension-puzzle-outline" as const,
    route: "/kuis/hijaiyah/1" as const,
    count: "",
  },
] as const;

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
      {!isConnected && (
        <View style={styles.offlineBanner}>
          <Ionicons name="cloud-offline-outline" size={16} color="#FFFFFF" />
          <Text style={styles.offlineText}>
            Offline — materi tersimpan tetap bisa dibuka
          </Text>
        </View>
      )}

      {/* Hero — satu aksen, tanpa pill statistik ganda */}
      <View style={styles.heroCard}>
        <Text style={styles.heroGreeting}>Assalamu&apos;alaikum</Text>
        <Text style={styles.heroTitle}>
          Mari Belajar Hijaiyah & Surat Pendek
        </Text>
        <Text style={styles.heroSubtitle}>
          Tanpa login • {completedLetters.length}/28 huruf •{" "}
          {completedSurahs.length}/10 surat • {unlockedBadges.length} badge
        </Text>

        <TouchableOpacity
          style={styles.heroCta}
          activeOpacity={0.85}
          onPress={() => router.push("/(tabs)/hijaiyah")}
        >
          <Text style={styles.heroCtaText}>Lanjutkan Belajar</Text>
          <Ionicons name="arrow-forward" size={16} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Progres */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Progres Belajar</Text>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/progres")}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.seeAllText}>Lihat Detail</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <TouchableOpacity
          style={styles.progressCard}
          activeOpacity={0.8}
          onPress={() => router.push("/(tabs)/hijaiyah")}
        >
          <View style={styles.progressTop}>
            <View style={styles.iconBox}>
              <Ionicons name="grid-outline" size={22} color={Colors.primary} />
            </View>
            <Text style={styles.percentText}>{hijaiyahPercent}%</Text>
          </View>
          <Text style={styles.cardTitle}>Huruf Hijaiyah</Text>
          <Text style={styles.cardSubtext}>
            {completedLetters.length} / 28 Huruf
          </Text>
          <View style={styles.progressBarOuter}>
            <View
              style={[
                styles.progressBarInner,
                { width: `${Math.min(hijaiyahPercent, 100)}%` },
              ]}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.progressCard}
          activeOpacity={0.8}
          onPress={() => router.push("/(tabs)/surat")}
        >
          <View style={styles.progressTop}>
            <View style={styles.iconBox}>
              <Ionicons name="book-outline" size={22} color={Colors.primary} />
            </View>
            <Text style={styles.percentText}>{surahPercent}%</Text>
          </View>
          <Text style={styles.cardTitle}>Surat Pendek</Text>
          <Text style={styles.cardSubtext}>
            {completedSurahs.length} / 10 Surat
          </Text>
          <View style={styles.progressBarOuter}>
            <View
              style={[
                styles.progressBarInner,
                { width: `${Math.min(surahPercent, 100)}%` },
              ]}
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* Menu — satu grup list, ikon monokrom */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Menu Pembelajaran</Text>
      </View>

      <View style={styles.menuGroup}>
        {MENU.map((m, idx) => (
          <TouchableOpacity
            key={m.id}
            style={[
              styles.menuRow,
              idx < MENU.length - 1 && styles.menuRowBorder,
            ]}
            activeOpacity={0.7}
            onPress={() => router.push(m.route as any)}
          >
            <View style={styles.menuIconBox}>
              {m.id === "hijaiyah" ? (
                <Text style={styles.arabicIcon}>أ</Text>
              ) : (
                <Ionicons name={m.icon} size={20} color={Colors.primary} />
              )}
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>{m.title}</Text>
              <Text style={styles.menuDesc} numberOfLines={1}>
                {m.desc}
              </Text>
            </View>
            {m.count ? (
              <Text style={styles.menuCount}>{m.count}</Text>
            ) : null}
            <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Quote — editorial, tanpa kartu kuning */}
      <View style={styles.quoteBlock}>
        <Text style={styles.quoteText}>
          “Sebaik-baik kalian adalah orang yang mempelajari Al-Qur&apos;an dan
          mengajarkannya.”
        </Text>
        <Text style={styles.quoteAuthor}>HR. Bukhari</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    padding: 16,
    paddingBottom: 140,
    backgroundColor: Colors.background,
  },
  offlineBanner: {
    backgroundColor: "#334155",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  offlineText: {
    fontFamily: Fonts.semiBold,
    color: "#FFFFFF",
    fontSize: 12,
    flex: 1,
  },
  heroCard: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  heroGreeting: {
    fontFamily: Fonts.semiBold,
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  heroTitle: {
    fontFamily: Fonts.extraBold,
    color: "#FFFFFF",
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontFamily: Fonts.regular,
    color: "rgba(255,255,255,0.75)",
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 16,
  },
  heroCta: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    minHeight: 40,
  },
  heroCtaText: {
    fontFamily: Fonts.bold,
    color: Colors.primary,
    fontSize: 13.5,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: Colors.textPrimary,
    letterSpacing: -0.1,
  },
  seeAllText: {
    fontFamily: Fonts.semiBold,
    fontSize: 12.5,
    color: Colors.primary,
  },
  progressContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 22,
  },
  progressCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E8EEF3",
  },
  progressTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  percentText: {
    fontFamily: Fonts.extraBold,
    fontSize: 22,
    color: Colors.primary,
    fontVariant: ["tabular-nums"],
  },
  cardTitle: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  cardSubtext: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  progressBarOuter: {
    height: 6,
    backgroundColor: "#F1F5F9",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarInner: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  menuGroup: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E8EEF3",
    marginBottom: 8,
    overflow: "hidden",
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 12,
    minHeight: 64,
  },
  menuRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  menuIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  arabicIcon: {
    fontFamily: Fonts.bold,
    fontSize: 22,
    color: Colors.primary,
    includeFontPadding: false,
  },
  menuContent: {
    flex: 1,
    minWidth: 0,
  },
  menuTitle: {
    fontFamily: Fonts.bold,
    fontSize: 14.5,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  menuDesc: {
    fontFamily: Fonts.regular,
    fontSize: 12.5,
    color: Colors.textSecondary,
  },
  menuCount: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    color: "#94A3B8",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: "hidden",
  },
  quoteBlock: {
    marginTop: 8,
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: "#EDF2F7",
    alignItems: "center",
  },
  quoteText: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    fontStyle: "italic",
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 6,
  },
  quoteAuthor: {
    fontFamily: Fonts.bold,
    fontSize: 11.5,
    color: Colors.primary,
    letterSpacing: 0.4,
  },
});
