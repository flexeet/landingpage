document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENTS ---
    const beforeMessagesContainer = document.getElementById('before-messages');
    const afterMessagesContainer = document.getElementById('after-messages');
    const beforeTypingIndicator = document.getElementById('before-typing');
    const afterTypingIndicator = document.getElementById('after-typing');
    const comparisonTabButton = document.getElementById('comparison-tab');

    // Hentikan jika elemen penting tidak ditemukan
    if (!beforeMessagesContainer || !comparisonTabButton) return;

    let simulationHasRun = false;

    // --- CONVERSATION DATA ---
    const conversation = [
        { customer: "halo ka saya mau tanya jaket puffer ?", before: { text: "MasyaAllah, tentu Kak! Jaket puffer kami ada beberapa pilihan, masing-masing dengan fitur dan desain unik. 😊\n\nVey perlu tahu lebih lanjut, Kakak cari jaket puffer untuk kebutuhan seperti apa? Misalnya, untuk traveling, aktivitas outdoor, atau acara tertentu? Atau mungkin ada warna atau ukuran yang Kakak minati? ❤️", credits: 29 }, after: { text: "MasyaAllah, halo! 😊 Jaket puffer adalah jaket yang dikenal dengan desain yang tebal dan menghangatkan. Biasanya terbuat dari material yang ringan dan insulasi, cocok untuk cuaca dingin. Ada yang bisa Vey bantu terkait jaket puffer? Misalnya ukuran, warna, atau harga?", credits: 3 } },
        { customer: "untuk traveling ke jepang ka rekomended yang mana ?", before: { text: "MasyaAllah, traveling ke Jepang pasti seru banget, Kak! Untuk cuaca di Jepang, terutama saat musim dingin atau pancaroba, Vey rekomendasikan jaket puffer yang memiliki fitur windproof dan insulasi agar tetap hangat dan nyaman. ✨\n\nBerikut beberapa jaket puffer yang cocok untuk traveling ke Jepang:\n1. Hijacket Ixora\n- Material: Taslan Parachute dan Dourmil Dacron\n- Fitur: Double closure, waterproof 75%, ringan, dan memiliki hoodie.\n- Cocok untuk suhu dingin (15-24°C).\n\n2. Hijacket Medium Puffer\n...\n\nMau Vey carikan warna dan ukuran yang ready, Kak? 😊", credits: 33 }, after: { text: "Alhamdulillah, untuk traveling ke Jepang, Vey merekomendasikan jaket puffer yang ringan dan waterproof. Jaket ini ideal untuk cuaca dingin dan bisa melindungi dari angin serta hujan.\n\nJaket yang cocok untuk perjalanan ini adalah:\n- Hijacket Ixora\n- Material: Taslan Parachute, Dourmil Dacron\n- Fitur: Insulasi, ringan, waterproof, dan desain elegan.\n- Ukuran: Tersedia dalam ukuran L, XL, dan XXL.\n\nApakah ada warna atau ukuran tertentu yang kamu cari? 😊", credits: 3 } },
        { customer: "bisa cod ka ?", before: { text: "Tentu bisa, Kak! 😊 Untuk pembayaran, Hijacket menyediakan opsi COD (Cash on Delivery) alias bayar di tempat. Jadi, Kakak bisa bayar langsung ke kurir saat paket sampai 💕✨\n\nUntuk keamanan, meskipun paketnya belum bisa dibuka di depan kurir, Hijacket menjamin:\n1. Quality Control Ketat\n2. Garansi 100%\n3. Kartu Garansi\n\nMau langsung Vey bantu proses pilih jaket dan alamatnya, Kak? 😍", credits: 32 }, after: { text: "Tentu bisa, Kak! Dan tenang saja, meskipun paketnya belum bisa dibuka di depan kurir, Hijacket sudah menyiapkan sistem yang aman banget untuk pembelian Kakak 💖✨\n\nKenapa Nggak Perlu Dibuka Dulu? Karena...\n1. Quality Control Kami Ketat.\n2. Hijacket Punya GARANSI 100%!\n3. Ada Kartu Garansi di Dalam Paket.\n\nJadi, jangan khawatir ya Kak! Mau lanjut untuk pilih produk atau ada yang ingin ditanyakan lagi? 😊", credits: 3 } }
    ];

    // --- HELPER FUNCTIONS ---
    const scrollToBottom = (element) => { element.scrollTop = element.scrollHeight; };
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const addMessage = (container, type, text, credits = null) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'bubble';
        bubbleDiv.textContent = text;
        messageDiv.appendChild(bubbleDiv);
        let creditDiv;
        if (credits !== null) {
            creditDiv = document.createElement('div');
            creditDiv.className = 'ai-credits highlight';
            creditDiv.textContent = `AI credits used: ${credits}`;
            messageDiv.appendChild(creditDiv);
        }
        container.insertBefore(messageDiv, container.lastElementChild);
        scrollToBottom(container);
        return creditDiv;
    };

    // --- SIMULATION LOGIC ---
    const simulateConversation = async () => {
        if (simulationHasRun) return; // Prevent re-running
        simulationHasRun = true;

        for (const turn of conversation) {
            addMessage(beforeMessagesContainer, 'customer', turn.customer);
            addMessage(afterMessagesContainer, 'customer', turn.customer);
            await sleep(800);
            beforeTypingIndicator.classList.add('active');
            afterTypingIndicator.classList.add('active');
            scrollToBottom(beforeMessagesContainer);
            scrollToBottom(afterMessagesContainer);
            await sleep(2000);
            beforeTypingIndicator.classList.remove('active');
            afterTypingIndicator.classList.remove('active');
            const creditDivBefore = addMessage(beforeMessagesContainer, 'ai', turn.before.text, turn.before.credits);
            const creditDivAfter = addMessage(afterMessagesContainer, 'ai', turn.after.text, turn.after.credits);
            await sleep(1500);
            creditDivBefore.classList.remove('highlight');
            creditDivAfter.classList.remove('highlight');
            await sleep(500);
        }
    };

    // --- START SIMULATION ON TAB CLICK ---
    comparisonTabButton.addEventListener('shown.bs.tab', simulateConversation, { once: true });
});