import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors, Fonts } from "../constants/theme";

interface CustomHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  showLogo?: boolean;
  rightAction?: React.ReactNode;
}

export function CustomHeader({ title, subtitle, showBack, showLogo = true, rightAction }: CustomHeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.headerContainer}>
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <View style={styles.headerContent}>
          <View style={styles.leftGroup}>
            {showBack ? (
              <TouchableOpacity
                style={styles.backButton}
                activeOpacity={0.7}
                onPress={() => router.back()}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="arrow-back" size={18} color={Colors.primary} />
              </TouchableOpacity>
            ) : showLogo ? (
              <View style={styles.logoBox}>
                <Image
                  source={require("../assets/logo.png")}
                  style={styles.logoImage}
                  resizeMode="cover"
                />
              </View>
            ) : null}

            <View style={styles.titleGroup}>
              <Text style={styles.titleText} numberOfLines={1}>
                {title}
              </Text>
              {subtitle && (
                <Text style={styles.subtitleText} numberOfLines={1}>
                  {subtitle}
                </Text>
              )}
            </View>
          </View>

          {rightAction ? (
            rightAction
          ) : (
            <TouchableOpacity
              style={styles.badgeChip}
              activeOpacity={0.7}
              onPress={() => router.push("/onboarding")}
            >
              <View style={styles.onlineDot} />
              <Text style={styles.badgeText}>Tutorial</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    elevation: 2,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6
  },
  safeArea: {
    backgroundColor: "transparent"
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14
  },
  leftGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1
  },
  logoBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center"
  },
  logoImage: {
    width: 50,
    height: 50,
    borderRadius: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center"
  },
  titleGroup: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 2,
    marginRight: 6,
  },
  titleText: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    lineHeight: 24,
    color: Colors.textPrimary,
    letterSpacing: 0.5,
    includeFontPadding: false,
  },
  subtitleText: {
    fontFamily: Fonts.medium,
    fontSize: 11,
    lineHeight: 15,
    color: Colors.textSecondary,
    marginTop: 1,
    includeFontPadding: false,
  },
  badgeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#DCFCE7"
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.secondary
  },
  badgeText: {
    fontFamily: Fonts.bold,
    fontSize: 11,
    color: Colors.secondary
  }
});
