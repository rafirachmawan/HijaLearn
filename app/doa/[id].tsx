import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, Fonts, Shadows } from "../../constants/theme";
import doaData from "../../data/doa.json";
import { useAudio } from "../../hooks/useAudio";
import { getDoaAudioSource } from "../../services/doaAudioMap";

type DoaItem = {
  id: number;
  title: string;
  category: string;
  icon: string;
  arabic: string;
  latin: string;
  arti: string;
  keterangan: string;
};

const CATEGORY_COLORS: Record<
  string,
  { bg: string; text: string; gradient: readonly [string, string] }
> = {
  Tidur: { bg: "#EDE9FE", text: "#7C3AED", gradient: ["#EDE9FE", "#DDD6FE"] },
  Kebersihan: {
    bg: "#E0F2FE",
    text: "#0284C7",
    gradient: ["#E0F2FE", "#BAE6FD"],
  },
  Makan: { bg: "#FEF3C7", text: "#D97706", gradient: ["#FEF3C7", "#FDE68A"] },
  Aktivitas: {
    bg: "#ECFDF5",
    text: "#059669",
    gradient: ["#ECFDF5", "#A7F3D0"],
  },
  Perjalanan: {
    bg: "#FFF7ED",
    text: "#EA580C",
    gradient: ["#FFF7ED", "#FED7AA"],
  },
  Ibadah: {
    bg: "#E6F4F1",
    text: Colors.primary,
    gradient: ["#E6F4F1", "#D1ECE6"],
  },
  Alam: { bg: "#F0FDF4", text: "#16A34A", gradient: ["#F0FDF4", "#BBF7D0"] },
  Keluarga: {
    bg: "#FCE7F3",
    text: "#DB2777",
    gradient: ["#FCE7F3", "#FBCFE8"],
  },
  Belajar: { bg: "#EFF6FF", text: "#2563EB", gradient: ["#EFF6FF", "#BFDBFE"] },
};

