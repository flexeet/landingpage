/**
 * AICEO V4 Landing Page - Neuro-Cognitive Engine
 * "AI yang Bikin Lo Mikir"
 * Includes: Preloader, Custom Cursor, Neural Canvas, GSAP Animations, Lenis Smooth Scroll
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // Feature detection & initialization
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Add class to body for CSS targeting
    if (isMobile) {
        document.body.classList.add('is-mobile');
    }
    
    // --- PRELOADER LOGIC ---
    const preloader = document.getElementById('preloader');
    
    window.addEventListener('load', () => {
        if (preloader) {
            setTimeout(() => {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
            }, 600);
            
            setTimeout(() => {
                preloader.style.display = 'none';
                
                if (!isMobile && !prefersReducedMotion) {
                    initHeroAnimations();
                } else {
                    document.querySelectorAll('.reveal-text, .reveal-up').forEach(el => {
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                    });
                }
            }, 1200);
        }
    });
    
    // Initialize core modules
    initNavigation();
    initMobileMenu();
    initFAQ();
    initSmoothAnchorLinks();
    
    // Initialize heavy modules (Desktop Only)
    if (!isMobile && !prefersReducedMotion) {
        initLenisScroll();
        initCustomCursor();
        initMagneticButtons();
        initTiltCards();
        initNeuralNetwork();
    } else {
        initMobileScrollReveal();
        hideDesktopOnlyElements();
    }
    
    // Always init standard scroll animations
    initScrollAnimations();
    
    console.log('🧠 AICEO V4 Neuro-Cognitive Engine Loaded', isMobile ? '(Mobile Mode)' : '(Desktop Mode)');
});

/* ============================================
   MOBILE SPECIFIC FUNCTIONS
   ============================================ */
function initMobileScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-up, [class*="reveal"]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

function hideDesktopOnlyElements() {
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
   LENIS SMOOTH SCROLL (DESKTOP ONLY)
   ============================================ */
let lenis;

function initLenisScroll() {
    if (typeof Lenis === 'undefined') return;
    
    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        smooth: true,
        smoothTouch: false,
    });
    
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
   NAVIGATION & STICKY CTA
   ============================================ */
function initNavigation() {
    const nav = document.getElementById('nav');
    const mobileBtn = document.querySelector('.mobile-sticky-btn');
    
    if (!nav) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY > 50;
        
        if (scrolled) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        if (mobileBtn) {
            if (window.scrollY > 600) {
                mobileBtn.classList.add('visible');
            } else {
                mobileBtn.classList.remove('visible');
            }
        }
    }, { passive: true });
}

/* ============================================
   MOBILE MENU
   ============================================ */
function initMobileMenu() {
    const toggle = document.getElementById('mobileToggle');
    const menu = document.getElementById('mobileMenu');
    const links = document.querySelectorAll('.nav-mobile-link, .nav-mobile-cta');
    
    if (!toggle || !menu) return;
    
    toggle.addEventListener('click', () => {
        const isActive = toggle.classList.contains('active');
        
        if (!isActive) {
            toggle.classList.add('active');
            menu.classList.add('active');
            document.body.style.overflow = 'hidden';
            if (lenis) lenis.stop();
        } else {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = '';
            if (lenis) lenis.start();
            
            if (typeof ScrollTrigger !== 'undefined') {
                setTimeout(() => ScrollTrigger.refresh(), 500);
            }
        }
    });
    
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
   HERO ANIMATIONS (GSAP)
   ============================================ */
function initHeroAnimations() {
    if (typeof gsap === 'undefined') return;
    
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    
    // Reveal text animations
    tl.to('.reveal-text', {
        y: 0,
        duration: 1,
        stagger: 0.15
    })
    .to('.hero .reveal-up', {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1
    }, "-=0.5");
}

/* ============================================
   CUSTOM CURSOR
   ============================================ */
function initCustomCursor() {
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
        
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });
    
    // Smooth outline follow
    function animateOutline() {
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;
        
        cursorOutline.style.left = outlineX + 'px';
        cursorOutline.style.top = outlineY + 'px';
        
        requestAnimationFrame(animateOutline);
    }
    animateOutline();
    
    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, .magnetic-btn, .tilt-card, .faq-question');
    
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hover');
        });
    });
    
    // Click effect
    document.addEventListener('mousedown', () => {
        document.body.classList.add('cursor-click');
    });
    document.addEventListener('mouseup', () => {
        document.body.classList.remove('cursor-click');
    });
}

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */
function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.reveal-up:not(.hero .reveal-up)');
    
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && window.innerWidth >= 768) {
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
                        start: "top 85%",
                        toggleActions: "play none none none"
                    }
                }
            );
        });
    }
}

/* ============================================
   NEURAL NETWORK CANVAS (PURPLE THEME)
   ============================================ */
function initNeuralNetwork() {
    const canvas = document.getElementById('neural-canvas');
    
    if (!canvas || window.innerWidth < 1024) { 
        if(canvas) canvas.style.display = 'none';
        return; 
    }
    
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    
    // Purple theme config
    const config = {
        particleCount: 45,
        connectionDistance: 150,
        mouseDistance: 150,
        particleColor: 'rgba(168, 85, 247, 0.6)', // Purple
        lineColor: 'rgba(168, 85, 247, 0.08)'
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
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.size = Math.random() * 2 + 1;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
            
            // Mouse interaction
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
        
        ctx.beginPath();
        ctx.strokeStyle = config.lineColor;
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
   UTILITIES
   ============================================ */

function initMagneticButtons() {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (typeof gsap === 'undefined') return;
    
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
    if (typeof gsap === 'undefined') return;

    const cards = document.querySelectorAll('.tilt-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
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