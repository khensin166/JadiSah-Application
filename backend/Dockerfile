# Multi-stage build untuk Go Backend
# Stage 1: Builder - Compile kode Go menjadi binary
FROM golang:1.26-alpine AS builder

# Install dependensi sistem yang dibutuhkan
RUN apk add --no-cache git ca-certificates tzdata

WORKDIR /app

# Copy go.mod dan go.sum dahulu (Layer caching: jika dependensi tidak berubah, Docker tidak perlu download ulang)
COPY go.mod go.sum ./
RUN go mod download

# Copy seluruh source code
COPY . .

# Build binary yang ringan (CGO_ENABLED=0 agar binary bisa berjalan di Alpine Linux)
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-w -s" -o /app/server .

# Stage 2: Runner - Image final yang sangat kecil dan aman
FROM alpine:3.19

# Install certificate agar bisa melakukan HTTPS requests ke layanan luar
RUN apk add --no-cache ca-certificates tzdata

# Jangan jalankan aplikasi sebagai root (Security Best Practice)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Salin hanya binary hasil kompilasi dari stage 1
COPY --from=builder /app/server /app/server

# Kepemilikan file diberikan ke user non-root
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 8080

CMD ["/app/server"]
