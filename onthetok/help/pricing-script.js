// ===================================================================
// AFFILIATE OS - DYNAMIC PRICING SCRIPT (V2 - DURATION SELECTOR)
// ===================================================================

document.addEventListener('DOMContentLoaded', function () {
    const durationSelector = document.getElementById('duration-selector');
    const pricingCards = document.querySelectorAll('.pricing-card');

    if (!durationSelector) return;

    // STRUKTUR DATA HARGA BARU (SUMBER KEBENARAN)
    const pricingData = {
        starter: {
            1: { totalPrice: "Rp 589K", monthlyPrice: "", strikethrough: "", savings: "Fleksibilitas Penuh", period: "/bulan", checkoutLink: "https://flexeet.myscalev.com/onthetok" },
            3: { totalPrice: "Rp 1.509K", monthlyPrice: "setara Rp 503rb/bln", strikethrough: "Rp 1.766.460", savings: "Hemat 15% (Rp 257.240)", period: "/3 bln", checkoutLink: "https://flexeet.myscalev.com/onthetok" },
            6: { totalPrice: "Rp 2.654K", monthlyPrice: "setara Rp 442rb/bln", strikethrough: "Rp 3.532.920", savings: "Hemat 25% (Rp 878.920)", period: "/6 bln", checkoutLink: "https://flexeet.myscalev.com/onthetok" },
            12: { totalPrice: "Rp 4.719K", monthlyPrice: "setara Rp 393rb/bln", strikethrough: "Rp 7.065.840", savings: "GRATIS 4 BULAN!", period: "/tahun", checkoutLink: "https://flexeet.myscalev.com/onthetok" }
        },
        growth: {
            1: { totalPrice: "Rp 1.415K", monthlyPrice: "", strikethrough: "", savings: "Paling Populer & Fleksibel", period: "/bulan", checkoutLink: "https://flexeet.myscalev.com/onthetok" },
            3: { totalPrice: "Rp 3.610K", monthlyPrice: "setara Rp 1,2jt/bln", strikethrough: "Rp 4.244.460", savings: "Hemat 15% (Rp 634.840)", period: "/3 bln", checkoutLink: "https://flexeet.myscalev.com/onthetok" },
            6: { totalPrice: "Rp 6.371K", monthlyPrice: "setara Rp 1,06jt/bln", strikethrough: "Rp 8.488.920", savings: "Hemat 25% (Rp 2.117.920)", period: "/6 bln", checkoutLink: "https://flexeet.myscalev.com/onthetok" },
            12: { totalPrice: "Rp 11.327K", monthlyPrice: "setara Rp 944rb/bln", strikethrough: "Rp 16.977.840", savings: "GRATIS 4 BULAN!", period: "/tahun", checkoutLink: "https://flexeet.myscalev.com/onthetok" }
        },
        scale: {
            1: { totalPrice: "Rp 4.129K", monthlyPrice: "", strikethrough: "", savings: "Kekuatan Penuh Agensi", period: "/bulan", checkoutLink: "https://flexeet.myscalev.com/onthetok" },
            3: { totalPrice: "Rp 10.536K", monthlyPrice: "setara Rp 3,5jt/bln", strikethrough: "Rp 12.386.460", savings: "Hemat 15% (Rp 1.850.240)", period: "/3 bln", checkoutLink: "https://flexeet.myscalev.com/onthetok" },
            6: { totalPrice: "Rp 18.584K", monthlyPrice: "setara Rp 3,1jt/bln", strikethrough: "Rp 24.772.920", savings: "Hemat 25% (Rp 6.188.920)", period: "/6 bln", checkoutLink: "https://flexeet.myscalev.com/onthetok" },
            12: { totalPrice: "Rp 33.039K", monthlyPrice: "setara Rp 2,75jt/bln", strikethrough: "Rp 49.545.840", savings: "GRATIS 4 BULAN!", period: "/tahun", checkoutLink: "https://flexeet.myscalev.com/onthetok" }
        }
    };

    function updatePricing(duration) {
        pricingCards.forEach(card => {
            const packageName = card.dataset.package;
            if (!packageName || !pricingData[packageName] || !pricingData[packageName][duration]) return;

            const data = pricingData[packageName][duration];

            // Dapatkan semua elemen di dalam kartu
            const priceEl = card.querySelector('.price');
            const periodEl = card.querySelector('.price-period');
            const strikethroughEl = card.querySelector('.price-strikethrough');
            const effectiveEl = card.querySelector('.price-effective');
            const savingsEl = card.querySelector('.price-savings');
            const ctaButton = card.querySelector('.cta-button');

            // Update konten elemen
            priceEl.textContent = data.totalPrice;
            periodEl.textContent = data.period;
            strikethroughEl.textContent = data.strikethrough;
            effectiveEl.textContent = data.monthlyPrice;
            savingsEl.textContent = data.savings;

            // Update teks tombol CTA
            const durationText = { '1': 'Bulanan', '3': '3 Bulan', '6': '6 Bulan', '12': 'Tahunan' }[duration];
            ctaButton.textContent = `Pilih ${packageName.charAt(0).toUpperCase() + packageName.slice(1)} ${durationText}`;

            // BARIS BARU: Update link checkout pada tombol
            ctaButton.href = data.checkoutLink;

            // Tampilkan atau sembunyikan elemen berdasarkan data
            strikethroughEl.style.display = data.strikethrough ? 'block' : 'none';
            effectiveEl.style.display = data.monthlyPrice ? 'block' : 'none';
            savingsEl.style.display = data.savings ? 'block' : 'none';
        });
    }

    // Event listener untuk tombol durasi
    durationSelector.addEventListener('click', (e) => {
        const selectedButton = e.target.closest('.duration-btn');
        if (!selectedButton) return;

        // Hapus kelas 'active' dari semua tombol
        durationSelector.querySelectorAll('.duration-btn').forEach(btn => btn.classList.remove('active'));
        
        // Tambahkan kelas 'active' ke tombol yang diklik
        selectedButton.classList.add('active');
        
        // Panggil fungsi update dengan durasi yang dipilih
        const selectedDuration = selectedButton.dataset.duration;
        updatePricing(selectedDuration);
    });

    // Panggil fungsi saat halaman dimuat untuk set ke state default (Tahunan)
    updatePricing('12');
});