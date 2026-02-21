// ===================================================================
// AFFILIATE OS - UNIFIED SCRIPT (SEMUA FUNGSI DIGABUNGKAN)
// ===================================================================

// ===================================================================
// UTILITY FUNCTIONS (DEBOUNCE, COUNTER ANIMATION)
// ===================================================================

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

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'), 10);
    if (isNaN(target)) return;
    const duration = 2000;
    let start = null;
    
    function step(timestamp) {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const easeOutQuad = t => t * (2 - t);
        const currentValue = Math.floor(easeOutQuad(progress) * target);
        // Pastikan format angka tetap dipertahankan
        element.textContent = String(currentValue.toLocaleString('id-ID')); 
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            element.textContent = String(target.toLocaleString('id-ID'));
        }
    }
    window.requestAnimationFrame(step);
}

// ===================================================================
// CORE SETUP & INITIALIZATION (Termasuk Loading Screen & AOS)
// ===================================================================

window.addEventListener('load', function() {
    // 1. Loading Screen
    setTimeout(function() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
        
        // 2. Initialize AOS (digunakan untuk semua animasi scroll)
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                once: true,
                offset: 100,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                disable: function() { return window.innerWidth < 768; }
            });
        }
    }, 1500); // Durasi loading screen
});


// ===================================================================
// DYNAMIC PRICING SCRIPT (Fungsi Interaktif Durasi dan Harga)
// ===================================================================

const pricingData = {
    starter: {
        1: { totalPrice: "Rp 589K", monthlyPrice: "", strikethrough: "", savings: "Fleksibilitas Penuh", period: "/bulan", checkoutLink: "https://pay.flexeet.com/onthetok" },
        3: { totalPrice: "Rp 1.509K", monthlyPrice: "setara Rp 503rb/bln", strikethrough: "Rp 1.766.460", savings: "Hemat 15% (Rp 257.240)", period: "/3 bln", checkoutLink: "https://pay.flexeet.com/onthetok" },
        6: { totalPrice: "Rp 2.654K", monthlyPrice: "setara Rp 442rb/bln", strikethrough: "Rp 3.532.920", savings: "Hemat 25% (Rp 878.920)", period: "/6 bln", checkoutLink: "https://pay.flexeet.com/onthetok" },
        12: { totalPrice: "Rp 4.719K", monthlyPrice: "setara Rp 393rb/bln", strikethrough: "Rp 7.065.840", savings: "GRATIS 4 BULAN!", period: "/tahun", checkoutLink: "https://pay.flexeet.com/onthetok" }
    },
    growth: {
        1: { totalPrice: "Rp 1.415K", monthlyPrice: "", strikethrough: "", savings: "Paling Populer & Fleksibel", period: "/bulan", checkoutLink: "https://pay.flexeet.com/onthetok" },
        3: { totalPrice: "Rp 3.610K", monthlyPrice: "setara Rp 1,2jt/bln", strikethrough: "Rp 4.244.460", savings: "Hemat 15% (Rp 634.840)", period: "/3 bln", checkoutLink: "https://pay.flexeet.com/onthetok" },
        6: { totalPrice: "Rp 6.371K", monthlyPrice: "setara Rp 1,06jt/bln", strikethrough: "Rp 8.488.920", savings: "Hemat 25% (Rp 2.117.920)", period: "/6 bln", checkoutLink: "https://pay.flexeet.com/onthetok" },
        12: { totalPrice: "Rp 11.327K", monthlyPrice: "setara Rp 944rb/bln", strikethrough: "Rp 16.977.840", savings: "GRATIS 4 BULAN!", period: "/tahun", checkoutLink: "https://pay.flexeet.com/onthetok" }
    },
    scale: {
        1: { totalPrice: "Rp 4.129K", monthlyPrice: "", strikethrough: "", savings: "Kekuatan Penuh Agensi", period: "/bulan", checkoutLink: "https://pay.flexeet.com/onthetok" },
        3: { totalPrice: "Rp 10.536K", monthlyPrice: "setara Rp 3,5jt/bln", strikethrough: "Rp 12.386.460", savings: "Hemat 15% (Rp 1.850.240)", period: "/3 bln", checkoutLink: "https://pay.flexeet.com/onthetok" },
        6: { totalPrice: "Rp 18.584K", monthlyPrice: "setara Rp 3,1jt/bln", strikethrough: "Rp 24.772.920", savings: "Hemat 25% (Rp 6.188.920)", period: "/6 bln", checkoutLink: "https://pay.flexeet.com/onthetok" },
        12: { totalPrice: "Rp 33.039K", monthlyPrice: "setara Rp 2,75jt/bln", strikethrough: "Rp 49.545.840", savings: "GRATIS 4 BULAN!", period: "/tahun", checkoutLink: "https://pay.flexeet.com/onthetok" }
    }
};

