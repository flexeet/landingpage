/**
 * FLEXEET INTELLIGENCE LAYER V2.0 (OPTIMIZED)
 * Core interactions: Loader, Scroll Effects, and 3D Tilt Logic.
 * 
 * Optimizations:
 * - Null safety checks
 * - Scroll throttling for performance
 * - Named constants (no magic numbers)
 * - Error handling
 * - requestAnimationFrame for smooth animations
 */

'use strict';

/* ==============================================
   CONFIGURATION CONSTANTS
   ============================================== */
const CONFIG = {
    // Loader settings
    LOADER_MIN_INCREMENT: 1,
    LOADER_MAX_INCREMENT: 10,
    LOADER_INTERVAL_MS: 100,
    LOADER_COMPLETE_DELAY_MS: 300,
    LOADER_FADE_DURATION_MS: 500,
    
    // Navbar settings
    NAVBAR_SCROLL_THRESHOLD: 20,
    SCROLL_THROTTLE_MS: 16, // ~60fps
    
    // 3D Tilt settings
    TILT_INTENSITY: 5,
    TILT_SCALE: 1.02,
    TILT_LIFT: -5,
    TILT_PERSPECTIVE: 1000,
    TILT_RESET_DURATION_MS: 500,
    MOBILE_BREAKPOINT: 900,
};

/* ==============================================
   UTILITY FUNCTIONS
   ============================================== */

/**
 * Safely get DOM element with null check
 * @param {string} selector - Element ID or selector
 * @param {boolean} useQuery - Use querySelector instead of getElementById
 * @returns {Element|null}
 */
function getElement(selector, useQuery = false) {
    try {
        return useQuery 
            ? document.querySelector(selector) 
            : document.getElementById(selector);
    } catch (error) {
        console.warn(`[FLEXEET] Element not found: ${selector}`);
        return null;
    }
}

/**
 * Throttle function to limit execution rate
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in ms
 * @returns {Function}
 */
function throttle(func, limit) {
    let inThrottle = false;
    let lastResult;
    
    return function(...args) {
        if (!inThrottle) {
            lastResult = func.apply(this, args);
            inThrottle = true;
            
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
        
        return lastResult;
    };
}

/**
 * Check if user prefers reduced motion
 * @returns {boolean}
 */
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if device is mobile/touch
 * @returns {boolean}
 */
function isMobileDevice() {
    return window.matchMedia(`(max-width: ${CONFIG.MOBILE_BREAKPOINT}px)`).matches;
}

/* ==============================================
   INITIALIZATION (handled at end of file)
   ============================================== */
/* Original initialization moved to end of file to include new functions */

/* ==============================================
   1. SYSTEM BOOT LOADER
   Simulates complex processing time with random increments
   ============================================== */
function initSystemLoader() {
    const loader = getElement('loader');
    const bar = getElement('loaderBar');
    
    if (!loader || !bar) {
        console.warn('[FLEXEET] Loader elements not found, skipping initialization');
        return;
    }
    
    if (prefersReducedMotion()) {
        loader.classList.add('hidden');
        return;
    }
    
    let progress = 0;
    
    const interval = setInterval(() => {
        const increment = Math.floor(
            Math.random() * (CONFIG.LOADER_MAX_INCREMENT - CONFIG.LOADER_MIN_INCREMENT + 1)
        ) + CONFIG.LOADER_MIN_INCREMENT;
        
        progress = Math.min(progress + increment, 100);
        bar.style.width = `${progress}%`;

        if (progress >= 100) {
            clearInterval(interval);
            
            setTimeout(() => {
                loader.style.opacity = '0';
                loader.style.pointerEvents = 'none';
                
                setTimeout(() => {
                    loader.classList.add('hidden');
                }, CONFIG.LOADER_FADE_DURATION_MS);
                
            }, CONFIG.LOADER_COMPLETE_DELAY_MS);
        }
    }, CONFIG.LOADER_INTERVAL_MS);
}

/* ==============================================
   2. SMART NAVBAR (Blur on Scroll - Throttled)
   ============================================= */
function initSmartNavbar() {
    const navbar = getElement('navbar');
    
    if (!navbar) {
        console.warn('[FLEXEET] Navbar element not found, skipping initialization');
        return;
    }
    
    function updateNavbarState() {
        const scrolled = window.scrollY > CONFIG.NAVBAR_SCROLL_THRESHOLD;
        navbar.classList.toggle('scrolled', scrolled);
    }
    
    updateNavbarState();
    
    const throttledUpdate = throttle(updateNavbarState, CONFIG.SCROLL_THROTTLE_MS);
    
    window.addEventListener('scroll', throttledUpdate, { passive: true });
}

/* ==============================================
   3. 3D GLASS TILT EFFECT (Desktop Only)
   Provides premium feel on glass cards
   ============================================== */
function init3DTiltEffect() {
    if (isMobileDevice()) {
        return;
    }
    
    if (prefersReducedMotion()) {
        return;
    }
    
    const cards = document.querySelectorAll('[data-tilt]');
    
    if (!cards.length) {
        return;
    }
    
    cards.forEach(card => {
        function handleMouseMove(e) {
            const rect = card.getBoundingClientRect();
            
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -CONFIG.TILT_INTENSITY;
            const rotateY = ((x - centerX) / centerX) * CONFIG.TILT_INTENSITY;
            
            requestAnimationFrame(() => {
                card.style.transform = `
                    perspective(${CONFIG.TILT_PERSPECTIVE}px)
                    rotateX(${rotateX}deg) 
                    rotateY(${rotateY}deg) 
                    scale(${CONFIG.TILT_SCALE})
                    translateY(${CONFIG.TILT_LIFT}px)
                `;
            });
        }
        
        function handleMouseLeave() {
            card.style.transition = `transform ${CONFIG.TILT_RESET_DURATION_MS}ms ease-out`;
            card.style.transform = `
                perspective(${CONFIG.TILT_PERSPECTIVE}px) 
                rotateX(0) 
                rotateY(0) 
                scale(1) 
                translateY(0)
            `;
            
            setTimeout(() => {
                card.style.transition = '';
            }, CONFIG.TILT_RESET_DURATION_MS);
        }
        
        function handleMouseEnter() {
            card.style.transition = 'none';
        }
        
        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', handleMouseLeave);
        card.addEventListener('mouseenter', handleMouseEnter);
    });
}

/* ==============================================
   4. LENIS SMOOTH SCROLL (Premium Feel)
   ============================================== */
function initLenisSmoothScroll() {
    // Skip on mobile or reduced motion
    if (isMobileDevice() || prefersReducedMotion()) {
        return;
    }
    
    // Check if Lenis is loaded
    if (typeof Lenis === 'undefined') {
        console.warn('[FLEXEET] Lenis not loaded, using native scroll');
        return;
    }
    
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
    });
    
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    
    // Handle anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                lenis.scrollTo(target, { offset: -100 });
            }
        });
    });
}

