import { Ionicons } from "@expo/vector-icons";
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
import { Colors, Fonts } from "../../constants/theme";
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
  ...Array.from(new Set((doaData as DoaItem[]).map((d) => d.category))),
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
    const isThisPlaying = playingDoaId === item.id && isPlaying;

    return (
      <TouchableOpacity
        style={[styles.doaCard, isThisPlaying && styles.activeDoaCard]}
        activeOpacity={0.7}
        onPress={() => router.push(`/doa/${item.id}`)}
      >
        <View style={styles.iconBox}>
          <Ionicons name={item.icon as any} size={20} color={Colors.primary} />
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.doaTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.doaLatin} numberOfLines={1}>
            {item.latin}
          </Text>
          <Text style={styles.doaCategory}>{item.category}</Text>
        </View>

        <TouchableOpacity
          style={styles.audioBtn}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={(e) => {
            e.stopPropagation();
            handlePlayDoaSound(item);
          }}
        >
          <Ionicons
            name={isThisPlaying ? "pause" : "volume-high-outline"}
            size={18}
            color={isThisPlaying ? Colors.primary : "#94A3B8"}
          />
        </TouchableOpacity>
        <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerArea}>
        <View style={styles.heroBanner}>
          <View style={styles.bannerTopRow}>
            <View style={styles.bannerTitleGroup}>
              <Text style={styles.bannerTitle}>Doa-doa Seharian</Text>
              <Text style={styles.bannerSubtitle}>
                20 Doa Harian • Audio & Terjemahan
              </Text>
            </View>
            <Text style={styles.countBadge}>20 Doa</Text>
          </View>
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari doa..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearch("")}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name="close-circle"
                size={18}
                color={Colors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.categoryScrollContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScrollContent}
        >
          {CATEGORIES.map((item) => {
            const isActive = item === activeCategory;
            const icon = CATEGORY_ICONS[item] || "apps-outline";

            return (
              <TouchableOpacity
                key={item}
                style={[styles.chip, isActive && styles.chipActive]}
                activeOpacity={0.75}
                onPress={() => setActiveCategory(item)}
              >
                <Ionicons
                  name={icon as any}
                  size={14}
                  color={isActive ? "#FFFFFF" : Colors.primary}
                />
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

      <Text style={styles.countRow}>{filteredDoa.length} doa ditemukan</Text>

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
            <Ionicons
              name="search-outline"
              size={40}
              color={Colors.inactive}
            />
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
    paddingBottom: 8,
    gap: 12,
  },
  heroBanner: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 18,
  },
  bannerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  bannerTitleGroup: {
    flex: 1,
  },
  bannerTitle: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: "#FFFFFF",
    letterSpacing: -0.1,
  },
  bannerSubtitle: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    marginTop: 3,
    lineHeight: 17,
  },
  countBadge: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    color: "#FFFFFF",
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    overflow: "hidden",
    fontVariant: ["tabular-nums"],
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
    borderWidth: 1,
    borderColor: "#E8EEF3",
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: Fonts.medium,
    fontSize: 13.5,
    color: Colors.textPrimary,
    includeFontPadding: false,
  },
  categoryScrollContainer: {
    paddingVertical: 4,
  },
  categoryScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E8EEF3",
    backgroundColor: "#FFFFFF",
    gap: 6,
    minHeight: 36,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontFamily: Fonts.semiBold,
    fontSize: 12,
    color: Colors.textPrimary,
  },
  chipTextActive: {
    color: "#FFFFFF",
  },
  countRow: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.textSecondary,
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    gap: 10,
  },
  doaCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E8EEF3",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minHeight: 68,
  },
  activeDoaCard: {
    borderColor: Colors.primary,
    backgroundColor: "#F2F7F7",
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  cardContent: {
    flex: 1,
    minWidth: 0,
  },
  doaTitle: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: 2,
    letterSpacing: -0.1,
  },
  doaLatin: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.textSecondary,
    fontStyle: "italic",
    marginBottom: 3,
  },
  doaCategory: {
    fontFamily: Fonts.semiBold,
    fontSize: 11,
    color: "#94A3B8",
  },
  audioBtn: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    gap: 8,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  emptySubText: {
    fontFamily: Fonts.regular,
    fontSize: 12.5,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 18,
  },
});
