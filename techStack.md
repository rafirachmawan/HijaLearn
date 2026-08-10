# Tech Stack — Aplikasi Belajar Huruf Hijaiyah & Surat Pendek

**Versi:** 1.0
**Tanggal:** 9 Agustus 2026
**Platform:** Android (fase awal), Expo / React Native
**Mode:** Online, tanpa login/akun

---

## 1. Ringkasan

Stack dipilih dengan prioritas: cepat dikembangkan dengan Expo, ringan (karena tidak ada aset besar yang dibundel), dan sederhana untuk MVP tanpa backend/login custom. Semua data pengguna (progres, badge) disimpan lokal di perangkat.

## 2. Core Framework

| Komponen        | Pilihan                                                            | Alasan                                                                                |
| --------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| Framework       | **Expo (React Native)**, SDK terbaru (managed workflow)            | Build cepat, akses native module (audio, file system) tanpa konfigurasi native manual |
| Bahasa          | **TypeScript**                                                     | Type safety untuk struktur data huruf/surat/progres yang cukup kompleks               |
| Navigasi        | **Expo Router**                                                    | Navigasi berbasis file, mendukung bottom tabs + stack navigation dengan mudah         |
| Package manager | **npm** atau **yarn** (pilih salah satu, konsisten di seluruh tim) | Standar ekosistem React Native                                                        |

## 3. Navigasi & Struktur Layar

- **expo-router** — untuk struktur tab (`(tabs)/`) dan stack per modul (detail huruf, detail surat, kuis).
- Struktur folder navigasi mengikuti 4 tab utama: Beranda, Hijaiyah, Surat Pendek, Progres — sesuai dokumen User Flow.

## 4. Data & Networking

| Kebutuhan                   | Library                                                                  | Catatan                                                                                     |
| --------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| Fetch data surat dari API   | **fetch bawaan** atau **axios**                                          | axios opsional untuk interceptor & timeout lebih mudah                                      |
| Caching & state server-data | **@tanstack/react-query**                                                | Mengelola loading/error/cache otomatis untuk data dari API Quran, mengurangi fetch berulang |
| Sumber data surat pendek    | **AlQuran Cloud API** (atau API Quran terbuka sejenis)                   | Menyediakan teks Arab, terjemahan, dan referensi audio per ayat                             |
| Sumber audio ayat           | **EveryAyah.com** (arsip audio per-ayat) atau CDN audio dari API di atas | Diputar via streaming URL                                                                   |
| Data huruf Hijaiyah         | **JSON statis lokal** (`data/hijaiyah.json`)                             | Data kecil & tetap, tidak perlu API                                                         |

## 5. Audio

- **expo-av** — memutar audio streaming (pelafalan huruf & ayat), kontrol play/pause/next.
- **expo-file-system** (opsional, untuk caching) — menyimpan file audio yang sudah pernah diputar agar pemutaran berikutnya lebih cepat dan hemat data.

## 6. Penyimpanan Lokal (Tanpa Login)

| Kebutuhan                                  | Library                                       | Catatan                                         |
| ------------------------------------------ | --------------------------------------------- | ----------------------------------------------- |
| Progres belajar (huruf/surat selesai)      | **@react-native-async-storage/async-storage** | Key-value sederhana, cukup untuk skala data MVP |
| Skor kuis & badge                          | **AsyncStorage** (struktur data JSON per key) | Tidak butuh database relasional untuk MVP       |
| Pengaturan aplikasi (volume, qari pilihan) | **AsyncStorage**                              | Disimpan sebagai preferensi lokal               |

_(Tidak ada SQLite/Realm di MVP — kompleksitas data masih sederhana. Bisa dipertimbangkan di fase lanjut jika data berkembang jauh lebih besar.)_

## 7. State Management

- **React Context + hooks** (`useProgress`, `useAudioPlayer`, dst.) untuk state lokal aplikasi (progres, pengaturan).
- **React Query** untuk state data dari API (surat, ayat) — terpisah dari state lokal, agar loading/error/cache tertangani otomatis tanpa Context tambahan.
- Tidak menggunakan Redux/MobX — skala aplikasi MVP tidak membutuhkan state management sekompleks itu.

