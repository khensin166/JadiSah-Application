# API Documentation (`API.md`)

## 1. Pendahuluan & Filosofi Contract-First
Aplikasi JadiSah menerapkan pendekatan **Contract-First**. Spesifikasi resmi OpenAPI (`backend/api/openapi.yaml`) bertindak sebagai **Single Source of Truth (SSOT)**.
- Kode Go server di-generate secara otomatis menggunakan `oapi-codegen` ke `backend/generated/api/server.gen.go`.
- Pengujian API, dokumentasi interaktif, dan simulasi request dikelola menggunakan koleksi **Bruno** di folder `backend/bruno/`.

---

## 2. Konfigurasi Lingkungan (Environments)
Semua endpoint Backend berada di bawah prefix rute `/api`.

| Environment | URL Base | Keterangan |
| :--- | :--- | :--- |
| **Local Development** | `http://localhost:8080/api` | Koneksi langsung ke binary lokal Go |
| **K8s Staging Proxy** | `http://staging.100.79.211.49.nip.io/api` | Melalui Traefik Ingress staging |
| **K8s Pod Internal** | `http://backend-service.jadisah-staging.svc.cluster.local:8080/api` | Rewrite internal dari pod Next.js |
| **Production** | `http://production.100.79.211.49.nip.io/api` | Traefik Ingress cluster production |

> **Koneksi Port-Forward Staging:**
> ```bash
> kubectl port-forward svc/backend-service 8080:80 -n staging
> ```

---

