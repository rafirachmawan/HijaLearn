# User Flow — Aplikasi Belajar Huruf Hijaiyah & Surat Pendek

**Versi:** 1.1
**Tanggal:** 9 Agustus 2026
**Platform:** Android (Expo / React Native)
**Mode:** Online, tanpa login/akun

---

## 1. Struktur Navigasi Utama

Aplikasi menggunakan bottom tab navigation dengan 4 tab utama, tanpa proses login/onboarding akun apa pun:

- **Beranda** — ringkasan progres & jalan pintas ke modul
- **Hijaiyah** — daftar 28 huruf
- **Surat Pendek** — daftar surat dari API
- **Progres** — statistik & badge

## 2. Alur 1 — Buka Aplikasi Pertama Kali

1. **Splash Screen** → logo aplikasi tampil singkat sambil aplikasi menyiapkan koneksi & memeriksa cache lokal.
2. **Tidak ada login/registrasi** → pengguna langsung diarahkan ke Beranda.
3. **Beranda (state kosong)** → karena belum ada progres, tampilkan pesan ajakan singkat ("Yuk mulai dari huruf Hijaiyah!") dengan tombol langsung menuju modul Hijaiyah.
4. Jika saat pembukaan pertama tidak ada koneksi internet → tampilkan banner non-blocking "Tidak ada koneksi, sebagian konten mungkin belum bisa dimuat" tetapi UI utama tetap bisa diakses (misal data huruf yang statis tetap tampil).

## 3. Alur 2 — Belajar Huruf Hijaiyah

1. **Tab Hijaiyah** → grid 28 kartu huruf ditampilkan (data lokal, langsung muncul tanpa loading).
2. **Ketuk salah satu kartu** → layar detail huruf terbuka:
   - Tampilkan huruf besar di tengah + 3 varian harakat (fathah, kasrah, dhommah).
   - Tombol putar audio per varian → saat ditekan, tampilkan indikator loading kecil di tombol selama audio streaming dimuat.
   - **Skenario gagal:** jika audio gagal dimuat (koneksi buruk), tampilkan ikon error kecil pada tombol + opsi "Coba lagi", tanpa mengganggu navigasi lain.
3. **Navigasi antar huruf** → tombol next/prev di layar detail agar pengguna bisa lanjut ke huruf berikutnya tanpa kembali ke grid.
4. **Setelah 5–7 huruf dipelajari (dibuka)** → muncul kartu ajakan "Sudah siap kuis huruf ini?" yang bisa dilewati atau langsung dicoba.
5. **Kuis Huruf** (lihat Alur 4).
6. **Kembali ke grid** → huruf yang sudah pernah dibuka ditandai (misal centang kecil) sebagai indikator progres, tersimpan di AsyncStorage.

## 4. Alur 3 — Belajar Surat Pendek

1. **Tab Surat Pendek** → aplikasi memanggil API untuk daftar surat.
   - **State loading** → tampilkan skeleton/list placeholder singkat.
   - **State error** (gagal fetch) → tampilkan pesan "Gagal memuat daftar surat" + tombol "Coba lagi"; jika ada cache daftar surat sebelumnya, tampilkan data cache dengan label kecil "data tersimpan".
2. **Pilih surat dari daftar** → layar detail surat terbuka, aplikasi fetch ayat-ayat surat tersebut (atau ambil dari cache jika pernah dibuka sebelumnya).
3. **Tampilan detail surat:**
   - Ayat ditampilkan berurutan: teks Arab, transliterasi, terjemahan.
   - Tombol putar per ayat, dan tombol "Putar Semua" untuk memutar berurutan otomatis.
   - Saat audio ayat diputar, ayat yang aktif di-highlight dan otomatis scroll mengikuti.
4. **Mode Murajaah (opsional dari layar detail)** → toggle untuk menyembunyikan teks Arab/terjemahan, audio tetap diputar, pengguna menguji hafalan sendiri.
5. **Setelah menyelesaikan seluruh ayat dalam satu surat** → muncul ajakan "Uji hafalanmu dengan kuis?" → lanjut ke Alur 4.
6. **Kembali ke daftar surat** → surat yang sudah pernah dibuka ditandai selesai/progres sebagian, tersimpan lokal.

## 5. Alur 4 — Kuis & Game Interaktif

Alur ini dipakai baik dari modul Hijaiyah maupun Surat Pendek, dengan bank soal berbeda sesuai konteks:

1. **Layar Mulai Kuis** → menampilkan jumlah soal & jenis kuis yang akan dikerjakan, tombol "Mulai".
2. **Soal ditampilkan satu per satu** (progress bar di atas menunjukkan soal ke berapa dari total).
3. **Pengguna menjawab** → feedback instan (benar = animasi/warna hijau singkat, salah = tampilkan jawaban benar dengan warna merah) sebelum otomatis lanjut ke soal berikutnya.
4. **Soal terakhir selesai** → **Layar Hasil**:
   - Skor akhir (mis. 8/10), jumlah bintang yang didapat.
   - Jika ini pertama kali menyelesaikan kuis tersebut, cek apakah memenuhi syarat badge baru → tampilkan animasi "Badge Terbuka!" bila relevan.
   - Tombol "Ulangi Kuis" dan "Kembali ke Materi".
5. Skor & progres kuis disimpan ke AsyncStorage, dipakai untuk update data di tab Progres.

## 6. Alur 5 — Halaman Progres

1. **Tab Progres** → menampilkan dua ringkasan utama: persentase huruf Hijaiyah dikuasai, dan jumlah/persentase surat yang sudah dipelajari.
2. **Daftar Badge** → grid badge yang sudah terbuka (berwarna) dan yang masih terkunci (abu-abu/siluet), masing-masing dengan syarat singkat saat diketuk (mis. "Selesaikan 5 surat untuk membuka badge ini").
3. **Tombol Reset Progres** (opsional) → menampilkan dialog konfirmasi sebelum menghapus seluruh data lokal.
4. Semua data di layar ini dibaca langsung dari AsyncStorage lokal — tidak ada pemanggilan API, sehingga tab ini tetap bisa diakses walau sedang offline.

## 7. Skenario Tepi (Edge Cases) yang Perlu Ditangani

- Pengguna membuka aplikasi tanpa internet sama sekali → tab Hijaiyah & Progres tetap berfungsi (data lokal), tab Surat Pendek menampilkan pesan perlu koneksi kecuali ada cache.
- Audio gagal dimuat di tengah pemutaran otomatis "Putar Semua" → lewati ke ayat berikutnya otomatis + catat log error kecil, jangan hentikan seluruh alur.
- Pengguna menutup aplikasi di tengah kuis → progres kuis yang belum selesai tidak perlu disimpan sebagian; saat dibuka lagi, kuis dimulai dari awal.
- Koneksi lambat saat fetch daftar surat → beri batas waktu (timeout) dan tampilkan opsi "Coba lagi" agar pengguna tidak menunggu tanpa kepastian.
