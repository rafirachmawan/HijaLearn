import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, Fonts, Shadows } from "../constants/theme";

const ONBOARDING_SLIDES = [
  {
    id: "1",
    image: require("../assets/onBoarding1rmv.png"),
    icon: "book" as const,
    tagline: "PEMBELAJARAN HIJAIYAH",
    title: "Kuasai 28 Huruf\nHijaiyah & Harakat",
    description:
      "Belajar Alif hingga Ya dengan audio makhraj yang jernih dan latihan harakat interaktif.",
    badgeBg: "#ECFDF5",
    badgeBorder: "#A7F3D0",
    themeColor: Colors.primary,
    gradient: ["#EFFAF8", "#DDF0EB"] as const,
    features: [
      { icon: "text-outline", label: "Alif – Ya" },
      { icon: "volume-high-outline", label: "Audio Jernih" },
      { icon: "language-outline", label: "Harakat" },
    ],
  },
  {
    id: "2",
    image: require("../assets/onBoarding2.png"),
    icon: "musical-notes" as const,
    tagline: "MUROTTAL JUZ 30",
    title: "Lantunan Merdu\nSurat-surat Pendek",
    description:
      "Hafalkan surat pendek ayat demi ayat dengan audio murottal, latin, dan terjemahan.",
    badgeBg: "#EFF6FF",
    badgeBorder: "#BFDBFE",
    themeColor: "#2563EB",
    gradient: ["#EFF6FF", "#DBEAFE"] as const,
    features: [
      { icon: "book-outline", label: "Juz 30" },
      { icon: "document-text-outline", label: "Terjemahan" },
      { icon: "play-circle-outline", label: "Per Ayat" },
    ],
  },
  {
    id: "3",
    image: require("../assets/onBoarding3.png"),
    icon: "trophy" as const,
    tagline: "KUIS & PENCAPAIAN",
    title: "Uji Hafalan,\nKumpulkan Badge",
    description:
      "5 soal singkat tiap kuis dengan bintang dan lencana untuk setiap pencapaianmu.",
    badgeBg: "#FFFBEB",
    badgeBorder: "#FDE68A",
    themeColor: "#B45309",
    gradient: ["#FFFBEB", "#FEF3C7"] as const,
    features: [
      { icon: "help-circle-outline", label: "5 Soal" },
      { icon: "star-outline", label: "Bintang" },
      { icon: "ribbon-outline", label: "Lencana" },
    ],
  },
  {
    id: "4",
    image: require("../assets/OnBoarding4.png"),
    icon: "construct" as const,
    tagline: "KUSTOMISASI APLIKASI",
    title: "Butuh Aplikasi\nSeperti Ini?",
    description:
      "Kami bantu buatkan aplikasi edukasi, sekolah, atau bisnis sesuai kebutuhan Anda.",
    badgeBg: "#F5F3FF",
    badgeBorder: "#DDD6FE",
    themeColor: "#7C3AED",
    gradient: ["#F5F3FF", "#EDE9FE"] as const,
    features: [
      { icon: "phone-portrait-outline", label: "Mobile App" },
      { icon: "globe-outline", label: "Website" },
      { icon: "chatbubble-outline", label: "Konsultasi" },
    ],
  },
];

const WA_NUMBER = "6285196221716";
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Halo, saya tertarik untuk kustomisasi aplikasi seperti HijaLearn. Boleh konsultasi?")}`;
const GAPAI_URL = "https://www.gapaidigital.my.id/";

