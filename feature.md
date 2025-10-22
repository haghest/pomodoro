# Progress ring
# Auto-switch Mode
→ Setelah 25 menit fokus selesai → otomatis ganti ke break, bunyi, dan jeda menunggu user klik “Start” lagi.
Notification API (Desktop Notification)
→ Kirim notifikasi sistem “Focus session complete!” saat tab tidak aktif.
(Gunakan Notification.requestPermission() dan new Notification(...)).
Custom Duration
→ User bisa atur durasi fokus & break (misal 25/5 atau 45/15).
(Gunakan modal atau slider dari Shadcn untuk UX yang clean).
Persistent State (LocalStorage)
→ Menyimpan mode, waktu tersisa, dan tema meskipun browser di-refresh.


Session Tracker / Statistik Sederhana
→ Hitung berapa kali user menyelesaikan sesi fokus hari ini.
→ Bisa pakai localStorage untuk simpan count harian.
Widget Mode / Minimal Floating Timer
→ Mode mini (floating) biar bisa dibiarkan di pojok layar saat multitasking.
User Profile + Cloud Sync (Auth + DB)
→ Simpan preferensi dan statistik di Supabase / Firebase.
Theme Variants / Dynamic Accent
→ Pilihan warna utama (merah, biru, ungu) sesuai mood user.
“Long Break” otomatis setiap 4 sesi
→ Fitur khas metode Pomodoro asli (misal: 25-5-25-5-25-15).
PWA (Progressive Web App)
→ Bisa di-install di desktop atau HP seperti aplikasi native.