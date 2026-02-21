document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const currentSlideEl = document.getElementById('currentSlide');
    const totalSlidesEl = document.getElementById('totalSlides');
    const cursorGlow = document.getElementById('cursorGlow');
    
    if(!slides.length) return; // Safety check

    let currentIndex = 0;
    const totalSlides = slides.length;
    totalSlidesEl.textContent = totalSlides;

    function showSlide(index) {
        if (index < 0) index = 0;
        if (index >= totalSlides) index = totalSlides - 1;
        currentIndex = index;

        slides.forEach(slide => {
            slide.classList.remove('active');
            const animatedEls = slide.querySelectorAll('.scroll-reveal, .stagger-reveal > *');
            animatedEls.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'none';
            });
        });

        const activeSlide = slides[currentIndex];
        activeSlide.classList.add('active');
        currentSlideEl.textContent = currentIndex + 1;

        setTimeout(() => {
            const animatedEls = activeSlide.querySelectorAll('.scroll-reveal, .stagger-reveal > *');
            animatedEls.forEach((el, i) => {
                el.style.transition = `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`;
                void el.offsetWidth; 
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
        }, 100);
    }

    if(nextBtn) nextBtn.addEventListener('click', () => showSlide(currentIndex + 1));
    if(prevBtn) prevBtn.addEventListener('click', () => showSlide(currentIndex - 1));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') showSlide(currentIndex + 1);
        if (e.key === 'ArrowLeft') showSlide(currentIndex - 1);
    });

    if(cursorGlow) {
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
            cursorGlow.style.opacity = '1';
        });
    }

    showSlide(0);
});