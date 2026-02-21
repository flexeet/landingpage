/**
 * AICEO Premium Landing Page - Final Optimized Version
 * Includes: Performance Fixes, Battery Saving Mode, and UX Enhancements
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // Feature detection & initialization
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Add class to body for CSS targeting
    if (isMobile) {
        document.body.classList.add('is-mobile');
    }
    
    // --- 1. PRELOADER LOGIC (FIXED) ---
    const preloader = document.getElementById('preloader');
    
    window.addEventListener('load', () => {
        if (preloader) {
            // Delay sedikit biar loading kerasa 'premium'
            setTimeout(() => {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden'; // Pastikan hidden
            }, 500);
            
            // Hapus total dari display setelah animasi selesai
            setTimeout(() => {
                preloader.style.display = 'none';
                
                // Trigger animasi Hero
                if (!isMobile && !prefersReducedMotion) {
                    initHeroAnimations();
                } else {
                    document.querySelectorAll('.reveal-text, .reveal-up').forEach(el => {
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                    });
                }
            }, 1100); // 500ms delay + 600ms transition
        }
    });
    
    // Initialize core modules
    initNavigation();
    initMobileMenu();
    initFAQ();
    initSmoothAnchorLinks();
    
    // Initialize heavy modules (Desktop Only for Performance)
    if (!isMobile && !prefersReducedMotion) {
        initLenisScroll();
        initCustomCursor();
        initMagneticButtons();
        initTiltCards();
        initNeuralNetwork(); // Canvas background
    } else {
        // Mobile Optimizations
        initMobileScrollReveal();
        hideDesktopOnlyElements();
    }
    
    // Always init standard scroll animations
    initScrollAnimations();
    
    console.log('🧠 AICEO System Loaded', isMobile ? '(Mobile Mode - Performance Optimized)' : '(Desktop Mode - Full Experience)');
});

/* ============================================
   MOBILE SPECIFIC FUNCTIONS
   ============================================ */
function initMobileScrollReveal() {
    // Simple fade-in on mobile using IntersectionObserver (Ringan)
    const revealElements = document.querySelectorAll('.reveal-up, [class*="reveal"]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                // Stop observing once revealed
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => {
        // Set initial state via JS to avoid CSS hiding content if JS fails
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

function hideDesktopOnlyElements() {
    // Pastikan elemen berat hidden di mobile
    const heavyElements = [
        document.querySelector('.custom-cursor'),
        document.getElementById('neural-canvas'),
        document.querySelector('.cursor-dot'),
        document.querySelector('.cursor-outline')
    ];
    
    heavyElements.forEach(el => {
        if(el) el.style.display = 'none';
    });
}

/* ============================================
   1. LENIS SMOOTH SCROLL (DESKTOP ONLY)
   ============================================ */
let lenis;

function initLenisScroll() {
    if (typeof Lenis === 'undefined') return;
    
    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        smooth: true,
        smoothTouch: false, // Disable on touch for native feel
    });
    
    // Integrate with GSAP ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
    }
    
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
}

/* ============================================
   2. NAVIGATION & STICKY CTA
   ============================================ */
function initNavigation() {
    const nav = document.getElementById('nav');
    const mobileBtn = document.querySelector('.mobile-sticky-btn');
    
    if (!nav) return;
    
    // Scroll listener
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY > 50;
        
        // Navbar styling
        if (scrolled) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        // Mobile Sticky Button Logic (Show after Hero)
        if (mobileBtn) {
            if (window.scrollY > 600) { // Muncul setelah scroll 600px
                mobileBtn.classList.add('visible');
            } else {
                mobileBtn.classList.remove('visible');
            }
        }
    }, { passive: true });
}

/* ============================================
   3. MOBILE MENU
   ============================================ */
function initMobileMenu() {
    const toggle = document.getElementById('mobileToggle');
    const menu = document.getElementById('mobileMenu');
    const links = document.querySelectorAll('.nav-mobile-link, .nav-mobile-cta');
    
    if (!toggle || !menu) return;
    
    toggle.addEventListener('click', () => {
        const isActive = toggle.classList.contains('active');
        
        if (!isActive) {
            // OPEN MENU
            toggle.classList.add('active');
            menu.classList.add('active');
            document.body.style.overflow = 'hidden'; // Lock scroll
            if (lenis) lenis.stop();
        } else {
            // CLOSE MENU
            toggle.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = '';
            if (lenis) lenis.start();
            
            // GSAP FIX: Refresh ScrollTrigger saat layout berubah
            if (typeof ScrollTrigger !== 'undefined') {
                setTimeout(() => ScrollTrigger.refresh(), 500);
            }
        }
    });
    
    // Close menu when clicking links
    links.forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = '';
            if (lenis) lenis.start();
        });
    });
}

