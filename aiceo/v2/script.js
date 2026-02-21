/**
 * AICEO Landing Page — Black & Gold
 * Unique Section Animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize everything
    initPreloader();
    initAOS();
    initNavigation();
    initMobileMenu();
    initCustomCursor();
    initHeroCanvas();
    initDotsCanvas();
    initCtaCanvas();
    initCounters();
    initTimeline();
    initChatDemo();
    initSmoothScroll();
    initMarqueeSpeed();
});

/* ============================
   PRELOADER
   ============================ */
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    const progress = document.querySelector('.preloader-progress');
    const percent = document.querySelector('.preloader-percent');
    
    let loaded = 0;
    const duration = 1500;
    const interval = 20;
    const increment = 100 / (duration / interval);
    
    const timer = setInterval(() => {
        loaded += increment;
        if (loaded >= 100) {
            loaded = 100;
            clearInterval(timer);
            
            setTimeout(() => {
                preloader.classList.add('loaded');
                document.body.classList.remove('loading');
            }, 200);
        }
        
        progress.style.width = loaded + '%';
        percent.textContent = Math.round(loaded) + '%';
    }, interval);
}

/* ============================
   AOS ANIMATIONS
   ============================ */
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 50,
            disable: 'mobile'
        });
    }
}

/* ============================
   NAVIGATION
   ============================ */
function initNavigation() {
    const nav = document.getElementById('mainNav');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
}

/* ============================
   MOBILE MENU
   ============================ */
function initMobileMenu() {
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('mobileMenu');
    const links = document.querySelectorAll('.mobile-link');
    
    if (!toggle || !menu) return;
    
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        menu.classList.toggle('active');
        document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    });
    
    links.forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

/* ============================
   CUSTOM CURSOR
   ============================ */
function initCustomCursor() {
    // Only on desktop with hover capability
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    
    if (!dot || !ring) return;
    
    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    let ringX = 0, ringY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animate() {
        // Dot follows quickly
        dotX += (mouseX - dotX) * 0.2;
        dotY += (mouseY - dotY) * 0.2;
        dot.style.left = dotX + 'px';
        dot.style.top = dotY + 'px';
        
        // Ring follows with delay
        ringX += (mouseX - ringX) * 0.1;
        ringY += (mouseY - ringY) * 0.1;
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';
        
        requestAnimationFrame(animate);
    }
    animate();
    
    // Hover states
    const hoverElements = document.querySelectorAll('a, button, .feature-card, .pricing-card, .compare-card');
    
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            dot.classList.add('hover');
            ring.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            dot.classList.remove('hover');
            ring.classList.remove('hover');
        });
    });
}

/* ============================
   HERO CANVAS — Particle Network
   ============================ */
function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height, particles = [];
    
    const CONFIG = {
        particleCount: 50,
        particleSize: 2,
        connectionDistance: 150,
        speed: 0.3,
        particleColor: 'rgba(212, 175, 55, 0.6)',
        lineColor: 'rgba(212, 175, 55, 0.1)'
    };
    
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * CONFIG.speed;
            this.vy = (Math.random() - 0.5) * CONFIG.speed;
            this.size = Math.random() * CONFIG.particleSize + 1;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = CONFIG.particleColor;
            ctx.fill();
        }
    }
    
    function initParticles() {
        particles = [];
        const count = window.innerWidth < 768 ? 25 : CONFIG.particleCount;
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.update();
            p.draw();
            
            // Draw connections
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < CONFIG.connectionDistance) {
                    const opacity = 1 - (distance / CONFIG.connectionDistance);
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(212, 175, 55, ${opacity * 0.15})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    window.addEventListener('resize', () => {
        resize();
        initParticles();
    });
    
    resize();
    initParticles();
    animate();
}

/* ============================
   DOTS CANVAS — Interactive Repel Effect
   ============================ */
