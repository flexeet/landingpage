/**
 * NAMA MARINE - NO LOADER VERSION
 * Clean, simple, works every time
 */

(function() {
    'use strict';

    // ===========================================
    // 1. SCROLL ANIMATIONS
    // ===========================================
    function initAnimations() {
        var reveals = document.querySelectorAll('.scroll-reveal, .stagger-reveal');
        
        if (!('IntersectionObserver' in window)) {
            // Fallback for old browsers - just show everything
            reveals.forEach(function(el) {
                el.classList.add('revealed');
            });
            return;
        }

        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    
                    // Handle counters
                    var counters = entry.target.querySelectorAll('[data-counter]');
                    counters.forEach(function(counter) {
                        if (!counter.dataset.counted) {
                            counter.dataset.counted = 'true';
                            animateCounter(counter);
                        }
                    });
                }
            });
        }, { threshold: 0.1 });

        reveals.forEach(function(el) {
            observer.observe(el);
        });
    }

    // ===========================================
    // 2. COUNTER ANIMATION
    // ===========================================
    function animateCounter(el) {
        var target = parseInt(el.dataset.counter, 10);
        if (isNaN(target)) return;

        var prefix = el.dataset.prefix || '';
        var suffix = el.dataset.suffix || '';
        var duration = 2000;
        var start = Date.now();

        function tick() {
            var elapsed = Date.now() - start;
            var progress = Math.min(elapsed / duration, 1);
            var ease = 1 - Math.pow(1 - progress, 3);
            var current = Math.floor(ease * target);
            
            el.textContent = prefix + current + suffix;

            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                el.textContent = prefix + target + suffix;
            }
        }
        
        requestAnimationFrame(tick);
    }

    // ===========================================
    // 3. NAVBAR SCROLL EFFECT
    // ===========================================
    function initNavbar() {
        var navbar = document.getElementById('navbar');
        if (!navbar) return;

        var navInner = navbar.querySelector('.nav-inner');
        if (!navInner) return;

        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navInner.style.background = 'rgba(255, 255, 255, 0.95)';
                navInner.style.boxShadow = '0 10px 30px rgba(0,0,0,0.08)';
            } else {
                navInner.style.background = 'rgba(255, 255, 255, 0.8)';
                navInner.style.boxShadow = '0 4px 6px -1px rgba(6, 182, 212, 0.05)';
            }
        });
    }

    // ===========================================
    // 4. SMOOTH SCROLL FOR ANCHOR LINKS
    // ===========================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                var targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                var target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    var top = target.getBoundingClientRect().top + window.pageYOffset - 100;
                    window.scrollTo({ top: top, behavior: 'smooth' });
                }
            });
        });
    }

    // ===========================================
    // 5. CURSOR GLOW (Desktop only)
    // ===========================================
    function initCursorGlow() {
        if (window.innerWidth <= 900) return;

        var glow = document.getElementById('cursorGlow');
        if (!glow) return;

        var mouseX = 0, mouseY = 0;
        var glowX = 0, glowY = 0;

        document.addEventListener('mousemove', function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            glow.classList.add('active');
        });

        document.addEventListener('mouseleave', function() {
            glow.classList.remove('active');
        });

        function animate() {
            glowX += (mouseX - glowX) * 0.1;
            glowY += (mouseY - glowY) * 0.1;
            glow.style.left = glowX + 'px';
            glow.style.top = glowY + 'px';
            requestAnimationFrame(animate);
        }
        animate();
    }

    // ===========================================
    // 6. 3D TILT EFFECT (Desktop only)
    // ===========================================
    function initTilt() {
        if (window.innerWidth <= 900) return;

        document.querySelectorAll('[data-tilt]').forEach(function(card) {
            card.addEventListener('mousemove', function(e) {
                var rect = card.getBoundingClientRect();
                var x = e.clientX - rect.left;
                var y = e.clientY - rect.top;
                var centerX = rect.width / 2;
                var centerY = rect.height / 2;

                var rotateX = ((y - centerY) / centerY) * -5;
                var rotateY = ((x - centerX) / centerX) * 5;

                card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale(1.02)';
            });

            card.addEventListener('mouseleave', function() {
                card.style.transition = 'transform 0.5s ease';
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
                setTimeout(function() { card.style.transition = ''; }, 500);
            });
        });
    }

    // ===========================================
    // INIT - Run on page load
    // ===========================================
    function init() {
        console.log('NAMA Marine: Starting...');
        initAnimations();
        initNavbar();
        initSmoothScroll();
        initCursorGlow();
        initTilt();
        console.log('NAMA Marine: Ready!');
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();