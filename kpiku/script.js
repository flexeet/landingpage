/* ===================================================================
   KPIKU LANDING PAGE — JAVASCRIPT
   Smooth interactions & modern animations
   =================================================================== */

(function() {
    'use strict';

    // === CONFIGURATION ===
    const CONFIG = {
        typingSpeed: 100,
        deletingSpeed: 50,
        pauseDuration: 2500,
        scrollThreshold: 50
    };

    // Pain points for typing effect
    const PAIN_POINTS = [
        'Subjektif?',
        'Manual?',
        'Bocor?',
        'Gak Jelas?'
    ];

    // === DOM ELEMENTS ===
    const elements = {
        cursorGlow: document.getElementById('cursorGlow'),
        scrollProgress: document.getElementById('scrollProgress'),
        mainNav: document.getElementById('mainNav'),
        navToggle: document.getElementById('navToggle'),
        mobileMenu: document.getElementById('mobileMenu'),
        dynamicWord: document.getElementById('dynamicWord')
    };

    // === CURSOR GLOW EFFECT ===
    function initCursorGlow() {
        if (!elements.cursorGlow) return;
        
        // Only on devices with hover capability
        if (!window.matchMedia('(hover: hover)').matches) return;

        let mouseX = 0, mouseY = 0;
        let currentX = 0, currentY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animate() {
            // Smooth follow
            currentX += (mouseX - currentX) * 0.1;
            currentY += (mouseY - currentY) * 0.1;
            
            elements.cursorGlow.style.left = currentX + 'px';
            elements.cursorGlow.style.top = currentY + 'px';
            
            requestAnimationFrame(animate);
        }
        
        animate();
    }

    // === SCROLL PROGRESS ===
    function updateScrollProgress() {
        if (!elements.scrollProgress) return;
        
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / scrollHeight) * 100;
        
        elements.scrollProgress.style.width = Math.min(progress, 100) + '%';
    }

    // === NAVIGATION SCROLL STATE ===
    function updateNavState() {
        if (!elements.mainNav) return;
        
        if (window.scrollY > CONFIG.scrollThreshold) {
            elements.mainNav.classList.add('scrolled');
        } else {
            elements.mainNav.classList.remove('scrolled');
        }
    }

    // === MOBILE MENU ===
    function initMobileMenu() {
        if (!elements.navToggle || !elements.mobileMenu) return;

        elements.navToggle.addEventListener('click', () => {
            elements.navToggle.classList.toggle('active');
            elements.mobileMenu.classList.toggle('active');
            document.body.style.overflow = elements.mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close on link click
        const mobileLinks = elements.mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                elements.navToggle.classList.remove('active');
                elements.mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && elements.mobileMenu.classList.contains('active')) {
                elements.navToggle.classList.remove('active');
                elements.mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // === TYPING EFFECT ===
    function initTypingEffect() {
        if (!elements.dynamicWord) return;

        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentWord = PAIN_POINTS[wordIndex];
            
            if (isDeleting) {
                charIndex--;
            } else {
                charIndex++;
            }

            const displayText = currentWord.substring(0, charIndex);
            elements.dynamicWord.textContent = displayText || '\u00A0'; // Non-breaking space when empty

            let delay = isDeleting ? CONFIG.deletingSpeed : CONFIG.typingSpeed;

            if (!isDeleting && charIndex === currentWord.length) {
                // Pause at end of word
                delay = CONFIG.pauseDuration;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                // Move to next word
                isDeleting = false;
                wordIndex = (wordIndex + 1) % PAIN_POINTS.length;
                delay = 500;
            }

            setTimeout(type, delay);
        }

        // Start after a brief delay
        setTimeout(type, 1000);
    }

    // === SMOOTH SCROLL ===
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                if (href.length > 1 && href.startsWith('#')) {
                    const target = document.querySelector(href);
                    
                    if (target) {
                        e.preventDefault();
                        
                        const navHeight = elements.mainNav?.offsetHeight || 0;
                        const offset = 20;
                        const targetPosition = target.offsetTop - navHeight - offset;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    // === SCROLL REVEAL ANIMATION ===
    function initScrollReveal() {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Add reveal class to elements
        const revealElements = document.querySelectorAll(
            '.problem-card, .brain-card, .step-item, .pricing-card, .faq-item'
        );

        revealElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(el);
        });
    }

    // Add revealed state
    const style = document.createElement('style');
    style.textContent = `
        .revealed {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // === ACTIVE NAV LINK (Scrollspy) ===
    function initScrollspy() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        function updateActiveLink() {
            let currentSection = '';
            const scrollY = window.scrollY;

            sections.forEach(section => {
                const sectionTop = section.offsetTop - 150;
                const sectionHeight = section.offsetHeight;

                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    currentSection = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href && href.includes(currentSection)) {
                    link.classList.add('active');
                }
            });
        }

        window.addEventListener('scroll', throttle(updateActiveLink, 100));
    }

    // === CHAT ANIMATION ===
    function initChatAnimation() {
        const chatBody = document.getElementById('chatBody');
        if (!chatBody) return;

        const messages = chatBody.querySelectorAll('.chat-message');
        
        // Add staggered animation delays
        messages.forEach((msg, index) => {
            msg.style.animationDelay = `${0.5 + index * 0.8}s`;
        });
    }

    // === UTILITY: THROTTLE ===
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // === UTILITY: DEBOUNCE ===
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // === SCROLL EVENT HANDLER ===
    function handleScroll() {
        updateScrollProgress();
        updateNavState();
    }

    // === INITIALIZE ===
    function init() {
        // Initialize all modules
        initCursorGlow();
        initMobileMenu();
        initTypingEffect();
        initSmoothScroll();
        initScrollReveal();
        initScrollspy();
        initChatAnimation();

        // Initial state
        updateScrollProgress();
        updateNavState();

        // Scroll event with throttle for performance
        window.addEventListener('scroll', throttle(handleScroll, 16), { passive: true });

        // Resize handler
        window.addEventListener('resize', debounce(() => {
            // Handle any resize-dependent logic
        }, 250));
    }

    // === RUN ===
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // === CONSOLE EASTER EGG ===
    console.log(
        '%c⚡ KPIKU',
        'font-size: 24px; font-weight: bold; color: #e85d3b;'
    );
    console.log(
        '%cKPI Kamu, UrusanKu. Beres!',
        'font-size: 14px; color: #64646b;'
    );
    console.log(
        '%cJoin us: @flexeet',
        'font-size: 12px; color: #9e9ea5;'
    );

})();