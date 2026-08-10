# Product Requirements Document (PRD)

## Aplikasi Belajar Huruf Hijaiyah & Surat Pendek (Online)

**Versi:** 1.1
**Tanggal:** 9 Agustus 2026
**Platform:** Android (Expo / React Native)
**Status:** Draft untuk MVP

---

## 1. Latar Belakang

Belajar membaca huruf Hijaiyah dan menghafal surat-surat pendek adalah tahap dasar penting dalam pendidikan agama Islam. Aplikasi ini dirancang sebagai media belajar interaktif yang mengambil konten (teks, terjemahan, audio) dari sumber online, sehingga selalu ringan diinstal dan mudah diperbarui tanpa perlu update aplikasi setiap kali ada penambahan konten.

## 2. Tujuan Produk

- Menyediakan media belajar huruf Hijaiyah dan surat pendek yang interaktif dan mandiri (self-paced).
- Memastikan konten mudah diperluas/diperbarui dari sisi server tanpa perlu update aplikasi setiap kali.
- Membuat proses belajar lebih menarik melalui kuis dan game interaktif, bukan sekadar membaca pasif.
- Menjangkau pengguna lintas usia — dari anak yang baru mengenal huruf Hijaiyah hingga dewasa yang ingin murajaah (mengulang hafalan).
- Menjaga aplikasi tetap ringan diinstal (ukuran APK kecil) karena aset besar (audio) tidak perlu dibundel.

## 3. Target Pengguna

Umum, untuk semua kalangan — dengan asumsi pengguna utama tetap berkisar dari anak usia sekolah hingga dewasa. Implikasinya terhadap desain:

- Bahasa instruksi sederhana dan netral (tidak terlalu kekanak-kanakan, tidak terlalu formal).
- Ukuran teks dan tombol cukup besar agar nyaman dibaca semua umur.
- Tidak ada asumsi bahwa pengguna sudah bisa membaca huruf Arab sama sekali (mulai dari nol).

## 4. Ruang Lingkup (Scope)

### 4.1 Termasuk dalam MVP

- Modul belajar 28 huruf Hijaiyah beserta harakat dasar.
- Modul surat-surat pendek pilihan (juz 30) lengkap dengan teks Arab, transliterasi, terjemahan, dan audio per ayat, diambil dari API online.
- Kuis dan game interaktif untuk kedua modul di atas.
- Sistem progres dan pencapaian (badge/bintang) tersimpan secara lokal di perangkat (tanpa akun/login).
- Caching sederhana agar konten yang sudah pernah dibuka tidak perlu diunduh ulang setiap saat.

### 4.2 Tidak termasuk dalam MVP (kemungkinan fase berikutnya)

- Akun pengguna / login / sinkronisasi cloud — **tidak diperlukan**, semua progres cukup tersimpan lokal per perangkat.
- Mode offline penuh (unduh semua konten untuk dipakai tanpa internet) — bisa jadi fitur tambahan di fase lanjut, bukan MVP.
- Multi-bahasa (MVP hanya Bahasa Indonesia).
- Fitur sosial (leaderboard antar pengguna, berbagi progres).
- Tajwid mendalam (hukum bacaan lanjutan) — MVP hanya pengenalan dasar.
- iOS — MVP fokus Android terlebih dahulu.

## 5. Strategi Sumber Data (Online)

Karena aplikasi berjalan online, konten diambil langsung dari API/sumber terbuka saat runtime, bukan dibundel di dalam aplikasi:

| Jenis Data                     | Sumber                                                                                                                 | Cara Pengambilan                                                                          |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Teks Arab huruf Hijaiyah       | Disusun manual (28 huruf), disimpan di server/CDN ringan atau tetap statis di aplikasi (kecil, tidak masalah dibundel) | JSON statis di aplikasi (data ini kecil, tidak perlu online)                              |
| Teks & terjemahan surat pendek | API Quran terbuka (mis. AlQuran Cloud API)                                                                             | Fetch saat pengguna membuka surat, dengan caching lokal                                   |
| Audio pelafalan huruf          | Sumber audio Hijaiyah, dihosting di CDN/server                                                                         | Streaming/diunduh saat dibutuhkan                                                         |
| Audio bacaan ayat per ayat     | Arsip audio Quran per-ayat (mis. EveryAyah.com)                                                                        | Streaming saat pengguna memutar ayat, dengan caching lokal file yang sudah pernah diputar |
| Progres pengguna               | —                                                                                                                      | Disimpan di perangkat via AsyncStorage (tetap lokal, tidak butuh akun)                    |

