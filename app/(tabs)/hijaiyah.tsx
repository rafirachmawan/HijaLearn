import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
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

  return (
    <View style={styles.container}>
      {/* Header Info & Search */}
      <View style={styles.headerArea}>
        <View style={styles.progressInfoRow}>
          <Text style={styles.headerTitle}>28 Huruf Hijaiyah Dasar</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>
              {completedLetters.length} / 28 Selesai
            </Text>
          </View>
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={Colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari huruf (misal: Alif, Ba, Ta)..."
            placeholderTextColor={Colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
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
    backgroundColor: Colors.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  },
  progressInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12
  },
  headerTitle: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: Colors.textPrimary
  },
  countBadge: {
    backgroundColor: "#E6F4F1",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12
  },
  countBadgeText: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    color: Colors.primary
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background,
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: Colors.border
  },
  searchInput: {
    fontFamily: Fonts.medium,
    flex: 1,
    marginLeft: 8,
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
