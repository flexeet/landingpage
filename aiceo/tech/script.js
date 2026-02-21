/* ============================================
   THE AI CEO 2025 - WEBINAR SCRIPT (OPTIMIZED)
   79 Slides • ~2.5 Hours • Comprehensive Deck
   
   OPTIMIZATIONS:
   - Touch/swipe support for mobile
   - LocalStorage progress save
   - Throttle/debounce for performance
   - RequestAnimationFrame optimization
   - Preload adjacent slides
   - Better error handling
   - Keyboard shortcuts help (?)
   ============================================ */

(function() {
    'use strict';

    // ==================== CONFIGURATION ====================
    const CONFIG = {
        totalSlides: 78,
        animationDuration: 600,
        swipeThreshold: 50,
        storageKey: 'aiceo_webinar_progress',
        debounceDelay: 150
    };

    // ==================== STATE MANAGEMENT ====================
    const state = {
        currentSlide: 1,
        isAnimating: false,
        touchStartX: 0,
        touchStartY: 0,
        mouseX: 0.5,
        mouseY: 0.5,
        rafId: null
    };

    // ==================== DOM CACHE ====================
    let DOM = {};

    // ==================== UTILITY FUNCTIONS ====================
    
    /**
     * Throttle function - limits execution rate
     */
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

    /**
     * Debounce function - delays execution until after delay
     */
    function debounce(func, delay) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    /**
     * Safe localStorage access
     */
    const storage = {
        get(key) {
            try {
                return JSON.parse(localStorage.getItem(key));
            } catch (e) {
                return null;
            }
        },
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (e) {
                console.warn('LocalStorage not available');
            }
        }
    };

    /**
     * Format number as Rupiah
     */
    function formatRupiah(num) {
        return 'Rp ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    /**
     * Pad number with leading zero
     */
    function padNumber(num) {
        return num.toString().padStart(2, '0');
    }

    // ==================== INITIALIZATION ====================
    
    function init() {
        // Cache DOM elements
        cacheDOM();
        
        // Initialize features
        initSlides();
        initCursor();
        initCalculator();
        initKeyboardNav();
        initTouchNav();
        initTelegramDemo();
        initParallaxOrbs();
        initStartButton();
        
        // Restore progress from localStorage
        restoreProgress();
        
        // Update UI
        updateProgress();
        updateSlideCounter();
        
        // Animate first slide
        setTimeout(() => {
            const activeSlide = document.querySelector('.slide.active');
            if (activeSlide) {
                animateSlideIn(activeSlide);
                triggerSlideAnimations(activeSlide);
            }
        }, 300);
        
        // Console branding
        console.log('%c🎙️ THE AI CEO 2025', 'font-size: 20px; font-weight: bold; color: #c9a962;');
        console.log(`%cLoaded ${CONFIG.totalSlides} slides.`, 'color: #888;');
        console.log('%cPress ? for keyboard shortcuts', 'color: #666; font-style: italic;');
    }

    function cacheDOM() {
        DOM = {
            slidesContainer: document.getElementById('slidesContainer'),
            progressFill: document.getElementById('progressFill'),
            currentSlideEl: document.getElementById('currentSlide'),
            totalSlidesEl: document.getElementById('totalSlides'),
            keyboardOverlay: document.getElementById('keyboardOverlay'),
            gotoModal: document.getElementById('gotoModal'),
            gotoInput: document.getElementById('gotoInput'),
            cursor: document.getElementById('cursor'),
            cursorFollower: document.getElementById('cursorFollower'),
            navHint: document.getElementById('navHint')
        };
        
        // Set total slides
        if (DOM.totalSlidesEl) {
            DOM.totalSlidesEl.textContent = padNumber(CONFIG.totalSlides);
        }
    }

    function initSlides() {
        const slides = document.querySelectorAll('.slide');
        slides.forEach((slide, index) => {
            slide.dataset.slide = index + 1;
        });
    }

    // ==================== PROGRESS PERSISTENCE ====================
    
    function saveProgress() {
        storage.set(CONFIG.storageKey, {
            slide: state.currentSlide,
            timestamp: Date.now()
        });
    }

    function restoreProgress() {
        const saved = storage.get(CONFIG.storageKey);
        if (saved && saved.slide > 1) {
            // Check if saved within last 24 hours
            const dayMs = 24 * 60 * 60 * 1000;
            if (Date.now() - saved.timestamp < dayMs) {
                // Show restore prompt
                const restore = confirm(`Lanjutkan dari slide ${saved.slide}?`);
                if (restore) {
                    goToSlide(saved.slide, true);
                }
            }
        }
    }

    // ==================== SLIDE NAVIGATION ====================
    
    function goToSlide(slideNumber, skipAnimation = false) {
        if (state.isAnimating && !skipAnimation) return;
        if (slideNumber < 1 || slideNumber > CONFIG.totalSlides) return;
        if (slideNumber === state.currentSlide) return;
        
        state.isAnimating = true;
        
        const currentSlideElement = document.querySelector('.slide.active');
        const nextSlideEl = document.querySelector(`.slide[data-slide="${slideNumber}"]`);
        const direction = slideNumber > state.currentSlide ? 1 : -1;
        
        // Animate OUT current slide
        if (currentSlideElement) {
            animateSlideOut(currentSlideElement, direction);
            setTimeout(() => {
                currentSlideElement.classList.remove('active');
            }, skipAnimation ? 0 : 500);
        }
        
        // Animate IN next slide
        if (nextSlideEl) {
            if (skipAnimation) {
                nextSlideEl.classList.add('active');
            } else {
                nextSlideEl.classList.add('active');
                animateSlideIn(nextSlideEl);
                
                // Force reflow
                void nextSlideEl.offsetWidth;
                
                // Trigger entry animation
                const content = nextSlideEl.querySelector('.slide-content');
                if (content) {
                    content.style.transform = 'translateX(0) translateZ(0)';
                    content.style.opacity = '1';
                }
                
                triggerSlideAnimations(nextSlideEl);
            }
        }
        
        state.currentSlide = slideNumber;
        updateProgress();
        updateSlideCounter();
        saveProgress();
        
        // Preload adjacent slides
        preloadAdjacentSlides(slideNumber);
        
        setTimeout(() => {
            state.isAnimating = false;
        }, skipAnimation ? 0 : CONFIG.animationDuration);
    }

    function nextSlide() {
        goToSlide(state.currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(state.currentSlide - 1);
    }

    function preloadAdjacentSlides(current) {
        // Preload next and previous slides for smoother transitions
        [-1, 1, 2].forEach(offset => {
            const slideNum = current + offset;
            if (slideNum >= 1 && slideNum <= CONFIG.totalSlides) {
                const slide = document.querySelector(`.slide[data-slide="${slideNum}"]`);
                if (slide) {
                    // Trigger any lazy-loaded content
                    slide.querySelectorAll('[data-src]').forEach(el => {
                        if (el.dataset.src) {
                            el.src = el.dataset.src;
                        }
                    });
                }
            }
        });
    }

    // ==================== SLIDE ANIMATIONS ====================
    
    function animateSlideOut(slide, direction) {
        const content = slide.querySelector('.slide-content');
        if (content) {
            content.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease';
            content.style.transform = `translateX(${direction * -50}px) translateZ(0)`;
            content.style.opacity = '0';
        }
    }

    function animateSlideIn(slide) {
        const content = slide.querySelector('.slide-content');
        const direction = state.currentSlide < parseInt(slide.dataset.slide) ? 1 : -1;
        
        if (content) {
            content.style.transition = 'none';
            content.style.transform = `translateX(${direction * 50}px) translateZ(0)`;
            content.style.opacity = '0';
            
            requestAnimationFrame(() => {
                content.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease';
            });
        }
    }

    function triggerSlideAnimations(slide) {
        // Staggered items animation
        const staggerSelectors = [
            '.engine-card', '.story-card', '.leak-item', '.data-card',
            '.cost-item', '.context-card', '.ceo-type', '.abc-card',
            '.invasion-card', '.evo-item', '.copy-card', '.benefit-card',
            '.consult-card', '.tier-card', '.faq-item', '.tool-card',
            '.paying-card', '.challenge-item', '.value-point', '.auth-card',
            '.compiler-step', '.whatif-item', '.objection', '.advisor-card',
            '.persona-card', '.qualify-card'
        ];
        
        const staggerItems = slide.querySelectorAll(staggerSelectors.join(', '));
        
        staggerItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px) translateZ(0)';
            item.style.transition = 'none';
            
            setTimeout(() => {
                item.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0) translateZ(0)';
            }, 150 + (index * 100));
        });
        
        // Number animations
        const numbers = slide.querySelectorAll('.data-number, .stat-value, .mega-number');
        numbers.forEach((num, index) => {
            setTimeout(() => animateNumber(num), 200 + (index * 150));
        });
        
        // Text animations
        const texts = slide.querySelectorAll('.section-title, .statement-text, .big-quote');
        texts.forEach(text => {
            text.style.opacity = '0';
            text.style.transform = 'translateY(20px) translateZ(0)';
            setTimeout(() => {
                text.style.transition = 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
                text.style.opacity = '1';
                text.style.transform = 'translateY(0) translateZ(0)';
            }, 200);
        });
    }

    function animateNumber(element) {
        const text = element.textContent.trim();
        const match = text.match(/^([^\d]*)([\d,.]+)([^\d]*)$/);
        if (!match) return;
        
        const prefix = match[1] || '';
        const numberStr = match[2];
        const suffix = match[3] || '';
        
        let target = parseFloat(numberStr.replace(/[,.]/g, ''));
        if (numberStr.includes(',')) target = parseFloat(numberStr.replace(',', '.'));
        
        // Simple scale animation for small or complex numbers
        if (target < 1000 && !text.includes('%')) {
            element.style.transform = 'scale(0.5) translateZ(0)';
            element.style.opacity = '0';
            requestAnimationFrame(() => {
                element.style.transition = 'all 0.6s cubic-bezier(0.17, 0.67, 0.83, 0.67)';
                element.style.transform = 'scale(1) translateZ(0)';
                element.style.opacity = '1';
            });
            return;
        }
        
        // Number counting animation
        const duration = 1500;
        const start = performance.now();
        
        function update(time) {
            const p = Math.min((time - start) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 4); // EaseOutQuart
            
            const current = Math.floor(target * ease);
            element.textContent = prefix + current.toLocaleString('id-ID') + suffix;
            
            if (p < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = text; // Restore original formatting
            }
        }
        requestAnimationFrame(update);
    }

    // ==================== PROGRESS & COUNTER ====================
    
    function updateProgress() {
        const progress = (state.currentSlide / CONFIG.totalSlides) * 100;
        
        if (DOM.progressFill) {
            DOM.progressFill.style.width = progress + '%';
        }
    }

    function updateSlideCounter() {
        if (DOM.currentSlideEl) {
            DOM.currentSlideEl.style.transform = 'translateY(-10px)';
            DOM.currentSlideEl.style.opacity = '0';
            
            setTimeout(() => {
                DOM.currentSlideEl.textContent = padNumber(state.currentSlide);
                DOM.currentSlideEl.style.transform = 'translateY(0)';
                DOM.currentSlideEl.style.opacity = '1';
            }, 200);
        }
    }

    // ==================== KEYBOARD NAVIGATION ====================
    
    function initKeyboardNav() {
        document.addEventListener('keydown', handleKeyDown);
        
        // Click navigation (right/left sides)
        document.addEventListener('click', handleClick);
        
        // Slide counter click
        const slideCounter = document.getElementById('slideCounter');
        if (slideCounter) {
            slideCounter.addEventListener('click', openGotoModal);
        }
    }

    function handleKeyDown(e) {
        // Ignore if typing in input
        if (document.activeElement.tagName === 'INPUT') {
            if (e.key === 'Enter') handleGotoSubmit();
            if (e.key === 'Escape') closeGotoModal();
            return;
        }
        
        switch(e.key) {
            case 'ArrowRight':
            case ' ':
            case 'Enter':
                e.preventDefault();
                nextSlide();
                break;
            case 'ArrowLeft':
            case 'Backspace':
                e.preventDefault();
                prevSlide();
                break;
            case 'ArrowUp':
                e.preventDefault();
                goToSlide(Math.max(1, state.currentSlide - 5));
                break;
            case 'ArrowDown':
                e.preventDefault();
                goToSlide(Math.min(CONFIG.totalSlides, state.currentSlide + 5));
                break;
            case 'Home':
                e.preventDefault();
                goToSlide(1);
                break;
            case 'End':
                e.preventDefault();
                goToSlide(CONFIG.totalSlides);
                break;
            case 'f':
            case 'F':
                toggleFullscreen();
                break;
            case 'g':
            case 'G':
                e.preventDefault();
                openGotoModal();
                break;
            case '?':
                e.preventDefault();
                showKeyboardHelp();
                break;
            case 'Escape':
                closeOverlay();
                closeGotoModal();
                break;
            case 't':
            case 'T':
                console.log(`Slide ${state.currentSlide} | Section: ${getSectionName(state.currentSlide)}`);
                break;
        }
    }

    function handleClick(e) {
        if (e.target.closest('button, input, .interactive, .slide-counter, .demo-btn')) return;
        
        const width = window.innerWidth;
        if (e.clientX > width * 0.75) nextSlide();
        else if (e.clientX < width * 0.25) prevSlide();
    }

    function showKeyboardHelp() {
        const helpHTML = `
            <div style="position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:9999;display:flex;justify-content:center;align-items:center;backdrop-filter:blur(10px);" onclick="this.remove()">
                <div style="background:#18181c;border:1px solid rgba(255,255,255,0.1);padding:48px;border-radius:24px;max-width:500px;" onclick="event.stopPropagation()">
                    <h3 style="font-family:'Playfair Display',serif;font-size:1.5rem;margin-bottom:24px;text-align:center;color:#c9a962;">⌨️ Keyboard Shortcuts</h3>
                    <div style="display:grid;gap:12px;font-size:0.95rem;">
                        <div style="display:flex;justify-content:space-between;"><span>→ / Space / Enter</span><span style="color:#888;">Next slide</span></div>
                        <div style="display:flex;justify-content:space-between;"><span>← / Backspace</span><span style="color:#888;">Previous slide</span></div>
                        <div style="display:flex;justify-content:space-between;"><span>↑ / ↓</span><span style="color:#888;">Skip 5 slides</span></div>
                        <div style="display:flex;justify-content:space-between;"><span>Home / End</span><span style="color:#888;">First / Last slide</span></div>
                        <div style="display:flex;justify-content:space-between;"><span>G</span><span style="color:#888;">Go to slide</span></div>
                        <div style="display:flex;justify-content:space-between;"><span>F</span><span style="color:#888;">Fullscreen</span></div>
                        <div style="display:flex;justify-content:space-between;"><span>Esc</span><span style="color:#888;">Close modal</span></div>
                    </div>
                    <p style="text-align:center;margin-top:24px;color:#666;font-size:0.85rem;">Click anywhere to close</p>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', helpHTML);
    }

    // ==================== TOUCH/SWIPE NAVIGATION ====================
    
    function initTouchNav() {
        const container = DOM.slidesContainer;
        if (!container) return;
        
        container.addEventListener('touchstart', handleTouchStart, { passive: true });
        container.addEventListener('touchmove', handleTouchMove, { passive: false });
        container.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    function handleTouchStart(e) {
        state.touchStartX = e.touches[0].clientX;
        state.touchStartY = e.touches[0].clientY;
    }

    function handleTouchMove(e) {
        if (!state.touchStartX) return;
        
        const diffX = state.touchStartX - e.touches[0].clientX;
        const diffY = state.touchStartY - e.touches[0].clientY;
        
        // Prevent vertical scroll if swiping horizontally
        if (Math.abs(diffX) > Math.abs(diffY)) {
            e.preventDefault();
        }
    }

    function handleTouchEnd(e) {
        if (!state.touchStartX) return;
        
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        
        const diffX = state.touchStartX - touchEndX;
        const diffY = state.touchStartY - touchEndY;
        
        // Horizontal swipe detection
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > CONFIG.swipeThreshold) {
            if (diffX > 0) {
                nextSlide(); // Swipe left = next
            } else {
                prevSlide(); // Swipe right = prev
            }
        }
        
        // Reset
        state.touchStartX = 0;
        state.touchStartY = 0;
    }

    // ==================== GOTO MODAL ====================
    
    function openGotoModal() {
        if (DOM.gotoModal) {
            DOM.gotoModal.classList.remove('hidden');
            if (DOM.gotoInput) {
                DOM.gotoInput.value = '';
                DOM.gotoInput.focus();
            }
        }
    }

    function closeGotoModal() {
        if (DOM.gotoModal) {
            DOM.gotoModal.classList.add('hidden');
        }
    }

    function handleGotoSubmit() {
        if (!DOM.gotoInput) return;
        
        const val = parseInt(DOM.gotoInput.value);
        if (!isNaN(val) && val >= 1 && val <= CONFIG.totalSlides) {
            goToSlide(val);
            closeGotoModal();
        } else {
            DOM.gotoInput.classList.add('error');
            setTimeout(() => DOM.gotoInput.classList.remove('error'), 300);
        }
    }

    // ==================== FULLSCREEN ====================
    
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Fullscreen not available:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }

    function closeOverlay() {
        const overlay = document.getElementById('keyboardOverlay');
        if (overlay) {
            overlay.classList.add('hidden');
            console.log('Overlay closed');
        }
    }

    // Bind start button click event
    function initStartButton() {
        const startBtn = document.querySelector('.start-btn');
        if (startBtn) {
            startBtn.addEventListener('click', closeOverlay);
        }
    }

    // ==================== CURSOR ====================
    
    function initCursor() {
        if (!DOM.cursor || !DOM.cursorFollower) return;
        
        // Skip on touch devices
        if (window.matchMedia("(pointer: coarse)").matches) return;
        
        let mx = 0, my = 0, cx = 0, cy = 0;
        
        const onMouseMove = throttle((e) => {
            mx = e.clientX;
            my = e.clientY;
        }, 16); // ~60fps
        
        document.addEventListener('mousemove', onMouseMove);
        
        function animateCursor() {
            cx += (mx - cx) * 0.2;
            cy += (my - cy) * 0.2;
            
            DOM.cursor.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%) translateZ(0)`;
            DOM.cursorFollower.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%) translateZ(0)`;
            
            requestAnimationFrame(animateCursor);
        }
        animateCursor();
        
        // Hover states
        const interactive = document.querySelectorAll('a, button, .interactive, .card, .leak-item, .consult-card, .demo-btn, .slide-counter');
        interactive.forEach(el => {
            el.addEventListener('mouseenter', () => DOM.cursorFollower.classList.add('hover'));
            el.addEventListener('mouseleave', () => DOM.cursorFollower.classList.remove('hover'));
        });
    }

    // ==================== PARALLAX ORBS ====================
    
    function initParallaxOrbs() {
        let currentX = 0.5, currentY = 0.5;
        
        const onMouseMove = throttle((e) => {
            state.mouseX = e.clientX / window.innerWidth;
            state.mouseY = e.clientY / window.innerHeight;
        }, 32);
        
        document.addEventListener('mousemove', onMouseMove);
        
        function animateOrbs() {
            currentX += (state.mouseX - currentX) * 0.05;
            currentY += (state.mouseY - currentY) * 0.05;
            
            const orbs = document.querySelectorAll('.gradient-orb');
            orbs.forEach((orb, i) => {
                const depth = (i + 1) * 20;
                const moveX = (currentX - 0.5) * depth;
                const moveY = (currentY - 0.5) * depth;
                orb.style.transform = `translate(${moveX}px, ${moveY}px) translateZ(0)`;
            });
            
            requestAnimationFrame(animateOrbs);
        }
        animateOrbs();
    }

    // ==================== CALCULATOR ====================
    
    function initCalculator() {
        const sliderHours = document.getElementById('sliderHours');
        const sliderRate = document.getElementById('sliderRate');
        const hoursValue = document.getElementById('calcHours');
        const rateValue = document.getElementById('calcRate');
        const resultValue = document.getElementById('resultValue');
        
        if (!sliderHours || !sliderRate) return;
        
        const updateCalc = debounce(() => {
            const hours = parseInt(sliderHours.value);
            const rate = parseInt(sliderRate.value);
            
            if (hoursValue) hoursValue.textContent = hours;
            if (rateValue) rateValue.textContent = rate;
            
            // Formula: hours/week * rate(rb) * 1000 * 52 weeks
            const annualLeak = hours * (rate * 1000) * 52;
            
            if (resultValue) {
                resultValue.textContent = formatRupiah(annualLeak);
                
                // Visual feedback
                resultValue.style.textShadow = "0 0 30px rgba(201, 169, 98, 0.8)";
                setTimeout(() => {
                    resultValue.style.textShadow = "0 0 40px rgba(201, 169, 98, 0.25)";
                }, 200);
            }
        }, 50);
        
        sliderHours.addEventListener('input', updateCalc);
        sliderRate.addEventListener('input', updateCalc);
    }

    // ==================== TELEGRAM DEMO ====================
    
    const demoScenarios = {
        ukuran: {
            user: "Ukuran LD Ixora berapa ya?",
            bot: `<strong>Teh Ija (AI):</strong><br><br>Untuk koleksi <strong>Ixora (HJ-IXR)</strong>, detail ukurannya:<br>• <strong>L:</strong> LD 106 cm<br>• <strong>XL:</strong> LD 114 cm<br>• <strong>XXL:</strong> LD 122 cm<br><br>Panjang badan 90cm, aman menutup panggul ya Kak! 😊`
        },
        usp: {
            user: "USP Belva & konsep TikTok",
            bot: `<strong>Teh Ija (AI):</strong><br><br>✨ <strong>USP BELVA:</strong><br>1. <strong>Siluet Slim:</strong> Cutting pinggang belakang bikin ramping.<br>2. <strong>Syar'i Friendly:</strong> Panjang & longgar.<br><br>🎬 <strong>KONSEP TIKTOK:</strong><br><em>Hook:</em> "Mau jaket syar'i tapi takut kelihatan gemuk?"<br><em>Visual:</em> Model muter nunjukin cutting belakang.<br><em>CTA:</em> "Cek Keranjang Kuning!"`
        },
        hr: {
            user: "Aturan seragam gimana?",
            bot: `<strong>HR Assistant (AI):</strong><br><br>Sesuai <strong>PP Bab IV Pasal 2</strong>:<br>✅ <strong>Senin-Kamis:</strong> Wajib Seragam Hijacket.<br>✅ <strong>Jumat:</strong> Batik Bebas.<br>⚠️ <em>Hamil:</em> Boleh baju bebas sopan.<br><br>Jangan lupa ID Card ya!`
        },
        tips: {
            user: "Tips bisnis fashion",
            bot: `<strong>Founder's Brain (AI):</strong><br><br>1. <strong>HPP is King:</strong> Salah hitung HPP = boncos selamanya.<br>2. <strong>Visual:</strong> Orang beli foto sebelum beli baju.<br>3. <strong>Cashflow:</strong> Jangan overstock di awal. Validasi dulu.`
        }
    };

    let isTyping = false;

    function initTelegramDemo() {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.demo-btn');
            if (!btn || isTyping) return;
            
            const type = btn.dataset.demo;
            if (demoScenarios[type]) runTelegramDemo(type, btn);
        });
    }

    function runTelegramDemo(type, btn) {
        const chat = document.getElementById('tgChat');
        if (!chat) return;
        
        const data = demoScenarios[type];
        
        // Update button states
        document.querySelectorAll('.demo-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        isTyping = true;
        chat.innerHTML = '';
        
        // User message
        setTimeout(() => {
            chat.innerHTML += `<div class="tg-msg tg-msg-user">${data.user}</div>`;
            
            // Typing indicator
            setTimeout(() => {
                const typing = document.createElement('div');
                typing.className = 'tg-typing';
                typing.innerHTML = '<span></span><span></span><span></span>';
                typing.id = 'typingIndicator';
                chat.appendChild(typing);
                chat.scrollTop = chat.scrollHeight;
                
                // Bot response
                setTimeout(() => {
                    const typingEl = document.getElementById('typingIndicator');
                    if (typingEl) typingEl.remove();
                    chat.innerHTML += `<div class="tg-msg tg-msg-bot">${data.bot}</div>`;
                    chat.scrollTop = chat.scrollHeight;
                    isTyping = false;
                }, 1200);
            }, 500);
        }, 200);
    }

    // ==================== SECTION HELPER ====================
    
    function getSectionName(slide) {
        if (slide <= 6) return "Opening & Mindset";
        if (slide === 7) return "CEO Premium Economics";
        if (slide <= 9) return "Reality Check";
        if (slide <= 16) return "Knowledge Leak (Pain)";
        if (slide <= 20) return "Normalcy Bias";
        if (slide <= 22) return "Data & Cost";
        if (slide <= 26) return "Choices";
        if (slide === 27) return "Business ABC";
        if (slide <= 32) return "Context 2026 (Invasion/Moat)";
        if (slide <= 35) return "Demo";
        if (slide <= 45) return "Solution (Decision Authority)";
        if (slide <= 56) return "Advisors & Use Cases";
        if (slide <= 65) return "Offer, ROI, Guarantee";
        if (slide <= 78) return "FAQ, Objections, Closing";
        return "End";
    }

    // ==================== VISIBILITY CHANGE ====================
    
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            saveProgress();
        }
    });

    // ==================== WINDOW BEFOREUNLOAD ====================
    
    window.addEventListener('beforeunload', saveProgress);

    // ==================== START ====================
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose for debugging
    window.webinarDebug = {
        state,
        goToSlide,
        getSectionName,
        clearProgress: () => storage.set(CONFIG.storageKey, null)
    };

    // Expose closeOverlay globally for onclick handler in HTML
    window.closeOverlay = function() {
        const overlay = document.getElementById('keyboardOverlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    };

})();
// ==================== ENHANCED ANIMATIONS ====================

