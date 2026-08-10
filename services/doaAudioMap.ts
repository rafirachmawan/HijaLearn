// ============================================================
// 🎙️ MAPPING AUDIO DOA SEHARI-HARI
// ============================================================
//
// CARA MENGISI:
// 1. Cari audio MP3 yang TEPAT untuk setiap doa
// 2. Pastikan link berformat langsung ke file .mp3
//    ✅ Contoh BENAR: "https://example.com/audio/doa-tidur.mp3"
//    ❌ Contoh SALAH: "https://youtube.com/watch?v=xxxxx" (tidak bisa diputar)
//
// SUMBER REKOMENDASI LINK MP3 LANGSUNG:
// - https://everyayah.com/data/Alafasy_128kbps/  (untuk ayat Al-Quran)
// - https://our-allah.com  (cari di halaman doa, klik kanan audio > "Copy audio address")
// - https://archive.org/details/HisnulMuslimAudio_201510  (Hisnul Muslim lengkap)
//   Format: https://ia801509.us.archive.org/21/items/HisnulMuslimAudio_201510/nXXX.mp3
//
// JIKA LINK KOSONG (""):
// - Aplikasi otomatis menggunakan suara TTS (Text-to-Speech) bawaan HP
//   sebagai pengganti sementara.
//
// ============================================================

export const DOA_AUDIO_MAP: Record<number, string | any> = {
  // ──────────────────────────────────────────
  // 1. Doa Sebelum Tidur
  //    "Bismika allahumma ahyaa wa bismika amuut"
  // ──────────────────────────────────────────
  1: "",

  // ──────────────────────────────────────────
  // 2. Doa Bangun Tidur
  //    "Alhamdulillaahil ladzii ahyaanaa ba'da maa amaatanaa wa ilaihin nusyuur"
  // ──────────────────────────────────────────
  2: "",

  // ──────────────────────────────────────────
  // 3. Doa Masuk Kamar Mandi
  //    "Allaahumma innii a'uudzu bika minal khubutsi wal khabaa-its"
  // ──────────────────────────────────────────
  3: "",

  // ──────────────────────────────────────────
  // 4. Doa Keluar Kamar Mandi
  //    "Ghufraanaka"
  // ──────────────────────────────────────────
  4: "",

  // ──────────────────────────────────────────
  // 5. Doa Sebelum Makan
  //    "Allaahumma baarik lanaa fiimaa razaqtanaa wa qinaa 'adzaaban naar. Bismillaah"
  // ──────────────────────────────────────────
  5: "",

  // ──────────────────────────────────────────
  // 6. Doa Sesudah Makan
  //    "Alhamdulillaahil ladzii ath'amanaa wa saqaanaa wa ja'alanaa minal muslimiin"
  // ──────────────────────────────────────────
  6: "",

  // ──────────────────────────────────────────
  // 7. Doa Keluar Rumah
  //    "Bismillaahi tawakkaltu 'alallaahi wa laa haula wa laa quwwata illaa billaah"
  // ──────────────────────────────────────────
  7: "",

  // ──────────────────────────────────────────
  // 8. Doa Masuk Rumah
  //    "Allaahumma innii as-aluka khoirol mauliji wa khoirol makhroji..."
  // ──────────────────────────────────────────
  8: "",

  // ──────────────────────────────────────────
  // 9. Doa Naik Kendaraan
  //    "Subhaanal ladzii sakhkhara lanaa haadzaa..."
  // ──────────────────────────────────────────
  9: "",

  // ──────────────────────────────────────────
  // 10. Doa Masuk Masjid
  //     "Allaahummaf tahlii abwaaba rohmatik"
  // ──────────────────────────────────────────
  10: "",

  // ──────────────────────────────────────────
  // 11. Doa Keluar Masjid
  //     "Allaahumma innii as-aluka min fadllik"
  // ──────────────────────────────────────────
  11: "",

  // ──────────────────────────────────────────
  // 12. Doa Bercermin
  //     "Allaahumma kamaa hassanta kholqii fahassin khuluqii"
  // ──────────────────────────────────────────
  12: "",

  // ──────────────────────────────────────────
  // 13. Doa Berpakaian
  //     "Alhamdulillaahil ladzii kasaanii haadzaa wa rozaqoniihi..."
  // ──────────────────────────────────────────
  13: "",

  // ──────────────────────────────────────────
  // 14. Doa Ketika Hujan Turun
  //     "Allaahumma shayyiban naafi'an"
  // ──────────────────────────────────────────
  14: "",

  // ──────────────────────────────────────────
  // 15. Doa Mendengar Petir
  //     "Subhaanal ladzii yusabbihur ra'du bihamdihi wal malaa-ikatu min khiifatih"
  // ──────────────────────────────────────────
  15: "",

  // ──────────────────────────────────────────
  // 16. Doa Untuk Kedua Orang Tua
  //     "Rabbighfirlii wa liwaalidayya warhamhumaa kamaa rabbayaanii shaghiiraa"
  // ──────────────────────────────────────────
  16: "",

  // ──────────────────────────────────────────
  // 17. Doa Sebelum Belajar
  //     "Rabbi zidnii 'ilman warzuqnii fahman"
  // ──────────────────────────────────────────
  17: "",

  // ──────────────────────────────────────────
  // 18. Doa Sesudah Belajar
  //     "Allaahumma innii astaudi'uka maa 'allamtaniihi..."
  // ──────────────────────────────────────────
  18: "",

  // ──────────────────────────────────────────
  // 19. Doa Ketika Bersin
  //     "Alhamdulillaah"
  // ──────────────────────────────────────────
  19: "",

  // ──────────────────────────────────────────
  // 20. Doa Kebaikan Dunia Akhirat
  //     "Rabbanaa aatinaa fid dunyaa hasanatan wa fil aakhirati hasanatan wa qinaa 'adzaaban naar"
  // ──────────────────────────────────────────
  20: "",
};

// ============================================================
// FUNGSI: Mengambil sumber audio berdasarkan ID doa
// Jika link kosong (""), return null → aplikasi otomatis pakai TTS
// ============================================================
export function getDoaAudioSource(doaId: number): string | any | null {
  const source = DOA_AUDIO_MAP[doaId];
  if (!source || source === "") return null;
  return source;
}
