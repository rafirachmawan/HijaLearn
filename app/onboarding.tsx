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
    icon: "book",
    tagline: "PEMBELAJARAN HIJAIYAH",
    title: "Kuasai 28 Huruf\nHijaiyah & Harakat",
    description:
      "Pelajari huruf dasar dari Alif hingga Ya lengkap dengan audio pelafalan Fathah, Kasrah, dan Dhommah yang jernih.",
    badgeBg: "#ECFDF5",
    badgeBorder: "#A7F3D0",
    themeColor: Colors.primary,
    gradient: ["#E6F4F1", "#D1ECE6"] as const,
    glowColor: "#CCECE6",
    chip1: "✨ 28 Huruf Dasar",
    chip2: "🔊 Audio Makhraj",
    features: [
      { icon: "text-outline", label: "Alif - Ya" },
      { icon: "musical-note-outline", label: "Audio Jernih" },
      { icon: "hand-left-outline", label: "Harakat" },
    ],
  },
  {
    id: "2",
    image: require("../assets/onBoarding2.png"),
    icon: "musical-notes",
    tagline: "MUROTTAL JUZ 30",
    title: "Lantunan Merdu\nSurat-surat Pendek",
    description:
      "Dengarkan audio murottal ayat demi ayat untuk mempermudah hafalan Al-Qur'an anak dan keluarga secara mandiri.",
    badgeBg: "#EFF6FF",
    badgeBorder: "#BFDBFE",
    themeColor: "#2563EB",
    gradient: ["#E0F2FE", "#BAE6FD"] as const,
    glowColor: "#BFDBFE",
    chip1: "📖 Murottal Juz 30",
    chip2: "🎙️ Ayat demi Ayat",
    features: [
      { icon: "book-outline", label: "Juz 30" },
      { icon: "language-outline", label: "Terjemahan" },
      { icon: "play-circle-outline", label: "Per Ayat" },
    ],
  },
  {
    id: "3",
    image: require("../assets/onBoarding3.png"),
    icon: "trophy",
    tagline: "KUIS & PENCAPAIAN",
    title: "Uji Pemahaman &\nKumpulkan Badge",
    description:
      "Evaluasi kemampuan dengan kuis interaktif yang seru dan dapatkan badge prestasi di setiap tahap kelulusan.",
    badgeBg: "#FEF3C7",
    badgeBorder: "#FDE68A",
    themeColor: "#D97706",
    gradient: ["#FEF3C7", "#FDE68A"] as const,
    glowColor: "#FDE68A",
    chip1: "⭐ Kuis Tebak Huruf",
    chip2: "🏅 Badge Prestasi",
    features: [
      { icon: "help-circle-outline", label: "5 Soal" },
      { icon: "star-outline", label: "Skor Bintang" },
      { icon: "ribbon-outline", label: "Lencana" },
    ],
  },
  {
    id: "4",
    image: require("../assets/OnBoarding4.png"),
    icon: "construct",
    tagline: "KUSTOMISASI APLIKASI",
    title: "Ingin Aplikasi\nSeperti Ini?",
    description:
      "Hubungi kami untuk pembuatan aplikasi edukasi, sekolah, atau bisnis custom sesuai kebutuhan Anda.",
    badgeBg: "#F3E8FF",
    badgeBorder: "#D8B4FE",
    themeColor: "#7C3AED",
    gradient: ["#F3E8FF", "#E9D5FF"] as const,
    glowColor: "#DDD6FE",
    chip1: "📱 Aplikasi Custom",
    chip2: "💬 Konsultasi Gratis",
    features: [
      { icon: "phone-portrait-outline", label: "Mobile App" },
      { icon: "globe-outline", label: "Website" },
      { icon: "chatbubble-outline", label: "Konsultasi" },
    ],
  },
];