function updatePricing(duration) {
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach(card => {
        const packageName = card.dataset.package;
        if (!packageName || !pricingData[packageName] || !pricingData[packageName][duration]) return;

        const data = pricingData[packageName][duration];
        const priceEl = card.querySelector('.price');
        const periodEl = card.querySelector('.price-period');
        const strikethroughEl = card.querySelector('.price-strikethrough');
        const effectiveEl = card.querySelector('.price-effective');
        const savingsEl = card.querySelector('.price-savings');
        const ctaButton = card.querySelector('.cta-button');

        priceEl.textContent = data.totalPrice;
        periodEl.textContent = data.period;
        strikethroughEl.textContent = data.strikethrough;
        effectiveEl.textContent = data.monthlyPrice;
        savingsEl.textContent = data.savings;

        const durationText = { '1': 'Bulanan', '3': '3 Bulan', '6': '6 Bulan', '12': 'Tahunan' }[duration];
        ctaButton.textContent = `Pilih ${packageName.charAt(0).toUpperCase() + packageName.slice(1)} ${durationText}`;
        ctaButton.href = data.checkoutLink;

        strikethroughEl.style.display = data.strikethrough ? 'block' : 'none';
        effectiveEl.style.display = data.monthlyPrice ? 'block' : 'none';
        savingsEl.style.display = data.savings ? 'block' : 'none';
    });
}


// ===================================================================
// PRICING RECOMMENDATION CALCULATOR (ROI Calculator)
// ===================================================================

const TIERS = {
    starter: { name: 'STARTER', kontenLimit: 2500, orderLimit: 350 },
    growth: { name: 'GROWTH', kontenLimit: 5000, orderLimit: 750 },
    scale: { name: 'SCALE', kontenLimit: 15000, orderLimit: 2500 }
};

function calculateAndUpdateRecommendation() {
    const affiliatorInput = document.getElementById('affiliatorCount');
    const avgContentSelect = document.getElementById('avgContent');
    const samplePercentageSelect = document.getElementById('samplePercentage');
    const recommendationBox = document.getElementById('recommendation');

    if (!affiliatorInput || !avgContentSelect || !samplePercentageSelect || !recommendationBox) return;

    const affiliatorCount = parseInt(affiliatorInput.value) || 0;
    const avgContent = parseInt(avgContentSelect.value) || 0;
    const samplePercentage = parseInt(samplePercentageSelect.value) || 0;
    
    const neededContent = affiliatorCount * avgContent;
    const neededOrders = Math.ceil(affiliatorCount * (samplePercentage / 100));
    
    let statusClass = 'neutral';
    let message = '💡 Masukkan angka untuk melihat rekomendasi paket';
    
    if (affiliatorCount > 0) {
        if (neededContent <= TIERS.starter.kontenLimit && neededOrders <= TIERS.starter.orderLimit) {
            message = `<strong>💡 Rekomendasi: Paket STARTER</strong> cocok untuk kebutuhan Anda.<br><span class="buffer-info">Estimasi: ${neededContent.toLocaleString('id-ID')} konten & ${neededOrders.toLocaleString('id-ID')} order.</span>`;
            statusClass = 'success';
        } 
        else if (neededContent <= TIERS.growth.kontenLimit && neededOrders <= TIERS.growth.orderLimit) {
            message = `<strong>💡 Rekomendasi: Paket GROWTH</strong> adalah pilihan ideal.<br><span class="buffer-info">Estimasi: ${neededContent.toLocaleString('id-ID')} konten & ${neededOrders.toLocaleString('id-ID')} order.</span>`;
            statusClass = 'success';
        } 
        else if (neededContent <= TIERS.scale.kontenLimit && neededOrders <= TIERS.scale.orderLimit) {
            message = `<strong>💡 Rekomendasi: Paket SCALE</strong> akan memaksimalkan potensi Anda.<br><span class="buffer-info">Estimasi: ${neededContent.toLocaleString('id-ID')} konten & ${neededOrders.toLocaleString('id-ID')} order.</span>`;
            statusClass = 'success';
        } 
        else {
            message = `<strong>🚀 Kebutuhan Enterprise:</strong> Volume Anda sangat besar! Hubungi kami untuk solusi custom.<br><span class="buffer-info">Estimasi: ${neededContent.toLocaleString('id-ID')} konten & ${neededOrders.toLocaleString('id-ID')} order.</span>`;
            statusClass = 'enterprise';
        }
    }
    
    recommendationBox.className = 'recommendation ' + statusClass;
    recommendationBox.innerHTML = message;
}


// ===================================================================
// NAVIGATION & SCROLL HANDLERS (Menu Mobile, Scrollspy, Scroll Progress)
// ===================================================================