/* ==============================================
   5. MAGNETIC BUTTONS (Subtle Version)
   ============================================== */
function initMagneticButtons() {
    // Skip on mobile or reduced motion
    if (isMobileDevice() || prefersReducedMotion()) {
        return;
    }
    
    const magneticElements = document.querySelectorAll('.btn-primary, .btn-glass, .nav-cta');
    
    magneticElements.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Subtle magnetic pull (max 8px)
            const maxMove = 8;
            const moveX = (x / rect.width) * maxMove * 2;
            const moveY = (y / rect.height) * maxMove * 2;
            
            btn.style.transform = `translate(${moveX}px, ${moveY}px)`;
            
            // Inner content moves less (parallax effect)
            const innerSpan = btn.querySelector('span');
            if (innerSpan) {
                innerSpan.style.transform = `translate(${moveX * 0.3}px, ${moveY * 0.3}px)`;
            }
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transition = 'transform 0.5s cubic-bezier(0.2, 0, 0, 1)';
            btn.style.transform = 'translate(0, 0)';
            
            const innerSpan = btn.querySelector('span');
            if (innerSpan) {
                innerSpan.style.transition = 'transform 0.5s cubic-bezier(0.2, 0, 0, 1)';
                innerSpan.style.transform = 'translate(0, 0)';
            }
            
            // Reset transition after animation
            setTimeout(() => {
                btn.style.transition = '';
                if (innerSpan) innerSpan.style.transition = '';
            }, 500);
        });
        
        btn.addEventListener('mouseenter', () => {
            btn.style.transition = 'none';
            const innerSpan = btn.querySelector('span');
            if (innerSpan) innerSpan.style.transition = 'none';
        });
    });
}

/* ==============================================
   6. PRODUCT CATEGORY FILTER
   ============================================== */
