Product Requirements Document (PRD)

Web Portal Berita Sederhana (Static - GitHub Pages)

Tanggal: 24 Juli 2026
Penulis: [Rahul Subagio]
Status: Draf

1. Pendahuluan
1.1 Tujuan Proyek
Membangun dan meluncurkan sebuah website portal berita yang cepat, responsif, dan ringan. Website ini ditujukan untuk menampilkan artikel berita harian dalam berbagai kategori. Proyek ini dirancang secara khusus sebagai static website agar dapat di-hosting secara gratis menggunakan GitHub Pages.

1.2 Visi Produk
Menyediakan platform baca berita yang bebas gangguan, memuat halaman dengan sangat cepat, dan mudah dipelihara secara teknis bagi pengelola.

2. Target Pengguna
    - Pembaca berita umum yang mencari informasi terkini secara instan.
    - Pengguna mobile yang membutuhkan website berita yang ringan dan tidak memakan banyak kuota.

3. Ruang Lingkup Proyek (Scope)
Karena keterbatasan hosting statis (GitHub Pages), proyek ini tidak akan memiliki:
    - Sistem Login/Register pengguna.
    - Sistem Komentar yang memerlukan database mandiri (bisa menggunakan plugin pihak ketiga seperti Disqus jika diperlukan nanti).
    - Dashboard Admin/CMS dinamis (pembaruan berita akan dilakukan melalui penambahan data di file JSON atau Markdown).

4. Spesifikasi Teknis
    - Hosting: GitHub Pages.
    - Frontend: HTML5, Tailwind CSS (menggunakan CDN), dan Vanilla JavaScript.
    - Manajemen Data: Data artikel/berita akan disimpan dalam format JSON (misal: news-data.json) yang akan di-fetch oleh JavaScript saat halaman dimuat.

5. Fitur Utama
5.1 Halaman Utama (Homepage)
    - Header & Navigasi: Logo portal berita, menu kategori (Pendidikan, Kesehatan, Teknologi,dll).
    - Headline / Breaking News: Menampilkan 1-3 berita utama dengan gambar berukuran besar (Hero Banner).
    - Daftar Berita Terbaru: Menampilkan feed berita berupa grid atau list (Gambar thumbnail, judul, ringkasan singkat, waktu tayang).
    - Footer: Informasi hak cipta, tautan kontak, dan media sosial.

5.2 Halaman Kategori
    - Menampilkan daftar berita yang telah difilter berdasarkan kategori spesifik (contoh: hanya menampilkan berita 'Teknologi').

5.3 Halaman Detail Berita (Baca Artikel)
    - Menampilkan informasi lengkap artikel:
        - Judul Berita.
        - Meta Info (Penulis, Tanggal, Waktu).
        - Gambar Utama Berita.
        - Isi konten teks yang rapi dan berparagraf.
    - Tombol Share (Bagikan ke media sosial seperti WhatsApp/Twitter) menggunakan URL API masing-masing platform.
    - Rekomendasi Berita Lainnya (Di bagian bawah halaman).

5.4 Fitur Pencarian (Search)
    - Kolom pencarian sederhana yang menggunakan JavaScript untuk memfilter judul berita yang ada di dalam file JSON (Client-side rendering).

6. Desain & Antarmuka (UI/UX)
    - Layout: Mobile-first approach (Responsif untuk HP, Tablet, dan Desktop).
    - Tipografi: Menggunakan font yang sangat mudah dibaca (contoh: Inter, Roboto, atau Lora untuk teks konten).
    - Warna Tema: Latar belakang putih/terang dengan teks gelap (Kombinasi warna bersih seperti putih, hitam, dan satu warna aksen seperti merah atau biru gelap untuk kategori/tombol).
    - Performa: Mengoptimalkan ukuran gambar dan minified CSS/JS agar loading sangat cepat.

7. Struktur Data (JSON Mockup)
Untuk menyimpan berita, struktur news-data.json akan seperti ini:

[
  {
    "id": "1",
    "title": "Perkembangan AI di Tahun 2026",
    "category": "Teknologi",
    "author": "Budi Santoso",
    "date": "2026-07-24",
    "thumbnail": "assets/images/ai-news.jpg",
    "summary": "Ringkasan singkat mengenai perkembangan AI...",
    "content": "Isi lengkap berita berparagraf di sini..."
  }
]

