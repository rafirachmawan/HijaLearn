import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors, Fonts } from "../../constants/theme";
import { useProgress } from "../../hooks/useProgress";
import hijaiyahData from "../../data/hijaiyah.json";

export default function HijaiyahTabScreen() {
  const router = useRouter();
  const { completedLetters } = useProgress();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLetters = hijaiyahData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.transliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.arabic.includes(searchQuery)
  );

  const percent = Math.round((completedLetters.length / 28) * 100);

  return (
    <View style={styles.container}>
      <View style={styles.headerArea}>
        {/* Ringkasan — solid primary, tanpa gradient */}
        <View style={styles.heroBanner}>
          <View style={styles.bannerTopRow}>
            <View style={styles.bannerTitleGroup}>
              <Text style={styles.bannerTitle}>28 Huruf Hijaiyah Dasar</Text>
              <Text style={styles.bannerSubtitle}>
                Bentuk huruf, harakat & audio pelafalan
              </Text>
            </View>
            <Text style={styles.countText}>
              {completedLetters.length}/28
            </Text>
          </View>

          <View style={styles.progressRow}>
            <View style={styles.progressBarTrack}>
              <View
                style={[styles.progressBarFill, { width: `${percent}%` }]}
              />
            </View>
            <Text style={styles.progressPercentText}>{percent}%</Text>
          </View>
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari huruf (Alif, Ba, Ta)..."
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
      </View>

      <FlatList
        data={filteredLetters}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isCompleted = completedLetters.includes(item.id);
          return (
            <TouchableOpacity
              style={[styles.card, isCompleted && styles.cardCompleted]}
              activeOpacity={0.7}
              onPress={() => router.push(`/hijaiyah/${item.id}`)}
            >
              {isCompleted && (
                <View style={styles.checkBadge}>
                  <Ionicons name="checkmark" size={11} color="#FFFFFF" />
                </View>
              )}

              <Text
                style={[
                  styles.arabicChar,
                  isCompleted && styles.arabicCharDone,
                ]}
              >
                {item.arabic}
              </Text>
              <Text style={styles.letterName}>{item.name}</Text>
              <Text style={styles.harakatPreview} numberOfLines={1}>
                {item.harakat.fathah.arabic} {item.harakat.kasrah.arabic}{" "}
                {item.harakat.dhommah.arabic}
              </Text>
            </TouchableOpacity>
          );
        }}
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
  gridContent: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 140,
    gap: 10,
  },
  gridRow: {
    gap: 10,
  },
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E8EEF3",
    minHeight: 112,
    position: "relative",
  },
  cardCompleted: {
    borderColor: Colors.primary,
    backgroundColor: "#F2F7F7",
  },
  checkBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: Colors.primary,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  arabicChar: {
    fontSize: 34,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 4,
    includeFontPadding: false,
  },
  arabicCharDone: {
    color: Colors.primary,
  },
  letterName: {
    fontFamily: Fonts.bold,
    fontSize: 12.5,
    color: Colors.textPrimary,
    marginBottom: 3,
  },
  harakatPreview: {
    fontSize: 13,
    fontWeight: "700",
    color: "#94A3B8",
  },
});
