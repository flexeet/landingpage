document.addEventListener('DOMContentLoaded', () => {
    // === KONSTANTA BERBASIS RUPIAH ===
    const COST_PER_CHAT_STANDARD = 500; // Biaya Rp 500 per chat tanpa Flexeet
    const COST_PER_CHAT_FLEXEET = 90;   // Biaya Rp 90 per chat dengan Flexeet
    const CLOSING_RATE = 0.05;          // Asumsi closing rate 5%

    // === ELEMEN DOM ===
    const targetCustomersInput = document.getElementById('target-customers');
    const chatAverageInput = document.getElementById('chat-average');

    // Hentikan eksekusi jika elemen kalkulator tidak ditemukan
    if (!targetCustomersInput || !chatAverageInput) {
        console.log('Elemen kalkulator tidak ditemukan di halaman ini.');
        return;
    }

    // === FUNGSI BANTU ===
    const formatRupiah = (num) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0
        }).format(num);
    };
    const formatNumber = (num) => {
        return new Intl.NumberFormat('id-ID').format(num);
    };

    // === FUNGSI KALKULASI UTAMA ===
    const updateCalculator = () => {
        // 1. AMBIL NILAI DARI INPUT
        let targetCustomers = parseInt(targetCustomersInput.value.replace(/\D/g, '')) || 1000;
        let chatAverage = parseInt(chatAverageInput.value.replace(/\D/g, '')) || 10;

        // 2. VALIDASI INPUT
        if (targetCustomers < 1) targetCustomers = 1;
        if (chatAverage < 1) chatAverage = 1;

        // 3. KALKULASI KARTU PERBANDINGAN
        // Sisi Tanpa Flexeet (Patokan Budget)
        const standardReach = targetCustomers;
        const calculatedBudget = standardReach * chatAverage * COST_PER_CHAT_STANDARD;
        const standardClosing = Math.floor(standardReach * CLOSING_RATE);

        // Sisi Dengan Flexeet (Menggunakan Budget yang Sama)
        const flexeetCostPerCustomer = chatAverage * COST_PER_CHAT_FLEXEET;
        const flexeetReach = (flexeetCostPerCustomer > 0) ? Math.floor(calculatedBudget / flexeetCostPerCustomer) : 0;
        const flexeetClosing = Math.floor(flexeetReach * CLOSING_RATE);

        // 4. UPDATE TAMPILAN KARTU
        // Kartu "Tanpa Flexeet"
        document.getElementById('standard-reach').textContent = formatNumber(standardReach);
        document.getElementById('standard-budget').textContent = formatRupiah(calculatedBudget);
        document.getElementById('standard-closing').textContent = formatNumber(standardClosing);

        // Kartu "Dengan Flexeet"
        document.getElementById('flexeet-reach').textContent = formatNumber(flexeetReach);
        document.getElementById('flexeet-budget').textContent = formatRupiah(calculatedBudget);
        document.getElementById('flexeet-closing').textContent = formatNumber(flexeetClosing);

        // 5. KALKULASI & UPDATE IMPACT BOX (BAGIAN BARU)
        // Hitung Metrik Impact
        const growthMultiplier = (standardReach > 0) ? (flexeetReach / standardReach).toFixed(1) : 0;
        const extraClosings = flexeetClosing - standardClosing;

        // Update Elemen Impact Box
        document.getElementById('growth-factor').textContent = `${growthMultiplier}x`;
        document.getElementById('extra-revenue').textContent = `+${formatNumber(extraClosings)}`;
        document.getElementById('roi-time').textContent = '2'; // Tetap statis untuk saat ini

        // 6. UPDATE PESAN HERO
        const heroMessage = document.querySelector('.calc-hero p');
        if (heroMessage) {
            heroMessage.innerHTML = `Dengan budget yang sama, mau handle <strong>${formatNumber(standardReach)}</strong> customer atau <strong>${formatNumber(flexeetReach)}</strong> customer?`;
        }
    };

    // === EVENT LISTENERS ===
    targetCustomersInput.addEventListener('input', updateCalculator);
    chatAverageInput.addEventListener('input', updateCalculator);
    
    // Inisialisasi kalkulator saat halaman dimuat
    updateCalculator();
});