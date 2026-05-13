const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const snap = document.getElementById('snap');
const photo = document.getElementById('photo');
const logData = document.getElementById('log-data');
const statusLokasi = document.getElementById('status-lokasi');

// 1. Akses Kamera
navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(err => {
        console.error("Gagal akses kamera: ", err);
        alert("Mohon izinkan akses kamera untuk absen.");
    });

// 2. Ambil Lokasi Otomatis
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            statusLokasi.innerText = `Lokasi: ${lat}, ${lon}`;
            return { lat, lon };
        }, (error) => {
            statusLokasi.innerText = "Gagal mendapatkan lokasi.";
        });
    }
}

// Jalankan pencarian lokasi saat page load
getLocation();

// 3. Logika Ambil Foto & Data
snap.addEventListener("click", () => {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/png');
    const now = new Date();
    const waktuString = now.toLocaleDateString('id-ID') + " " + now.toLocaleTimeString('id-ID');

    // Tampilkan hasil ke user
    photo.src = dataUrl;
    photo.style.display = 'block';
    
    const dataAbsen = {
        waktu: waktuString,
        lokasi: statusLokasi.innerText,
        keterangan: "Absen Berhasil"
    };

    logData.innerText = JSON.stringify(dataAbsen, null, 2);
    
    // Di sini Anda bisa menambahkan fungsi fetch() untuk mengirim dataUrl dan dataAbsen ke database/backend
    console.log("Data siap dikirim ke server:", dataAbsen);
});
