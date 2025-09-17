# Proyek API Gemini AI

## 📋 Gambaran Proyek

Proyek ini adalah implementasi **Back-End Gemini AI berbasis Node.js** sebagai bagian dari submission untuk **Hacktiv-8**. Aplikasi dirancang sebagai RESTful API yang terintegrasi dengan model AI Gemini dari Google, mendukung generasi konten berbasis AI dari berbagai jenis input: teks, gambar, audio, hingga dokumen.

## 🚀 Fitur Utama

### Fungsionalitas Inti

* **Pemrosesan AI Multi-Modal**: Mendukung input teks, gambar, audio, dan dokumen.
* **Sistem Fallback Model Otomatis**: Memastikan keandalan dengan beralih otomatis antar-model Gemini.
* **Dukungan Upload File**: Mampu menangani berbagai format file dengan deteksi MIME cerdas.
* **Penanganan Error Terstruktur**: Logging detail dan kode status HTTP sesuai standar.
* **Desain RESTful API**: Endpoint bersih, intuitif, dan mudah diintegrasikan.

### Endpoint Utama

#### 1. **Generasi Teks** (`POST /generate-text`)

* Menghasilkan respons AI dari input teks.
* Input/output berbasis JSON.
* Cocok untuk chatbot atau pembuatan konten dinamis.

#### 2. **Analisis Gambar** (`POST /generate-from-image`)

* Menganalisis serta memberikan deskripsi gambar.
* Mendukung berbagai format (JPEG, PNG, dll.).
* Dapat menggunakan prompt kustom.

#### 3. **Pemrosesan Audio** (`POST /generate-from-audio`)

* Transkripsi dan analisis audio secara otomatis.
* Mendukung format MP3, WAV, WebM.
* Deteksi MIME otomatis untuk file audio.

#### 4. **Pemrosesan Dokumen** (`POST /generate-from-document`)

* Mengekstrak konten sekaligus meringkas dokumen.
* Mendukung PDF dan format umum lainnya.
* Ringkasan adaptif berdasarkan prompt kustom.

## 🛠️ Teknologi yang Digunakan

### Teknologi Inti

* **Node.js**: Lingkungan runtime JavaScript.
* **Express.js**: Framework server-side untuk Node.js.
* **Google GenAI SDK**: SDK resmi integrasi Gemini AI (`@google/genai`).

### Dependensi Pendukung

* **dotenv**: Manajemen variabel lingkungan.
* **multer**: Middleware upload file.
* **express**: Framework inti untuk server API.

### Model AI

Aplikasi menggunakan beberapa model Gemini dengan sistem fallback otomatis:

* `gemini-2.5-flash` (utama)
* `gemini-2.5-flash-preview-05-20`
* `gemini-2.5-flash-lite`
* `gemini-2.5-flash-lite-06-17`
* `gemini-2.0-flash`
* `gemini-2.0-flash-001`
* `gemini-2.0-flash-exp`
* `gemini-2.0-flash-lite`
* `gemini-2.0-flash-lite-001`

## 📁 Struktur Proyek

```
gemini-ai-api-project/
├── index.js              # File aplikasi utama
├── index-backup.js       # Versi cadangan (khusus teks)
├── package.json          # Konfigurasi dependensi & skrip
├── README.md             # Dokumentasi proyek
├── contoh-curl.md        # Contoh request cURL
├── upload/               # File sampel untuk pengujian
│   ├── audio.mp3
│   ├── gambar.jpg
│   └── dokumen.pdf
└── .env                  # Variabel lingkungan (tidak dilacak)
```

## 🔧 Instalasi & Pengaturan

### Prasyarat

* Node.js (v14 atau lebih baru).
* npm atau yarn.
* API Key Google AI.

### Langkah Instalasi

1. Clone repository:

   ```bash
   git clone https://github.com/salambudiarto/gemini-ai-api-project.git
   cd gemini-ai-api-project
   ```

2. Install dependensi:

   ```bash
   npm install
   ```

3. Atur variabel lingkungan dengan membuat file `.env`:

   ```env
   API_KEY=api_key_google_ai_anda
   PORT=3000
   ```

