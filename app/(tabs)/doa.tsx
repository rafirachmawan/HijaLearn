import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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

const CATEGORIES = [
  "Semua",
  ...Array.from(new Set(doaData.map((d: DoaItem) => d.category))),
];

const CATEGORY_ICONS: Record<string, string> = {
  Semua: "apps-outline",
  Tidur: "moon-outline",
  Kebersihan: "water-outline",
  Makan: "restaurant-outline",
  Aktivitas: "walk-outline",
  Perjalanan: "car-outline",
  Ibadah: "sparkles-outline",
  Alam: "leaf-outline",
  Keluarga: "people-outline",
  Belajar: "book-outline",
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Tidur: { bg: "#EDE9FE", text: "#7C3AED" },
  Kebersihan: { bg: "#E0F2FE", text: "#0284C7" },
  Makan: { bg: "#FEF3C7", text: "#D97706" },
  Aktivitas: { bg: "#ECFDF5", text: "#059669" },
  Perjalanan: { bg: "#FFF7ED", text: "#EA580C" },
  Ibadah: { bg: "#E6F4F1", text: Colors.primary },
  Alam: { bg: "#F0FDF4", text: "#16A34A" },
  Keluarga: { bg: "#FCE7F3", text: "#DB2777" },
  Belajar: { bg: "#EFF6FF", text: "#2563EB" },
};

