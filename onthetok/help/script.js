// ===================================================================
// AFFILIATE OS - UNIFIED SCRIPT (BASED ON FLEXEET CORE)
// Menggabungkan fungsionalitas inti FLEXEET dengan fitur unik Affiliate OS
// ===================================================================

// ===== 1. CORE SETUP & INITIALIZATION =====
window.addEventListener('load', function() {
    // Loading Screen
    setTimeout(function() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
        
        // Initialize AOS (digunakan untuk semua animasi scroll)
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

// ===== 2. HERO TYPING EFFECT (KHAS AFFILIATE OS) =====
document.addEventListener('DOMContentLoaded', function() {
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
});


// ===================================================================
// ===== 3. SCROLL EFFECTS & INTERACTIONS (DARI FLEXEET CORE) =====
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

const handleScroll = () => {
    const scrollY = window.scrollY;
    
    // Scroll Progress Bar
    const scrollProgress = document.getElementById('scrollProgress');
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollProgress && scrollableHeight > 0) {
        scrollProgress.style.transform = `scaleX(${(scrollY / scrollableHeight)})`;
    }
};

window.addEventListener('scroll', debounce(handleScroll, 10));

// ===================================================================
// ===== 4. SMOOTH SCROLL (GENERAL UTILITY) =====
// ===================================================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href.length > 1 && href.startsWith('#')) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                // Offset -100px agar tidak terlalu mepet dengan nav
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - 100;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ===================================================================
// ===== 5. MAGNETIC HOVER EFFECT & INTERACTIVITY (DARI FLEXEET) =====
// ===================================================================

// Efek Glow Magnetik untuk Kartu Kaca (disesuaikan untuk elemen yang ada)
document.querySelectorAll('.tutorial-card, .faq-item').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// Interaksi Mouse untuk Gradient Orb (KHAS AFFILIATE OS)
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


// ===================================================================
// ===== 6. COUNTER ANIMATION (DARI FLEXEET, MENGGUNAKAN IntersectionObserver) =====
// ===================================================================

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
        element.textContent = String(currentValue.toLocaleString('id-ID'));
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            element.textContent = String(target.toLocaleString('id-ID'));
        }
    }
    window.requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // ===== FIX DI SINI: Mengubah .counter menjadi [data-count] =====
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

// Amati semua elemen yang memiliki data-count atau container-nya
document.querySelectorAll('[data-count], .hero-stat-wrapper').forEach(el => { // Disesuaikan untuk elemen yang ada
    counterObserver.observe(el);
});

// ===================================================================
// ===== 7. FLOATING PARTICLES (KHAS AFFILIATE OS) =====
// ===================================================================
document.addEventListener('DOMContentLoaded', function() {
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
});


// ===================================================================
// ===== 8. CONSOLE BRANDING (DARI FLEXEET) =====
// ===================================================================
console.log('%c🚀 Affiliate OS - A FLEXEET Product', 'color: #00f2ea; font-size: 20px; font-weight: bold;');
console.log('%c✨ Built with the FLEXEET design system for a consistent, premium experience.', 'color: #ff0050; font-size: 14px;');