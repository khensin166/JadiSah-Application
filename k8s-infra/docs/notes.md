1.coredns: Ini adalah "buku telepon"-nya Kubernetes. Tanpa ini, aplikasi-aplikasi di dalam cluster tidak akan tahu cara memanggil satu sama lain berdasarkan nama.
2.local-path-provisioner: Ini adalah fitur dari K3s untuk manajemen penyimpanan (storage). Nanti jika database PostgreSQL Anda meminta tempat penyimpanan data (Persistent Volume), pod inilah yang akan membuatkan foldernya di sisa disk 1TB Anda.
3.metrics-server: Alat pemantau internal. Fungsinya untuk melihat berapa persen CPU dan RAM yang digunakan oleh setiap aplikasi Anda (nanti Anda bisa coba perintah kubectl top nodes atau kubectl top pods).
4.traefik: Ini adalah Ingress Controller atau "Satpam Pintu Masuk". Nanti, semua traffic HTTP/HTTPS (misalnya dari user yang membuka web jadisah.com) akan ditangkap oleh Traefik terlebih dahulu, lalu Traefik akan membagi jalur (routing) apakah permintaan itu harus diarahkan ke Frontend Next.js atau ke Backend Go API.

====================================
1.Control Plane / Master: Mengatur jaringan, menjadwalkan pod, dan menyimpan state (di database internal K3s).
2.Worker: Mengeksekusi dan menjalankan container/pod (terbukti Nginx tadi bisa berjalan di node ini).