export default function DoaTabScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [playingDoaId, setPlayingDoaId] = useState<number | null>(null);
  const { playAudio, playSpeech, stopAudio, isPlaying } = useAudio();

  const filteredDoa = useMemo(() => {
    return (doaData as DoaItem[]).filter((doa) => {
      const matchCategory =
        activeCategory === "Semua" || doa.category === activeCategory;
      const matchSearch =
        search.trim() === "" ||
        doa.title.toLowerCase().includes(search.toLowerCase()) ||
        doa.arti.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [search, activeCategory]);

  const handlePlayDoaSound = (doa: DoaItem) => {
    if (playingDoaId === doa.id && isPlaying) {
      stopAudio();
      setPlayingDoaId(null);
    } else {
      setPlayingDoaId(doa.id);
      const audioSource = getDoaAudioSource(doa.id);
      if (audioSource) {
        playAudio(audioSource, doa.arabic, () => {
          setPlayingDoaId(null);
        });
      } else {
        playSpeech(doa.arabic, "ar-SA", () => {
          setPlayingDoaId(null);
        });
      }
    }
  };

  const renderDoaItem = ({ item }: { item: DoaItem }) => {
    const catColor = CATEGORY_COLORS[item.category] || {
      bg: "#F1F5F9",
      text: Colors.textSecondary,
    };
    const isThisPlaying = playingDoaId === item.id && isPlaying;

    return (
      <TouchableOpacity
        style={[
          styles.doaCard,
          Shadows.small,
          isThisPlaying && styles.activeDoaCard,
        ]}
        activeOpacity={0.75}
        onPress={() => router.push(`/doa/${item.id}`)}
      >
        <View style={styles.cardRow}>
          <View style={[styles.iconCircle, { backgroundColor: catColor.bg }]}>
            <Ionicons name={item.icon as any} size={22} color={catColor.text} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.doaTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.doaLatin} numberOfLines={2}>
              {item.latin}
            </Text>
            <View
              style={[styles.categoryPill, { backgroundColor: catColor.bg }]}
            >
              <Text style={[styles.categoryPillText, { color: catColor.text }]}>
                {item.category}
              </Text>
            </View>
          </View>

          {/* Quick Sound Play Button */}
          <TouchableOpacity
            style={[
              styles.audioIconBtn,
              isThisPlaying && styles.audioIconBtnActive,
            ]}
            activeOpacity={0.7}
            onPress={(e) => {
              e.stopPropagation();
              handlePlayDoaSound(item);
            }}
          >
            <Ionicons
              name={isThisPlaying ? "pause" : "volume-high-outline"}
              size={18}
              color={isThisPlaying ? Colors.secondary : Colors.primary}
            />
          </TouchableOpacity>

          <View style={styles.arrowBtn}>
            <Ionicons name="chevron-forward" size={18} color={Colors.primary} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header Banner & Search */}
      <View style={styles.headerArea}>
        {/* Hero Banner Card */}
        <LinearGradient
          colors={["#0F766E", "#14B8A6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.heroBanner, Shadows.medium]}
        >
          <View style={styles.bannerTopRow}>
            <View style={styles.bannerTitleGroup}>
              <Text style={styles.bannerTitle}>Doa-doa Seharian</Text>
              <Text style={styles.bannerSubtitle}>20 Doa Harian • Audio & Terjemahan</Text>
            </View>
            <View style={styles.countBadge}>
              <Ionicons name="sparkles" size={14} color="#0F766E" />
              <Text style={styles.countBadgeText}>20 Doa</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Search Bar */}
        <View style={[styles.searchBar, Shadows.small]}>
          <Ionicons name="search" size={20} color={Colors.primary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari doa..."
            placeholderTextColor={Colors.textSecondary}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close-circle" size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Filter Chips - Horizontal Scroll Bar */}
      <View style={styles.categoryScrollContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScrollContent}
        >
          {CATEGORIES.map((item) => {
            const isActive = item === activeCategory;
            const icon = CATEGORY_ICONS[item] || "apps-outline";
            const catColor = CATEGORY_COLORS[item] || {
              bg: "#E6F4F1",
              text: Colors.primary,
            };

            return (
              <TouchableOpacity
                key={item}
                style={[
                  styles.chip,
                  isActive
                    ? styles.chipActive
                    : { backgroundColor: Colors.cardBg, borderColor: Colors.border },
                ]}
                activeOpacity={0.75}
                onPress={() => setActiveCategory(item)}
              >
                <View
                  style={[
                    styles.chipIconBg,
                    isActive
                      ? { backgroundColor: "rgba(255,255,255,0.25)" }
                      : { backgroundColor: catColor.bg },
                  ]}
                >
                  <Ionicons
                    name={icon as any}
                    size={14}
                    color={isActive ? "#FFFFFF" : catColor.text}
                  />
                </View>
                <Text
                  style={[styles.chipText, isActive && styles.chipTextActive]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Doa Count */}
      <View style={styles.countRow}>
        <Text style={styles.countText}>{filteredDoa.length} doa ditemukan</Text>
      </View>

      {/* Doa List */}
      <FlatList
        data={filteredDoa}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderDoaItem}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: Math.max(insets.bottom + 110, 140) },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color={Colors.inactive} />
            <Text style={styles.emptyText}>Doa tidak ditemukan</Text>
            <Text style={styles.emptySubText}>
              Coba kata kunci lain atau ubah filter kategori
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerArea: {
    padding: 16,
    gap: 12,
    backgroundColor: Colors.background,
  },
  heroBanner: {
    borderRadius: 20,
    padding: 16,
    gap: 14,
  },
  bannerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  bannerTitleGroup: {
    flex: 1,
    marginRight: 8,
  },
  bannerTitle: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: "#FFFFFF",
  },
  bannerSubtitle: {
    fontFamily: Fonts.medium,
    fontSize: 11,
    color: "#CCFBF1",
    marginTop: 2,
  },
  countBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  countBadgeText: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    color: "#0F766E",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  searchInput: {
    flex: 1,
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: Colors.textPrimary,
    marginLeft: 10,
  },
  categoryScrollContainer: {
    marginVertical: 4,
  },
  categoryScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: "center",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  chipIconBg: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
  },
  chipText: {
    fontFamily: Fonts.semiBold,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  chipTextActive: {
    fontFamily: Fonts.bold,
    color: "#FFFFFF",
  },
  countRow: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 6,
  },
  countText: {
    fontFamily: Fonts.medium,
    fontSize: 11.5,
    color: Colors.textSecondary,
  },
  listContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  doaCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activeDoaCard: {
    borderColor: Colors.secondary,
    backgroundColor: "#F0FDF4",
  },
  audioIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#E6F4F1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },
  audioIconBtnActive: {
    backgroundColor: "#DCFCE7",
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  cardContent: {
    flex: 1,
  },
  doaTitle: {
    fontFamily: Fonts.bold,
    fontSize: 13.5,
    color: Colors.textPrimary,
    marginBottom: 1,
  },
  doaLatin: {
    fontFamily: Fonts.regular,
    fontSize: 11.5,
    lineHeight: 16,
    color: Colors.textSecondary,
    fontStyle: "italic",
    marginBottom: 4,
  },
  categoryPill: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  categoryPillText: {
    fontFamily: Fonts.semiBold,
    fontSize: 9.5,
  },
  arrowBtn: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: "#E6F4F1",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 6,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    gap: 8,
  },
  emptyText: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  emptySubText: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});