**Implikasi teknis:**

- Aplikasi butuh koneksi internet aktif untuk memuat konten baru (teks & audio) — perlu penanganan yang baik saat koneksi lambat/terputus (loading state, pesan error yang jelas, retry).
- Caching lokal (mis. dengan `expo-file-system` untuk menyimpan audio yang sudah diunduh, atau cache HTTP biasa) disarankan agar konten yang sudah pernah dibuka bisa diakses lebih cepat dan mengurangi pemakaian data saat dibuka ulang.
- Ukuran APK jauh lebih kecil karena tidak ada audio yang dibundel.
- Progres belajar tetap sepenuhnya lokal per perangkat — tidak ada login, tidak ada sinkronisasi antar perangkat di MVP.

## 6. Fitur & User Stories

### 6.1 Modul Huruf Hijaiyah

- Sebagai pengguna, saya ingin melihat daftar 28 huruf Hijaiyah dalam bentuk kartu agar mudah dijelajahi.
- Sebagai pengguna, saya ingin mendengar pelafalan huruf saat mengetuk kartu (audio dimuat dari server, dengan indikator loading singkat).
- Sebagai pengguna, saya ingin melihat huruf dengan 3 harakat dasar (fathah, kasrah, dhommah) beserta bunyinya.
- Sebagai pengguna, saya ingin mengikuti kuis pencocokan bunyi-huruf setelah mempelajari sekelompok huruf.

### 6.2 Modul Surat Pendek

- Sebagai pengguna, saya ingin memilih surat pendek dari daftar (misalnya An-Nas, Al-Falaq, Al-Ikhlas, Al-Lahab, dst), diambil dari API saat aplikasi dibuka.
- Sebagai pengguna, saya ingin membaca teks Arab, transliterasi Latin, dan terjemahan Indonesia per ayat.
- Sebagai pengguna, saya ingin memutar audio ayat satu per satu (streaming), dengan ayat yang sedang dibaca ditandai (highlight).
- Sebagai pengguna, saya ingin mengikuti mode "murajaah" — audio ayat diputar dan tampilan teks disembunyikan sebagian untuk menguji hafalan.

### 6.3 Kuis & Game Interaktif

- Kuis huruf: dengar audio → pilih huruf yang benar (pilihan ganda).
- Kuis huruf: lihat huruf → susun urutan menjadi kata sederhana (drag & drop atau tap-to-select).
- Kuis surat: susun potongan ayat sesuai urutan yang benar.
- Kuis surat: lengkapi ayat yang hilang (isian kata dari beberapa pilihan).
- Kuis surat: cocokkan ayat dengan terjemahannya.
- Setiap kuis memberi skor dan feedback langsung (benar/salah + jawaban yang tepat).

### 6.4 Progres & Pencapaian

- Sebagai pengguna, saya ingin melihat berapa persen huruf/surat yang sudah saya pelajari, tanpa perlu membuat akun.
- Sebagai pengguna, saya ingin mendapat bintang setiap menyelesaikan satu unit belajar.
- Sebagai pengguna, saya ingin membuka lencana (badge) untuk pencapaian tertentu, misalnya "Khatam Hijaiyah" atau "Hafal 5 Surat".
- Semua data progres tersimpan otomatis di perangkat (AsyncStorage) tanpa perlu aksi simpan manual dan tanpa login.

## 7. Persyaratan Fungsional (Functional Requirements)

