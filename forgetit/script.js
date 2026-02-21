/* ========================================
   FORGETIT V2 - INTERACTIVE JAVASCRIPT
   Awwwards-Level + Full Functionality
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    Preloader.init();
    Navigation.init();
    ParticleCanvas.init();
    StorySection.init();
    CuanCalculator.init();
    QueryDemo.init();
    ScrollAnimations.init();
    CounterAnimations.init();
    CustomCursor.init();
    SmoothScroll.init();
    
    // FOMO Modules
    FomoNotifications.init();
    FomoStickyBar.init();
    FomoCountdown.init();
    FomoLossCounter.init();
    
    console.log('🧠 ForgetIt V2 - Hemat 1 Milyar+ Loaded');
});

/* ==========================================
   PRELOADER
   ========================================== */
const Preloader = {
    init() {
        const preloader = document.querySelector('.preloader');
        const progressFill = document.querySelector('.progress-fill');
        const progressPercent = document.querySelector('.progress-percent');
        
        if (!preloader) return;
        
        let progress = 0;
        const duration = 2000;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            progress = Math.min((elapsed / duration) * 100, 100);
            
            if (progressFill) progressFill.style.width = `${progress}%`;
            if (progressPercent) progressPercent.textContent = `${Math.round(progress)}%`;
            
            if (progress < 100) {
                requestAnimationFrame(animate);
            } else {
                setTimeout(() => {
                    preloader.classList.add('loaded');
                    document.body.style.overflow = '';
                }, 300);
            }
        };
        
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(animate);
    }
};

/* ==========================================
   NAVIGATION
   ========================================== */
const Navigation = {
    init() {
        const nav = document.querySelector('.nav');
        const toggle = document.querySelector('.nav-toggle');
        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');
        
        // Scroll behavior
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
            
            lastScroll = currentScroll;
        }, { passive: true });
        
        // Mobile menu toggle
        if (toggle && mobileMenu) {
            toggle.addEventListener('click', () => {
                toggle.classList.toggle('active');
                mobileMenu.classList.toggle('active');
                document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
            });
            
            mobileLinks.forEach(link => {
                link.addEventListener('click', () => {
                    toggle.classList.remove('active');
                    mobileMenu.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });
        }
    }
};

/* ==========================================
   PARTICLE CANVAS
   ========================================== */
