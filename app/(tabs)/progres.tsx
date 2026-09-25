import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useProgress } from "../../hooks/useProgress";
import { Colors, Fonts } from "../../constants/theme";

export default function ProgressTabScreen() {
  const {
    completedLetters,
    completedSurahs,
    quizScores,
    getBadgesWithStatus,
    resetProgress,
  } = useProgress();

  const [isResetModalVisible, setIsResetModalVisible] = useState(false);
  const badges = getBadgesWithStatus();
  const unlockedCount = badges.filter((b) => b.unlocked).length;

  const handleConfirmReset = async () => {
    await resetProgress();
    setIsResetModalVisible(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Ringkasan — solid primary, angka putih */}
      <View style={styles.statCard}>
        <Text style={styles.statTitle}>Statistik Pencapaian Belajar</Text>
        <View style={styles.statGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>
              {completedLetters.length}/28
            </Text>
            <Text style={styles.statLabel}>Huruf Hijaiyah</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{completedSurahs.length}</Text>
            <Text style={styles.statLabel}>Surat Selesai</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>
              {unlockedCount}/{badges.length}
            </Text>
            <Text style={styles.statLabel}>Badge Terbuka</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Lencana & Prestasi</Text>

      <View style={styles.badgeGrid}>
        {badges.map((badge) => (
          <View
            key={badge.id}
            style={[
              styles.badgeCard,
              badge.unlocked && styles.badgeUnlocked,
            ]}
          >
            <View style={styles.badgeIconBox}>
              <Ionicons
                name={badge.icon as any}
                size={26}
                color={badge.unlocked ? Colors.primary : "#CBD5E1"}
              />
            </View>

            <Text
              style={[
                styles.badgeTitle,
                !badge.unlocked && styles.textLocked,
              ]}
            >
              {badge.title}
            </Text>
            <Text style={styles.badgeDesc} numberOfLines={2}>
              {badge.description}
            </Text>

            <View style={styles.badgeStatus}>
              <Ionicons
                name={badge.unlocked ? "checkmark-circle" : "lock-closed"}
                size={12}
                color={badge.unlocked ? Colors.primary : "#CBD5E1"}
              />
              <Text
                style={[
                  styles.statusText,
                  badge.unlocked
                    ? styles.statusUnlocked
                    : styles.statusLocked,
                ]}
              >
                {badge.unlocked ? "Terbuka" : "Terkunci"}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Riwayat Skor Kuis</Text>

      {quizScores.length === 0 ? (
        <View style={styles.emptyQuizBox}>
          <Ionicons
            name="sparkles-outline"
            size={22}
            color={Colors.textSecondary}
          />
          <Text style={styles.emptyQuizText}>
            Belum ada kuis yang diselesaikan. Yuk coba kuis pertama kamu!
          </Text>
        </View>
      ) : (
        <View style={styles.quizScoreList}>
          {quizScores.map((score, idx) => (
            <View key={idx} style={styles.scoreItem}>
              <View style={styles.scoreIconBox}>
                <Ionicons
                  name="trophy-outline"
                  size={18}
                  color={Colors.primary}
                />
              </View>
              <View style={styles.scoreDetails}>
                <Text style={styles.scoreQuizId} numberOfLines={1}>
                  Kuis Modul: {score.quizId}
                </Text>
                <Text style={styles.scoreText}>
                  Skor Tertinggi: {score.score} / 100
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity
        style={styles.resetButton}
        activeOpacity={0.8}
        onPress={() => setIsResetModalVisible(true)}
      >
        <Ionicons name="trash-outline" size={16} color={Colors.danger} />
        <Text style={styles.resetButtonText}>Reset Seluruh Data Belajar</Text>
      </TouchableOpacity>

      <Modal
        visible={isResetModalVisible}
        transparent
        statusBarTranslucent
        animationType="fade"
        onRequestClose={() => setIsResetModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Ionicons
              name="warning-outline"
              size={40}
              color={Colors.danger}
            />
            <Text style={styles.modalTitle}>Reset Progres?</Text>
            <Text style={styles.modalDesc}>
              Seluruh data huruf yang dipelajari, hafalan surat, skor kuis,
              dan badge akan dihapus secara permanen.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelModalBtn}
                onPress={() => setIsResetModalVisible(false)}
              >
                <Text style={styles.cancelModalText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmModalBtn}
                onPress={handleConfirmReset}
              >
                <Text style={styles.confirmModalText}>Hapus Data</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  statCard: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
  },
  statTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 14,
    textAlign: "center",
    letterSpacing: 0.2,
  },
  statGrid: {
    flexDirection: "row",
    alignItems: "center",
  },
  statBox: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontFamily: Fonts.extraBold,
    fontSize: 20,
    color: "#FFFFFF",
    fontVariant: ["tabular-nums"],
  },
  statLabel: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: "rgba(255,255,255,0.7)",
    marginTop: 4,
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: Colors.textPrimary,
    letterSpacing: -0.1,
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  badgeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 22,
  },
  badgeCard: {
    width: "48%",
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E8EEF3",
  },
  badgeUnlocked: {
    borderColor: Colors.primary,
    backgroundColor: "#F2F7F7",
  },
  badgeIconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  badgeTitle: {
    fontFamily: Fonts.bold,
    fontSize: 13.5,
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: 4,
  },
  textLocked: {
    color: Colors.textSecondary,
  },
  badgeDesc: {
    fontFamily: Fonts.regular,
    fontSize: 11.5,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 16,
    marginBottom: 10,
    minHeight: 32,
  },
  badgeStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statusText: {
    fontFamily: Fonts.semiBold,
    fontSize: 11,
  },
  statusUnlocked: {
    color: Colors.primary,
  },
  statusLocked: {
    color: "#94A3B8",
  },
  emptyQuizBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#E8EEF3",
    marginBottom: 20,
  },
  emptyQuizText: {
    fontFamily: Fonts.regular,
    fontSize: 12.5,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 18,
  },
  quizScoreList: {
    gap: 10,
    marginBottom: 20,
  },
  scoreItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E8EEF3",
  },
  scoreIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    flexShrink: 0,
  },
  scoreDetails: {
    flex: 1,
    minWidth: 0,
  },
  scoreQuizId: {
    fontFamily: Fonts.bold,
    fontSize: 13.5,
    color: Colors.textPrimary,
  },
  scoreText: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 13,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#FECACA",
    gap: 8,
    marginTop: 4,
    minHeight: 48,
  },
  resetButtonText: {
    fontFamily: Fonts.bold,
    fontSize: 13.5,
    color: Colors.danger,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    width: "100%",
  },
  modalTitle: {
    fontFamily: Fonts.bold,
    fontSize: 17,
    color: Colors.textPrimary,
    marginTop: 12,
    marginBottom: 8,
  },
  modalDesc: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 19,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  cancelModalBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    minHeight: 46,
    justifyContent: "center",
  },
  cancelModalText: {
    fontFamily: Fonts.bold,
    fontSize: 13.5,
    color: Colors.textPrimary,
  },
  confirmModalBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: Colors.danger,
    alignItems: "center",
    minHeight: 46,
    justifyContent: "center",
  },
  confirmModalText: {
    fontFamily: Fonts.bold,
    fontSize: 13.5,
    color: "#FFFFFF",
  },
});