## 3. Autentikasi & Sesi
Autentikasi ditangani oleh modul terintegrasi [Limen](https://limenauth.dev):
1. **Web Browser (Next.js Frontend):**
   - Menggunakan cookie HTTP-only `limen_session` yang dikelola secara otomatis oleh browser dan diproksi via Next.js server actions / rewrites.
2. **Klien API / Bruno / Mobile:**
   - Setelah login berhasil, server mengirimkan header `Set-Auth-Token`.
   - Klien menyertakan token tersebut di header:
     ```http
     Authorization: Bearer <token>
     ```

---

## 4. Status Codes HTTP Resmi

| Kode | Nama | Keterangan Penggunaan |
| :--- | :--- | :--- |
| `200` | **OK** | Permintaan berhasil dan data disertakan dalam response body. |
| `201` | **Created** | Resource baru berhasil dibuat (misal: pengiriman undangan baru). |
| `204` | **No Content** | Permintaan berhasil tanpa konten body (misal: logout, atau pengecekan pasangan untuk role `ADMIN` / `SUPER_ADMIN` dalam Mode Concierge). |
| `400` | **Bad Request** | Parameter atau body JSON tidak valid menurut skema API. |
| `401` | **Unauthorized** | Sesi tidak valid, token kedaluwarsa, atau kredensial salah. |
| `403` | **Forbidden** | Pengguna terotentikasi tidak memiliki hak izin (*permission*) untuk aksi ini. |
| `404` | **Not Found** | Data target tidak ditemukan di sistem. |
| `409` | **Conflict** | Terjadi konflik logika bisnis (misal: Super Admin mencabut role Super Admin miliknya sendiri, atau mengundang pasangan yang sudah punya tautan aktif). |
| `422` | **Unprocessable Entity** | Validasi input spesifik gagal (misal: kriteria password kurang aman). |
| `500` | **Internal Server Error** | Kesalahan internal server (dilengkapi `trace_id` pada log terstruktur). |

---

## 5. Ringkasan Endpoint API

### A. Sistem & Health Check (`tags: [system]`)
| Method | Endpoint | Auth | Deskripsi |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/ping` | Publik | Health check ketersediaan server (`{"message": "pong"}`). |

### B. Autentikasi Limen (`tags: [auth]`)
| Method | Endpoint | Auth | Deskripsi |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup/credential` | Publik | Registrasi pengguna baru dengan email & password. |
| `POST` | `/api/auth/signin/credential` | Publik | Login pengguna dengan email & password. |
| `GET` | `/api/auth/me` | Bearer/Cookie | Mendapatkan sesi aktif dan user login. |
| `POST` | `/api/auth/signout` | Bearer/Cookie | Mengakhiri sesi aktif saat ini (`204 No Content`). |
| `GET` | `/api/auth/sessions` | Bearer/Cookie | Mengambil daftar sesi dan perangkat aktif. |
| `POST` | `/api/auth/revoke-sessions` | Bearer/Cookie | Mencabut semua sesi aktif lainnya (`204 No Content`). |
| `POST` | `/api/auth/passwords/change` | Bearer/Cookie | Mengubah password pengguna aktif. |
| `POST` | `/api/auth/passwords/request-reset`| Publik | Meminta token reset password via email. |
| `POST` | `/api/auth/passwords/reset` | Publik | Mengubah password menggunakan token reset. |

### C. Profil Pengguna (`tags: [users]`)
| Method | Endpoint | Auth | Deskripsi |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users/me` | Bearer/Cookie | Mengambil profil lengkap user login (nama, email, role, izin, subscription tier, dan data ringkas pasangan). |
| `PATCH` | `/api/users/me` | Bearer/Cookie | Memperbarui nama profil pengguna (`first_name`, `last_name`). |

### D. Pasangan & Undangan (`tags: [couples]`)
| Method | Endpoint | Auth | Status Codes & Deskripsi |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/couples/me` | Bearer/Cookie | **200 OK**: Objek `CoupleLink` aktif (`ACCEPTED`).<br>**204 No Content**: *Mode Concierge Administrator* (User ber-role `ADMIN` / `SUPER_ADMIN` tidak memerlukan tautan pasangan).<br>**404 Not Found**: User biasa belum memiliki pasangan aktif. |
| `DELETE` | `/api/couples/me` | Bearer/Cookie | **200 OK**: Memutuskan tautan pasangan aktif (`status` di database menjadi `UNLINKED`). |
| `GET` | `/api/couples/invitations` | Bearer/Cookie | **200 OK**: Mendapatkan daftar undangan berstatus `PENDING` (`incoming` & `outgoing`). |
| `POST` | `/api/couples/invitations` | Bearer/Cookie | **201 Created**: Mengirim undangan tautan pasangan berdasarkan email target. |
| `POST` | `/api/couples/invitations/:invitationId/accept` | Bearer/Cookie | **200 OK**: Menerima undangan pasangan (hanya oleh pihak tertuju). Membatalkan undangan pending lainnya. |
| `POST` | `/api/couples/invitations/:invitationId/reject` | Bearer/Cookie | **200 OK**: Menolak undangan pasangan (hanya oleh pihak tertuju). |
| `DELETE`| `/api/couples/invitations/:invitationId` | Bearer/Cookie | **200 OK / 204**: Membatalkan undangan pasangan yang telah dikirim (hanya oleh pengirim). |

### E. Administrasi IAM (`tags: [admin]`)
*Endpoint di bawah ini dilindungi otorisasi Role-Based Access Control (RBAC).*

| Method | Endpoint | Izin Wajib | Deskripsi |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/roles` | `roles:read` | Mengambil seluruh daftar role (`SUPER_ADMIN`, `ADMIN`, `USER`) dan relasi permission-nya. |
| `GET` | `/api/admin/users` | `users:read` | Mengambil daftar pengguna dengan filter nama/email (`q`), nomor halaman (`page`), dan batas data (`per_page`, max 100). |
| `PUT` | `/api/admin/users/:userId/roles` | `roles:assign` | Mengubah role akun pengguna.<br>*Guard:* Super Admin dilarang mencabut role Super Admin dari dirinya sendiri (**409 Conflict**). |
| `PUT` | `/api/admin/users/:userId/subscription` | `subscriptions:update` | Mengubah tier langganan (`FREE`, `PREMIUM`, `VIP`) dan tanggal kedaluwarsa.<br>*Catatan:* Mengubah tier ke `FREE` otomatis mengosongkan `expires_at: null`. |

---

## 6. Koleksi Pengujian Bruno (`backend/bruno/`)
Setiap rute di atas memiliki file request `.bru` yang siap dieksekusi di Bruno Client dengan konfigurasi environment:
- `Local`: `{{url}}` = `http://localhost:8080`
- `Staging`: `{{url}}` = `http://staging.100.79.211.49.nip.io`

Setiap file `.bru` menyertakan blok `docs {}` yang merinci parameter, header, dan status respons yang diharapkan.