| ID    | Deskripsi                                                                                        | Prioritas  |
| ----- | ------------------------------------------------------------------------------------------------ | ---------- |
| FR-01 | Aplikasi menampilkan daftar 28 huruf Hijaiyah dalam grid/kartu                                   | Wajib      |
| FR-02 | Setiap huruf memiliki audio pelafalan yang dapat diputar (streaming dari server)                 | Wajib      |
| FR-03 | Aplikasi menampilkan minimal 10 surat pendek juz 30 pada MVP, diambil dari API                   | Wajib      |
| FR-04 | Setiap ayat memiliki teks Arab, transliterasi, terjemahan, dan audio                             | Wajib      |
| FR-05 | Pengguna dapat memutar audio per ayat maupun seluruh surat berurutan                             | Wajib      |
| FR-06 | Aplikasi menyediakan minimal 3 jenis kuis untuk modul huruf                                      | Wajib      |
| FR-07 | Aplikasi menyediakan minimal 3 jenis kuis untuk modul surat                                      | Wajib      |
| FR-08 | Progres belajar tersimpan lokal dan tetap ada setelah aplikasi ditutup/dibuka ulang, tanpa login | Wajib      |
| FR-09 | Aplikasi menampilkan ringkasan progres (persentase & badge) di halaman utama/profil              | Wajib      |
| FR-10 | Aplikasi menangani kondisi tanpa/lemah koneksi internet dengan pesan yang jelas (bukan crash)    | Wajib      |
| FR-11 | Konten yang sudah pernah dibuka di-cache lokal agar lebih cepat diakses kembali                  | Disarankan |
| FR-12 | Pengguna dapat mengatur ulang (reset) progres jika diinginkan                                    | Opsional   |
| FR-13 | Aplikasi menyimpan pengaturan dasar seperti volume audio dan qari pilihan                        | Opsional   |

## 8. Persyaratan Non-Fungsional

- **Performa:** Audio dan teks dimuat sesuai kebutuhan (lazy loading), dengan caching agar tidak berulang kali mengunduh konten yang sama.
- **Ukuran Aplikasi:** APK diusahakan tetap kecil (di bawah 50 MB) karena aset besar tidak dibundel.
- **Konektivitas:** Aplikasi harus menampilkan status jelas saat offline/koneksi lambat, dan idealnya tetap bisa menampilkan konten yang sudah pernah di-cache.
- **Kompatibilitas:** Minimal Android 8.0 (API level 26) ke atas.
- **Aksesibilitas:** Kontras warna cukup, ukuran font dapat dibaca, target sentuh tombol minimal 44x44dp.
- **Stabilitas:** Tidak ada crash saat audio gagal dimuat (harus ada penanganan error/retry) atau navigasi cepat antar layar.
- **Keamanan/Privasi:** Tidak ada login, tidak ada pengumpulan data pribadi; tidak ada permintaan izin selain yang benar-benar dibutuhkan.

## 9. Arsitektur Teknis (Ringkasan)

- **Framework:** Expo (React Native), menggunakan Expo Router untuk navigasi berbasis file.
- **Audio:** `expo-av` untuk pemutaran audio via streaming URL, dengan opsi caching file menggunakan `expo-file-system`.
- **Data konten:**
  - Data huruf Hijaiyah (kecil, statis) tetap disimpan sebagai JSON lokal di aplikasi.
  - Data surat pendek (teks, terjemahan, URL audio) diambil dari API Quran secara online saat runtime, dengan caching hasil fetch (mis. menggunakan `AsyncStorage` atau library seperti `@tanstack/react-query` untuk caching otomatis).
- **Penyimpanan progres:** `@react-native-async-storage/async-storage` (lokal di perangkat, tanpa backend/login).
- **State management:** React Context atau state lokal per layar, plus data-fetching layer (mis. React Query) untuk mengelola loading/error/cache dari API.
- **Build/Distribusi:** Expo prebuild → APK/AAB untuk Android.

## 10. Alur Pengguna Utama (High-Level User Flow)

