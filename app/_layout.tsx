import React, { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ProgressProvider } from "../hooks/useProgress";
import { CustomHeader } from "../components/CustomHeader";
import { Colors } from "../constants/theme";

SplashScreen.preventAutoHideAsync().catch(() => {});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 30, // 30 mins cache
      retry: 2
    }
  }
});

export default function RootLayout() {
  const router = useRouter();

  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_400Regular: require("@expo-google-fonts/plus-jakarta-sans/400Regular/PlusJakartaSans_400Regular.ttf"),
    PlusJakartaSans_500Medium: require("@expo-google-fonts/plus-jakarta-sans/500Medium/PlusJakartaSans_500Medium.ttf"),
    PlusJakartaSans_600SemiBold: require("@expo-google-fonts/plus-jakarta-sans/600SemiBold/PlusJakartaSans_600SemiBold.ttf"),
    PlusJakartaSans_700Bold: require("@expo-google-fonts/plus-jakarta-sans/700Bold/PlusJakartaSans_700Bold.ttf"),
    PlusJakartaSans_800ExtraBold: require("@expo-google-fonts/plus-jakarta-sans/800ExtraBold/PlusJakartaSans_800ExtraBold.ttf")
  });

  useEffect(() => {
    async function checkFirstLaunch() {
      if (fontsLoaded || fontError) {
        SplashScreen.hideAsync().catch(() => {});
        try {
          const hasCompleted = await AsyncStorage.getItem("has_completed_onboarding");
          if (hasCompleted !== "true") {
            router.replace("/onboarding");
          }
        } catch (e) {
          console.warn("AsyncStorage check error:", e);
        }
      }
    }
    checkFirstLaunch();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ProgressProvider>
        <SafeAreaProvider>
          <StatusBar style="dark" backgroundColor="#FFFFFF" />
          <Stack
            screenOptions={{
              contentStyle: {
                backgroundColor: Colors.background
              }
            }}
          >
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="hijaiyah/[id]"
              options={{
                header: () => (
                  <CustomHeader
                    title="Detail Hijaiyah"
                    subtitle="Pelafalan & Harakat"
                    showBack
                  />
                )
              }}
            />
            <Stack.Screen
              name="surat/[id]"
              options={{
                header: () => (
                  <CustomHeader
                    title="Baca Surat Pendek"
                    subtitle="Ayat, Terjemahan & Audio"
                    showBack
                  />
                )
              }}
            />
            <Stack.Screen
              name="kuis/[type]/[id]"
              options={{
                header: () => (
                  <CustomHeader
                    title="Kuis Interaktif"
                    subtitle="Uji Kemampuan & Hafalan"
                    showBack
                  />
                )
              }}
            />
            <Stack.Screen
              name="doa/index"
              options={{
                header: () => (
                  <CustomHeader
                    title="Doa-doa Seharian"
                    subtitle="Kumpulan Doa Harian Islami"
                    showBack
                  />
                )
              }}
            />
            <Stack.Screen
              name="doa/[id]"
              options={{
                header: () => (
                  <CustomHeader
                    title="Detail Doa"
                    subtitle="Arab, Latin & Arti"
                    showBack
                  />
                )
              }}
            />
          </Stack>
        </SafeAreaProvider>
      </ProgressProvider>
    </QueryClientProvider>
  );
}
