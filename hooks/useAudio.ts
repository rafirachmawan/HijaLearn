import { Audio } from "expo-av";
import * as Speech from "expo-speech";
import { useEffect, useRef, useState } from "react";

export function useAudio() {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Configure audio mode once
  useEffect(() => {
    async function initAudio() {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
        });
      } catch (e) {
        console.warn("Error setAudioModeAsync:", e);
      }
    }
    initAudio();

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
      }
      Speech.stop();
    };
  }, []);

  const stopAudio = async () => {
    try {
      Speech.stop();
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    } catch (e) {
      console.warn("Error stopping sound:", e);
    } finally {
      setIsPlaying(false);
      setCurrentUrl(null);
      setIsLoading(false);
    }
  };

  const playSpeech = async (text: string, lang = "ar-SA", onEnded?: () => void) => {
    const cleanText = text.replace(/^speech:/i, "").trim();
    if (!cleanText) return;

    try {
      setError(null);
      Speech.stop();
      if (soundRef.current) {
        await soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }

      setIsLoading(true);
      setIsPlaying(true);
      setCurrentUrl(`speech:${cleanText}`);

      // High-quality female Arabic audio stream (works on all physical Android APK builds)
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(cleanText)}&tl=ar&client=tw-ob`;

      try {
        const { sound } = await Audio.Sound.createAsync(
          { uri: ttsUrl },
          { shouldPlay: true },
          (status) => {
            if (status.isLoaded) {
              setIsPlaying(status.isPlaying);
              if (status.didJustFinish && !status.isLooping) {
                setIsPlaying(false);
                if (onEnded) onEnded();
              }
            } else if (status.error) {
              console.warn("TTS Audio stream error, trying device Speech:", status.error);
            }
          }
        );
        soundRef.current = sound;
        setIsLoading(false);
      } catch (streamErr) {
        console.warn("Stream failed, falling back to device Speech.speak:", streamErr);
        Speech.speak(cleanText, {
          language: lang,
          pitch: 1.0,
          rate: 0.8,
          onDone: () => {
            setIsPlaying(false);
            if (onEnded) onEnded();
          },
          onError: (e) => {
            console.warn("Speech error:", e);
            setIsPlaying(false);
            setError("Gagal memutar suara");
          },
        });
        setIsLoading(false);
      }
    } catch (err) {
      console.warn("Speech exception:", err);
      setIsPlaying(false);
      setIsLoading(false);
    }
  };

  const playAudio = async (
    sourceOrUrlOrText: any,
    fallbackArabicText?: string,
    onEnded?: () => void,
  ) => {
    if (!sourceOrUrlOrText) return;

    const handleEnded =
      typeof fallbackArabicText === "function"
        ? (fallbackArabicText as any)
        : onEnded;
    const fallbackText =
      typeof fallbackArabicText === "string" ? fallbackArabicText : undefined;

    const isRequireAsset = typeof sourceOrUrlOrText === "number";
    const isHttpUrl =
      typeof sourceOrUrlOrText === "string" &&
      (sourceOrUrlOrText.startsWith("http://") ||
        sourceOrUrlOrText.startsWith("https://"));

    if (!isRequireAsset && !isHttpUrl) {
      const textToSpeak =
        typeof sourceOrUrlOrText === "string"
          ? sourceOrUrlOrText.replace(/^speech:/i, "").trim()
          : fallbackText || "";
      if (textToSpeak) {
        playSpeech(textToSpeak, "ar-SA", handleEnded);
      }
      return;
    }

    const audioSource = isRequireAsset
      ? sourceOrUrlOrText
      : { uri: sourceOrUrlOrText };
    const trackingKey = isRequireAsset
      ? `asset:${sourceOrUrlOrText}`
      : sourceOrUrlOrText;

    try {
      setError(null);
      Speech.stop();

      if (currentUrl === trackingKey && soundRef.current && isPlaying) {
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
        return;
      }

      if (currentUrl === trackingKey && soundRef.current && !isPlaying) {
        await soundRef.current.playAsync();
        setIsPlaying(true);
        return;
      }

      setIsLoading(true);
      if (soundRef.current) {
        await soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }

      const { sound } = await Audio.Sound.createAsync(
        audioSource,
        { shouldPlay: true },
        (status) => {
          if (status.isLoaded) {
            setIsPlaying(status.isPlaying);
            if (status.didJustFinish && !status.isLooping) {
              setIsPlaying(false);
              if (handleEnded) handleEnded();
            }
          } else if (status.error) {
            console.warn("Audio playback error:", status.error);
            setIsLoading(false);
            if (fallbackText) {
              playSpeech(fallbackText, "ar-SA", handleEnded);
            }
          }
        },
      );

      soundRef.current = sound;
      setCurrentUrl(trackingKey);
      setIsLoading(false);
      setIsPlaying(true);
    } catch (e) {
      console.warn("Error playing audio, falling back to speech:", e);
      setIsLoading(false);
      if (fallbackText) {
        playSpeech(fallbackText, "ar-SA", handleEnded);
      } else {
        setIsPlaying(false);
      }
    }
  };

  return {
    playAudio,
    playSpeech,
    stopAudio,
    isPlaying,
    isLoading,
    currentUrl,
    error,
  };
}