function initDotsCanvas() {
    const canvas = document.getElementById('dots-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height, dots = [];
    
    const CONFIG = {
        dotGap: 50,
        dotSize: 1.5,
        mouseRadius: 100,
        repelForce: 0.8,
        friction: 0.85,
        returnSpeed: 0.08,
        dotColor: '#d4af37'
    };
    
    let mouse = { x: -1000, y: -1000 };
    
    function resize() {
        const parent = canvas.parentElement;
        width = canvas.width = parent.offsetWidth;
        height = canvas.height = parent.offsetHeight;
        initDots();
    }
    
    class Dot {
        constructor(x, y) {
            this.originX = x;
            this.originY = y;
            this.x = x;
            this.y = y;
            this.vx = 0;
            this.vy = 0;
        }
        
        update() {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < CONFIG.mouseRadius) {
                const angle = Math.atan2(dy, dx);
                const force = (CONFIG.mouseRadius - distance) / CONFIG.mouseRadius;
                this.vx -= Math.cos(angle) * force * CONFIG.repelForce * 15;
                this.vy -= Math.sin(angle) * force * CONFIG.repelForce * 15;
            }
            
            this.vx *= CONFIG.friction;
            this.vy *= CONFIG.friction;
            
            this.x += this.vx;
            this.y += this.vy;
            
            // Return to origin
            this.x += (this.originX - this.x) * CONFIG.returnSpeed;
            this.y += (this.originY - this.y) * CONFIG.returnSpeed;
        }
        
        draw() {
            const dx = this.x - this.originX;
            const dy = this.y - this.originY;
            const displacement = Math.sqrt(dx * dx + dy * dy);
            const opacity = Math.min(1, 0.3 + displacement / 50);
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, CONFIG.dotSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(212, 175, 55, ${opacity})`;
            ctx.fill();
        }
    }
    
    function initDots() {
        dots = [];
        for (let x = CONFIG.dotGap / 2; x < width; x += CONFIG.dotGap) {
            for (let y = CONFIG.dotGap / 2; y < height; y += CONFIG.dotGap) {
                dots.push(new Dot(x, y));
            }
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        dots.forEach(dot => {
            dot.update();
            dot.draw();
        });
        requestAnimationFrame(animate);
    }
    
    document.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        if (e.clientX >= rect.left && e.clientX <= rect.right &&
            e.clientY >= rect.top && e.clientY <= rect.bottom) {
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        } else {
            mouse.x = -1000;
            mouse.y = -1000;
        }
    });
    
    window.addEventListener('resize', resize);
    resize();
    animate();
}

/* ============================
   CTA CANVAS — Floating Particles
   ============================ */
function initCtaCanvas() {
    const canvas = document.getElementById('cta-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height, particles = [];
    
    function resize() {
        const parent = canvas.parentElement;
        width = canvas.width = parent.offsetWidth;
        height = canvas.height = parent.offsetHeight;
    }
    
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * width;
            this.y = height + 10;
            this.size = Math.random() * 4 + 2;
            this.speedY = Math.random() * 1 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.y -= this.speedY;
            this.x += this.speedX;
            
            if (this.y < -10) {
                this.reset();
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
            ctx.fill();
        }
    }
    
    function initParticles() {
        particles = [];
        const count = window.innerWidth < 768 ? 15 : 30;
        for (let i = 0; i < count; i++) {
            const p = new Particle();
            p.y = Math.random() * height; // Start at random positions
            particles.push(p);
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    
    window.addEventListener('resize', () => {
        resize();
        initParticles();
    });
    
    resize();
    initParticles();
    animate();
}

/* ============================
   COUNTER ANIMATION
   ============================ */
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.target);
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    const duration = 2000;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out quart
        const eased = 1 - Math.pow(1 - progress, 4);
        const current = Math.round(target * eased);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

/* ============================
   TIMELINE PROGRESS
   ============================ */
function initTimeline() {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;
    
    const progress = document.getElementById('timelineProgress');
    const steps = timeline.querySelectorAll('.step');
    
    function updateTimeline() {
        const rect = timeline.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Calculate progress
        const scrollProgress = Math.max(0, Math.min(1,
            (windowHeight - rect.top) / (windowHeight + rect.height)
        ));
        
        progress.style.height = `${scrollProgress * 100}%`;
        
        // Activate steps
        steps.forEach((step, index) => {
            const stepRect = step.getBoundingClientRect();
            const stepCenter = stepRect.top + stepRect.height / 2;
            
            if (stepCenter < windowHeight * 0.6) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }
    
    window.addEventListener('scroll', throttle(updateTimeline, 16));
    updateTimeline();
}

/* ============================
   CHAT DEMO — Typing Effect
   ============================ */
function initChatDemo() {
    const demoWindow = document.querySelector('.demo-window');
    if (!demoWindow) return;
    
    const typingDots = demoWindow.querySelector('.typing-dots');
    const messageContent = demoWindow.querySelector('.message-content');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Start typing animation
                setTimeout(() => {
                    if (typingDots) typingDots.style.display = 'none';
                    if (messageContent) {
                        messageContent.style.display = 'block';
                        animateMessageContent(messageContent);
                    }
                }, 2000);
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(demoWindow);
}

function animateMessageContent(container) {
    const elements = container.children;
    
    Array.from(elements).forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(10px)';
        el.style.transition = 'all 0.4s ease';
        
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 150);
    });
}

/* ============================
   SMOOTH SCROLL
   ============================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ============================
   MARQUEE SPEED ON SCROLL
   ============================ */
function initMarqueeSpeed() {
    let lastScrollY = window.scrollY;
    const marqueeTrack = document.querySelector('.marquee-track');
    
    if (!marqueeTrack) return;
    
    window.addEventListener('scroll', throttle(() => {
        const currentScrollY = window.scrollY;
        const velocity = Math.abs(currentScrollY - lastScrollY);
        lastScrollY = currentScrollY;
        
        // Speed up marquee based on scroll
        const baseSpeed = 30;
        const speedBoost = Math.min(velocity * 0.15, 15);
        marqueeTrack.style.animationDuration = `${baseSpeed - speedBoost}s`;
    }, 50));
}

/* ============================
   UTILITY FUNCTIONS
   ============================ */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

/* ============================
   CONSOLE BRANDING
   ============================ */
console.log(
    '%c🧠 AICEO',
    'font-size: 24px; font-weight: bold; color: #d4af37; background: #0a0a0a; padding: 10px 20px; border-radius: 8px;'
);
console.log(
    '%cClone your decision intelligence',
    'font-size: 14px; color: #d4af37;'
);