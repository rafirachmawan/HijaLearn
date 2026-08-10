import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import hijaiyahData from "../../data/hijaiyah.json";
import { useProgress } from "../../hooks/useProgress";
import { Colors, Fonts, Shadows } from "../../constants/theme";

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
      {/* Header Banner & Search */}
      <View style={styles.headerArea}>
        {/* Banner Card */}
        <LinearGradient
          colors={["#0F766E", "#14B8A6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.heroBanner, Shadows.medium]}
        >
          <View style={styles.bannerTopRow}>
            <View style={styles.bannerTitleGroup}>
              <Text style={styles.bannerTitle}>28 Huruf Hijaiyah Dasar</Text>
              <Text style={styles.bannerSubtitle}>Bentuk huruf, harakat & audio pelafalan</Text>
            </View>
            <View style={styles.countBadge}>
              <Ionicons name="trophy" size={14} color="#0F766E" />
              <Text style={styles.countBadgeText}>{completedLetters.length} / 28</Text>
            </View>
          </View>

          {/* Progress Bar Row */}
          <View style={styles.progressRow}>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: `${percent}%` }]} />
            </View>
            <Text style={styles.progressPercentText}>{percent}%</Text>
          </View>
        </LinearGradient>

        {/* Search Bar Container */}
        <View style={[styles.searchBar, Shadows.small]}>
          <Ionicons name="search" size={20} color={Colors.primary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari huruf (misal: Alif, Ba, Ta)..."
            placeholderTextColor={Colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close-circle" size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Grid 28 Huruf */}
      <FlatList
        data={filteredLetters}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        contentContainerStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isCompleted = completedLetters.includes(item.id);
          return (
            <TouchableOpacity
              style={[
                styles.card,
                Shadows.small,
                isCompleted && styles.cardCompleted
              ]}
              activeOpacity={0.7}
              onPress={() => router.push(`/hijaiyah/${item.id}`)}
            >
              {isCompleted && (
                <View style={styles.checkBadge}>
                  <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                </View>
              )}

              <Text style={styles.arabicChar}>{item.arabic}</Text>
              <Text style={styles.letterName}>{item.name}</Text>

              {/* Harakat Preview */}
              <View style={styles.harakatPreviewRow}>
                <Text style={styles.harakatPreviewText}>{item.harakat.fathah.arabic}</Text>
                <Text style={styles.harakatPreviewText}>{item.harakat.kasrah.arabic}</Text>
                <Text style={styles.harakatPreviewText}>{item.harakat.dhommah.arabic}</Text>
              </View>
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
    backgroundColor: Colors.background
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
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  progressBarTrack: {
    flex: 1,
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
  },
  progressPercentText: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    color: "#FFFFFF",
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
    fontFamily: Fonts.medium,
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: Colors.textPrimary
  },
  gridContent: {
    padding: 10,
    paddingBottom: 140
  },
  card: {
    flex: 1,
    margin: 6,
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: Colors.border,
    minHeight: 120,
    position: "relative"
  },
  cardCompleted: {
    borderColor: Colors.secondary,
    backgroundColor: "#F0FDF4"
  },
  checkBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: Colors.secondary,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  arabicChar: {
    fontSize: 38,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 2
  },
  letterName: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    color: Colors.textPrimary,
    marginBottom: 4
  },
  harakatPreviewRow: {
    flexDirection: "row",
    gap: 4,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8
  },
  harakatPreviewText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textSecondary
  }
});