function initProductFilter() {
    const tabs = document.querySelectorAll('.category-tab');
    const products = document.querySelectorAll('.product-card');
    
    if (!tabs.length || !products.length) {
        return;
    }
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const category = tab.dataset.category;
            
            // Filter products
            products.forEach(product => {
                const productCategory = product.dataset.category;
                
                if (category === 'all' || productCategory === category) {
                    product.style.display = 'flex';
                    product.style.opacity = '0';
                    product.style.transform = 'translateY(20px)';
                    
                    // Animate in
                    requestAnimationFrame(() => {
                        product.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                        product.style.opacity = '1';
                        product.style.transform = 'translateY(0)';
                    });
                } else {
                    product.style.opacity = '0';
                    product.style.transform = 'translateY(-10px)';
                    
                    setTimeout(() => {
                        product.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/* ==============================================
   7. PARALLAX SCROLL EFFECT
   ============================================== */
function initParallax() {
    if (prefersReducedMotion()) {
        return;
    }
    
    if (isMobileDevice()) {
        return;
    }
    
    const parallaxBgs = document.querySelectorAll('.parallax-bg');
    
    if (!parallaxBgs.length) {
        return;
    }
    
    let ticking = false;
    
    function updateParallax() {
        const scrollY = window.scrollY;
        
        parallaxBgs.forEach(bg => {
            const section = bg.parentElement;
            const rect = section.getBoundingClientRect();
            const speed = parseFloat(bg.dataset.speed) || 0.3;
            
            // Only animate when section is in view
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const yPos = (rect.top * speed);
                bg.style.transform = `translate3d(0, ${yPos}px, 0)`;
            }
        });
        
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });
    
    // Initial call
    updateParallax();
}

/* ==============================================
   8. INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
   ============================================== */
function initScrollAnimations() {
    if (prefersReducedMotion()) {
        document.querySelectorAll('.fade-in-up').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
        return;
    }
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

/* ==============================================
   9. CURSOR GLOW EFFECT (2026 Trend)
   ============================================== */
function initCursorGlow() {
    // Skip on mobile or reduced motion
    if (isMobileDevice() || prefersReducedMotion()) {
        return;
    }
    
    const glow = document.getElementById('cursorGlow');
    if (!glow) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let glowX = 0;
    let glowY = 0;
    
    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        glow.classList.add('active');
    });
    
    // Hide when mouse leaves window
    document.addEventListener('mouseleave', () => {
        glow.classList.remove('active');
    });
    
    // Smooth follow animation
    function animateGlow() {
        // Ease factor (lower = smoother/slower)
        const ease = 0.15;
        
        glowX += (mouseX - glowX) * ease;
        glowY += (mouseY - glowY) * ease;
        
        glow.style.left = glowX + 'px';
        glow.style.top = glowY + 'px';
        
        requestAnimationFrame(animateGlow);
    }
    animateGlow();
}

/* ==============================================
   10. SCROLL REVEAL (2026 Trend)
   ============================================== */
function initScrollReveal() {
    if (prefersReducedMotion()) {
        document.querySelectorAll('.scroll-reveal, .stagger-reveal').forEach(el => {
            el.classList.add('revealed');
        });
        return;
    }
    
    const revealElements = document.querySelectorAll('.scroll-reveal, .stagger-reveal');
    
    if (!revealElements.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => observer.observe(el));
}

/* ==============================================
   11. ANIMATED COUNTERS (2026 Trend)
   ============================================== */
function initCounterAnimation() {
    if (prefersReducedMotion()) return;
    
    const counters = document.querySelectorAll('[data-counter]');
    
    if (!counters.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.dataset.counter, 10);
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    const suffix = element.dataset.suffix || '';
    const prefix = element.dataset.prefix || '';
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out cubic
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(easeProgress * target);
        
        element.textContent = prefix + current + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = prefix + target + suffix;
        }
    }
    
    requestAnimationFrame(updateCounter);
}

/* ==============================================
   12. UTILITY: TRACK OUTBOUND LINKS (Optional Analytics)
   ============================================== */
function trackOutboundLinks() {
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    
    externalLinks.forEach(link => {
        link.addEventListener('click', function() {
            const url = this.href;
            
            // If analytics is available, track the click
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    'event_category': 'outbound',
                    'event_label': url,
                    'transport_type': 'beacon'
                });
            }
            
            console.log('[FLEXEET] Outbound click:', url);
        });
    });
}

/* ==============================================
   13. FAQ ACCORDION (Kill Shots Section)
   ============================================== */
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('[data-faq]');
    
    if (!faqItems.length) return;
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (!question) return;
        
        question.addEventListener('click', () => {
            // Check if this item is already active
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }
        });
        
        // Keyboard accessibility
        question.setAttribute('role', 'button');
        question.setAttribute('tabindex', '0');
        
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                question.click();
            }
        });
    });
}

/* ==============================================
   14. LAYER DIAGRAM ANIMATION
   ============================================== */
function initLayerAnimation() {
    const layerRows = document.querySelectorAll('.layer-row');
    
    if (!layerRows.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, index * 200);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    layerRows.forEach(row => {
        row.style.opacity = '0';
        row.style.transform = 'translateY(20px)';
        observer.observe(row);
    });
}

// Add CSS for layer animation via JS
function addLayerAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .layer-row.animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .layer-row.featured.animate-in {
            transform: translateY(0) scale(1.02) !important;
        }
    `;
    document.head.appendChild(style);
}

/* ==============================================
   INITIALIZATION UPDATE
   ============================================== */
// Override the DOMContentLoaded to include new functions
document.addEventListener('DOMContentLoaded', () => {
    initSystemLoader();
    initSmartNavbar();
    init3DTiltEffect();
    initLenisSmoothScroll();
    initMagneticButtons();
    initProductFilter();
    initParallax();
    initCursorGlow();
    initScrollReveal();
    initCounterAnimation();
    
    // NEW: FAQ Accordion
    initFAQAccordion();
    
    // NEW: Layer Animation
    addLayerAnimationStyles();
    initLayerAnimation();
});