/**
 * Special animations for key slides
 */
function enhanceSlideAnimations() {
    const currentSlideNum = state.currentSlide;
    const currentSlideEl = document.querySelector('.slide.active');
    
    if (!currentSlideEl) return;
    
    // Slide 59 - Price Pulse Effect
    if (currentSlideNum === 59) {
        const priceElement = currentSlideEl.querySelector('.price-amount-big');
        if (priceElement) {
            setTimeout(() => {
                priceElement.style.animation = 'pulseGlow 1.5s ease-out';
            }, 600);
        }
    }
    
    // Slide 62 - VS Battle Effect
    if (currentSlideNum === 62) {
        const vsText = currentSlideEl.querySelector('.vs-text');
        if (vsText) {
            setTimeout(() => {
                vsText.style.animation = 'pulse 1s ease-in-out infinite';
            }, 800);
        }
    }
    
    // Slide 65 - Guarantee Shine
    if (currentSlideNum === 65) {
        const guaranteeBoxes = currentSlideEl.querySelectorAll('.guarantee-box-clean');
        guaranteeBoxes.forEach((box, index) => {
            setTimeout(() => {
                box.style.animation = 'shimmer 2s ease-in-out infinite';
                box.style.animationDelay = `${index * 0.3}s`;
            }, 1000 + (index * 200));
        });
    }
    
    // Slide 70 - Objection Shake
    if (currentSlideNum === 70) {
        const objCards = currentSlideEl.querySelectorAll('.objection-card');
        objCards.forEach((card, index) => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.02) rotate(-1deg)';
            });
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1) rotate(0deg)';
            });
        });
    }
    
    // Slide 72 - Question Reveal
    if (currentSlideNum === 72) {
        const wrongQ = currentSlideEl.querySelector('.question-wrong');
        const rightQ = currentSlideEl.querySelector('.question-right');
        
        if (wrongQ && rightQ) {
            setTimeout(() => {
                wrongQ.style.animation = 'shake 0.5s ease';
            }, 1000);
            
            setTimeout(() => {
                rightQ.style.animation = 'pulseGlow 1.5s ease-out';
            }, 1800);
        }
    }
}

// Add shimmer animation
const shimmerStyle = document.createElement('style');
shimmerStyle.textContent = `
    @keyframes shimmer {
        0%, 100% { 
            box-shadow: 0 0 20px rgba(201, 169, 98, 0.2);
        }
        50% { 
            box-shadow: 0 0 40px rgba(201, 169, 98, 0.5),
                        0 0 60px rgba(201, 169, 98, 0.3);
        }
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
`;
document.head.appendChild(shimmerStyle);

// Hook into existing goToSlide function
const originalGoToSlide = goToSlide;
goToSlide = function(slideNumber, skipAnimation = false) {
    originalGoToSlide.call(this, slideNumber, skipAnimation);
    
    // Add enhanced animations after slide transition
    setTimeout(() => {
        enhanceSlideAnimations();
    }, 700);
};

// Initialize enhanced animations on first load
setTimeout(() => {
    enhanceSlideAnimations();
}, 1000);

console.log('%c✨ Enhanced Animations Loaded', 'color: #c9a962; font-size: 14px; font-weight: bold;');