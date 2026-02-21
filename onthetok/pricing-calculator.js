// ===================================================================
// AFFILIATE OS - PRICING RECOMMENDATION CALCULATOR (V2.1 - ROBUST)
// ===================================================================

document.addEventListener('DOMContentLoaded', function() {
    
    const affiliatorInput = document.getElementById('affiliatorCount');
    const avgContentSelect = document.getElementById('avgContent');
    const samplePercentageSelect = document.getElementById('samplePercentage');
    const recommendationBox = document.getElementById('recommendation');
    
    // Pastikan semua elemen ada sebelum melanjutkan
    if (!affiliatorInput || !avgContentSelect || !samplePercentageSelect || !recommendationBox) {
        console.error("Satu atau lebih elemen kalkulator tidak ditemukan di DOM.");
        return;
    }
    
    // Data kuota paket (sumber kebenaran)
    const TIERS = {
        starter: { name: 'STARTER', kontenLimit: 2500, orderLimit: 350 },
        growth: { name: 'GROWTH', kontenLimit: 5000, orderLimit: 750 },
        scale: { name: 'SCALE', kontenLimit: 15000, orderLimit: 2500 }
    };
    
    function calculateAndUpdate() {
        const affiliatorCount = parseInt(affiliatorInput.value) || 0;
        const avgContent = parseInt(avgContentSelect.value) || 0;
        const samplePercentage = parseInt(samplePercentageSelect.value) || 0;
        
        // Kalkulasi kebutuhan terpisah untuk Konten dan Order
        const neededContent = affiliatorCount * avgContent;
        const neededOrders = Math.ceil(affiliatorCount * (samplePercentage / 100)); // Pembulatan ke atas
        
        let statusClass = 'neutral';
        let message = '💡 Masukkan angka untuk melihat rekomendasi paket';
        
        // Hanya jalankan logika jika ada input jumlah afiliasi
        if (affiliatorCount > 0) {
            // Cek paket STARTER
            if (neededContent <= TIERS.starter.kontenLimit && neededOrders <= TIERS.starter.orderLimit) {
                message = `<strong>💡 Rekomendasi: Paket STARTER</strong> cocok untuk kebutuhan Anda.<br><span class="buffer-info">Estimasi: ${neededContent.toLocaleString('id-ID')} konten & ${neededOrders.toLocaleString('id-ID')} order.</span>`;
                statusClass = 'success';
            } 
            // Cek paket GROWTH
            else if (neededContent <= TIERS.growth.kontenLimit && neededOrders <= TIERS.growth.orderLimit) {
                message = `<strong>💡 Rekomendasi: Paket GROWTH</strong> adalah pilihan ideal.<br><span class="buffer-info">Estimasi: ${neededContent.toLocaleString('id-ID')} konten & ${neededOrders.toLocaleString('id-ID')} order.</span>`;
                statusClass = 'success';
            } 
            // Cek paket SCALE
            else if (neededContent <= TIERS.scale.kontenLimit && neededOrders <= TIERS.scale.orderLimit) {
                message = `<strong>💡 Rekomendasi: Paket SCALE</strong> akan memaksimalkan potensi Anda.<br><span class="buffer-info">Estimasi: ${neededContent.toLocaleString('id-ID')} konten & ${neededOrders.toLocaleString('id-ID')} order.</span>`;
                statusClass = 'success';
            } 
            // Jika melebihi semua paket
            else {
                message = `<strong>🚀 Kebutuhan Enterprise:</strong> Volume Anda sangat besar! Hubungi kami untuk solusi custom.<br><span class="buffer-info">Estimasi: ${neededContent.toLocaleString('id-ID')} konten & ${neededOrders.toLocaleString('id-ID')} order.</span>`;
                statusClass = 'enterprise';
            }
        }
        
        // Update tampilan kotak rekomendasi
        recommendationBox.className = 'recommendation ' + statusClass;
        recommendationBox.innerHTML = message;
    }
    
    // Event listeners untuk semua input. Menggunakan 'input' dan 'change' untuk cakupan maksimal
    [affiliatorInput, avgContentSelect, samplePercentageSelect].forEach(element => {
        element.addEventListener('input', calculateAndUpdate);
        element.addEventListener('change', calculateAndUpdate); // Fallback untuk beberapa browser/kasus
    });
    
    // Kalkulasi awal saat halaman dimuat untuk menangani nilai yang sudah terisi (misalnya dari cache browser)
    calculateAndUpdate();
});