4. Jalankan server:

   ```bash
   node index.js
   ```

Server akan aktif di `http://localhost:3000`

## 📚 Dokumentasi API

### URL Dasar

```
http://localhost:3000
```

### Contoh Endpoint

#### Generasi Teks (`POST /generate-text`)

Request:

```json
{
  "prompt": "Jelaskan cara kerja AI dalam 1 kalimat"
}
```

Response:

```json
{
  "model": "gemini-2.5-flash",
  "result": "AI bekerja dengan memproses data melalui model pembelajaran mesin."
}
```

Contoh cURL:

```bash
curl -X POST http://localhost:3000/generate-text \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Jelaskan cara kerja AI dalam 1 kalimat"}'
```

(Endpoint gambar, audio, dan dokumen dijelaskan detail dalam file `contoh-curl.md`).

## 🔄 Sistem Fallback Model

* **Prioritas Utama**: `gemini-2.5-flash`.
* **Fallback Otomatis**: Jika model gagal (503/429), sistem mencoba model alternatif.
* **Logging Lengkap**: Semua percobaan dicatat untuk debugging.

## 🛡️ Penanganan Error

* **Validasi Input**: Memastikan field & file wajib tersedia.
* **Fallback Otomatis**: Model lain digunakan jika model utama gagal.
* **Deteksi MIME**: Menentukan tipe file dengan akurat.
* **HTTP Status Code**: Menggunakan kode yang sesuai standar.

Contoh respons error:

```json
{
  "error": "Prompt is required"
}
```

## 📝 Dukungan File

### Jenis File

* **Gambar**: JPEG, PNG, GIF, WebP.
* **Audio**: MP3, WAV, WebM.
* **Dokumen**: PDF, serta format umum lain yang didukung Gemini.

### Deteksi MIME

* Deteksi otomatis via header file.
* Fallback berbasis ekstensi.
* Override manual tersedia.

## 🧪 Testing

File contoh tersedia di folder `upload/`. Semua request uji coba dapat dilakukan melalui `contoh-curl.md`.

## 🚀 Deployment

### Variabel Lingkungan

```env
API_KEY=api_key_google_ai_anda
PORT=3000
```

### Pertimbangan Produksi

* Gunakan **PM2** untuk manajemen proses.
* Terapkan rate limiting pada endpoint.
* Tambahkan autentikasi & otorisasi sesuai kebutuhan.
* Atur konfigurasi CORS yang aman.
* Implementasikan monitoring dan logging.

## 📊 Performa

* Upload file efisien menggunakan multer.
* Optimisasi memori untuk file besar.
* Sistem fallback mengurangi potensi downtime.
* Logging detail untuk pemantauan.

## 🎯 Tujuan Proyek

Proyek ini bertujuan untuk mendemonstrasikan:

* Pembangunan **RESTful API** dengan Node.js & Express.
* Integrasi AI generatif dengan model Gemini Google.
* Pemrosesan file multi-format (gambar, audio, dokumen).
* Implementasi error handling dan fallback yang robust.
* Dokumentasi API yang terstruktur dan mudah dipahami.

## 🤝 Kontribusi

Proyek ini dikembangkan sebagai bagian dari program pembelajaran Hacktiv-8.

## 📄 Lisensi

Menggunakan lisensi ISC.

## 👨‍💻 Penulis

**Salam Budiarto**

* GitHub: [@salambudiarto](https://github.com/salambudiarto)
* Repo: [gemini-ai-api-project](https://github.com/salambudiarto/gemini-ai-api-project)

## 🔍 Detail Implementasi

### Arsitektur

* **Routing**: Endpoint API terorganisir.
* **Middleware**: Penanganan upload file.
* **Service Layer**: Logika bisnis AI.
* **Error Handling**: Terpusat & terstruktur.

### Keamanan

* Validasi input ketat.
* Validasi tipe file.
* Sanitasi error message.

### Performa

* Streaming untuk file besar.
* Optimisasi memori.
* Potensi implementasi caching di masa depan.

---

**Catatan**: Proyek ini merupakan submission Hacktiv-8 dengan implementasi 4 endpoint utama untuk generasi konten berbasis AI multi-modal.
