/**
 * HIJACKET Presentation
 * Slide Navigation & Animations
 */

class Presentation {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.currentSlideIndex = 0;
        this.totalSlides = this.slides.length;
        this.isAnimating = false;
        this.touchStartX = 0;
        this.touchEndX = 0;

        this.init();
    }

    init() {
        this.updateSlideCounter();
        this.updateProgressBar();
        this.bindEvents();
        this.animateCounters();
    }

    bindEvents() {
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Button navigation
        document.getElementById('prevBtn').addEventListener('click', () => this.prevSlide());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextSlide());

        // Touch/swipe navigation
        document.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        document.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });

        // Mouse wheel navigation
        document.addEventListener('wheel', (e) => this.handleWheel(e), { passive: false });

        // Click navigation (click on right half = next, left half = prev)
        document.getElementById('slidesContainer').addEventListener('click', (e) => this.handleClick(e));
    }

    handleKeyboard(e) {
        switch(e.key) {
            case 'ArrowRight':
            case 'ArrowDown':
            case ' ':
            case 'PageDown':
                e.preventDefault();
                this.nextSlide();
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
            case 'PageUp':
                e.preventDefault();
                this.prevSlide();
                break;
            case 'Home':
                e.preventDefault();
                this.goToSlide(0);
                break;
            case 'End':
                e.preventDefault();
                this.goToSlide(this.totalSlides - 1);
                break;
            case 'f':
            case 'F':
                this.toggleFullscreen();
                break;
        }
    }

    handleTouchStart(e) {
        this.touchStartX = e.changedTouches[0].screenX;
    }

    handleTouchEnd(e) {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }

    handleWheel(e) {
        if (this.isAnimating) return;
        
        // Only respond to significant scroll
        if (Math.abs(e.deltaY) > 30) {
            e.preventDefault();
            if (e.deltaY > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }

    handleClick(e) {
        // Ignore clicks on buttons or interactive elements
        if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.nav')) {
            return;
        }

        const clickX = e.clientX;
        const windowWidth = window.innerWidth;

        if (clickX > windowWidth * 0.7) {
            this.nextSlide();
        } else if (clickX < windowWidth * 0.3) {
            this.prevSlide();
        }
    }

    nextSlide() {
        if (this.isAnimating || this.currentSlideIndex >= this.totalSlides - 1) return;
        this.goToSlide(this.currentSlideIndex + 1);
    }

    prevSlide() {
        if (this.isAnimating || this.currentSlideIndex <= 0) return;
        this.goToSlide(this.currentSlideIndex - 1);
    }

    goToSlide(index) {
        if (this.isAnimating || index === this.currentSlideIndex) return;
        if (index < 0 || index >= this.totalSlides) return;

        this.isAnimating = true;

        // Remove active class from current slide
        this.slides[this.currentSlideIndex].classList.remove('active');

        // Update index
        this.currentSlideIndex = index;

        // Add active class to new slide
        this.slides[this.currentSlideIndex].classList.add('active');

        // Update UI
        this.updateSlideCounter();
        this.updateProgressBar();

        // Trigger counter animations for this slide
        setTimeout(() => {
            this.animateCountersInSlide(this.slides[this.currentSlideIndex]);
        }, 500);

        // Reset animation lock
        setTimeout(() => {
            this.isAnimating = false;
        }, 800);
    }

    updateSlideCounter() {
        const currentEl = document.getElementById('currentSlide');
        const totalEl = document.getElementById('totalSlides');
        
        currentEl.textContent = String(this.currentSlideIndex + 1).padStart(2, '0');
        totalEl.textContent = String(this.totalSlides).padStart(2, '0');
    }

    updateProgressBar() {
        const progress = ((this.currentSlideIndex + 1) / this.totalSlides) * 100;
        document.getElementById('progressBar').style.width = `${progress}%`;
    }

    animateCounters() {
        // Animate counters in the first active slide
        this.animateCountersInSlide(this.slides[this.currentSlideIndex]);
    }

    animateCountersInSlide(slide) {
        // Regular counters
        const counters = slide.querySelectorAll('.animate-count');
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.target);
            if (target) {
                this.animateValue(counter.querySelector('.stat-number'), 0, target, 1500);
            }
        });

        // Big counter (market slide)
        const bigCounter = slide.querySelector('.animate-count-big');
        if (bigCounter) {
            const target = parseInt(bigCounter.dataset.target);
            if (target) {
                this.animateValue(bigCounter.querySelector('.stat-big-number'), 0, target, 2000);
            }
        }
    }

    animateValue(element, start, end, duration) {
        if (!element) return;
        
        const range = end - start;
        const startTime = performance.now();
        
        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out-expo)
            const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            
            const current = Math.round(start + (range * easeOutExpo));
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };
        
        requestAnimationFrame(update);
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Fullscreen not available:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }
}

// Initialize presentation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.presentation = new Presentation();
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Prevent context menu on long press (mobile)
document.addEventListener('contextmenu', (e) => {
    if (e.target.closest('.slide')) {
        e.preventDefault();
    }
});

// Handle visibility change (pause animations when tab is hidden)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause any ongoing animations
    } else {
        // Resume
    }
});

// Keyboard shortcuts info
console.log('%c HIJACKET Presentation', 'font-size: 20px; font-weight: bold;');
console.log('%c Keyboard Shortcuts:', 'font-size: 14px; font-weight: bold; margin-top: 10px;');
console.log('→ / ↓ / Space / PageDown : Next slide');
console.log('← / ↑ / PageUp : Previous slide');
console.log('Home : First slide');
console.log('End : Last slide');
console.log('F : Toggle fullscreen');
