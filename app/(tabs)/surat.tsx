import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { fetchSurahList } from "../../services/quranApi";
import { useNetwork } from "../../hooks/useNetwork";
import { useProgress } from "../../hooks/useProgress";
import { Colors, Fonts } from "../../constants/theme";

export default function SuratTabScreen() {
  const router = useRouter();
  const { completedSurahs } = useProgress();
  const { isConnected } = useNetwork();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: surahList, isLoading, isError, refetch } = useQuery({
    queryKey: ["surahList"],
    queryFn: fetchSurahList,
  });

  const filteredSurahs = (surahList || []).filter(
    (item) =>
      item.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.includes(searchQuery) ||
      item.number.toString().includes(searchQuery)
  );

  const totalSurahs = surahList?.length || 37;
  const percent = Math.round((completedSurahs.length / totalSurahs) * 100);

  return (
    <View style={styles.container}>
      <View style={styles.headerArea}>
        <View style={styles.heroBanner}>
          <View style={styles.bannerTopRow}>
            <View style={styles.bannerTitleGroup}>
              <Text style={styles.bannerTitle}>Surat-surat Pendek</Text>
              <Text style={styles.bannerSubtitle}>
                Juz 30 • Audio Ayat & Terjemahan
              </Text>
            </View>
            <Text style={styles.countText}>
              {completedSurahs.length}/{totalSurahs}
            </Text>
          </View>

          <View style={styles.progressRow}>
            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${Math.min(percent, 100)}%` },
                ]}
              />
            </View>
            <Text style={styles.progressPercentText}>{percent}%</Text>
          </View>
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari surat (An-Nas, Al-Ikhlas, 114)..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
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

        {!isConnected && (
          <View style={styles.offlineNotice}>
            <Ionicons
              name="cloud-offline-outline"
              size={14}
              color={Colors.textSecondary}
            />
            <Text style={styles.offlineNoticeText}>
              Offline — menampilkan data tersimpan
            </Text>
          </View>
        )}
      </View>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Memuat daftar surat pendek...</Text>
        </View>
      ) : isError ? (
        <View style={styles.centerContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={44}
            color={Colors.textSecondary}
          />
          <Text style={styles.errorText}>Gagal memuat data dari server</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => refetch()}
          >
            <Text style={styles.retryText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredSurahs}
          keyExtractor={(item) => item.number.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isCompleted = completedSurahs.includes(item.number);
            const isMeccan = item.revelationType === "Meccan";

            return (
              <TouchableOpacity
                style={[
                  styles.surahCard,
                  isCompleted && styles.completedSurahCard,
                ]}
                activeOpacity={0.7}
                onPress={() => router.push(`/surat/${item.number}`)}
              >
                <View style={styles.numberChip}>
                  <Text style={styles.numberText}>{item.number}</Text>
                </View>

                <View style={styles.surahInfo}>
                  <View style={styles.titleRow}>
                    <Text style={styles.englishName} numberOfLines={1}>
                      {item.englishName}
                    </Text>
                    {isCompleted && (
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color={Colors.primary}
                      />
                    )}
                  </View>
                  <Text style={styles.metaText} numberOfLines={1}>
                    {isMeccan ? "Makkiyah" : "Madaniyah"} •{" "}
                    {item.numberOfAyahs} Ayat
                  </Text>
                </View>

                <Text style={styles.arabicSurahName}>{item.name}</Text>
              </TouchableOpacity>
            );
          }}
        />
      )}
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
    gap: 14,
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
  countText: {
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
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  progressBarTrack: {
    flex: 1,
    height: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 3,
  },
  progressPercentText: {
    fontFamily: Fonts.semiBold,
    fontSize: 12,
    color: "rgba(255,255,255,0.9)",
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
    fontFamily: Fonts.medium,
    flex: 1,
    fontSize: 13.5,
    color: Colors.textPrimary,
    includeFontPadding: false,
  },
  offlineNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  offlineNoticeText: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 10,
  },
  loadingText: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  errorText: {
    fontFamily: Fonts.semiBold,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    minHeight: 40,
    justifyContent: "center",
  },
  retryText: {
    fontFamily: Fonts.bold,
    color: "#FFFFFF",
    fontSize: 13,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 140,
    gap: 10,
  },
  surahCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E8EEF3",
    minHeight: 68,
  },
  completedSurahCard: {
    borderColor: Colors.primary,
    backgroundColor: "#F2F7F7",
  },
  numberChip: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    flexShrink: 0,
  },
  numberText: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    color: Colors.primary,
    fontVariant: ["tabular-nums"],
  },
  surahInfo: {
    flex: 1,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  englishName: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: Colors.textPrimary,
    letterSpacing: -0.1,
    flexShrink: 1,
  },
  metaText: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  arabicSurahName: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.primary,
    marginLeft: 10,
    flexShrink: 0,
  },
});
