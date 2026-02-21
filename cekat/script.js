/*
===================================================================
FLEXEET - MASTER SCRIPT (GABUNGAN SCRIPT.JS & NAV-SCRIPT.JS)
===================================================================

TABLE OF CONTENTS
-----------------
1.  INITIALIZATION & EVENT LISTENERS
2.  LOADING SCREEN
3.  NAVIGATION & MENU (LOGIC GABUNGAN)
    - Efek Scroll (Scrolled, Hide on Scroll, Scrollspy)
    - Menu Mobile (Hamburger)
    - Smooth Scroll
4.  SCROLL PROGRESS BAR
5.  FORM HANDLING (WHATSAPP REDIRECT)
6.  PERFORMANCE (LAZY LOADING)
7.  ANALYTICS (PLACEHOLDER)
8.  UTILITY FUNCTIONS (DEBOUNCE)
9.  LEGACY CODE (CALCULATOR)

===================================================================
*/

// ===================================================================
// 1. INITIALIZATION & EVENT LISTENERS
// ===================================================================

// Menjalankan semua fungsi setup setelah DOM (struktur HTML) siap
document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi library pihak ketiga
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });
    }

    // Inisialisasi semua modul dari script ini
    initLoadingScreen();
    initNavigationAndMenu(); // <- Fungsi gabungan dari kedua file
    initScrollProgress();
    initFormHandling();
    initPerformanceOptimizations();
    initAnalytics();
});


// ===================================================================
// 2. LOADING SCREEN
// ===================================================================

function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (!loadingScreen) return;

    // Sembunyikan loading screen setelah DOM siap, tanpa menunggu gambar (lebih cepat & andal)
    setTimeout(() => loadingScreen.classList.add('hidden'), 500);

    // Fallback: Sembunyikan paksa setelah 3 detik jika ada masalah
    setTimeout(() => {
        if (!loadingScreen.classList.contains('hidden')) {
            loadingScreen.classList.add('hidden');
        }
    }, 3000);
}


// ===================================================================
// 3. NAVIGATION & MENU (LOGIC GABUNGAN)
// ===================================================================

function initNavigationAndMenu() {
    const mainNav = document.getElementById('mainNav');
    const hamburgerBtn = document.getElementById('hamburger-button');
    const mobileMenu = document.getElementById('mobile-menu-overlay');
    const allNavLinks = document.querySelectorAll('a[href^="#"]');
    const desktopNavLinks = document.querySelectorAll('.desktop-menu .nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-link, .mobile-link-cta');
    const sections = document.querySelectorAll('section[id]');
    let lastScroll = 0;

    if (!mainNav) return;

    // --- Efek Scroll (Scrolled, Hide on Scroll, Scrollspy) ---
    function handleScrollEffects() {
        const currentScroll = window.pageYOffset;

        // 1. Efek 'scrolled' pada navbar (dari nav-script.js)
        mainNav.classList.toggle('scrolled', currentScroll > 50);

        // 2. Sembunyikan/tampilkan navbar saat scroll (dari script.js)
        if (currentScroll > lastScroll && currentScroll > 200) {
            mainNav.classList.add('hidden');
        } else {
            mainNav.classList.remove('hidden');
        }
        lastScroll = currentScroll <= 0 ? 0 : currentScroll;

        // 3. Scrollspy untuk menandai link menu yang aktif (dari nav-script.js)
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (currentScroll >= sectionTop - 150) { // offset agar aktif lebih awal
                currentSectionId = section.getAttribute('id');
            }
        });

        desktopNavLinks.forEach(link => {
            link.classList.remove('active');
            if (currentSectionId && link.getAttribute('href').includes(currentSectionId)) {
                link.classList.add('active');
            }
        });
    }

    // --- Menu Mobile (Hamburger) - Versi paling lengkap dari nav-script.js ---
    function toggleMobileMenu() {
        const isActive = mobileMenu.classList.toggle('active');
        hamburgerBtn.classList.toggle('active', isActive);
        document.body.style.overflow = isActive ? 'hidden' : '';
    }

    if (hamburgerBtn && mobileMenu) {
        hamburgerBtn.addEventListener('click', toggleMobileMenu);

        // Tutup menu saat link mobile di-klik
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mobileMenu.classList.contains('active')) {
                    toggleMobileMenu();
                }
            });
        });

        // Tutup menu dengan tombol Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    }

    // --- Smooth Scroll - Versi paling lengkap dari script.js (dengan offset) ---
    allNavLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId.length > 1) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const offset = 80; // Tinggi navbar
                    const targetPosition = targetElement.offsetTop - offset;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    trackEvent('Navigation', 'Click', targetId);
                }
            }
        });
    });

    // --- Event Listener Utama untuk Scroll ---
    // Menggunakan debounce agar tidak memberatkan browser
    window.addEventListener('scroll', debounce(handleScrollEffects, 10), { passive: true });
    handleScrollEffects(); // Panggil sekali di awal untuk set state
}