const ParticleCanvas = {
    init() {
        const canvas = document.getElementById('particles-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const isMobile = window.innerWidth < 768;
        let particles = [];
        let animationId;
        
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        const createParticles = () => {
            particles = [];
            const count = isMobile ? 20 : 40;
            
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    radius: Math.random() * 2 + 0.5,
                    opacity: Math.random() * 0.4 + 0.1,
                    hue: Math.random() * 60 + 140
                });
            }
        };
        
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw connections on desktop only
            if (!isMobile) {
                particles.forEach((p1, i) => {
                    particles.slice(i + 1).forEach(p2 => {
                        const dx = p1.x - p2.x;
                        const dy = p1.y - p2.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        
                        if (distance < 120) {
                            ctx.beginPath();
                            ctx.strokeStyle = `hsla(${p1.hue}, 100%, 60%, ${0.08 * (1 - distance / 120)})`;
                            ctx.lineWidth = 0.5;
                            ctx.moveTo(p1.x, p1.y);
                            ctx.lineTo(p2.x, p2.y);
                            ctx.stroke();
                        }
                    });
                });
            }
            
            // Draw particles
            particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${p.hue}, 100%, 60%, ${p.opacity})`;
                ctx.fill();
                
                p.x += p.vx;
                p.y += p.vy;
                
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;
            });
            
            animationId = requestAnimationFrame(draw);
        };
        
        resize();
        createParticles();
        draw();
        
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                resize();
                createParticles();
            }, 250);
        });
        
        // Pause when not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(animationId);
            } else {
                draw();
            }
        });
    }
};

/* ==========================================
   STORY SECTION - Interactive Checkboxes
   ========================================== */
const StorySection = {
    costs: {
        1: 20000000,  // Human Google: 20jt
        2: 75000000,  // Scaling: 75jt
        3: 37500000,  // Affiliate: 37.5jt
        4: 150000000, // Brain Drain: 150jt
        5: 30000000,  // Bottleneck: 30jt
        6: 45000000   // Training: 45jt
    },
    
    init() {
        const checkboxes = document.querySelectorAll('.story-checkbox');
        const countEl = document.getElementById('story-count');
        const estimateEl = document.getElementById('story-estimate');
        const summaryEl = document.getElementById('story-summary');
        
        if (!checkboxes.length) return;
        
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateSummary(checkboxes, countEl, estimateEl, summaryEl);
                
                // Add visual feedback
                const card = checkbox.closest('.story-card');
                if (checkbox.checked) {
                    card.style.borderColor = 'var(--accent-primary)';
                    card.style.background = 'linear-gradient(135deg, rgba(0,255,136,0.08) 0%, var(--bg-surface) 100%)';
                } else {
                    card.style.borderColor = '';
                    card.style.background = '';
                }
            });
        });
        
        // Initial update
        this.updateSummary(checkboxes, countEl, estimateEl, summaryEl);
    },
    
    updateSummary(checkboxes, countEl, estimateEl, summaryEl) {
        let count = 0;
        let total = 0;
        
        checkboxes.forEach(cb => {
            if (cb.checked) {
                count++;
                const storyNum = cb.id.replace('story-check-', '');
                total += this.costs[storyNum] || 0;
            }
        });
        
        // Update count
        if (countEl) {
            this.animateNumber(countEl, count);
        }
        
        // Update estimate
        if (estimateEl) {
            const formatted = this.formatRupiah(total);
            estimateEl.textContent = formatted;
        }
        
        // Show/hide summary
        if (summaryEl) {
            if (count > 0) {
                summaryEl.style.opacity = '1';
                summaryEl.style.transform = 'translateY(0)';
            }
        }
    },
    
    formatRupiah(num) {
        if (num >= 1000000000) {
            return `Rp ${(num / 1000000000).toFixed(1)}M`;
        } else if (num >= 1000000) {
            return `Rp ${(num / 1000000).toFixed(0)}jt`;
        }
        return `Rp ${num.toLocaleString('id-ID')}`;
    },
    
    animateNumber(el, target) {
        const current = parseInt(el.textContent) || 0;
        const diff = target - current;
        const duration = 300;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const value = Math.round(current + diff * this.easeOut(progress));
            el.textContent = value;
            
            if (progress < 1) requestAnimationFrame(animate);
        };
        
        requestAnimationFrame(animate);
    },
    
    easeOut(t) {
        return 1 - Math.pow(1 - t, 3);
    }
};

/* ==========================================
   CUAN 1 MILYAR CALCULATOR
   ========================================== */
const CuanCalculator = {
    init() {
        const hireSlider = document.getElementById('hire-slider');
        const trainingSlider = document.getElementById('training-slider');
        const hoursSlider = document.getElementById('hours-slider');
        const rateSlider = document.getElementById('rate-slider');
        const affiliateSlider = document.getElementById('affiliate-slider');
        
        if (!hireSlider) return;
        
        const sliders = [hireSlider, trainingSlider, hoursSlider, rateSlider, affiliateSlider];
        
        sliders.forEach(slider => {
            if (slider) {
                slider.addEventListener('input', () => this.calculate());
            }
        });
        
        // Initial calculation
        this.calculate();
    },
    
    calculate() {
        // Get values
        const hire = parseInt(document.getElementById('hire-slider').value);
        const training = parseInt(document.getElementById('training-slider').value);
        const hours = parseInt(document.getElementById('hours-slider').value);
        const rate = parseInt(document.getElementById('rate-slider').value);
        const affiliates = parseInt(document.getElementById('affiliate-slider').value);
        
        // Update display values
        document.getElementById('hire-value').textContent = `${hire} orang`;
        document.getElementById('training-value').textContent = `${training} bulan`;
        document.getElementById('hours-value').textContent = `${hours} jam`;
        document.getElementById('rate-value').textContent = rate >= 1000 ? `Rp ${rate/1000}jt` : `Rp ${rate}rb`;
        document.getElementById('affiliate-value').textContent = affiliates.toString();
        
        // Calculate savings (in millions)
        const avgSalary = 10; // 10 juta per orang per bulan
        
        // 1. Hiring savings: hire × salary × 12 months
        const hireSavings = hire * avgSalary * 12;
        
        // 2. Training savings: hire × salary × training months (unproductive period)
        const trainingSavings = hire * avgSalary * training;
        
        // 3. Owner time savings: hours × rate × 52 weeks / 1000 (convert to millions)
        const timeSavings = Math.round((hours * rate * 52) / 1000);
        
        // 4. Affiliate CS savings: affiliates/200 × 5jt × 12
        const affiliateAdmins = Math.ceil(affiliates / 200);
        const affiliateSavings = affiliateAdmins * 5 * 12;
        
        // Total
        const totalSavings = hireSavings + trainingSavings + timeSavings + affiliateSavings;
        
        // Update results
        this.animateNumber(document.getElementById('total-savings'), totalSavings);
        
        // Update breakdown
        document.getElementById('save-hire').textContent = `Rp ${hireSavings}jt`;
        document.getElementById('save-training').textContent = `Rp ${trainingSavings}jt`;
        document.getElementById('save-time').textContent = `Rp ${timeSavings}jt`;
        document.getElementById('save-affiliate').textContent = `Rp ${affiliateSavings}jt`;
        
        // Update breakdown bars
        const maxSaving = Math.max(hireSavings, trainingSavings, timeSavings, affiliateSavings, 1);
        document.getElementById('bar-hire').style.width = `${(hireSavings / maxSaving) * 100}%`;
        document.getElementById('bar-training').style.width = `${(trainingSavings / maxSaving) * 100}%`;
        document.getElementById('bar-time').style.width = `${(timeSavings / maxSaving) * 100}%`;
        document.getElementById('bar-affiliate').style.width = `${(affiliateSavings / maxSaving) * 100}%`;
        
        // Update insight
        const equivalentRevenue = Math.round(totalSavings / 0.3); // 30% profit margin
        document.getElementById('savings-insight').textContent = 
            `= Laba dari omset tambahan Rp ${equivalentRevenue} juta`;
        
        // Calculate ROI
        const investment = 135; // Year 1: Setup 75jt + Monthly 60jt (Professional tier)
        const roiPercent = Math.round((totalSavings / investment) * 100);
        const roiMonths = Math.max(1, Math.round((investment / totalSavings) * 12));
        
        this.animateNumber(document.getElementById('roi-percent'), roiPercent);
        document.getElementById('roi-months').textContent = roiMonths > 12 ? '12+' : roiMonths;
    },
    
    animateNumber(el, target) {
        if (!el) return;
        
        const current = parseInt(el.textContent) || 0;
        const diff = target - current;
        const duration = 500;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.round(current + diff * eased);
            el.textContent = value;
            
            if (progress < 1) requestAnimationFrame(animate);
        };
        
        requestAnimationFrame(animate);
    }
};

/* ==========================================
   QUERY DEMO
   ========================================== */
const QueryDemo = {
    answers: {
        1: 'Harga grosir: 100-499 pcs diskon 10%, 500-999 pcs diskon 15%, 1000+ pcs diskon 20%. Payment cash atau tempo 14 hari untuk partner terdaftar.',
        2: 'Prosedur retur: (1) Foto bukti dalam 24 jam, (2) Kirim via form di website, (3) Tim QC verifikasi 1-2 hari, (4) Refund atau replacement dalam 5 hari kerja. Biaya ongkir ditanggung pembeli kecuali kesalahan kami.',
        3: 'Untuk jadi affiliator: (1) Daftar di affiliate.domain.com, (2) Isi data & rekening, (3) Tunggu approval 1x24 jam, (4) Dapat link & akses dashboard. Komisi 10% per sale, payout setiap tanggal 25.'
    },
    sources: {
        1: 'pricing_policy.xlsx, partner_terms.docx',
        2: 'SOP_retur.pdf, CS_guidelines.docx',
        3: 'affiliate_program.pdf, commission_structure.xlsx'
    },
    
    init() {
        const buttons = document.querySelectorAll('.query-btn');
        const answerEl = document.getElementById('result-answer');
        const sourceEl = document.querySelector('.result-source');
        
        if (!buttons.length) return;
        
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Get query number
                const queryNum = btn.dataset.query;
                
                // Animate answer change
                if (answerEl) {
                    answerEl.style.opacity = '0';
                    answerEl.style.transform = 'translateY(10px)';
                    
                    setTimeout(() => {
                        answerEl.textContent = this.answers[queryNum];
                        if (sourceEl) {
                            sourceEl.innerHTML = `📄 ${this.sources[queryNum]}`;
                        }
                        answerEl.style.opacity = '1';
                        answerEl.style.transform = 'translateY(0)';
                    }, 200);
                }
            });
        });
        
        // Add transition styles
        if (answerEl) {
            answerEl.style.transition = 'opacity 0.2s, transform 0.2s';
        }
    }
};

/* ==========================================
   SCROLL ANIMATIONS
   ========================================== */
const ScrollAnimations = {
    init() {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Add staggered delay
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 50);
                }
            });
        }, observerOptions);
        
        // Observe elements
        const elements = document.querySelectorAll(`
            .story-card,
            .step-card,
            .pricing-card,
            .clone-card
        `);
        
        elements.forEach(el => observer.observe(el));
    }
};

/* ==========================================
   COUNTER ANIMATIONS
   ========================================== */
const CounterAnimations = {
    init() {
        const counters = document.querySelectorAll('.proof-number[data-count]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => observer.observe(counter));
    },
    
    animateCounter(el) {
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const duration = 2000;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            const value = Math.round(target * eased);
            
            el.textContent = value + suffix;
            
            if (progress < 1) requestAnimationFrame(animate);
        };
        
        requestAnimationFrame(animate);
    }
};

/* ==========================================
   CUSTOM CURSOR (Desktop Only)
   ========================================== */
const CustomCursor = {
    init() {
        // Skip on touch devices
        if (this.isTouchDevice()) return;
        
        const glow = document.querySelector('.cursor-glow');
        const dot = document.querySelector('.cursor-dot');
        
        if (!glow || !dot) return;
        
        let mouseX = 0, mouseY = 0;
        let glowX = 0, glowY = 0;
        let dotX = 0, dotY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        const animate = () => {
            glowX += (mouseX - glowX) * 0.06;
            glowY += (mouseY - glowY) * 0.06;
            glow.style.left = `${glowX}px`;
            glow.style.top = `${glowY}px`;
            
            dotX += (mouseX - dotX) * 0.15;
            dotY += (mouseY - dotY) * 0.15;
            dot.style.left = `${dotX}px`;
            dot.style.top = `${dotY}px`;
            
            requestAnimationFrame(animate);
        };
        
        animate();
        
        // Hover effects
        const interactive = document.querySelectorAll('a, button, .query-btn, .story-card');
        interactive.forEach(el => {
            el.addEventListener('mouseenter', () => {
                dot.style.transform = 'translate(-50%, -50%) scale(2.5)';
                dot.style.background = 'transparent';
                dot.style.border = '2px solid var(--accent-primary)';
            });
            
            el.addEventListener('mouseleave', () => {
                dot.style.transform = 'translate(-50%, -50%) scale(1)';
                dot.style.background = 'var(--accent-primary)';
                dot.style.border = 'none';
            });
        });
    },
    
    isTouchDevice() {
        return ('ontouchstart' in window) || 
               (navigator.maxTouchPoints > 0) || 
               (window.matchMedia('(hover: none)').matches);
    }
};

/* ==========================================
   SMOOTH SCROLL
   ========================================== */
const SmoothScroll = {
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const offset = 80;
                    const targetPosition = target.offsetTop - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
};

/* ==========================================
   FORM SUBMISSION
   ========================================== */
function submitForm() {
    const nameInput = document.getElementById('form-name');
    const waInput = document.getElementById('form-wa');
    
    const name = nameInput?.value?.trim();
    const wa = waInput?.value?.trim();
    
    if (!name || !wa) {
        alert('Mohon lengkapi nama dan nomor WhatsApp');
        return;
    }
    
    // Format WhatsApp number
    let waNumber = wa.replace(/\D/g, '');
    if (waNumber.startsWith('0')) {
        waNumber = '62' + waNumber.substring(1);
    }
    
    // Create message
    const message = encodeURIComponent(
        `Halo, saya ${name}.\n\nSaya tertarik dengan ForgetIt untuk hemat operasional bisnis saya.\n\nMohon jadwalkan konsultasi gratis. Terima kasih!`
    );
    
    // WhatsApp link - Replace with actual number
    const targetWa = '6281234567890'; // Ganti dengan nomor asli
    window.open(`https://wa.me/${targetWa}?text=${message}`, '_blank');
    
    // Clear form
    nameInput.value = '';
    waInput.value = '';
    
    // Show success feedback
    const submitBtn = document.querySelector('.form-submit');
    if (submitBtn) {
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '✓ Menuju WhatsApp...';
        submitBtn.style.background = '#25D366';
        
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = '';
        }, 3000);
    }
}