1. **Buka Aplikasi** → Halaman utama menampilkan dua menu besar: "Belajar Hijaiyah" dan "Surat Pendek", plus ringkasan progres.
2. **Pilih Modul Hijaiyah** → Lihat grid 28 huruf → Ketuk huruf → Audio dimuat & diputar (dengan indikator loading singkat) → Lihat harakat → Setelah beberapa huruf, muncul ajakan kuis.
3. **Pilih Modul Surat** → Aplikasi mengambil daftar surat dari API → Pilih surat → Konten ayat diambil (atau dari cache jika sudah pernah dibuka) → Baca/dengarkan ayat per ayat → Setelah selesai, muncul ajakan kuis surat tersebut.
4. **Kuis** → Soal ditampilkan satu per satu → Jawaban diberi feedback langsung → Skor akhir & bintang ditampilkan di akhir.
5. **Halaman Progres** → Menampilkan persentase huruf & surat yang dikuasai, daftar badge yang sudah/belum terbuka — semua dari data lokal perangkat, tanpa perlu login.

## 11. Konten MVP (Cakupan Awal)

**Huruf Hijaiyah:** seluruh 28 huruf dasar (Alif–Ya), masing-masing dengan 3 harakat dasar.

**Surat Pendek (usulan awal, dapat disesuaikan):**
An-Nas, Al-Falaq, Al-Ikhlas, Al-Lahab, An-Nasr, Al-Kafirun, Al-Kautsar, Al-Ma'un, Quraisy, Al-Fil.

_(Karena data diambil dari API online, daftar ini mudah diperluas kapan saja tanpa perlu update aplikasi — cukup ubah konfigurasi/daftar surat yang ditampilkan.)_

## 12. Metrik Keberhasilan

- Tingkat penyelesaian modul huruf Hijaiyah (berapa % pengguna menyelesaikan seluruh 28 huruf).
- Tingkat penyelesaian minimal 1 surat pendek per sesi belajar.
- Rata-rata skor kuis pengguna (indikasi apakah materi cukup jelas).
- Retensi penggunaan (apakah pengguna kembali membuka aplikasi dalam 7 hari).
- Tingkat kegagalan pemuatan konten (error rate saat fetch API) — indikator kualitas koneksi/reliabilitas sumber data.

## 13. Risiko & Asumsi

| Risiko/Asumsi                                                           | Mitigasi                                                                                                             |
| ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Aplikasi tidak bisa dipakai sama sekali tanpa internet                  | Terima sebagai batasan MVP; pertimbangkan caching agresif atau mode offline parsial di fase lanjut jika dibutuhkan   |
| Ketergantungan pada API pihak ketiga (Quran API) yang bisa down/berubah | Pilih API yang stabil dan populer, siapkan fallback/pesan error yang jelas, pertimbangkan cache lokal sebagai buffer |
| Audio streaming bisa lambat di koneksi buruk                            | Tambahkan indikator loading, kompresi audio yang wajar, dan caching setelah pertama kali diputar                     |
| Sumber teks/audio Quran perlu diverifikasi akurasinya                   | Gunakan sumber yang sudah dikenal dan diverifikasi (mis. mushaf standar)                                             |
| Pengguna lintas usia punya kebutuhan UX berbeda                         | Desain netral dan sederhana, uji coba dengan beberapa kelompok usia sebelum rilis                                    |

## 14. Roadmap Bertahap (Usulan)

- **Fase 1 (MVP):** Modul huruf + modul surat (10 surat, via API) + kuis dasar + progres lokal tanpa login, sesuai dokumen ini.
- **Fase 2:** Tambah lebih banyak surat, tambah jenis kuis/game baru, tambah pengaturan qari, perkuat caching.
- **Fase 3:** Multi-bahasa, dukungan iOS, mode offline parsial (unduh surat favorit untuk dipakai tanpa internet).
- **Fase 4 (opsional):** Akun pengguna & sinkronisasi progres lintas perangkat, jika suatu saat dibutuhkan.

## 15. Pertanyaan Terbuka

- Berapa jumlah surat pendek yang ideal untuk MVP — cukup 10, atau langsung lebih banyak?
- Apakah dibutuhkan pilihan qari (pembaca) lebih dari satu, atau cukup satu suara konsisten di MVP?
- Apakah target rilis melalui Google Play Store, atau dulu sebagai APK internal untuk uji coba?

---

_Dokumen ini adalah draft awal dan dapat direvisi seiring masukan dari proses pengembangan dan uji coba pengguna._
