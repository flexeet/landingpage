/* ============================================
   AICEO FOR OWNERS - Landing Page
   JavaScript for interactions and animations
   ============================================ */

// Initialize when DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initSmoothScroll();
    initRevealAnimations();
    initNavHighlight();
    initParallaxOrbs();
});

/* ==================== CUSTOM CURSOR ==================== */
function initCursor() {
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursorFollower');
    
    if (!cursor || !follower) return;
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Smooth cursor animation
    function animateCursor() {
        // Cursor follows immediately
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        // Follower has more lag
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Hover effects
    const interactiveElements = document.querySelectorAll('a, button, .btn, .product-card, .problem-card, .flow-card, .tier, .cta-card');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            follower.classList.add('hover');
        });
        
        el.addEventListener('mouseleave', () => {
            follower.classList.remove('hover');
        });
    });
    
    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        follower.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        follower.style.opacity = '0.5';
    });
}

/* ==================== SMOOTH SCROLL ==================== */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (!target) return;
            
            e.preventDefault();
            
            const navHeight = document.querySelector('.nav').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

/* ==================== REVEAL ANIMATIONS ==================== */
function initRevealAnimations() {
    const revealElements = document.querySelectorAll(
        '.section-label, .section-title, .problem-card, .feature-item, ' +
        '.flow-card, .product-card, .cta-card, .not-card, .owner-benefit, ' +
        '.about-quote, .about-desc, .philosophy-quote, .philosophy-content p, ' +
        '.tier, .owner-criteria, .not-punchline, .philosophy-final'
    );
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay based on siblings
                const siblings = entry.target.parentElement.querySelectorAll(entry.target.tagName);
                const siblingIndex = Array.from(siblings).indexOf(entry.target);
                
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, siblingIndex * 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    revealElements.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
}

/* ==================== NAV HIGHLIGHT ==================== */
function initNavHighlight() {
    const nav = document.querySelector('.nav');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Add/remove nav background on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            nav.style.background = 'rgba(10, 10, 12, 0.95)';
        } else {
            nav.style.background = 'rgba(10, 10, 12, 0.8)';
        }
        
        // Highlight current section in nav
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href') === '#' + current) {
                link.style.color = 'var(--accent)';
            }
        });
    });
}

/* ==================== PARALLAX ORBS ==================== */
function initParallaxOrbs() {
    const orbs = document.querySelectorAll('.gradient-orb');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 0.05;
            const yPos = scrollY * speed;
            orb.style.transform = `translateY(${yPos}px)`;
        });
    });
    
    // Mouse parallax for hero orbs
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
            const heroOrbs = heroSection.querySelectorAll('.gradient-orb');
            const rect = heroSection.getBoundingClientRect();
            const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
            const mouseY = (e.clientY - rect.top) / rect.height - 0.5;
            
            heroOrbs.forEach((orb, index) => {
                const speed = (index + 1) * 30;
                orb.style.transform = `translate(${mouseX * speed}px, ${mouseY * speed}px)`;
            });
        });
    }
}

/* ==================== COUNTER ANIMATION ==================== */
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out expo
        const easeProgress = 1 - Math.pow(2, -10 * progress);
        const current = Math.floor(start + (target - start) * easeProgress);
        
        element.textContent = current.toLocaleString('id-ID');
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

/* ==================== TYPING EFFECT ==================== */
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

/* ==================== MOBILE MENU (if needed) ==================== */
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (!menuBtn || !navLinks) return;
    
    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuBtn.classList.toggle('active');
    });
    
    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuBtn.classList.remove('active');
        });
    });
}

/* ==================== FORM HANDLING (placeholder) ==================== */
function initForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Add your form submission logic here
            // For example: send to API, show success message, etc.
            
            console.log('Form submitted');
        });
    });
}

/* ==================== SCROLL PROGRESS INDICATOR ==================== */
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.innerHTML = '<div class="scroll-progress-fill"></div>';
    document.body.appendChild(progressBar);
    
    const fill = progressBar.querySelector('.scroll-progress-fill');
    
    window.addEventListener('scroll', () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = (window.scrollY / scrollHeight) * 100;
        fill.style.width = scrollProgress + '%';
    });
}

/* ==================== LAZY LOADING IMAGES ==================== */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

/* ==================== TOOLTIP ==================== */
function createTooltip(element, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    
    element.addEventListener('mouseenter', () => {
        document.body.appendChild(tooltip);
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        tooltip.classList.add('visible');
    });
    
    element.addEventListener('mouseleave', () => {
        tooltip.classList.remove('visible');
        setTimeout(() => tooltip.remove(), 200);
    });
}

/* ==================== UTILITY: Debounce ==================== */
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

/* ==================== UTILITY: Throttle ==================== */
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