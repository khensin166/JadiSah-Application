# API.md

## 1. Tujuan
File ini mendokumentasikan konvensi API dan aturan komunikasi antara aplikasi Frontend (Next.js) dan Backend (Go).

## 2. Konfigurasi Dasar
Semua endpoint Backend dikelompokkan di bawah *prefix* `/api`.
- **Environment Staging:** `http://staging.100.79.211.49.nip.io/api`
- **Environment Production:** `http://production.100.79.211.49.nip.io/api`
- **Format Pertukaran Data:** JSON.

## 3. Konvensi Endpoint
Gunakan kata benda (*nouns*) jamak untuk penamaan *resource* di URL (RESTful API standar).
- `GET    /api/users`      (Mendapatkan semua user)
- `GET    /api/users/:id`  (Mendapatkan satu user)
- `POST   /api/users`      (Membuat user baru)
- `PUT    /api/users/:id`  (Mengupdate user)
- `DELETE /api/users/:id`  (Menghapus user)

## 4. Format Response Seragam
Semua respons API wajib mengikuti format objek pembungkus (*wrapper*) berikut agar Frontend mudah mem-parsing-nya.

**Respons Sukses (200 / 201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Contoh Nama"
  }
}
```

**Respons Error (400 / 401 / 500):**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Pesan error yang ramah pengguna."
  }
}
```

## 5. Status Codes HTTP yang Disepakati
- `200` - Permintaan sukses.
- `201` - Resource sukses dibuat (untuk respon `POST`).
- `400` - Input tidak valid (*Bad Request* / Validasi Gagal).
- `401` - Wajib login (*Unauthorized* / Token Hilang).
- `403` - Login berhasil, tapi dilarang mengakses ini (*Forbidden* / Role tidak sesuai).
- `404` - Data/URL tidak ditemukan (*Not Found*).
- `500` - Error di sistem Backend (*Internal Server Error*).

## 6. Autentikasi
Untuk endpoint yang diproteksi, Frontend wajib menyisipkan token ke dalam *HTTP Headers*:
`Authorization: Bearer <token_anda_disini>`

(Atau sesuai yang disepakati, misal via Cookie `httpOnly`).

## 7. Integrasi Pihak Ketiga (Third-Party APIs)
Setiap kali tim menggunakan layanan luar (misal: Midtrans, Xendit, AWS S3), wajib tambahkan ke dokumentasi ini:
- **Nama Provider:** Midtrans
- **Tujuan:** Payment Gateway
- **Webhooks:** `/api/webhooks/midtrans`
- **Secret Keys:** Hanya dikelola di environment server (sesuai `SECURITY.md`).
