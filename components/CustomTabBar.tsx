import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../constants/theme";

export function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  // Dynamic bottom spacing: ensures tab bar is never overlapped by Android navigation bar or iOS home bar
  const bottomMargin = Math.max(
    insets.bottom + 6,
    Platform.OS === "android" ? 14 : 10,
  );
  const backdropHeight = bottomMargin + 75;

  return (
    <View style={styles.container} pointerEvents="box-none">
      {/* Minimal backdrop blur effect */}
      <LinearGradient
        colors={[
          "rgba(248, 250, 252, 0)",
          "rgba(248, 250, 252, 0.98)",
          "#FFFFFF",
        ]}
        style={[styles.backdropGradient, { height: backdropHeight }]}
        pointerEvents="none"
      />

      {/* Floating Tab Bar - Clean & Modern */}
      <View style={[styles.floatingWrapper, { bottom: bottomMargin }]}>
        <View style={styles.tabBarCard}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                  ? options.title
                  : route.name;

            const isFocused = state.index === index;

            let iconName: keyof typeof Ionicons.glyphMap = "home";
            if (route.name === "index") {
              iconName = isFocused ? "home" : "home-outline";
            } else if (route.name === "hijaiyah") {
              iconName = isFocused ? "grid" : "grid-outline";
            } else if (route.name === "surat") {
              iconName = isFocused ? "book" : "book-outline";
            } else if (route.name === "doa") {
              iconName = isFocused ? "heart" : "heart-outline";
            } else if (route.name === "progres") {
              iconName = isFocused ? "trophy" : "trophy-outline";
            }

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            // Animated indicator line for active tab
            const isActiveAnimation = isFocused ? styles.activeLine : null;

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                onPress={onPress}
                activeOpacity={0.7}
                style={styles.tabItem}
              >
                <Ionicons
                  name={iconName}
                  size={26}
                  color={isFocused ? Colors.primary : Colors.textSecondary}
                  style={styles.iconContainer}
                />
                {/* Active indicator line */}
                {isFocused && <View style={isActiveAnimation} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  backdropGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  floatingWrapper: {
    position: "absolute",
    left: 12,
    right: 12,
    backgroundColor: "transparent",
  },
  tabBarCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "space-around",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    gap: 4,
  },
  iconContainer: {
    marginBottom: -2,
  },
  activeLine: {
    width: 32,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.primary,
    marginTop: 4,
  },
});
