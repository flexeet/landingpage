/**
 * ============================================================================
 * LIMAOS - EVENT OPERATING SYSTEM
 * Interactive JavaScript - NAMA Marine Theme
 * Version: 2.0
 * ============================================================================
 */

(function() {
    'use strict';

    // ========================================================================
    // CONFIGURATION
    // ========================================================================
    
    const CONFIG = {
        scrollRevealThreshold: 0.1,
        navbarScrollThreshold: 100,
        counterDuration: 2000,
        cursorGlowEnabled: true,
        tiltMaxRotation: 5,
        smoothScrollOffset: -100
    };

    // ========================================================================
    // DOM ELEMENTS
    // ========================================================================
    
    const DOM = {
        navbar: document.getElementById('navbar'),
        menuToggle: document.getElementById('menuToggle'),
        cursorGlow: document.getElementById('cursorGlow'),
        scrollRevealElements: document.querySelectorAll('.scroll-reveal'),
        counters: document.querySelectorAll('[data-counter]'),
        tiltElements: document.querySelectorAll('[data-tilt]'),
        anchorLinks: document.querySelectorAll('a[href^="#"]')
    };

    // ========================================================================
    // UTILITY FUNCTIONS
    // ========================================================================
    
    /**
     * Debounce function to limit execution rate
     */
    function debounce(func, wait = 100) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    /**
     * Throttle function for scroll events
     */
    function throttle(func, limit = 16) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Check if device is mobile/touch
     */
    function isMobile() {
        return window.innerWidth <= 900 || 'ontouchstart' in window;
    }

    /**
     * Easing function for smooth animations
     */
    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    // ========================================================================
    // NAVBAR FUNCTIONALITY
    // ========================================================================
    
    const Navbar = {
        init() {
            this.handleScroll();
            window.addEventListener('scroll', throttle(() => this.handleScroll(), 16));
            
            // Mobile menu toggle
            if (DOM.menuToggle) {
                DOM.menuToggle.addEventListener('click', () => this.toggleMobileMenu());
            }
        },

        handleScroll() {
            if (!DOM.navbar) return;
            
            const scrollY = window.scrollY || window.pageYOffset;
            
            if (scrollY > CONFIG.navbarScrollThreshold) {
                DOM.navbar.classList.add('scrolled');
            } else {
                DOM.navbar.classList.remove('scrolled');
            }
        },

        toggleMobileMenu() {
            // Toggle mobile menu (if implemented)
            DOM.menuToggle.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        }
    };

    // ========================================================================
    // SCROLL REVEAL ANIMATION
    // ========================================================================
    
    const ScrollReveal = {
        observer: null,

        init() {
            if (!('IntersectionObserver' in window)) {
                // Fallback for old browsers
                DOM.scrollRevealElements.forEach(el => el.classList.add('revealed'));
                return;
            }

            this.observer = new IntersectionObserver(
                (entries) => this.handleIntersect(entries),
                {
                    threshold: CONFIG.scrollRevealThreshold,
                    rootMargin: '0px 0px -50px 0px'
                }
            );

            DOM.scrollRevealElements.forEach(el => this.observer.observe(el));
        },

        handleIntersect(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    
                    // Trigger counter animation if element has counter
                    const counter = entry.target.querySelector('[data-counter]');
                    if (counter && !counter.dataset.animated) {
                        CounterAnimation.animate(counter);
                    }
                    
                    // Unobserve after reveal (one-time animation)
                    this.observer.unobserve(entry.target);
                }
            });
        }
    };

    // ========================================================================
    // COUNTER ANIMATION
    // ========================================================================
    
    const CounterAnimation = {
        init() {
            // Also check for counters that are already visible
            DOM.counters.forEach(counter => {
                if (this.isInViewport(counter) && !counter.dataset.animated) {
                    this.animate(counter);
                }
            });
        },

        isInViewport(el) {
            const rect = el.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        },

        animate(element) {
            const target = parseFloat(element.dataset.counter);
            const suffix = element.dataset.suffix || '';
            const prefix = element.dataset.prefix || '';
            const duration = CONFIG.counterDuration;
            const startTime = performance.now();
            
            element.dataset.animated = 'true';

            const updateCounter = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = easeOutCubic(progress);
                
                let currentValue = target * easedProgress;
                
                // Format based on whether target is decimal or integer
                if (target % 1 !== 0) {
                    currentValue = currentValue.toFixed(1);
                } else {
                    currentValue = Math.floor(currentValue);
                }
                
                element.textContent = prefix + currentValue + suffix;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    element.textContent = prefix + target + suffix;
                }
            };

            requestAnimationFrame(updateCounter);
        }
    };

    // ========================================================================
    // CURSOR GLOW EFFECT
    // ========================================================================
    
    const CursorGlow = {
        currentX: 0,
        currentY: 0,
        targetX: 0,
        targetY: 0,
        rafId: null,

        init() {
            if (isMobile() || !CONFIG.cursorGlowEnabled || !DOM.cursorGlow) return;

            document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
            document.addEventListener('mouseleave', () => this.handleMouseLeave());
            document.addEventListener('mouseenter', () => this.handleMouseEnter());
            
            this.animate();
        },

        handleMouseMove(e) {
            this.targetX = e.clientX;
            this.targetY = e.clientY;
        },

        handleMouseLeave() {
            DOM.cursorGlow.classList.remove('active');
        },

        handleMouseEnter() {
            DOM.cursorGlow.classList.add('active');
        },

        animate() {
            // Smooth follow with easing
            const ease = 0.1;
            this.currentX += (this.targetX - this.currentX) * ease;
            this.currentY += (this.targetY - this.currentY) * ease;

            DOM.cursorGlow.style.left = `${this.currentX}px`;
            DOM.cursorGlow.style.top = `${this.currentY}px`;

            this.rafId = requestAnimationFrame(() => this.animate());
        },

        destroy() {
            if (this.rafId) {
                cancelAnimationFrame(this.rafId);
            }
        }
    };

    // ========================================================================
    // 3D TILT EFFECT
    // ========================================================================
    
    const TiltEffect = {
        init() {
            if (isMobile()) return;

            DOM.tiltElements.forEach(element => {
                element.addEventListener('mouseenter', (e) => this.handleMouseEnter(e, element));
                element.addEventListener('mousemove', (e) => this.handleMouseMove(e, element));
                element.addEventListener('mouseleave', (e) => this.handleMouseLeave(e, element));
            });
        },

        handleMouseEnter(e, element) {
            element.style.transition = 'transform 0.1s ease';
        },

        handleMouseMove(e, element) {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;
            
            const rotateX = (mouseY / (rect.height / 2)) * -CONFIG.tiltMaxRotation;
            const rotateY = (mouseX / (rect.width / 2)) * CONFIG.tiltMaxRotation;

            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        },

        handleMouseLeave(e, element) {
            element.style.transition = 'transform 0.5s ease';
            element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        }
    };

    // ========================================================================
    // SMOOTH SCROLL
    // ========================================================================
    
    const SmoothScroll = {
        init() {
            DOM.anchorLinks.forEach(link => {
                link.addEventListener('click', (e) => this.handleClick(e, link));
            });
        },

        handleClick(e, link) {
            const href = link.getAttribute('href');
            
            // Skip if it's just "#" or external link
            if (href === '#' || !href.startsWith('#')) return;
            
            const target = document.querySelector(href);
            if (!target) return;
            
            e.preventDefault();
            
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = targetPosition + CONFIG.smoothScrollOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            document.body.classList.remove('menu-open');
            DOM.menuToggle?.classList.remove('active');
        }
    };

    // ========================================================================
    // LAZY LOAD IMAGES
    // ========================================================================
    
    const LazyLoad = {
        init() {
            const images = document.querySelectorAll('img[data-src]');
            
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            imageObserver.unobserve(img);
                        }
                    });
                }, {
                    rootMargin: '100px'
                });

                images.forEach(img => imageObserver.observe(img));
            } else {
                // Fallback
                images.forEach(img => {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                });
            }
        }
    };

    // ========================================================================
    // PAGE VISIBILITY
    // ========================================================================
    
    const PageVisibility = {
        hidden: false,

        init() {
            document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
        },

        handleVisibilityChange() {
            if (document.hidden) {
                this.hidden = true;
                // Pause animations when tab is not visible
                document.body.classList.add('animations-paused');
            } else {
                this.hidden = false;
                document.body.classList.remove('animations-paused');
            }
        }
    };

    // ========================================================================
    // TYPING INDICATOR ANIMATION (for chat demos)
    // ========================================================================
    
    const TypingIndicator = {
        init() {
            const typingElements = document.querySelectorAll('.chat-typing span');
            
            typingElements.forEach((span, index) => {
                span.style.animationDelay = `${index * 0.2}s`;
            });
        }
    };

    // ========================================================================
    // EMOJI ANIMATION PAUSE ON HOVER
    // ========================================================================
    
    const EmojiAnimations = {
        init() {
            // Add CSS to pause animations on hover for better UX
            const style = document.createElement('style');
            style.textContent = `
                .emoji-hero:hover,
                .emoji-success:hover,
                .emoji-danger:hover,
                .emoji-info:hover,
                .emoji-feature:hover {
                    animation-play-state: paused;
                }
                
                .animations-paused .emoji-hero,
                .animations-paused .emoji-success,
                .animations-paused .emoji-danger,
                .animations-paused .emoji-info,
                .animations-paused .emoji-feature {
                    animation-play-state: paused;
                }
            `;
            document.head.appendChild(style);
        }
    };

    // ========================================================================
    // RESIZE HANDLER
    // ========================================================================
    
    const ResizeHandler = {
        init() {
            window.addEventListener('resize', debounce(() => this.handleResize(), 250));
        },

        handleResize() {
            // Re-check mobile status and adjust features accordingly
            if (isMobile()) {
                CursorGlow.destroy();
                DOM.cursorGlow?.classList.remove('active');
            }
        }
    };

    // ========================================================================
    // EASTER EGG
    // ========================================================================
    
    const EasterEgg = {
        init() {
            console.log(
                '%c🎯 LimaOS - Event Operating System',
                'font-size: 20px; font-weight: bold; color: #06B6D4;'
            );
            console.log(
                '%cBuilt with ❤️ by Flexeet\n' +
                '%c"Automation tanpa logika itu bukan efisiensi — itu mempercepat kekacauan."',
                'font-size: 12px; color: #64748B;',
                'font-size: 11px; font-style: italic; color: #94A3B8;'
            );
            console.log(
                '%c📞 Ready to stop the bleeding? Schedule a discovery call!',
                'font-size: 12px; color: #10B981;'
            );
        }
    };

    // ========================================================================
    // PERFORMANCE MONITOR (Development Only)
    // ========================================================================
    
    const PerformanceMonitor = {
        init() {
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                window.addEventListener('load', () => {
                    setTimeout(() => {
                        const perfData = performance.getEntriesByType('navigation')[0];
                        if (perfData) {
                            console.log(
                                '%c⚡ Page Load Performance',
                                'font-size: 14px; font-weight: bold; color: #F59E0B;'
                            );
                            console.log(`DOM Content Loaded: ${Math.round(perfData.domContentLoadedEventEnd)}ms`);
                            console.log(`Full Page Load: ${Math.round(perfData.loadEventEnd)}ms`);
                        }
                    }, 0);
                });
            }
        }
    };

    // ========================================================================
    // INITIALIZE ALL MODULES
    // ========================================================================
    
    function init() {
        // Core functionality
        Navbar.init();
        ScrollReveal.init();
        SmoothScroll.init();
        
        // Visual enhancements
        CounterAnimation.init();
        CursorGlow.init();
        TiltEffect.init();
        EmojiAnimations.init();
        TypingIndicator.init();
        
        // Performance & utility
        LazyLoad.init();
        PageVisibility.init();
        ResizeHandler.init();
        
        // Fun stuff
        EasterEgg.init();
        PerformanceMonitor.init();
        
        // Add loaded class to body for CSS hooks
        document.body.classList.add('js-loaded');
    }

    // ========================================================================
    // RUN ON DOM READY
    // ========================================================================
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();