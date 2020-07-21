const CACHE_NAME = "first-pwa-v1";

// variabel urlsToCache untuk memudahkan menulis daftar aset
// dan halaman mana saja yang akan disimpan ke dalam cache
var urlsToCache = [
    //update variabel ini ketika terdapat penambahan file
    "/",

    "/nav.html",
    "/index.html",
    "/manifest.json",

    "/icons/Icon-72.png",
    "/icons/Icon-96.png",
    "/icons/Icon-128.png",
    "/icons/Icon-144.png",
    "/icons/Icon-192.png",
    "/icons/Icon-256.png",
    "/icons/Icon-512.png",

    "/images/html.png",
    "/images/css.png",
    "/images/js.png",
    "/images/mysql.png",
    "/images/me.jpg",
    "/images/dompetku.jpg",
    "/images/hp.png",
    "/images/pendaki.jpg",
    "/images/pengaduan.png",

    "/pages/home.html",
    "/pages/about.html",
    "/pages/skills.html",
    "/pages/portfolio.html",

    "/css/materialize.min.css",
    "/css/style.css",

    "/js/materialize.min.js",
    "/js/nav.js"
];

// Kemudian kita daftarkan event listener untuk event install
// yang akan dipanggil setelah proses registrasi service worker berhasil.
self.addEventListener("install", function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            // Setelah cache dibuka, kita langsung menyimpan aset ke dalam
            // cache tersebut sejumlah daftar aset yang sudah kita buat pada
            // variable urlsToCache menggunakan method cache.addAll()
            return cache.addAll(urlsToCache);
            // cek cache yang sudah terdaftar pada DevTools tab Application bagian Cache Storage
        })
    );
});

// agar halaman menggunakan aset yang sudah disimpan di cache
self.addEventListener("fetch", function (event) {
    event.respondWith(
        caches
            .match(event.request, { cacheName: CACHE_NAME })
            .then(function (response) {
                if (response) {
                    console.log("ServiceWorker: Gunakan aset dari cache: ", response.url);
                    return response;
                }

                console.log(
                    "ServiceWorker: Memuat aset dari server: ",
                    event.request.url
                );
                return fetch(event.request);
            })
    );
});

// membuat mekanisme penghapusan cache yang lama agar tidak membebani pengguna.
self.addEventListener("activate", function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheName != CACHE_NAME) {
                        console.log("ServiceWorker: cache " + cacheName + " dihapus");
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
// Pada kode di atas kita mendaftarkan event listener untuk event activate
// service worker yang akan dipanggil saat service worker diaktifkan, sesaat
// setelah proses instalasi service worker. Pertama-tama kita ambil dahulu semua
// nama cache yang sudah terdaftar. Kemudian satu per satu kita cek bila nama
// cachenya tidak sama dengan nama cache yang sedang digunakan oleh service worker,
// maka kita panggil di dalam method caches.delete() untuk dihapus.