/* ==========================================
   UTILITY: SCROLL TO SECTION
   ========================================== */
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offset = 80;
        const targetPosition = section.offsetTop - offset;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

/* ==========================================
   KEYBOARD NAVIGATION
   ========================================== */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const mobileMenu = document.querySelector('.mobile-menu');
        const toggle = document.querySelector('.nav-toggle');
        
        if (mobileMenu?.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            toggle?.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

/* ==========================================
   FOMO: LIVE NOTIFICATIONS
   ========================================== */
const FomoNotifications = {
    cities: ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang', 'Makassar', 'Tangerang', 'Bekasi', 'Depok', 'Yogyakarta', 'Bali', 'Malang', 'Solo'],
    times: ['baru saja', '1 menit lalu', '2 menit lalu', '3 menit lalu', '5 menit lalu'],
    
    init() {
        const notifEl = document.getElementById('live-notif');
        if (!notifEl) return;
        
        // Show first notification after 8 seconds
        setTimeout(() => this.showNotification(notifEl), 8000);
        
        // Then show every 30-60 seconds
        setInterval(() => {
            const delay = Math.random() * 30000 + 30000; // 30-60 seconds
            setTimeout(() => this.showNotification(notifEl), delay);
        }, 45000);
    },
    
    showNotification(el) {
        const cityEl = document.getElementById('notif-city');
        const timeEl = document.getElementById('notif-time');
        
        // Randomize content
        const city = this.cities[Math.floor(Math.random() * this.cities.length)];
        const time = this.times[Math.floor(Math.random() * this.times.length)];
        
        if (cityEl) cityEl.textContent = city;
        if (timeEl) timeEl.textContent = time;
        
        // Show
        el.classList.add('show');
        
        // Hide after 5 seconds
        setTimeout(() => {
            el.classList.remove('show');
        }, 5000);
    }
};

/* ==========================================
   FOMO: STICKY BOTTOM BAR
   ========================================== */
const FomoStickyBar = {
    init() {
        const stickyEl = document.getElementById('sticky-fomo');
        if (!stickyEl) return;
        
        let lastScroll = 0;
        const triggerPoint = window.innerHeight * 0.5; // Show after scrolling 50% of viewport
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > triggerPoint) {
                stickyEl.classList.add('show');
            } else {
                stickyEl.classList.remove('show');
            }
            
            lastScroll = currentScroll;
        }, { passive: true });
        
        // Update slots randomly (simulate scarcity)
        this.updateSlots();
    },
    
    updateSlots() {
        const slotsEl = document.getElementById('slots-left');
        if (!slotsEl) return;
        
        // Randomly decrease slots over time (psychological trick)
        setInterval(() => {
            const current = parseInt(slotsEl.textContent);
            if (current > 1 && Math.random() > 0.7) {
                slotsEl.textContent = current - 1;
                slotsEl.style.animation = 'none';
                slotsEl.offsetHeight; // Trigger reflow
                slotsEl.style.animation = 'pulse 0.5s ease-out';
            }
        }, 60000); // Check every minute
    }
};

