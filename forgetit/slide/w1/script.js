/**
 * ForgetIt Week 1: Discovery & Audit
 * Interactive elements
 */

document.addEventListener('DOMContentLoaded', () => {
    initFAQ();
    initSmoothScroll();
    initScrollAnimations();
});

// ==========================================
// FAQ ACCORDION
// ==========================================

function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(other => {
                if (other !== item && other.classList.contains('active')) {
                    other.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// ==========================================
// SMOOTH SCROLL
// ==========================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                const navHeight = 70;
                const targetPosition = target.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==========================================
// SCROLL ANIMATIONS
// ==========================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Elements to animate
    const animateElements = document.querySelectorAll(`
        .objective-card,
        .timeline-block,
        .prep-card,
        .deliverable-item,
        .next-card,
        .faq-item
    `);
    
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.5s ease ${index * 0.05}s, transform 0.5s ease ${index * 0.05}s`;
        observer.observe(el);
    });
}

// ==========================================
// CONSOLE
// ==========================================

console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   [ ForgetIt ] Week 1: Discovery & Audit                  ║
║                                                           ║
║   Let's understand your business and map out the          ║
║   knowledge that matters.                                 ║
║                                                           ║
║   Built by Flexeet — flexeet.com                          ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
`);