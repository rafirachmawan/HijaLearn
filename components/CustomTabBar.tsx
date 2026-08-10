import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, Fonts } from "../constants/theme";

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  // Dynamic bottom spacing: ensures tab bar is never overlapped by Android navigation bar or iOS home bar
  const bottomMargin = Math.max(insets.bottom + 6, Platform.OS === "android" ? 14 : 10);
  const backdropHeight = bottomMargin + 75;

  return (
    <View style={styles.container} pointerEvents="box-none">
      {/* Smooth Backdrop Gradient — hides scrolling content cleanly behind the floating tab bar */}
      <LinearGradient
        colors={["rgba(248, 250, 252, 0)", "rgba(248, 250, 252, 0.95)", "#F8FAFC"]}
        style={[styles.backdropGradient, { height: backdropHeight }]}
        pointerEvents="none"
      />

      {/* Floating Tab Bar Card */}
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
                canPreventDefault: true
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                onPress={onPress}
                activeOpacity={0.7}
                style={[styles.tabItem, isFocused && styles.activeTabItem]}
              >
                <Ionicons
                  name={iconName}
                  size={22}
                  color={isFocused ? Colors.primary : Colors.inactive}
                />
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={[
                    styles.tabLabel,
                    isFocused ? styles.activeTabLabel : styles.inactiveTabLabel
                  ]}
                >
                  {typeof label === "string" ? label : route.name}
                </Text>
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
    left: 10,
    right: 10,
    backgroundColor: "transparent",
  },
  tabBarCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    elevation: 12,
    shadowColor: "#0F5257",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 14
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 18,
    gap: 3
  },
  activeTabItem: {
    backgroundColor: "#E6F4F1"
  },
  tabLabel: {
    fontFamily: Fonts.medium,
    fontSize: 11,
    textAlign: "center"
  },
  activeTabLabel: {
    fontFamily: Fonts.bold,
    color: Colors.primary
  },
  inactiveTabLabel: {
    fontFamily: Fonts.medium,
    color: Colors.inactive
  }
});