/* ==========================================
   FOMO: COUNTDOWN TIMER
   ========================================== */
const FomoCountdown = {
    init() {
        // Set deadline to 7 days from now (or use a fixed date)
        const deadline = new Date();
        deadline.setDate(deadline.getDate() + 7);
        deadline.setHours(23, 59, 59, 999);
        
        this.updateCountdown(deadline);
        setInterval(() => this.updateCountdown(deadline), 1000);
    },
    
    updateCountdown(deadline) {
        const now = new Date().getTime();
        const distance = deadline.getTime() - now;
        
        if (distance < 0) {
            // Reset to next week if expired
            deadline.setDate(deadline.getDate() + 7);
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        const daysEl = document.getElementById('countdown-days');
        const hoursEl = document.getElementById('countdown-hours');
        const minsEl = document.getElementById('countdown-mins');
        const secsEl = document.getElementById('countdown-secs');
        
        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minsEl) minsEl.textContent = String(minutes).padStart(2, '0');
        if (secsEl) {
            secsEl.textContent = String(seconds).padStart(2, '0');
            // Pulse animation on seconds
            secsEl.style.animation = 'none';
            secsEl.offsetHeight;
            secsEl.style.animation = 'pulse 1s ease-out';
        }
    }
};

/* ==========================================
   FOMO: LOSS COUNTER
   ========================================== */
