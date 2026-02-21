/* ============================================
   AI MANAGER SERVICE - LANDING PAGE JS
   ============================================ */

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initNav();
    initParticles();
    initCountUp();
    initScrollAnimations();
    initSmoothScroll();
});

/* ============================================
   CURSOR FOLLOWER
   ============================================ */
function initCursor() {
    const cursor = document.getElementById('cursor');
    if (!cursor || window.innerWidth < 768) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.classList.add('visible');
    });
    
    document.addEventListener('mouseleave', () => {
        cursor.classList.remove('visible');
    });
    
    // Hover effect on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, .faq-item');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
    
    // Animation loop
    function animate() {
        const ease = 0.15;
        cursorX += (mouseX - cursorX) * ease;
        cursorY += (mouseY - cursorY) * ease;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        requestAnimationFrame(animate);
    }
    animate();
}

/* ============================================
   NAVIGATION
   ============================================ */
function initNav() {
    const nav = document.getElementById('nav');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
}

/* ============================================
   PARTICLES
   ============================================ */
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    const particleCount = 25;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        container.appendChild(particle);
    }
}

/* ============================================
   COUNT UP ANIMATION
   ============================================ */
function initCountUp() {
    const stats = document.querySelectorAll('.stat-value[data-count]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count);
                animateCount(el, target);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => observer.observe(stat));
}

function animateCount(el, target) {
    const duration = 2000;
    const start = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.round(easeOutQuart * target);
        
        el.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */
function initScrollAnimations() {
    const elements = document.querySelectorAll('[data-animate]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    elements.forEach(el => observer.observe(el));
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
                const navHeight = document.getElementById('nav').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ============================================
   FAQ ACCORDION
   ============================================ */
function toggleFaq(element) {
    const isOpen = element.classList.contains('open');
    
    // Close all FAQs
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('open');
    });
    
    // Open clicked one if it wasn't open
    if (!isOpen) {
        element.classList.add('open');
    }
}

/* ============================================
   FORM HANDLING
   ============================================ */
function handleSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const btn = document.getElementById('submitBtn');
    const originalContent = btn.innerHTML;
    
    // Show loading state
    btn.innerHTML = `
        <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="20">
                <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/>
            </circle>
        </svg>
        <span>Memproses...</span>
    `;
    btn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        // Success state
        btn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6L9 17l-5-5"/>
            </svg>
            <span>Berhasil! Tim akan hubungi via WA</span>
        `;
        btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        
        // Reset after delay
        setTimeout(() => {
            form.reset();
            btn.innerHTML = originalContent;
            btn.style.background = '';
            btn.disabled = false;
        }, 3000);
    }, 2000);
}

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
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

/* ============================================
   PARALLAX EFFECTS
   ============================================ */
window.addEventListener('scroll', throttle(() => {
    const scrolled = window.scrollY;
    
    // Hero glows parallax
    const glow1 = document.querySelector('.hero-glow-1');
    const glow2 = document.querySelector('.hero-glow-2');
    
    if (glow1) {
        glow1.style.transform = `translate(${scrolled * 0.05}px, ${scrolled * 0.1}px)`;
    }
    if (glow2) {
        glow2.style.transform = `translate(${-scrolled * 0.03}px, ${scrolled * 0.08}px)`;
    }
}, 16));

/* ============================================
   CHAT DEMO ANIMATION
   ============================================ */
(function initChatDemo() {
    // Auto-scroll chat messages
    const chatMessages = document.querySelector('.chat-messages');
    if (chatMessages) {
        // Simulate new message appearing
        setTimeout(() => {
            const typingMessage = document.querySelector('.message.typing');
            if (typingMessage) {
                typingMessage.innerHTML = `
                    <p>Kalau customer marah-marah:</p>
                    <p><strong>1.</strong> Dengarkan dulu tanpa memotong</p>
                    <p><strong>2.</strong> Acknowledge perasaan mereka</p>
                    <p><strong>3.</strong> Jangan defensive, fokus solusi</p>
                    <p><strong>4.</strong> Eskalasi ke CS Lead jika perlu</p>
                `;
                typingMessage.classList.remove('typing');
            }
        }, 3000);
    }
})();

/* ============================================
   MAGNETIC BUTTONS
   ============================================ */
document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
    });
});

/* ============================================
   CONSOLE BRANDING
   ============================================ */
console.log('%c🤖 AI Manager', 'font-size: 24px; font-weight: bold; color: #3b82f6;');
console.log('%cYour AI Second Brain for Business', 'font-size: 14px; color: #a1a1aa;');
console.log('%cby Flexeet — AI Implementation Partner', 'font-size: 12px; color: #6b7280;');
console.log('%c---', 'color: #6b7280;');
console.log('%cInterested? Visit us or schedule a demo!', 'font-size: 12px; color: #60a5fa;');