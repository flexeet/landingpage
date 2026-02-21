/* ============================================
   PROFIT ENGINES 2026 — TikTok Underground Batch 9
   MASTER VERSION: 75 Slides | 120 Minutes
   Emotional Arc: Hook → Pain → Fear → Hope → Solution → Proof → Action
   ============================================ */

class Presentation {
    constructor() {
        this.deck = document.getElementById('deck');
        this.slides = Array.from(this.deck.querySelectorAll('.slide'));
        this.total = this.slides.length;
        this.current = 0;
        this.isAnimating = false;
        this.animationDuration = 700;
        
        // Elements
        this.progressBar = document.getElementById('progressBar');
        this.counter = document.getElementById('counter');
        this.gotoModal = document.getElementById('gotoModal');
        this.gotoInput = document.getElementById('gotoInput');
        
        this.init();
    }
    
    init() {
        // Set first slide active
        this.slides[0].classList.add('active');
        this.updateUI();
        
        // Bind events
        this.bindKeyboard();
        this.bindTouch();
        this.bindWheel();
        this.bindGotoModal();
        
        // URL hash support
        this.checkHash();
        window.addEventListener('hashchange', () => this.checkHash());
    }
    
    // ==================== NAVIGATION ====================
    
    goTo(index, direction = null) {
        if (this.isAnimating) return;
        if (index < 0 || index >= this.total) return;
        if (index === this.current) return;
        
        this.isAnimating = true;
        
        const oldSlide = this.slides[this.current];
        const newSlide = this.slides[index];
        
        // Determine direction
        const goingForward = direction === 'next' || (direction === null && index > this.current);
        
        // Remove classes
        oldSlide.classList.remove('active');
        if (goingForward) {
            oldSlide.classList.add('prev');
        }
        
        // Activate new slide
        newSlide.classList.remove('prev');
        newSlide.classList.add('active');
        
        // Update state
        this.current = index;
        this.updateUI();
        
        // Update URL
        window.history.replaceState(null, null, `#${this.current + 1}`);
        
        // Reset animation lock
        setTimeout(() => {
            this.isAnimating = false;
            oldSlide.classList.remove('prev');
        }, this.animationDuration);
    }
    
    next() {
        if (this.current < this.total - 1) {
            this.goTo(this.current + 1, 'next');
        }
    }
    
    prev() {
        if (this.current > 0) {
            this.goTo(this.current - 1, 'prev');
        }
    }
    
    first() {
        this.goTo(0, 'prev');
    }
    
    last() {
        this.goTo(this.total - 1, 'next');
    }
    
    // ==================== UI UPDATES ====================
    
    updateUI() {
        // Progress bar
        const progress = ((this.current + 1) / this.total) * 100;
        this.progressBar.style.width = `${progress}%`;
        
        // Counter
        const currentNum = String(this.current + 1).padStart(2, '0');
        const totalNum = String(this.total).padStart(2, '0');
        this.counter.innerHTML = `
            <span class="current">${currentNum}</span>
            <span class="sep">/</span>
            <span class="total">${totalNum}</span>
        `;
    }
    
    // ==================== KEYBOARD ====================
    
    bindKeyboard() {
        document.addEventListener('keydown', (e) => {
            // Ignore if goto modal is open and typing
            if (!this.gotoModal.classList.contains('hidden') && 
                e.target === this.gotoInput) {
                if (e.key === 'Enter') {
                    this.handleGotoSubmit();
                } else if (e.key === 'Escape') {
                    this.closeGoto();
                }
                return;
            }
            
            switch (e.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                case ' ':
                case 'PageDown':
                    e.preventDefault();
                    this.next();
                    break;
                    
                case 'ArrowLeft':
                case 'ArrowUp':
                case 'PageUp':
                    e.preventDefault();
                    this.prev();
                    break;
                    
                case 'Home':
                    e.preventDefault();
                    this.first();
                    break;
                    
                case 'End':
                    e.preventDefault();
                    this.last();
                    break;
                    
                case 'g':
                case 'G':
                    e.preventDefault();
                    this.openGoto();
                    break;
                    
                case 'f':
                case 'F':
                    e.preventDefault();
                    this.toggleFullscreen();
                    break;
                    
                case 'Escape':
                    if (document.fullscreenElement) {
                        document.exitFullscreen();
                    } else {
                        this.closeGoto();
                    }
                    break;
            }
        });
    }
    
    // ==================== TOUCH ====================
    
    bindTouch() {
        let startX = 0;
        let startY = 0;
        const threshold = 50;
        
        this.deck.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        this.deck.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Only horizontal swipes
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }
        }, { passive: true });
    }
    
    // ==================== WHEEL ====================
    
    bindWheel() {
        let lastWheel = 0;
        const cooldown = 1000;
        
        this.deck.addEventListener('wheel', (e) => {
            const now = Date.now();
            if (now - lastWheel < cooldown) return;
            
            if (Math.abs(e.deltaY) > 30) {
                lastWheel = now;
                if (e.deltaY > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }
        }, { passive: true });
    }
    
    // ==================== GOTO MODAL ====================
    
    bindGotoModal() {
        // Click counter to open
        this.counter.addEventListener('click', () => this.openGoto());
    }
    
    openGoto() {
        this.gotoModal.classList.remove('hidden');
        this.gotoInput.value = '';
        this.gotoInput.placeholder = this.current + 1;
        setTimeout(() => this.gotoInput.focus(), 100);
    }
    
    closeGoto() {
        this.gotoModal.classList.add('hidden');
    }
    
    handleGotoSubmit() {
        const value = parseInt(this.gotoInput.value);
        
        if (isNaN(value) || value < 1 || value > this.total) {
            this.gotoInput.classList.add('error');
            setTimeout(() => this.gotoInput.classList.remove('error'), 300);
            return;
        }
        
        this.goTo(value - 1);
        this.closeGoto();
    }
    
    // ==================== FULLSCREEN ====================
    
    toggleFullscreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            document.documentElement.requestFullscreen();
        }
    }
    
    // ==================== HASH ====================
    
    checkHash() {
        const hash = window.location.hash;
        if (hash) {
            const slideNum = parseInt(hash.substring(1));
            if (!isNaN(slideNum) && slideNum >= 1 && slideNum <= this.total) {
                this.goTo(slideNum - 1);
            }
        }
    }
}

// ==================== INIT ====================

document.addEventListener('DOMContentLoaded', () => {
    window.presentation = new Presentation();
});

// ==================== ANIMATIONS ON SLIDE CHANGE ====================

const observeSlides = () => {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const slide = mutation.target;
                if (slide.classList.contains('active')) {
                    animateSlideIn(slide);
                }
            }
        });
    });
    
    document.querySelectorAll('.slide').forEach((slide) => {
        observer.observe(slide, { attributes: true });
    });
};

const animateSlideIn = (slide) => {
    // Add staggered animations to child elements
    const animatables = slide.querySelectorAll(
        '.card, .stat-card, .sol-item, .comp-step, .testi-card, .guarantee-card, ' +
        '.obj-card, .timeline-item, .leak-item, .tier-card, .compare-card, ' +
        '.transform-card, .hierarchy-item, .bonus-item, .scarcity-item, .defense-item'
    );
    
    animatables.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 100 + (i * 80));
    });
};

document.addEventListener('DOMContentLoaded', observeSlides);