const FomoLossCounter = {
    // Average loss per minute based on calculator defaults
    // (3 employees × 10M × 12 + 3 × 3 × 10M + 10 × 1M × 52 + 2.5 × 5M × 12) / 12 / 30 / 24 / 60
    // ≈ Rp 2,847 per minute
    lossPerMinute: 2847,
    startTime: null,
    
    init() {
        this.startTime = Date.now();
        this.update();
        setInterval(() => this.update(), 1000);
    },
    
    update() {
        const lossEl = document.getElementById('loss-counter');
        if (!lossEl) return;
        
        const elapsedMinutes = (Date.now() - this.startTime) / 60000;
        const totalLoss = Math.round(elapsedMinutes * this.lossPerMinute);
        
        lossEl.textContent = this.formatRupiah(totalLoss);
    },
    
    formatRupiah(num) {
        if (num >= 1000000) {
            return `Rp ${(num / 1000000).toFixed(1)}jt`;
        } else if (num >= 1000) {
            return `Rp ${Math.round(num / 1000)}rb`;
        }
        return `Rp ${num.toLocaleString('id-ID')}`;
    }
};

/* ==========================================
   EXIT INTENT POPUP (Desktop Only)
   ========================================== */
const ExitIntent = {
    shown: false,
    
    init() {
        if (this.isMobile()) return;
        
        document.addEventListener('mouseout', (e) => {
            if (this.shown) return;
            
            // Check if mouse is leaving the viewport from top
            if (e.clientY <= 0 && e.relatedTarget === null) {
                this.showPopup();
            }
        });
    },
    
    showPopup() {
        this.shown = true;
        
        // Create popup
        const popup = document.createElement('div');
        popup.className = 'exit-popup';
        popup.innerHTML = `
            <div class="exit-overlay"></div>
            <div class="exit-content">
                <button class="exit-close" onclick="this.closest('.exit-popup').remove()">×</button>
                <div class="exit-icon">⚠️</div>
                <h3 class="exit-title">Tunggu Dulu!</h3>
                <p class="exit-text">Kompetitor Anda mungkin tidak menutup halaman ini.</p>
                <p class="exit-subtext">Setiap hari tanpa AI = <strong>Rp 2-3 juta</strong> terbuang.</p>
                <a href="#cta" class="exit-cta" onclick="this.closest('.exit-popup').remove()">
                    🔥 Konsultasi Gratis Sekarang
                </a>
                <button class="exit-dismiss" onclick="this.closest('.exit-popup').remove()">
                    Tidak, biarkan kompetitor menang
                </button>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        // Animate in
        requestAnimationFrame(() => {
            popup.classList.add('show');
        });
    },
    
    isMobile() {
        return window.innerWidth < 768 || 
               ('ontouchstart' in window) || 
               (navigator.maxTouchPoints > 0);
    }
};

// Initialize exit intent after page load
setTimeout(() => ExitIntent.init(), 5000);