/* ============================================
   4. CUSTOM CURSOR
   ============================================ */
function initCustomCursor() {
    // Double check: jangan jalan di touch device
    if (window.matchMedia("(pointer: coarse)").matches) return;
    
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');
    
    if (!cursorDot || !cursorOutline) return;
    
    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;
    
    document.addEventListener('mousemove', function onFirstMove(e) {
        document.body.classList.add('cursor-ready');
        document.removeEventListener('mousemove', onFirstMove);
    });
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    });
    
    // Smooth follow loop
    function animateOutline() {
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;
        
        cursorOutline.style.left = `${outlineX}px`;
        cursorOutline.style.top = `${outlineY}px`;
        
        requestAnimationFrame(animateOutline);
    }
    animateOutline();
    
    // Interactive states
    const hoverTargets = document.querySelectorAll('a, button, .magnetic-btn, .tilt-card, .faq-question');
    hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        target.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
}

/* ============================================
   5. HERO ANIMATIONS (GSAP)
   ============================================ */
function initHeroAnimations() {
    if (typeof gsap === 'undefined') return;
    
    const tl = gsap.timeline();
    
    // Text Reveal (Masked)
    tl.to('.reveal-text', {
        y: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "power4.out"
    });
    
    // Elements Fade Up
    tl.to('.hero .reveal-up', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
    }, "-=0.8");
}

/* ============================================
   6. SCROLL ANIMATIONS
   ============================================ */
function initScrollAnimations() {
    // Select elements except hero ones (handled separately)
    const revealElements = document.querySelectorAll('.reveal-up:not(.hero .reveal-up)');
    
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && window.innerWidth >= 768) {
        // Desktop: GSAP ScrollTrigger
        revealElements.forEach((element) => {
            gsap.fromTo(element, 
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: element,
                        start: "top 85%", // Trigger lebih awal biar gak nunggu lama
                        toggleActions: "play none none none"
                    }
                }
            );
        });
    } else {
        // Fallback for Mobile or no-GSAP handled by initMobileScrollReveal
        // Already called in init()
    }
}

/* ============================================
   7. NEURAL NETWORK CANVAS (OPTIMIZED)
   ============================================ */
function initNeuralNetwork() {
    const canvas = document.getElementById('neural-canvas');
    
    // PERFORMANCE FIX: Kill switch for mobile/tablet to save battery
    if (!canvas || window.innerWidth < 1024) { 
        if(canvas) canvas.style.display = 'none';
        return; 
    }
    
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    
    // Config: Reduce particle count for performance
    const config = {
        particleCount: 40, // Reduced from 50
        connectionDistance: 150,
        mouseDistance: 150,
        particleColor: 'rgba(212, 175, 55, 0.6)'
    };
    
    let mouse = { x: null, y: null };
    
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', debounce(() => {
        resize();
        initParticles();
    }, 250));
    
    resize();
    
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.3; // Slower speed
            this.vy = (Math.random() - 0.5) * 0.3;
            this.size = Math.random() * 2 + 1;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
            
            // Mouse repulsion
            if (mouse.x) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < config.mouseDistance) {
                    const force = (config.mouseDistance - distance) / config.mouseDistance;
                    this.x -= (dx / distance) * force * 2;
                    this.y -= (dy / distance) * force * 2;
                }
            }
        }
        
        draw() {
            ctx.fillStyle = config.particleColor;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    function initParticles() {
        particles = [];
        for (let i = 0; i < config.particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        // Optimasi: Draw lines first (batching)
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;

        for (let i = 0; i < particles.length; i++) {
            const p1 = particles[i];
            p1.update();
            p1.draw();
            
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < config.connectionDistance) {
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                }
            }
        }
        ctx.stroke();
        
        requestAnimationFrame(animate);
    }
    
    initParticles();
    animate();
}

/* ============================================
   8. UTILITIES (Tilt, FAQ, Anchors)
   ============================================ */

function initMagneticButtons() {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    
    const btns = document.querySelectorAll('.magnetic-btn');
    btns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.3 });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });
        });
    });
}

function initTiltCards() {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const cards = document.querySelectorAll('.tilt-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Limit rotation
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;
            
            gsap.to(card, {
                rotationX: rotateX,
                rotationY: rotateY,
                transformPerspective: 1000,
                duration: 0.4
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { rotationX: 0, rotationY: 0, duration: 0.6 });
        });
    });
}

function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(i => i.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });
}

function initSmoothAnchorLinks() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                if (lenis) {
                    lenis.scrollTo(target, { offset: -80 });
                } else {
                    const top = target.getBoundingClientRect().top + window.scrollY - 80;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            }
        });
    });
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}