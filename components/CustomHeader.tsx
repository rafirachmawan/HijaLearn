import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Fonts } from "../constants/theme";

interface CustomHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  showLogo?: boolean;
  rightAction?: React.ReactNode;
}

export function CustomHeader({
  title,
  subtitle,
  showBack,
  showLogo = true,
  rightAction,
}: CustomHeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.headerContainer}>
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <View style={styles.headerContent}>
          {/* Left Section - Logo & Title */}
          <View style={styles.leftSection}>
            {showBack ? (
              <TouchableOpacity
                style={styles.backButton}
                activeOpacity={0.7}
                onPress={() => router.back()}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name="arrow-back"
                  size={20}
                  color={Colors.textPrimary}
                />
              </TouchableOpacity>
            ) : showLogo ? (
              <View style={styles.logoSection}>
                <Image
                  source={require("../assets/logo.png")}
                  style={styles.logoImage}
                  resizeMode="cover"
                />
              </View>
            ) : null}

            <View style={styles.titleSection}>
              <Text style={styles.titleText}>{title}</Text>
              {subtitle && <Text style={styles.subtitleText}>{subtitle}</Text>}
            </View>
          </View>

          {/* Right Section - Action Button */}
          {rightAction ? (
            rightAction
          ) : (
            <TouchableOpacity
              style={styles.actionButton}
              activeOpacity={0.7}
              onPress={() => router.push("/onboarding")}
            >
              <Ionicons
                name="information-circle"
                size={18}
                color={Colors.primary}
              />
              <Text style={styles.actionButtonText}>Tutorial</Text>
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
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  safeArea: {
    backgroundColor: "transparent",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flex: 1,
  },
  logoSection: {
    width: 38,
    height: 38,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },
  logoImage: {
    width: 46,
    height: 46,
    borderRadius: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  titleSection: {
    flex: 1,
    justifyContent: "center",
    paddingRight: 4,
  },
  titleText: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: Colors.textPrimary,
    letterSpacing: 0.3,
    includeFontPadding: false,
  },
  subtitleText: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
    includeFontPadding: false,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#E6F4F1",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 24,
  },
  actionButtonText: {
    fontFamily: Fonts.semiBold,
    fontSize: 12,
    color: Colors.primary,
  },
});
