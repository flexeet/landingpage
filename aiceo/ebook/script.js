// ============================================
// AI-PROOF Landing Page — JavaScript
// ============================================

(function () {
    'use strict';

    // ---- Countdown Timer ----
    function initCountdown() {
        const el = document.getElementById('countdown');
        if (!el) return;

        // Set deadline to end of today
        const now = new Date();
        const deadline = new Date(now);
        deadline.setHours(23, 59, 59, 999);

        function update() {
            const diff = deadline - new Date();
            if (diff <= 0) {
                el.textContent = '⏰ EXPIRED';
                return;
            }
            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            el.textContent = `⏰ ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        }
        update();
        setInterval(update, 1000);
    }

    // ---- Scroll Animations ----
    function initScrollAnimations() {
        const items = document.querySelectorAll('[data-animate]');
        if (!items.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.delay) || 0;
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        items.forEach(item => observer.observe(item));
    }

    // ---- Nav Scroll Effect ----
    function initNavScroll() {
        const nav = document.getElementById('nav');
        if (!nav) return;

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    nav.classList.toggle('scrolled', window.scrollY > 50);
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // ---- Mobile Menu ----
    function initMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('navLinks');
        if (!hamburger || !navLinks) return;

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // ---- FAQ Accordion ----
    function initFAQ() {
        const items = document.querySelectorAll('.faq-item');
        items.forEach(item => {
            const btn = item.querySelector('.faq-question');
            if (!btn) return;

            btn.addEventListener('click', () => {
                const isOpen = item.classList.contains('open');

                // Close all others
                items.forEach(other => other.classList.remove('open'));

                // Toggle current
                if (!isOpen) {
                    item.classList.add('open');
                }
            });
        });
    }

    // ---- Hero Canvas (Subtle particle network) ----
    function initHeroCanvas() {
        const canvas = document.getElementById('heroCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let particles = [];
        let w, h;
        let animationId;

        function resize() {
            const rect = canvas.parentElement.getBoundingClientRect();
            w = canvas.width = rect.width;
            h = canvas.height = rect.height;
        }

        function createParticles() {
            const count = Math.min(Math.floor((w * h) / 18000), 60);
            particles = [];
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    r: Math.random() * 1.5 + 0.5,
                });
            }
        }

        function draw() {
            ctx.clearRect(0, 0, w, h);

            // Draw connections
            ctx.strokeStyle = 'rgba(212, 175, 55, 0.06)';
            ctx.lineWidth = 0.5;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        ctx.globalAlpha = 1 - dist / 150;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Draw particles
            ctx.globalAlpha = 1;
            particles.forEach(p => {
                ctx.fillStyle = 'rgba(212, 175, 55, 0.35)';
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();

                // Move
                p.x += p.vx;
                p.y += p.vy;

                // Wrap
                if (p.x < 0) p.x = w;
                if (p.x > w) p.x = 0;
                if (p.y < 0) p.y = h;
                if (p.y > h) p.y = 0;
            });

            animationId = requestAnimationFrame(draw);
        }

        // Only run canvas on larger screens
        if (window.innerWidth > 768) {
            resize();
            createParticles();
            draw();

            let resizeTimer;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => {
                    cancelAnimationFrame(animationId);
                    resize();
                    createParticles();
                    draw();
                }, 250);
            });
        }
    }

    // ---- Smooth Scroll for anchor links ----
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    const navHeight = document.getElementById('nav')?.offsetHeight || 0;
                    const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            });
        });
    }

    // ---- CTA Pulse (subtle attention grab) ----
    function initCTAPulse() {
        const cta = document.getElementById('ctaMain');
        if (!cta) return;

        // Add a subtle pulse every 5 seconds
        setInterval(() => {
            cta.style.transform = 'scale(1.03)';
            cta.style.boxShadow = '0 8px 40px rgba(212, 175, 55, 0.35)';
            setTimeout(() => {
                cta.style.transform = '';
                cta.style.boxShadow = '';
            }, 400);
        }, 5000);
    }

    // ---- Init All ----
    document.addEventListener('DOMContentLoaded', () => {
        initCountdown();
        initScrollAnimations();
        initNavScroll();
        initMobileMenu();
        initFAQ();
        initHeroCanvas();
        initSmoothScroll();
        initCTAPulse();
    });

})();