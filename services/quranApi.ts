export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
  translationId?: string;
}

export interface Ayah {
  number: number;
  numberInSurah: number;
  text: string;
  translation: string;
  transliteration: string;
  audio: string;
}

export interface SurahDetail extends Surah {
  ayahs: Ayah[];
}

// Minimal 10 Surat Pendek Juz 30 Fallback untuk Offline/Cache
const FALLBACK_SURAHS: Surah[] = [
  { number: 114, name: "الناس", englishName: "An-Naas", englishNameTranslation: "Manusia", numberOfAyahs: 6, revelationType: "Meccan", translationId: "Manusia" },
  { number: 113, name: "الفلق", englishName: "Al-Falaq", englishNameTranslation: "Waktu Subuh", numberOfAyahs: 5, revelationType: "Meccan", translationId: "Waktu Subuh" },
  { number: 112, name: "الإخلاص", englishName: "Al-Ikhlaas", englishNameTranslation: "Ikhlas", numberOfAyahs: 4, revelationType: "Meccan", translationId: "Memurnikan Keesaan Allah" },
  { number: 111, name: "المسد", englishName: "Al-Masad", englishNameTranslation: "Gejolak Api / Tali Gejolak", numberOfAyahs: 5, revelationType: "Meccan", translationId: "Gejolak Api" },
  { number: 110, name: "النصر", englishName: "An-Nasr", englishNameTranslation: "Pertolongan", numberOfAyahs: 3, revelationType: "Medinan", translationId: "Pertolongan" },
  { number: 109, name: "الكافرون", englishName: "Al-Kaafiroon", englishNameTranslation: "Orang-orang Kafir", numberOfAyahs: 6, revelationType: "Meccan", translationId: "Orang-orang Kafir" },
  { number: 108, name: "الكوثر", englishName: "Al-Kawthar", englishNameTranslation: "Nikmat Berlimpah", numberOfAyahs: 3, revelationType: "Meccan", translationId: "Nikmat Yang Banyak" },
  { number: 107, name: "الماعون", englishName: "Al-Maa'un", englishNameTranslation: "Barang-barang Berguna", numberOfAyahs: 7, revelationType: "Meccan", translationId: "Barang-Barang Yang Berguna" },
  { number: 106, name: "قريش", englishName: "Quraysh", englishNameTranslation: "Suku Quraisy", numberOfAyahs: 4, revelationType: "Meccan", translationId: "Suku Quraisy" },
  { number: 105, name: "الفيل", englishName: "Al-Feel", englishNameTranslation: "Gajah", numberOfAyahs: 5, revelationType: "Meccan", translationId: "Gajah" }
];

export async function fetchSurahList(): Promise<Surah[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    
    const response = await fetch("https://api.alquran.cloud/v1/surah", {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error("Gagal mengambil data dari server");
    }
    
    const json = await response.json();
    if (json.data && Array.isArray(json.data)) {
      // Filter Juz 30 surahs (Surah 78 - 114)
      const juz30 = json.data.filter((s: Surah) => s.number >= 78);
      return juz30.length > 0 ? juz30 : FALLBACK_SURAHS;
    }
    return FALLBACK_SURAHS;
  } catch (error) {
    console.warn("fetchSurahList offline/fallback used:", error);
    return FALLBACK_SURAHS;
  }
}

export async function fetchSurahDetail(surahNumber: number): Promise<SurahDetail> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    // Fetch Arabic text + Indonesian Translation simultaneously
    const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,id.indonesian`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error("Gagal memuat detail surat dari server");
    }

    const json = await res.json();
    if (json.data && Array.isArray(json.data) && json.data.length >= 2) {
      const arabicData = json.data[0];
      const indoData = json.data[1];

      // For surahs other than Al-Fatihah(1) and At-Tawbah(9),
      // the API includes Bismillah as part of Ayah 1 text.
      // Since the UI already shows a standalone Bismillah banner,
      // we need to strip the Bismillah text from Ayah 1 to avoid duplication.
      const bismillahPatterns = [
        "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",
        "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        "بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِيمِ"
      ];
      const hasSeparateBismillah = surahNumber !== 1 && surahNumber !== 9;

      const ayahs: Ayah[] = arabicData.ayahs.map((a: any, idx: number) => {
        const surahPad = String(surahNumber).padStart(3, "0");
        const ayahPad = String(a.numberInSurah).padStart(3, "0");
        const audioUrl = `https://everyayah.com/data/Alafasy_128kbps/${surahPad}${ayahPad}.mp3`;
        const indoText = indoData.ayahs[idx]?.text || "";

        let ayahText = a.text;
        // Strip Bismillah prefix from Ayah 1 for surahs with separate banner
        if (hasSeparateBismillah && a.numberInSurah === 1) {
          for (const pattern of bismillahPatterns) {
            ayahText = ayahText.replace(pattern, "").trim();
          }
        }

        return {
          number: a.number,
          numberInSurah: a.numberInSurah,
          text: ayahText,
          translation: indoText,
          transliteration: `Ayat ${a.numberInSurah}`,
          audio: audioUrl
        };
      });

      return {
        number: arabicData.number,
        name: arabicData.name,
        englishName: arabicData.englishName,
        englishNameTranslation: arabicData.englishNameTranslation,
        numberOfAyahs: arabicData.numberOfAyahs,
        revelationType: arabicData.revelationType,
        ayahs
      };
    }
    throw new Error("Struktur data API tidak sesuai");
  } catch (error) {
    console.warn("fetchSurahDetail failed, generating mock for surah:", surahNumber, error);
    // Mock Fallback surah detail for offline testing
    const fallbackInfo = FALLBACK_SURAHS.find(s => s.number === surahNumber) || FALLBACK_SURAHS[0];
    const ayahsCount = fallbackInfo.numberOfAyahs;
    
    const mockAyahs: Ayah[] = Array.from({ length: ayahsCount }, (_, i) => {
      const num = i + 1;
      const surahPad = String(surahNumber).padStart(3, "0");
      const ayahPad = String(num).padStart(3, "0");
      return {
        number: num,
        numberInSurah: num,
        text: num === 1 ? "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ" : "قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
        translation: `Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang (Ayat ${num})`,
        transliteration: `Bismillah / Ayat ${num}`,
        audio: `https://everyayah.com/data/Alafasy_128kbps/${surahPad}${ayahPad}.mp3`
      };
    });

    return {
      ...fallbackInfo,
      ayahs: mockAyahs
    };
  }
}