// ===================================================================
// 4. SCROLL PROGRESS BAR
// ===================================================================

function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgress');
    if (!progressBar) return;

    function updateProgress() {
        const scrollPercent = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = scrollPercent + '%';
        trackScrollDepth(scrollPercent);
    }
    window.addEventListener('scroll', updateProgress, { passive: true });
}


// ===================================================================
// 5. FORM HANDLING (WHATSAPP REDIRECT)
// ===================================================================

function initFormHandling() {
    const consultForm = document.getElementById('consultForm');
    if (!consultForm) return;

    consultForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const nama = consultForm.querySelector('input[name="nama"]').value;
        const perusahaan = consultForm.querySelector('input[name="perusahaan"]').value;

        if (!nama.trim() || !perusahaan.trim()) {
            alert('Mohon isi Nama dan Nama Bisnis Anda.');
            return;
        }

        const templatePesan = `Hi Tim Flexeet, aku *${nama}* dari *${perusahaan}* mau tanya terkait Flexeet x CEKAT lebih detail, terima kasih`;
        const pesanEncoded = encodeURIComponent(templatePesan);
        const nomorWA = '6287777220117';
        const urlWA = `https://wa.me/${nomorWA}?text=${pesanEncoded}`;

        trackEvent('Form', 'Submit to WhatsApp', perusahaan);
        window.open(urlWA, '_blank');
        this.reset();
    });
}


// ===================================================================
// 6. PERFORMANCE (LAZY LOADING)
// ===================================================================

function initPerformanceOptimizations() {
    const images = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback untuk browser lama
        images.forEach(img => img.src = img.dataset.src);
    }
}


// ===================================================================
// 7. ANALYTICS (PLACEHOLDER)
// ===================================================================

let reachedMarkers = [];
function trackScrollDepth(percent) {
    [25, 50, 75, 90, 100].forEach(marker => {
        if (percent >= marker && !reachedMarkers.includes(marker)) {
            reachedMarkers.push(marker);
            trackEvent('Scroll Depth', `${marker}%`);
        }
    });
}

function initAnalytics() {
    trackEvent('Page', 'View', window.location.pathname);
}

function trackEvent(category, action, label = null) {
    console.log(`Analytics Event: ${category} - ${action}${label ? ' - ' + label : ''}`);
    // Integrasi dengan Google Analytics atau tool lain
    if (typeof gtag !== 'undefined') {
        gtag('event', action, { 'event_category': category, 'event_label': label });
    }
}


// ===================================================================
// 8. UTILITY FUNCTIONS (DEBOUNCE)
// ===================================================================

/**
 * Membatasi frekuensi eksekusi sebuah fungsi.
 * @param {Function} func - Fungsi yang akan dieksekusi.
 * @param {number} wait - Waktu tunggu dalam milidetik.
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}


// ===================================================================
// 9. LEGACY CODE (CALCULATOR)
// ===================================================================

// Catatan: Fungsi ini untuk kalkulator lama.
// Kalkulator di halaman ini sekarang menggunakan 'calculator.js'.
// Ini bisa dihapus jika sudah tidak ada halaman yang menggunakannya.
function initCalculator() {
    const dailyChatsInput = document.getElementById('dailyChats');
    if (!dailyChatsInput) return;
    // ... (Logika kalkulator lama bisa diletakkan di sini jika masih perlu)
}

console.log('Flexeet Master Script Loaded Successfully');