// ========================================
// ADAB PEKERJA - Presentation Script
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const currentSlideEl = document.getElementById('currentSlide');
    const progressBar = document.getElementById('progressBar');
    const menuBtn = document.getElementById('menuBtn');
    const slideMenu = document.getElementById('slideMenu');
    const menuItems = document.getElementById('menuItems');
    const menuClose = document.getElementById('menuClose');
    const navControls = document.querySelector('.nav-controls');
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    let idleTimer;
    const IDLE_TIMEOUT = 3000; // 3 seconds
    
    // Initialize
    buildMenu();
    updateSlide();
    startIdleTimer();
    
    // Idle timer for auto-hide navigation
    function startIdleTimer() {
        clearTimeout(idleTimer);
        navControls.classList.remove('idle');
        
        idleTimer = setTimeout(() => {
            navControls.classList.add('idle');
        }, IDLE_TIMEOUT);
    }
    
    // Reset idle on any interaction
    ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'].forEach(event => {
        document.addEventListener(event, startIdleTimer, { passive: true });
    });
    
    // Keep nav visible when hovering over it
    navControls.addEventListener('mouseenter', () => {
        clearTimeout(idleTimer);
        navControls.classList.remove('idle');
    });
    
    navControls.addEventListener('mouseleave', startIdleTimer);
    
    // Build menu
    function buildMenu() {
        slides.forEach((slide, index) => {
            const title = slide.dataset.title || `Slide ${index + 1}`;
            const item = document.createElement('div');
            item.className = 'menu-item';
            item.innerHTML = `<span class="num">${index + 1}</span><span>${title}</span>`;
            item.addEventListener('click', () => {
                goToSlide(index);
                closeMenu();
            });
            menuItems.appendChild(item);
        });
    }
    
    // Update slide display
    function updateSlide() {
        slides.forEach((slide, index) => {
            slide.classList.remove('active', 'prev');
            if (index === currentSlide) {
                slide.classList.add('active');
                triggerSlideAnimations(slide);
            } else if (index < currentSlide) {
                slide.classList.add('prev');
            }
        });
        
        currentSlideEl.textContent = currentSlide + 1;
        progressBar.style.width = `${((currentSlide + 1) / totalSlides) * 100}%`;
        
        // Update menu
        document.querySelectorAll('.menu-item').forEach((item, index) => {
            item.classList.toggle('active', index === currentSlide);
        });
        
        // Update nav buttons
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide === totalSlides - 1;
        prevBtn.style.opacity = currentSlide === 0 ? 0.3 : 1;
        nextBtn.style.opacity = currentSlide === totalSlides - 1 ? 0.3 : 1;
    }
    
    // Go to specific slide
    function goToSlide(index) {
        if (index >= 0 && index < totalSlides) {
            currentSlide = index;
            updateSlide();
        }
    }
    
    // Next slide
    function nextSlide() {
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
            updateSlide();
        }
    }
    
    // Previous slide
    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            updateSlide();
        }
    }
    
    // Trigger animations for specific slides
    function triggerSlideAnimations(slide) {
        // Counter animation for slide 8
        if (slide.classList.contains('slide-counter-visual')) {
            animateCounters(slide);
        }
        
        // Typewriter for slide 12
        if (slide.classList.contains('slide-punchline')) {
            typeWriter('Kalau salah? Bisa dikoreksi.', 'punchlineText');
        }
    }
    
    // Counter animation
    function animateCounters(slide) {
        const counters = slide.querySelectorAll('.counter-number');
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.target);
            let current = 0;
            const increment = target / 30;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = target;
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.ceil(current);
                }
            }, 50);
        });
    }
    
    // Typewriter effect
    function typeWriter(text, elementId, speed = 50) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        element.textContent = '';
        let i = 0;
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        setTimeout(type, 500);
    }
    
    // Menu functions
    function openMenu() {
        slideMenu.classList.add('active');
    }
    
    function closeMenu() {
        slideMenu.classList.remove('active');
    }
    
    function toggleMenu() {
        slideMenu.classList.toggle('active');
    }
    
    // Event Listeners
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    menuBtn.addEventListener('click', toggleMenu);
    menuClose.addEventListener('click', closeMenu);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
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
            case 'm':
            case 'M':
                toggleMenu();
                break;
            case 'f':
            case 'F':
                toggleFullscreen();
                break;
            case 'Escape':
                closeMenu();
                break;
            case 'Home':
                goToSlide(0);
                break;
            case 'End':
                goToSlide(totalSlides - 1);
                break;
        }
        
        // Number keys for quick navigation (1-9)
        if (e.key >= '1' && e.key <= '9') {
            goToSlide(parseInt(e.key) - 1);
        }
    });
    
    // Touch/Swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide(); // Swipe left
            } else {
                prevSlide(); // Swipe right
            }
        }
    }
    
    // Fullscreen
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Fullscreen error:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }
    
    // Scenario quiz (Slide 5)
    const choiceButtons = document.querySelectorAll('.choice-btn');
    choiceButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const answer = btn.dataset.answer;
            const parent = btn.closest('.scenario-box');
            
            // Reset all buttons
            parent.querySelectorAll('.choice-btn').forEach(b => {
                b.classList.remove('selected');
            });
            
            // Mark selected
            btn.classList.add('selected');
            
            // Show answer
            const wrongAnswer = parent.querySelector('.answer-wrong');
            const correctAnswer = parent.querySelector('.answer-correct');
            
            if (answer === 'wrong') {
                wrongAnswer.classList.remove('hidden');
                correctAnswer.classList.add('hidden');
            } else {
                wrongAnswer.classList.add('hidden');
                correctAnswer.classList.remove('hidden');
            }
        });
    });
    
    // Checklist counter (Slide 22)
    const checkboxes = document.querySelectorAll('.check-item input');
    const checkCount = document.getElementById('checkCount');
    const resultFill = document.getElementById('resultFill');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const checked = document.querySelectorAll('.check-item input:checked').length;
            if (checkCount) {
                checkCount.textContent = checked;
            }
            if (resultFill) {
                resultFill.style.width = `${(checked / 12) * 100}%`;
            }
        });
    });
    
    // Click outside menu to close
    document.addEventListener('click', (e) => {
        if (slideMenu.classList.contains('active') && 
            !slideMenu.contains(e.target) && 
            !menuBtn.contains(e.target)) {
            closeMenu();
        }
    });
    
    // Prevent default on flip cards
    document.querySelectorAll('.flip-card').forEach(card => {
        card.addEventListener('touchend', (e) => {
            e.preventDefault();
            card.classList.toggle('flipped');
        });
    });
    
    // Mouse wheel navigation
    let wheelTimeout;
    document.addEventListener('wheel', (e) => {
        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
            if (e.deltaY > 0) {
                nextSlide();
            } else if (e.deltaY < 0) {
                prevSlide();
            }
        }, 100);
    }, { passive: true });
    
    // Add entrance animations to elements
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Preload effect - hide loading after a brief moment
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
    
    // Auto-advance timer (optional - uncomment to enable)
    // let autoAdvance;
    // function startAutoAdvance(interval = 15000) {
    //     autoAdvance = setInterval(nextSlide, interval);
    // }
    // function stopAutoAdvance() {
    //     clearInterval(autoAdvance);
    // }
    
    // Console welcome message
    console.log('%c📿 ADAB PEKERJA', 'font-size: 24px; font-weight: bold; color: #D4AF37;');
    console.log('%cKajian Karir Islami - Keseimbangan Dunia & Akhirat', 'font-size: 14px; color: #888;');
    console.log('%cNavigation: ← → arrows, M for menu, F for fullscreen', 'font-size: 12px; color: #666;');
});

// Service Worker for offline support (optional)
if ('serviceWorker' in navigator) {
    // navigator.serviceWorker.register('/sw.js');
}