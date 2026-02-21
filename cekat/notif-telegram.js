document.addEventListener('DOMContentLoaded', () => {
    let demoRunning = false;
    let demoInterval = null;
    const infoBox = document.getElementById('infoBox');
    const infoText = document.getElementById('infoText');
    const demoBtn = document.getElementById('demoBtn');
    const chatItems = document.querySelectorAll('.chat-item');

    if (!demoBtn) return;

    const infoTexts = {
        'customer': '💬 Pesan masuk ke Chat - Customer',
        'closing': '🎯 Pesan masuk ke Chat - Go Closingkan',
        'alert': '⚠️ Alert dikirim ke Alert Center',
        'order': '📦 Order baru masuk!',
        'media': '🎬 Media disimpan ke Media Log',
        'tool': '📋 Tool check diproses'
    };

    const showInfo = (category) => {
        if (!infoBox || !infoText) return;
        infoText.textContent = infoTexts[category] || '✨ Pesan diproses...';
        infoBox.style.display = 'flex';
        setTimeout(() => {
            if (infoBox) infoBox.style.display = 'none';
        }, 2500);
    };

    const updateBadge = (category) => {
        const badge = document.getElementById(`${category}Badge`);
        if (badge) {
            const currentCount = parseInt(badge.textContent.replace(/,/g, ''), 10);
            badge.textContent = (currentCount + 1).toLocaleString('en-US');
            badge.classList.add('new');
            setTimeout(() => badge.classList.remove('new'), 600);
        }
    };

    const highlightTopic = (category) => {
        const topics = document.querySelectorAll('.topic-item');
        topics.forEach(topic => {
            if (topic.dataset.topic === category) {
                topic.classList.add('highlight');
                setTimeout(() => topic.classList.remove('highlight'), 1000);
            }
        });
    };

    const processChatItem = (chatItem) => {
        if (!chatItem) return;
        const category = chatItem.dataset.category;
        chatItem.classList.add('sending');
        setTimeout(() => {
            chatItem.classList.remove('sending');
            showInfo(category);
            setTimeout(() => {
                updateBadge(category);
                highlightTopic(category);
            }, 1000);
        }, 800);
    };

    const toggleDemo = () => {
        demoRunning = !demoRunning;
        if (demoRunning) {
            demoBtn.textContent = '⏸️ Stop Demo';
            demoBtn.style.background = '#ef4444';
            demoBtn.style.color = 'white';
            let currentIndex = 0;
            const processNext = () => {
                processChatItem(chatItems[currentIndex]);
                currentIndex = (currentIndex + 1) % chatItems.length;
            };
            processNext();
            demoInterval = setInterval(processNext, 3000);
        } else {
            demoBtn.textContent = '▶️ Mulai Demo Otomatis';
            demoBtn.style.background = 'white';
            demoBtn.style.color = '#3b82f6';
            clearInterval(demoInterval);
        }
    };

    demoBtn.addEventListener('click', toggleDemo);

    const telegramTabButton = document.getElementById('telegram-tab');
    if (telegramTabButton) {
        telegramTabButton.addEventListener('shown.bs.tab', () => {
            if (!demoRunning) {
                toggleDemo();
            }
        }, {
            once: true
        });
    }
});