export default function DoaDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { playAudio, playSpeech, stopAudio, isPlaying } = useAudio();

  const doa = (doaData as DoaItem[]).find((d) => d.id === Number(id));

  if (!doa) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.danger} />
        <Text style={styles.errorText}>Doa tidak ditemukan</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const catColor = CATEGORY_COLORS[doa.category] || {
    bg: "#F1F5F9",
    text: Colors.textSecondary,
    gradient: ["#F1F5F9", "#E2E8F0"] as const,
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${doa.title}\n\n${doa.arabic}\n\n${doa.latin}\n\nArtinya: ${doa.arti}\n\n— HijaLearn App`,
      });
    } catch (e) {
      console.warn(e);
    }
  };

  const handleToggleAudio = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      const audioSource = getDoaAudioSource(doa.id);
      if (audioSource) {
        playAudio(audioSource, doa.arabic);
      } else {
        playSpeech(doa.arabic, "ar-SA");
      }
    }
  };

  // Find prev/next doa
  const currentIdx = (doaData as DoaItem[]).findIndex((d) => d.id === doa.id);
  const prevDoa = currentIdx > 0 ? doaData[currentIdx - 1] : null;
  const nextDoa =
    currentIdx < doaData.length - 1 ? doaData[currentIdx + 1] : null;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: Math.max(insets.bottom + 80, 100) },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Arabic Display Card */}
      <LinearGradient
        colors={catColor.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.arabicCard, Shadows.medium]}
      >
        <View style={styles.cardHeaderRow}>
          <View
            style={[
              styles.iconOrbSmall,
              { backgroundColor: catColor.text + "20" },
            ]}
          >
            <Ionicons name={doa.icon as any} size={22} color={catColor.text} />
          </View>
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: catColor.text + "18" },
            ]}
          >
            <Text style={[styles.categoryBadgeText, { color: catColor.text }]}>
              {doa.category}
            </Text>
          </View>
        </View>

        <Text style={styles.arabicText}>{doa.arabic}</Text>

        {/* Audio Button */}
        <TouchableOpacity
          style={[
            styles.audioBtn,
            isPlaying && styles.audioBtnActive,
            Shadows.small,
          ]}
          activeOpacity={0.85}
          onPress={handleToggleAudio}
        >
          <Ionicons
            name={isPlaying ? "pause" : "volume-high"}
            size={20}
            color="#FFFFFF"
          />
          <Text style={styles.audioBtnText}>
            {isPlaying ? "Hentikan Suara" : "Putar Audio Doa"}
          </Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Latin Transliteration */}
      <View style={[styles.sectionCard, Shadows.small]}>
        <View style={styles.sectionHeader}>
          <Ionicons name="text" size={16} color={Colors.primary} />
          <Text style={styles.sectionLabel}>Bacaan Latin</Text>
        </View>
        <Text style={styles.latinText}>{doa.latin}</Text>
      </View>

      {/* Translation */}
      <View style={[styles.sectionCard, Shadows.small]}>
        <View style={styles.sectionHeader}>
          <Ionicons name="language" size={16} color="#2563EB" />
          <Text style={[styles.sectionLabel, { color: "#2563EB" }]}>Arti</Text>
        </View>
        <Text style={styles.artiText}>"{doa.arti}"</Text>
      </View>

      {/* Context / Keterangan */}
      <View style={[styles.infoCard, Shadows.small]}>
        <Ionicons name="information-circle" size={20} color={Colors.primary} />
        <Text style={styles.infoText}>{doa.keterangan}</Text>
      </View>

      {/* Share Button */}
      <TouchableOpacity
        style={[styles.shareBtn, Shadows.small]}
        activeOpacity={0.8}
        onPress={handleShare}
      >
        <Ionicons
          name="share-social-outline"
          size={18}
          color={Colors.primary}
        />
        <Text style={styles.shareBtnText}>Bagikan Doa Ini</Text>
      </TouchableOpacity>

      {/* Navigation: Prev / Next */}
      <View style={styles.navRow}>
        {prevDoa ? (
          <TouchableOpacity
            style={[styles.navBtn, Shadows.small]}
            activeOpacity={0.75}
            onPress={() => router.replace(`/doa/${prevDoa.id}`)}
          >
            <Ionicons name="chevron-back" size={16} color={Colors.primary} />
            <Text style={styles.navBtnText} numberOfLines={1}>
              {prevDoa.title}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={{ flex: 1 }} />
        )}

        {nextDoa ? (
          <TouchableOpacity
            style={[styles.navBtn, styles.navBtnRight, Shadows.small]}
            activeOpacity={0.75}
            onPress={() => router.replace(`/doa/${nextDoa.id}`)}
          >
            <Text
              style={[styles.navBtnText, { textAlign: "right" }]}
              numberOfLines={1}
            >
              {nextDoa.title}
            </Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
          </TouchableOpacity>
        ) : (
          <View style={{ flex: 1 }} />
        )}
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
    paddingBottom: 40,
    gap: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.background,
  },
  errorText: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  backBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: Colors.primary,
    borderRadius: 20,
  },
  backBtnText: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: "#FFFFFF",
  },
  arabicCard: {
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
    gap: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.8)",
  },
  cardHeaderRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconOrbSmall: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
  },
  audioBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 4,
  },
  audioBtnActive: {
    backgroundColor: Colors.danger,
  },
  audioBtnText: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    color: "#FFFFFF",
  },
  arabicText: {
    fontSize: 28,
    lineHeight: 48,
    color: Colors.textPrimary,
    textAlign: "center",
    fontWeight: "700",
  },
  categoryBadge: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontFamily: Fonts.bold,
    fontSize: 11,
    letterSpacing: 0.5,
  },
  sectionCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  sectionLabel: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    color: Colors.primary,
    letterSpacing: 0.3,
  },
  latinText: {
    fontFamily: Fonts.medium,
    fontSize: 15,
    lineHeight: 24,
    color: Colors.textPrimary,
    fontStyle: "italic",
  },
  artiText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    lineHeight: 22,
    color: Colors.textSecondary,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "#E6F4F1",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#D1ECE6",
  },
  infoText: {
    flex: 1,
    fontFamily: Fonts.medium,
    fontSize: 13,
    lineHeight: 20,
    color: Colors.primary,
  },
  shareBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  shareBtnText: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: Colors.primary,
  },
  navRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  navBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.cardBg,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  navBtnRight: {
    justifyContent: "flex-end",
  },
  navBtnText: {
    flex: 1,
    fontFamily: Fonts.semiBold,
    fontSize: 12,
    color: Colors.textPrimary,
  },
});