const WA_NUMBER = "6285707185783";
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

    // Hero card takes ~38-42% of screen height to minimize empty space
    const cardH = isCompact
      ? Math.min(height * 0.32, 210)
      : isMedium
      ? Math.min(height * 0.36, 260)
      : Math.min(height * 0.38, 300);

    const titleSize = isCompact ? 18 : isMedium ? 20 : 22;
    const titleLineH = isCompact ? 24 : isMedium ? 26 : 29;
    const descSize = isCompact ? 12 : isMedium ? 12.5 : 13;
    const descLineH = isCompact ? 17 : isMedium ? 18 : 20;

    return {
      cardH,
      titleSize,
      titleLineH,
      descSize,
      descLineH,
      isCompact,
      isMedium,
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

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      <LinearGradient
        colors={["#F8FAFC", "#F1F5F9", "#FFFFFF"]}
        style={StyleSheet.absoluteFillObject}
      />

      <View
        style={[
          styles.ambientGlowTopRight,
          { backgroundColor: ONBOARDING_SLIDES[currentIndex].glowColor },
        ]}
      />
      <View style={styles.ambientGlowBottomLeft} />

      {/* 1. Header */}
      <View
        style={[
          styles.headerRow,
          { paddingTop: Math.max(insets.top + 6, 18) },
        ]}
      >
        <View style={[styles.brandBadge, Shadows.small]}>
          <View style={styles.brandIconBox}>
            <Image
              source={require("../assets/logo.png")}
              style={styles.brandLogoImage}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.brandText}>HijaLearn</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleFinishOnboarding}
          style={styles.skipButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.skipText}>Lewati</Text>
        </TouchableOpacity>
      </View>

      {/* 2. Slides */}
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
              {/* Hero Card */}
              <View
                style={[styles.heroWrapper, { height: responsive.cardH }]}
              >
                <LinearGradient
                  colors={item.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.heroCard, Shadows.medium]}
                >
                  {item.image ? (
                    <Image
                      source={item.image}
                      style={styles.heroImage}
                      resizeMode="contain"
                    />
                  ) : (
                    <View
                      style={[
                        styles.mainIconOrb,
                        { backgroundColor: item.themeColor },
                        Shadows.medium,
                      ]}
                    >
                      <Ionicons
                        name={item.icon as any}
                        size={44}
                        color="#FFFFFF"
                      />
                    </View>
                  )}

                  <View
                    style={[
                      styles.floatingChip,
                      styles.chipTopLeft,
                      Shadows.small,
                    ]}
                  >
                    <Text style={styles.chipText}>{item.chip1}</Text>
                  </View>

                  <View
                    style={[
                      styles.floatingChip,
                      styles.chipBottomRight,
                      Shadows.small,
                    ]}
                  >
                    <Text style={styles.chipText}>{item.chip2}</Text>
                  </View>
                </LinearGradient>
              </View>

              {/* Text Content — flex:1 fills remaining space */}
              <View style={styles.textBlock}>
                <View
                  style={[
                    styles.tagBadge,
                    {
                      backgroundColor: item.badgeBg,
                      borderColor: item.badgeBorder,
                    },
                  ]}
                >
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
                  adjustsFontSizeToFit
                  numberOfLines={2}
                >
                  {item.title}
                </Text>

                <Text
                  style={[
                    styles.slideDesc,
                    {
                      fontSize: responsive.descSize,
                      lineHeight: responsive.descLineH,
                    },
                  ]}
                  adjustsFontSizeToFit
                  numberOfLines={4}
                >
                  {item.description}
                </Text>

                {/* Feature Highlight Pills */}
                <View style={styles.featureRow}>
                  {item.features.map((feat: { icon: string; label: string }, idx: number) => (
                    <View
                      key={idx}
                      style={[
                        styles.featureChip,
                        { borderColor: item.badgeBorder },
                      ]}
                    >
                      <View
                        style={[
                          styles.featureIconBg,
                          { backgroundColor: item.badgeBg },
                        ]}
                      >
                        <Ionicons
                          name={feat.icon as any}
                          size={14}
                          color={item.themeColor}
                        />
                      </View>
                      <Text
                        style={[
                          styles.featureLabel,
                          { color: item.themeColor },
                        ]}
                        numberOfLines={1}
                      >
                        {feat.label}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* WhatsApp CTA on Slide 4 */}
                {item.id === "4" && (
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => Linking.openURL(WA_URL)}
                    style={[styles.waButton, Shadows.small]}
                  >
                    <Ionicons name="logo-whatsapp" size={18} color="#FFFFFF" />
                    <Text style={styles.waButtonText}>
                      Hubungi via WhatsApp
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        />
      </View>

      {/* 3. Footer */}
      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom + (Platform.OS === "android" ? 18 : 10), 28) },
        ]}
      >
        <View style={styles.paginationRow}>
          {ONBOARDING_SLIDES.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                currentIndex === idx ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          activeOpacity={0.88}
          onPress={handleNext}
          style={styles.buttonContainer}
        >
          <LinearGradient
            colors={[Colors.primary, "#0B7A70"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.nextBtn, Shadows.medium]}
          >
            <Text style={styles.nextBtnText}>
              {currentIndex === ONBOARDING_SLIDES.length - 1
                ? "Mulai Belajar"
                : "Lanjutkan"}
            </Text>
            <Ionicons
              name={
                currentIndex === ONBOARDING_SLIDES.length - 1
                  ? "checkmark-circle"
                  : "arrow-forward"
              }
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
    backgroundColor: "#F8FAFC",
  },
  ambientGlowTopRight: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 220,
    height: 220,
    borderRadius: 110,
    opacity: 0.4,
  },
  ambientGlowBottomLeft: {
    position: "absolute",
    bottom: -60,
    left: -60,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "#E2E8F0",
    opacity: 0.5,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 4,
    zIndex: 10,
  },
  brandBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  brandIconBox: {
    width: 32,
    height: 32,
    borderRadius: 9,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  brandLogoImage: {
    width: 40,
    height: 40,
    borderRadius: 9,
  },
  brandText: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: Colors.textPrimary,
    letterSpacing: 0.3,
    includeFontPadding: false,
  },
  skipButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  skipText: {
    fontFamily: Fonts.semiBold,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  slideItem: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  heroWrapper: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    zIndex: 10,
    marginTop: 4,
    marginBottom: 12,
  },
  heroCard: {
    width: "98%",
    height: "100%",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.9)",
    overflow: "hidden",
  },
  mainIconOrb: {
    width: 86,
    height: 86,
    borderRadius: 43,
    justifyContent: "center",
    alignItems: "center",
  },
  heroImage: {
    width: "80%",
    height: "80%",
    borderRadius: 12,
  },
  floatingChip: {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.96)",
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    zIndex: 999,
    elevation: 6,
  },
  chipTopLeft: {
    top: 10,
    left: 10,
  },
  chipBottomRight: {
    bottom: 10,
    right: 10,
  },
  chipText: {
    fontFamily: Fonts.bold,
    fontSize: 10.5,
    color: Colors.textPrimary,
  },
  textBlock: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 4,
  },
  tagBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  tagText: {
    fontFamily: Fonts.bold,
    fontSize: 10,
    letterSpacing: 0.6,
  },
  slideTitle: {
    fontFamily: Fonts.extraBold,
    fontSize: 22,
    lineHeight: 29,
    color: Colors.textPrimary,
    textAlign: "center",
    letterSpacing: -0.2,
  },
  slideDesc: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    lineHeight: 20,
    color: "#475569",
    textAlign: "center",
    paddingHorizontal: 6,
    maxWidth: 320,
  },
  featureRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  featureChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  featureIconBg: {
    width: 22,
    height: 22,
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  featureLabel: {
    fontFamily: Fonts.semiBold,
    fontSize: 11,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 6,
    gap: 10,
    zIndex: 10,
  },
  paginationRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    height: 7,
    borderRadius: 3.5,
  },
  activeDot: {
    width: 26,
    backgroundColor: Colors.primary,
  },
  inactiveDot: {
    width: 7,
    backgroundColor: "#CBD5E1",
  },
  buttonContainer: {
    width: "100%",
  },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
    borderRadius: 26,
    gap: 8,
  },
  nextBtnText: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: "#FFFFFF",
  },
  waButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#25D366",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 2,
  },
  waButtonText: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    color: "#FFFFFF",
  },
  footerLink: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerLinkText: {
    fontFamily: Fonts.medium,
    fontSize: 11,
    color: Colors.textSecondary,
  },
  footerLinkBold: {
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },
});