## 8. UI & Styling

| Kebutuhan                                     | Pilihan                                                                                            | Catatan                                                             |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Styling                                       | **StyleSheet React Native bawaan**, atau **NativeWind (Tailwind untuk RN)**                        | NativeWind mempercepat styling konsisten jika tim familiar Tailwind |
| Ikon                                          | **@expo/vector-icons**                                                                             | Sudah terintegrasi dengan Expo, banyak pilihan set ikon             |
| Animasi ringan (feedback kuis, badge terbuka) | **react-native-reanimated**                                                                        | Untuk animasi transisi & feedback yang halus                        |
| Font Arab                                     | Font khusus Arab yang mendukung harakat (mis. **Amiri**, **Scheherazade**), dimuat via `expo-font` | Penting agar teks Arab & harakat terbaca jelas                      |

## 9. Utilitas Tambahan

| Kebutuhan                       | Library                                                                                                                   |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Deteksi status koneksi internet | **@react-native-community/netinfo** — untuk menampilkan banner "tidak ada koneksi" dan menentukan kapan fallback ke cache |
| Validasi/format data            | **zod** (opsional) — memvalidasi struktur data JSON huruf/surat agar konsisten                                            |

## 10. Build & Distribusi

- **EAS Build (Expo Application Services)** — untuk membuat APK/AAB tanpa perlu setup Android Studio penuh di awal.
- **EAS Update** (opsional, fase lanjut) — untuk push update konten/bugfix ringan tanpa submit ulang ke Play Store.
- Target rilis awal: APK internal untuk uji coba, lanjut ke Google Play Store setelah stabil (menunggu keputusan di PRD).

## 11. Testing (Dasar untuk MVP)

| Jenis                                | Tools                                                                                             |
| ------------------------------------ | ------------------------------------------------------------------------------------------------- |
| Unit test logic (progres, skor kuis) | **Jest**                                                                                          |
| Component test dasar                 | **@testing-library/react-native**                                                                 |
| Manual QA                            | Uji coba di beberapa perangkat Android dengan kondisi koneksi bervariasi (baik, lambat, terputus) |

## 12. Struktur Proyek (Usulan)

```
app/
├── (tabs)/
│   ├── index.tsx          # Beranda
│   ├── hijaiyah.tsx        # Daftar huruf
│   ├── surat.tsx           # Daftar surat
│   └── progres.tsx         # Progres & badge
├── hijaiyah/
│   └── [id].tsx             # Detail huruf
├── surat/
│   └── [id].tsx             # Detail surat
├── kuis/
│   └── [type]/[id].tsx      # Layar kuis (dinamis per modul)
├── components/
│   ├── HurufCard.tsx
│   ├── AyatItem.tsx
│   ├── QuizQuestion.tsx
│   └── BadgeGrid.tsx
├── data/
│   └── hijaiyah.json
├── hooks/
│   ├── useProgress.ts        # Wrapper AsyncStorage
│   ├── useSuratList.ts       # React Query — daftar surat
│   └── useSuratDetail.ts     # React Query — detail ayat
├── services/
│   ├── api.ts                # Konfigurasi fetch/axios ke API Quran
│   └── audio.ts               # Wrapper expo-av
└── utils/
    └── badgeRules.ts          # Logika syarat pembukaan badge
```

## 13. Ringkasan Keputusan Kunci

- **Online, bukan offline** → data surat & audio diambil dari API, bukan dibundel di aplikasi.
- **Tanpa login** → semua progres cukup disimpan lokal via AsyncStorage, tidak perlu backend/akun sendiri.
- **Tanpa database kompleks** → AsyncStorage cukup untuk skala data MVP.
- **React Query** dipilih khusus untuk mengelola data dari API agar loading/error/cache tertangani rapi tanpa banyak boilerplate manual.