function setupMobileMenu() {
    const menuToggle = document.getElementById('hamburger-button');
    const mobileMenu = document.getElementById('mobile-menu-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-menu-inner a');
    
    if (!menuToggle || !mobileMenu) return;

    const toggleMenu = () => {
        menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    };

    menuToggle.addEventListener('click', toggleMenu);
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMenu); // Cukup panggil toggleMenu
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            toggleMenu();
        }
    });
}

function handleScrollEffects() {
    const scrollY = window.scrollY;
    
    // 1. Navbar Scrolled Class
    const navbar = document.getElementById('mainNav');
    if (navbar) {
        navbar.classList.toggle('scrolled', scrollY > 50);
    }
    
    // 2. Highlight link navigasi aktif (Scrollspy)
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.desktop-menu .nav-link');
    let currentSectionId = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 150) {
            currentSectionId = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (currentSectionId && link.getAttribute('href').includes(currentSectionId)) {
            link.classList.add('active');
        }
    });

    // 3. Scroll Progress Bar
    const scrollProgress = document.getElementById('scrollProgress');
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollProgress && scrollableHeight > 0) {
        scrollProgress.style.transform = `scaleX(${(scrollY / scrollableHeight)})`;
    }
}


// ===================================================================
// DOM CONTENT LOADED (MAIN INIT)
// ===================================================================

document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Setup Navigation
    setupMobileMenu();
    handleScrollEffects(); // Initial call
    window.addEventListener('scroll', debounce(handleScrollEffects, 10));

    // 2. HERO TYPING EFFECT
    const heroWords = document.querySelectorAll('.hero-title .word');
    if (heroWords.length > 0) {
        heroWords.forEach((word, index) => {
            const text = word.dataset.word;
            word.textContent = '';
            setTimeout(() => {
                let charIndex = 0;
                const typingInterval = setInterval(() => {
                    if (charIndex < text.length) {
                        word.textContent += text[charIndex];
                        charIndex++;
                    } else {
                        clearInterval(typingInterval);
                    }
                }, 50);
            }, 500 + (index * 1000));
        });
    }

    // 3. Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.length > 1 && href.startsWith('#')) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - 100;
                    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                }
            }
        });
    });

    // 4. Magnetic Hover Effect (Orb Mouse Tracking)
    document.addEventListener('mousemove', (e) => {
        const orbs = document.querySelectorAll('.gradient-orb');
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 20;
            const x = (mouseX - 0.5) * speed;
            const y = (mouseY - 0.5) * speed;
            orb.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
    
    // Magnetic Hover Effect for Cards
    document.querySelectorAll('.workflow-card, .pricing-card, .lie-card, .roi-item, .divide-column, .column, .cta-promise, .faq-item-pricing').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // 5. Counter Animation (menggunakan IntersectionObserver)
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counterElements = entry.target.querySelectorAll('[data-count]');
                if (counterElements.length > 0) {
                    counterElements.forEach(counter => {
                        animateCounter(counter);
                    });
                } else if (entry.target.hasAttribute('data-count')) {
                     animateCounter(entry.target);
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('[data-count], .divide-column, .roi-grid, .hero-stat-wrapper').forEach(el => {
        counterObserver.observe(el);
    });

    // 6. Floating Particles
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        const particleCount = 30;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.animationDuration = (15 + Math.random() * 10) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    // 7. Dynamic Pricing & Recommendation Logic
    const durationSelector = document.getElementById('duration-selector');
    if (durationSelector) {
        durationSelector.addEventListener('click', (e) => {
            const selectedButton = e.target.closest('.duration-btn');
            if (!selectedButton) return;
            durationSelector.querySelectorAll('.duration-btn').forEach(btn => btn.classList.remove('active'));
            selectedButton.classList.add('active');
            const selectedDuration = selectedButton.dataset.duration;
            updatePricing(selectedDuration);
        });
    }
    updatePricing('12'); // Set default to 1 Year

    const affiliatorInput = document.getElementById('affiliatorCount');
    const avgContentSelect = document.getElementById('avgContent');
    const samplePercentageSelect = document.getElementById('samplePercentage');
    
    [affiliatorInput, avgContentSelect, samplePercentageSelect].forEach(element => {
        element.addEventListener('input', calculateAndUpdateRecommendation);
        element.addEventListener('change', calculateAndUpdateRecommendation);
    });
    calculateAndUpdateRecommendation(); // Initial call for calculator

    // 8. CONSOLE BRANDING
    console.log('%c🚀 Affiliate OS - A FLEXEET Product', 'color: #00f2ea; font-size: 20px; font-weight: bold;');
    console.log('%c✨ Built with the FLEXEET design system for a consistent, premium experience.', 'color: #ff0050; font-size: 14px;');
});