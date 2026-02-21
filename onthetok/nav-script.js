// ===================================================================
// AFFILIATE OS - NAVIGATION SCRIPT (BASED ON FLEXEET CORE)
// ===================================================================

(function() {

    /**
     * Menginisialisasi fungsionalitas menu mobile (hamburger).
     */
    function setupMobileMenu() {
        const menuToggle = document.getElementById('hamburger-button');
        const mobileMenu = document.getElementById('mobile-menu-overlay');
        const mobileLinks = document.querySelectorAll('.mobile-menu-inner a');
        
        if (!menuToggle || !mobileMenu) return;

        // Toggle menu saat tombol hamburger diklik
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            // Mencegah scroll body saat menu terbuka
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Tutup menu saat link di dalam menu mobile diklik
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Tutup menu saat tombol 'Escape' ditekan
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    /**
     * Menangani efek visual yang bergantung pada posisi scroll.
     */
    function handleScrollEffects() {
        const scrollY = window.scrollY;
    
        // 1. Menambahkan class 'scrolled' ke navbar
        const navbar = document.getElementById('mainNav');
        if (navbar) {
            navbar.classList.toggle('scrolled', scrollY > 50);
        }
        
        // 2. Highlight link navigasi aktif (Scrollspy)
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.desktop-menu .nav-link');
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            // Offset 150px agar link aktif sebelum section pas di atas
            if (scrollY >= sectionTop - 150) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            // Cek jika href link mengandung ID section yang aktif
            if (currentSectionId && link.getAttribute('href').includes(currentSectionId)) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Fungsi Debounce untuk membatasi frekuensi eksekusi fungsi saat event terjadi (seperti scroll).
     * @param {Function} func - Fungsi yang akan dieksekusi.
     * @param {number} wait - Waktu tunggu dalam milidetik.
     * @returns {Function} - Fungsi baru yang telah di-debounce.
     */
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

    // Menjalankan semua fungsi setup setelah DOM siap
    document.addEventListener('DOMContentLoaded', function() {
        setupMobileMenu();
        
        // Panggil handleScrollEffects sekali saat load untuk state awal yang benar
        handleScrollEffects();
        
        // Tambahkan event listener untuk scroll dengan debounce
        window.addEventListener('scroll', debounce(handleScrollEffects, 10));
    });

})(); // Akhir dari IIFE