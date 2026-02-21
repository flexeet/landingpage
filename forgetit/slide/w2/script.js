/* ============================================
   FORGETIT DISCOVERY SPRINT - JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initFAQ();
    initScrollAnimations();
    initSmoothScroll();
    initBarAnimations();
});

/* ============================================
   FAQ ACCORDION
   ============================================ */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */
function initScrollAnimations() {
    // Add animate-on-scroll class to elements
    const animateElements = [
        '.problem-card',
        '.timeline-item',
        '.deliverable-card',
        '.why-point',
        '.comparison-card',
        '.faq-item'
    ];
    
    animateElements.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, index) => {
            el.classList.add('animate-on-scroll');
            el.style.transitionDelay = `${index * 0.1}s`;
        });
    });
    
    // Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */
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

/* ============================================
   BAR ANIMATIONS
   ============================================ */
function initBarAnimations() {
    const bars = document.querySelectorAll('.bar-fill');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.style.width;
                bar.style.width = '0';
                
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
                
                observer.unobserve(bar);
            }
        });
    }, {
        threshold: 0.5
    });
    
    bars.forEach(bar => observer.observe(bar));
}

/* ============================================
   CALENDAR SLOT INTERACTION
   ============================================ */
document.querySelectorAll('.slot').forEach(slot => {
    slot.addEventListener('click', function() {
        // Remove selected from all slots
        document.querySelectorAll('.slot').forEach(s => s.classList.remove('selected'));
        
        // Add selected to clicked slot
        this.classList.add('selected');
        
        // Get slot info for WhatsApp message
        const week = this.querySelector('.slot-week').textContent;
        const date = this.querySelector('.slot-date').textContent;
        
        // Update WhatsApp link with selected slot
        const waLink = document.querySelector('.booking-actions .btn-primary');
        if (waLink) {
            const message = encodeURIComponent(`Halo, saya tertarik dengan Discovery Sprint untuk ${week} (${date}). Bisa jelaskan lebih lanjut?`);
            waLink.href = `https://wa.me/6281234567890?text=${message}`;
        }
    });
});

/* ============================================
   NAV SCROLL EFFECT
   ============================================ */
let lastScrollY = 0;

window.addEventListener('scroll', () => {
    const nav = document.querySelector('.nav');
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 100) {
        nav.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
    } else {
        nav.style.boxShadow = 'none';
    }
    
    lastScrollY = currentScrollY;
});

/* ============================================
   METRIC COUNTER ANIMATION
   ============================================ */
function animateCounter(element, target, duration = 1500) {
    const start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        const current = Math.floor(start + (target - start) * easeOut);
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }
    
    requestAnimationFrame(update);
}

// Animate metrics when visible
const metricObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const value = entry.target;
            const text = value.textContent;
            
            // Check if it's a number
            if (!isNaN(parseInt(text))) {
                const target = parseInt(text);
                animateCounter(value, target);
            }
            
            metricObserver.unobserve(value);
        }
    });
}, {
    threshold: 0.5
});

document.querySelectorAll('.metric-value').forEach(el => {
    metricObserver.observe(el);
});

document.querySelectorAll('.matrix-quadrant span').forEach(el => {
    metricObserver.observe(el);
});