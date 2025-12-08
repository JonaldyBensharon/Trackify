// Daftar halaman yang diproteksi 
const protectedPages = [
    'beranda.html',
    'profile.html',
    'repositori.html',
    'agenda.html',
    'fokus.html'
];

// Ambil token dari sessionStorage
const token = sessionStorage.getItem('token');

// Fungsi untuk redirect ke login
function redirectToLogin() {
    window.location.href = 'index.html';
}

// Cek token
if (!token) {
    redirectToLogin();
}

window.addEventListener('pageshow', (event) => {
    if (!sessionStorage.getItem('token')) {
        redirectToLogin();
    }
});

// Optional: jika ingin menghapus token saat browser ditutup
// sessionStorage otomatis hilang saat browser/tab ditutup
// Jadi tidak perlu log-out eksplisit jika pakai sessionStorage
