document.addEventListener('DOMContentLoaded', () => {
    
    // --- VARIABLES ---
    const loader = document.querySelector('.loader');
    const loaderBar = document.querySelector('.loader-bar');
    const cursor = document.querySelector('.cursor-glow');
    const navbar = document.querySelector('.navbar');

    // --- FUNCTION: HIDE LOADER ---
    // Fungsi terpusat untuk menghilangkan loader
    function hideLoader() {
        if (loader && !loader.classList.contains('hidden')) {
            loader.classList.add('hidden');
            // Mulai animasi scroll setelah loader hilang
            setTimeout(initScrollAnimations, 100); 
        }
    }

    // --- 1. LOADER LOGIC (FAIL-SAFE) ---
    // Logika utama loading bar
    if (loader && loaderBar) {
        let width = 0;
        const interval = setInterval(() => {
            if (width >= 100) {
                clearInterval(interval);
                loaderBar.style.width = '100%';
                setTimeout(hideLoader, 500); // Tunggu sebentar lalu hide
            } else {
                width += Math.random() * 15; // Speed up a bit
                if(width > 100) width = 100;
                loaderBar.style.width = width + '%';
            }
        }, 100);

        // FAIL-SAFE: Paksa buka setelah 3 detik jika script macet
        setTimeout(() => {
            clearInterval(interval);
            hideLoader();
        }, 3000);
    } else {
        // Jika elemen loader tidak ketemu, langsung jalankan animasi
        console.warn('Loader element not found, skipping...');
        initScrollAnimations();
    }

    // --- 2. CURSOR GLOW EFFECT ---
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
            });
            
            if(e.target.closest('a') || e.target.closest('button')) {
                cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            } else {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            }
        });
        
        document.addEventListener('mouseenter', () => cursor.classList.add('active'));
        document.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    }

    // --- 3. SCROLL REVEAL (INTERSECTION OBSERVER) ---
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target); // Stop observing once revealed (Performance)
                }
            });
        }, observerOptions);

        const revealElements = document.querySelectorAll('.scroll-reveal, .stagger-reveal, .fade-in-up');
        revealElements.forEach(el => observer.observe(el));
    }

    // --- 4. NAVBAR SCROLL EFFECT ---
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.padding = '10px 0';
                const inner = navbar.querySelector('.nav-inner');
                if(inner) inner.style.background = 'rgba(255, 255, 255, 0.9)';
            } else {
                navbar.style.padding = '20px 0';
                const inner = navbar.querySelector('.nav-inner');
                if(inner) inner.style.background = 'rgba(255, 255, 255, 0.7)';
            }
        });
    }

    // --- 5. SMOOTH SCROLL FOR ANCHOR LINKS ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // --- 6. MAGNETIC BUTTON EFFECT ---
    const btns = document.querySelectorAll('.hover-lift');
    btns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const moveX = (x - centerX) / 10;
            const moveY = (y - centerY) / 10;
            btn.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });

});