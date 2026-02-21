/**
 * ForgetIt Service Deck
 * Interactive presentation-style landing page
 */

document.addEventListener('DOMContentLoaded', () => {
    initProgressBar();
    initCalculator();
    initSmoothScroll();
    initScrollAnimations();
    initNavHighlight();
});

// ==========================================
// PROGRESS BAR
// ==========================================

function initProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    if (!progressBar) return;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = `${progress}%`;
    });
}

// ==========================================
// ROI CALCULATOR
// ==========================================

function initCalculator() {
    const qSlider = document.getElementById('q-slider');
    const tSlider = document.getElementById('t-slider');
    const rSlider = document.getElementById('r-slider');
    
    if (!qSlider) return;
    
    function calculate() {
        const q = parseInt(qSlider.value);
        const t = parseInt(tSlider.value);
        const r = parseInt(rSlider.value);
        
        // Update display values
        document.getElementById('q-value').textContent = q + '×';
        document.getElementById('t-value').textContent = t + ' menit';
        
        if (r >= 1000) {
            document.getElementById('r-value').textContent = `Rp ${(r/1000).toFixed(1)} jt`;
        } else {
            document.getElementById('r-value').textContent = `Rp ${r}rb`;
        }
        
        // Calculate
        const hoursPerWeek = (q * t) / 60;
        const hoursPerMonth = hoursPerWeek * 4;
        const hoursPerYear = hoursPerMonth * 12;
        const yearlyLoss = Math.round(hoursPerYear * r * 1000 / 1000000);
        const daysLost = Math.round(hoursPerYear / 8);
        const roiMonths = yearlyLoss > 0 ? Math.ceil(75 / (yearlyLoss / 12)) : 12;
        
        // Animate updates
        animateValue('loss-value', yearlyLoss);
        animateValue('hours-month', hoursPerMonth, 1);
        animateValue('days-year', daysLost);
        animateValue('roi-month', Math.min(roiMonths, 12));
    }
    
    qSlider.addEventListener('input', calculate);
    tSlider.addEventListener('input', calculate);
    rSlider.addEventListener('input', calculate);
    
    calculate();
}

function animateValue(id, target, decimals = 0) {
    const el = document.getElementById(id);
    if (!el) return;
    
    const current = parseFloat(el.textContent) || 0;
    const diff = target - current;
    const duration = 300;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = current + (diff * eased);
        
        el.textContent = value.toFixed(decimals);
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// ==========================================
// SMOOTH SCROLL
// ==========================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                const navHeight = 60;
                const targetPosition = target.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==========================================
// NAV HIGHLIGHT
// ==========================================

function initNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href') === `#${current}`) {
                link.style.color = 'var(--color-primary)';
            }
        });
    });
}

// ==========================================
// SCROLL ANIMATIONS
// ==========================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Elements to animate
    const animateElements = document.querySelectorAll(`
        .problem-item,
        .benefit-card,
        .timeline-item,
        .step-list li,
        .chunk,
        .tech-step,
        .integration-card,
        .deliverable-card,
        .pricing-card
    `);
    
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.5s ease ${index * 0.05}s, transform 0.5s ease ${index * 0.05}s`;
        observer.observe(el);
    });
}

// ==========================================
// KEYBOARD NAVIGATION
// ==========================================

document.addEventListener('keydown', (e) => {
    const slides = document.querySelectorAll('.slide');
    const currentScroll = window.scrollY;
    let currentSlide = 0;
    
    slides.forEach((slide, index) => {
        if (slide.offsetTop <= currentScroll + 100) {
            currentSlide = index;
        }
    });
    
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        if (currentSlide < slides.length - 1) {
            slides[currentSlide + 1].scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        if (currentSlide > 0) {
            slides[currentSlide - 1].scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// ==========================================
// CONSOLE
// ==========================================

console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   [ ForgetIt ] Service Deck                               ║
║                                                           ║
║   AI Knowledge Assistant for Growing Businesses           ║
║                                                           ║
║   Navigate: Arrow Keys / Page Up/Down                     ║
║                                                           ║
║   Built by Flexeet — flexeet.com                          ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
`);