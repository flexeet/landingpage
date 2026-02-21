/* ========================================
   FORGETIT CURRICULUM - JavaScript
   Awwwards-level interactions
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // Custom Cursor
    // ========================================
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });
    
    function animateOutline() {
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;
        
        cursorOutline.style.left = outlineX + 'px';
        cursorOutline.style.top = outlineY + 'px';
        
        requestAnimationFrame(animateOutline);
    }
    animateOutline();
    
    // Magnetic effect for buttons
    document.querySelectorAll('.magnetic').forEach(elem => {
        elem.addEventListener('mousemove', (e) => {
            const rect = elem.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            elem.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        
        elem.addEventListener('mouseleave', () => {
            elem.style.transform = 'translate(0, 0)';
        });
    });
    
    // ========================================
    // Navigation Scroll Effect
    // ========================================
    const nav = document.querySelector('.nav');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
    
    // ========================================
    // Smooth Scroll
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // ========================================
    // Scroll Animations
    // ========================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Elements to animate
    const animateElements = document.querySelectorAll(
        '.path-stage, .week-card, .session-item, .project-card, ' +
        '.req-card, .pricing-card, .week-detail-block, .week-deliverable'
    );
    
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.05}s, transform 0.6s ease ${index * 0.05}s`;
        observer.observe(el);
    });
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
    
    // ========================================
    // Neural Network Canvas Animation
    // ========================================
    const canvas = document.getElementById('neural-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let connections = [];
        
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Create particles
        function createParticles() {
            particles = [];
            const numParticles = Math.floor((canvas.width * canvas.height) / 25000);
            
            for (let i = 0; i < numParticles; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    radius: Math.random() * 2 + 1
                });
            }
        }
        createParticles();
        
        function drawParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Update and draw particles
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                
                // Bounce off edges
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
                
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 255, 136, 0.5)';
                ctx.fill();
            });
            
            // Draw connections
            particles.forEach((p1, i) => {
                particles.slice(i + 1).forEach(p2 => {
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(0, 255, 136, ${0.15 * (1 - dist / 150)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                });
            });
            
            requestAnimationFrame(drawParticles);
        }
        drawParticles();
    }
    
    // ========================================
    // Counter Animation
    // ========================================
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const count = parseInt(target.dataset.count);
                let current = 0;
                const increment = count / 50;
                const duration = 1500;
                const stepTime = duration / 50;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= count) {
                        target.textContent = target.textContent.includes('~') ? '~' + count : count;
                        clearInterval(timer);
                    } else {
                        target.textContent = target.textContent.includes('~') ? '~' + Math.floor(current) : Math.floor(current);
                    }
                }, stepTime);
                
                counterObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
    
    // ========================================
    // Keyboard Navigation
    // ========================================
    document.addEventListener('keydown', (e) => {
        const sections = document.querySelectorAll('section');
        let currentSection = 0;
        
        sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                currentSection = index;
            }
        });
        
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            if (currentSection < sections.length - 1) {
                sections[currentSection + 1].scrollIntoView({ behavior: 'smooth' });
            }
        }
        
        if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            if (currentSection > 0) {
                sections[currentSection - 1].scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
    
    // ========================================
    // Session Topics Toggle
    // ========================================
    document.querySelectorAll('.session-item').forEach(item => {
        const topics = item.querySelector('.session-topics');
        if (topics) {
            topics.style.maxHeight = '0';
            topics.style.overflow = 'hidden';
            topics.style.transition = 'max-height 0.3s ease';
            
            item.addEventListener('click', () => {
                const isOpen = topics.style.maxHeight !== '0px';
                if (isOpen) {
                    topics.style.maxHeight = '0';
                } else {
                    topics.style.maxHeight = topics.scrollHeight + 'px';
                }
            });
        }
    });
    
    // ========================================
    // Parallax Effect on Hero Orbs
    // ========================================
    const orbs = document.querySelectorAll('.hero-orb');
    
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        
        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 10;
            orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });
    });
    
    console.log('FORGETIT Curriculum loaded! 🚀');
    console.log('Navigation: Arrow keys, Page Up/Down');
});