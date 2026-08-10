import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useProgress } from "../../hooks/useProgress";
import { Colors, Shadows } from "../../constants/theme";

export default function ProgressTabScreen() {
  const {
    completedLetters,
    completedSurahs,
    quizScores,
    getBadgesWithStatus,
    resetProgress
  } = useProgress();

  const [isResetModalVisible, setIsResetModalVisible] = useState(false);
  const badges = getBadgesWithStatus();
  const unlockedCount = badges.filter((b) => b.unlocked).length;

  const handleConfirmReset = async () => {
    await resetProgress();
    setIsResetModalVisible(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Overview Stat Banner */}
      <View style={[styles.statHeaderCard, Shadows.small]}>
        <Text style={styles.statTitle}>Statistik Pencapaian Belajar</Text>
        
        <View style={styles.statGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{completedLetters.length}/28</Text>
            <Text style={styles.statLabel}>Huruf Hijaiyah</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{completedSurahs.length}</Text>
            <Text style={styles.statLabel}>Surat Selesai</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{unlockedCount}/{badges.length}</Text>
            <Text style={styles.statLabel}>Badge Terbuka</Text>
          </View>
        </View>
      </View>

      {/* Grid Badges */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Lencana & Prestasi (Badges)</Text>
      </View>

      <View style={styles.badgeGrid}>
        {badges.map((badge) => (
          <View
            key={badge.id}
            style={[
              styles.badgeCard,
              Shadows.small,
              badge.unlocked ? styles.badgeUnlocked : styles.badgeLocked
            ]}
          >
            <View style={[styles.badgeIconBg, badge.unlocked ? styles.iconUnlockedBg : styles.iconLockedBg]}>
              <Ionicons
                name={badge.icon as any}
                size={30}
                color={badge.unlocked ? Colors.accent : Colors.inactive}
              />
            </View>

            <Text style={[styles.badgeTitle, !badge.unlocked && styles.textLocked]}>
              {badge.title}
            </Text>
            <Text style={styles.badgeDesc}>{badge.description}</Text>

            <View style={[styles.badgeStatusChip, badge.unlocked ? styles.chipUnlocked : styles.chipLocked]}>
              <Ionicons
                name={badge.unlocked ? "checkmark-circle" : "lock-closed"}
                size={12}
                color={badge.unlocked ? Colors.secondary : Colors.inactive}
              />
              <Text style={[styles.chipText, badge.unlocked ? styles.chipTextUnlocked : styles.chipTextLocked]}>
                {badge.unlocked ? "Terbuka" : "Terkunci"}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Riwayat Skor Kuis */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Riwayat Skor Kuis</Text>
      </View>

      {quizScores.length === 0 ? (
        <View style={styles.emptyQuizBox}>
          <Ionicons name="sparkles-outline" size={26} color={Colors.textSecondary} />
          <Text style={styles.emptyQuizText}>Belum ada kuis yang diselesaikan. Yuk coba kuis pertama kamu!</Text>
        </View>
      ) : (
        <View style={styles.quizScoreList}>
          {quizScores.map((score, idx) => (
            <View key={idx} style={[styles.scoreItem, Shadows.small]}>
              <View style={styles.scoreIcon}>
                <Ionicons name="trophy-outline" size={20} color={Colors.primary} />
              </View>
              <View style={styles.scoreDetails}>
                <Text style={styles.scoreQuizId}>Kuis Modul: {score.quizId}</Text>
                <Text style={styles.scoreText}>Skor Tertinggi: {score.score} / 100</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Action Reset */}
      <TouchableOpacity
        style={styles.resetButton}
        activeOpacity={0.8}
        onPress={() => setIsResetModalVisible(true)}
      >
        <Ionicons name="trash-outline" size={18} color={Colors.danger} />
        <Text style={styles.resetButtonText}>Reset Seluruh Data Belajar</Text>
      </TouchableOpacity>

      {/* Reset Confirmation Modal */}
      <Modal
        visible={isResetModalVisible}
        transparent
        statusBarTranslucent
        animationType="fade"
        onRequestClose={() => setIsResetModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Ionicons name="warning-outline" size={44} color={Colors.danger} />
            <Text style={styles.modalTitle}>Reset Progres?</Text>
            <Text style={styles.modalDesc}>
              Seluruh data huruf yang dipelajari, hafalan surat, skor kuis, dan badge akan dihapus secara permanen.
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
    backgroundColor: Colors.background
  },
  content: {
    padding: 16,
    paddingBottom: 140
  },
  statHeaderCard: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20
  },
  statTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 16,
    textAlign: "center"
  },
  statGrid: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  statBox: {
    flex: 1,
    alignItems: "center"
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.accent
  },
  statLabel: {
    fontSize: 11,
    color: "#E2E8F0",
    marginTop: 4,
    fontWeight: "600"
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: "rgba(255,255,255,0.2)"
  },
  sectionHeader: {
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: Colors.textPrimary
  },
  badgeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24
  },
  badgeCard: {
    width: "48%",
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: Colors.border
  },
  badgeUnlocked: {
    borderColor: Colors.accent,
    backgroundColor: "#FFFEF5"
  },
  badgeLocked: {
    opacity: 0.75
  },
  badgeIconBg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10
  },
  iconUnlockedBg: {
    backgroundColor: "#FEF3C7"
  },
  iconLockedBg: {
    backgroundColor: "#F1F5F9"
  },
  badgeTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: 4
  },
  textLocked: {
    color: Colors.textSecondary
  },
  badgeDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 16
  },
  badgeStatusChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 4
  },
  chipUnlocked: {
    backgroundColor: "#ECFDF5"
  },
  chipLocked: {
    backgroundColor: "#F1F5F9"
  },
  chipText: {
    fontSize: 11,
    fontWeight: "800"
  },
  chipTextUnlocked: {
    color: Colors.secondary
  },
  chipTextLocked: {
    color: Colors.inactive
  },
  emptyQuizBox: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20
  },
  emptyQuizText: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: "center"
  },
  quizScoreList: {
    gap: 10,
    marginBottom: 20
  },
  scoreItem: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border
  },
  scoreIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#E6F4F1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12
  },
  scoreDetails: {
    flex: 1
  },
  scoreQuizId: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.textPrimary
  },
  scoreText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FCA5A5",
    gap: 8,
    marginTop: 8
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.danger
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    width: "100%"
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginVertical: 10
  },
  modalDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 20
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    width: "100%"
  },
  cancelModalBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center"
  },
  cancelModalText: {
    fontWeight: "800",
    color: Colors.textPrimary
  },
  confirmModalBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: Colors.danger,
    alignItems: "center"
  },
  confirmModalText: {
    fontWeight: "800",
    color: "#FFFFFF"
  }
});