export default function OnboardingScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);

  const responsive = useMemo(() => {
    const isCompact = height < 680;
    const isMedium = height >= 680 && height < 800;

    const cardH = isCompact
      ? Math.min(height * 0.3, 200)
      : isMedium
        ? Math.min(height * 0.33, 240)
        : Math.min(height * 0.34, 270);

    return {
      cardH,
      titleSize: isCompact ? 23 : isMedium ? 25 : 27,
      titleLineH: isCompact ? 30 : isMedium ? 32 : 34,
      descSize: 13,
      isCompact,
    };
  }, [height]);

  const handleFinishOnboarding = async () => {
    try {
      await AsyncStorage.setItem("has_completed_onboarding", "true");
      router.replace("/(tabs)");
    } catch (e) {
      console.warn("Error saving onboarding status:", e);
      router.replace("/(tabs)");
    }
  };

  const handleNext = () => {
    if (currentIndex < ONBOARDING_SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      handleFinishOnboarding();
    }
  };

  const isLast = currentIndex === ONBOARDING_SLIDES.length - 1;
  const activeSlide = ONBOARDING_SLIDES[currentIndex];

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Header: brand + step + skip */}
      <View
        style={[styles.headerRow, { paddingTop: Math.max(insets.top + 8, 20) }]}
      >
        <View style={styles.brandInline}>
          <Image
            source={require("../assets/logo.png")}
            style={styles.inlineLogo}
            resizeMode="cover"
          />
          <Text style={styles.inlineText}>HijaLearn</Text>
        </View>

        <View style={styles.headerRight}>
          <View style={styles.stepPill}>
            <Text style={styles.stepPillText}>
              {currentIndex + 1} / {ONBOARDING_SLIDES.length}
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleFinishOnboarding}
            style={styles.skipButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={styles.skipText}>Lewati</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Slides */}
      <View style={{ flex: 1 }}>
        <FlatList
          ref={flatListRef}
          data={ONBOARDING_SLIDES}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setCurrentIndex(index);
          }}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.slideItem, { width }]}>
              {/* Hero visual — bersih tanpa chip melayang */}
              <View style={[styles.heroWrapper, { height: responsive.cardH }]}>
                <LinearGradient
                  colors={item.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.heroCard}
                >
                  <Image
                    source={item.image}
                    style={styles.heroImage}
                    resizeMode="contain"
                  />
                </LinearGradient>
              </View>

              {/* Teks — scrollable agar tombol WA slide 4 tidak ketutup di layar pendek */}
              <ScrollView
                style={styles.textScroll}
                contentContainerStyle={styles.textBlock}
                showsVerticalScrollIndicator={false}
                bounces={false}
              >
                <View
                  style={[
                    styles.tagBadge,
                    {
                      backgroundColor: item.badgeBg,
                      borderColor: item.badgeBorder,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.tagDot,
                      { backgroundColor: item.themeColor },
                    ]}
                  />
                  <Text style={[styles.tagText, { color: item.themeColor }]}>
                    {item.tagline}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.slideTitle,
                    {
                      fontSize: responsive.titleSize,
                      lineHeight: responsive.titleLineH,
                    },
                  ]}
                  numberOfLines={2}
                  textBreakStrategy="balanced"
                  maxFontSizeMultiplier={1.15}
                >
                  {item.title}
                </Text>

                <Text
                  style={[
                    styles.slideDesc,
                    { fontSize: responsive.descSize },
                  ]}
                  numberOfLines={4}
                  textBreakStrategy="balanced"
                  maxFontSizeMultiplier={1.15}
                >
                  {item.description}
                </Text>

                {/* 3 keunggulan — satu baris, konsisten */}
                <View style={styles.featureRow}>
                  {item.features.map(
                    (feat: { icon: string; label: string }, idx: number) => (
                    <View key={idx} style={styles.featureItem}>
                      <View
                        style={[
                          styles.featureIconBg,
                          { backgroundColor: item.badgeBg },
                        ]}
                      >
                        <Ionicons
                          name={feat.icon as any}
                          size={16}
                          color={item.themeColor}
                        />
                      </View>
                      <Text
                        style={styles.featureLabel}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        minimumFontScale={0.8}
                      >
                        {feat.label}
                      </Text>
                    </View>
                  ))}
                </View>

                {item.id === "4" && (
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => Linking.openURL(WA_URL)}
                    style={[styles.waButton, Shadows.small]}
                  >
                    <Ionicons name="logo-whatsapp" size={18} color="#FFFFFF" />
                    <Text style={styles.waButtonText}>
                      Chat WhatsApp Gratis
                    </Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            </View>
          )}
        />
      </View>

      {/* Footer: progress + CTA */}
      <View
        style={[
          styles.footer,
          {
            paddingBottom: Math.max(
              insets.bottom + (Platform.OS === "android" ? 16 : 10),
              24,
            ),
          },
        ]}
      >
        <View style={styles.progressRow}>
          <View style={styles.dotsRow}>
            {ONBOARDING_SLIDES.map((_, idx) => (
              <View
                key={idx}
                style={[
                  styles.dot,
                  idx === currentIndex
                    ? [
                        styles.activeDot,
                        { backgroundColor: activeSlide.themeColor },
                      ]
                    : styles.inactiveDot,
                ]}
              />
            ))}
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${((currentIndex + 1) / ONBOARDING_SLIDES.length) * 100}%`,
                  backgroundColor: activeSlide.themeColor,
                },
              ]}
            />
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleNext}
          style={styles.buttonContainer}
        >
          <LinearGradient
            colors={
              isLast ? ["#25D366", "#16A34A"] : [Colors.primary, "#0B7A70"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.nextBtn, Shadows.medium]}
          >
            <Text style={styles.nextBtnText}>
              {isLast ? "Mulai Belajar" : "Lanjutkan"}
            </Text>
            <Ionicons
              name={isLast ? "checkmark-circle-outline" : "arrow-forward"}
              size={20}
              color="#FFFFFF"
            />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => Linking.openURL(GAPAI_URL)}
          style={styles.footerLink}
        >
          <Text style={styles.footerLinkText}>Dibuat oleh </Text>
          <Text style={[styles.footerLinkText, styles.footerLinkBold]}>
            Gapai Digital
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 8,
    backgroundColor: "#FFFFFF",
  },
  brandInline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  inlineLogo: {
    width: 34,
    height: 34,
    borderRadius: 10,
  },
  inlineText: {
    fontFamily: Fonts.bold,
    fontSize: 17,
    color: Colors.textPrimary,
    letterSpacing: 0.2,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepPill: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  stepPillText: {
    fontFamily: Fonts.bold,
    fontSize: 11.5,
    color: Colors.textSecondary,
    fontVariant: ["tabular-nums"],
  },
  skipButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    minHeight: 36,
    justifyContent: "center",
  },
  skipText: {
    fontFamily: Fonts.semiBold,
    fontSize: 12.5,
    color: Colors.textSecondary,
  },
  slideItem: {
    flex: 1,
    paddingHorizontal: 20,
  },
  heroWrapper: {
    width: "100%",
    marginTop: 6,
    marginBottom: 16,
  },
  heroCard: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    padding: 16,
  },
  heroImage: {
    width: "88%",
    height: "88%",
  },
  textScroll: {
    flex: 1,
    width: "100%",
  },
  textBlock: {
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
    paddingHorizontal: 12,
    paddingTop: 2,
    paddingBottom: 8,
    flexGrow: 1,
  },
  tagBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    marginBottom: 0,
  },
  tagDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  tagText: {
    fontFamily: Fonts.bold,
    fontSize: 10.5,
    letterSpacing: 1,
    includeFontPadding: false,
  },
  slideTitle: {
    fontFamily: Fonts.extraBold,
    color: Colors.textPrimary,
    textAlign: "center",
    letterSpacing: -0.4,
    paddingHorizontal: 8,
    includeFontPadding: false,
    marginTop: 0,
  },
  slideDesc: {
    fontFamily: Fonts.regular,
    lineHeight: 20,
    letterSpacing: 0.1,
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    maxWidth: 290,
    paddingHorizontal: 8,
    includeFontPadding: false,
  },
  featureRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "stretch",
    gap: 7,
    marginTop: 8,
    width: "100%",
    paddingHorizontal: 0,
  },
  featureItem: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 6,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 8,
    paddingVertical: 9,
    minHeight: 46,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#E8EEF3",
  },
  featureIconBg: {
    width: 26,
    height: 26,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  featureLabel: {
    fontFamily: Fonts.semiBold,
    fontSize: 11,
    lineHeight: 13,
    color: Colors.textPrimary,
    flex: 1,
    flexShrink: 1,
    includeFontPadding: false,
  },
  waButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#22C55E",
    paddingVertical: 11,
    paddingHorizontal: 20,
    borderRadius: 14,
    marginTop: 4,
    marginBottom: 4,
    minHeight: 46,
    width: "100%",
  },
  waButtonText: {
    fontFamily: Fonts.bold,
    fontSize: 13.5,
    color: "#FFFFFF",
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 12,
    backgroundColor: "#FFFFFF",
  },
  progressRow: {
    gap: 10,
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  activeDot: {
    width: 24,
  },
  inactiveDot: {
    width: 6,
    backgroundColor: "#E2E8F0",
  },
  progressTrack: {
    height: 4,
    backgroundColor: "#F1F5F9",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  buttonContainer: {
    width: "100%",
  },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 54,
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
  },
  nextBtnText: {
    fontFamily: Fonts.bold,
    fontSize: 15.5,
    color: "#FFFFFF",
  },
  footerLink: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 4,
  },
  footerLinkText: {
    fontFamily: Fonts.medium,
    fontSize: 11.5,
    color: Colors.textSecondary,
  },
  footerLinkBold: {
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },
});
