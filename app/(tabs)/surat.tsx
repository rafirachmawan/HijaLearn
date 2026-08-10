import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator
} from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { fetchSurahList, Surah } from "../../services/quranApi";
import { useProgress } from "../../hooks/useProgress";
import { useNetwork } from "../../hooks/useNetwork";
import { Colors, Fonts, Shadows } from "../../constants/theme";

export default function SuratTabScreen() {
  const router = useRouter();
  const { completedSurahs } = useProgress();
  const { isConnected } = useNetwork();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: surahList, isLoading, isError, refetch } = useQuery({
    queryKey: ["surahList"],
    queryFn: fetchSurahList
  });

  const filteredSurahs = (surahList || []).filter(
    (item) =>
      item.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.includes(searchQuery) ||
      item.number.toString().includes(searchQuery)
  );

  return (
    <View style={styles.container}>
      {/* Search & Header */}
      <View style={styles.headerArea}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={Colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari surat (An-Nas, Al-Ikhlas, 114)..."
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

        {!isConnected && (
          <View style={styles.offlineNotice}>
            <Ionicons name="cloud-offline" size={14} color="#D97706" />
            <Text style={styles.offlineNoticeText}>Mode Offline (Menampilkan data tersimpan)</Text>
          </View>
        )}
      </View>

      {/* Body List */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Memuat daftar surat pendek...</Text>
        </View>
      ) : isError ? (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={Colors.danger} />
          <Text style={styles.errorText}>Gagal memuat data dari server</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
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
                  Shadows.small,
                  isCompleted && styles.completedSurahCard
                ]}
                activeOpacity={0.7}
                onPress={() => router.push(`/surat/${item.number}`)}
              >
                {/* Number Chip */}
                <View style={styles.numberChip}>
                  <Text style={styles.numberText}>{item.number}</Text>
                </View>

                {/* Info Text */}
                <View style={styles.surahInfo}>
                  <View style={styles.titleRow}>
                    <Text style={styles.englishName}>{item.englishName}</Text>
                    {isCompleted && (
                      <View style={styles.doneBadge}>
                        <Ionicons name="checkmark-circle" size={14} color={Colors.secondary} />
                        <Text style={styles.doneBadgeText}>Selesai</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.metaRow}>
                    <View style={[styles.typePill, { backgroundColor: isMeccan ? "#FEF3C7" : "#ECFDF5" }]}>
                      <Text style={[styles.typePillText, { color: isMeccan ? "#D97706" : Colors.secondary }]}>
                        {isMeccan ? "Makkiyah" : "Madaniyah"}
                      </Text>
                    </View>
                    <Text style={styles.metaText}>• {item.numberOfAyahs} Ayat</Text>
                  </View>
                </View>

                {/* Arabic Name */}
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
    backgroundColor: Colors.background
  },
  headerArea: {
    padding: 16,
    backgroundColor: Colors.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
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
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: Colors.textPrimary
  },
  offlineNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8
  },
  offlineNoticeText: {
    fontSize: 12,
    color: "#D97706",
    fontWeight: "700"
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.textSecondary
  },
  errorText: {
    fontSize: 15,
    color: Colors.textPrimary,
    marginVertical: 12
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12
  },
  retryText: {
    color: "#FFFFFF",
    fontWeight: "800"
  },
  listContent: {
    padding: 16,
    paddingBottom: 140
  },
  surahCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border
  },
  completedSurahCard: {
    borderColor: Colors.secondary,
    backgroundColor: "#F0FDF4"
  },
  numberChip: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#E6F4F1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14
  },
  numberText: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: Colors.primary
  },
  surahInfo: {
    flex: 1
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  englishName: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: Colors.textPrimary
  },
  doneBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8
  },
  doneBadgeText: {
    fontFamily: Fonts.bold,
    fontSize: 11,
    color: Colors.secondary
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4
  },
  typePill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6
  },
  typePillText: {
    fontFamily: Fonts.bold,
    fontSize: 10
  },
  metaText: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: Colors.textSecondary
  },
  arabicSurahName: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.primary,
    marginLeft: 8
  }
});
