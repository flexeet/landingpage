/* =========================================
   FLEXBIT V3.5 - COMPLETE SCRIPT
   Base + Desktop Animations
   ========================================= */

// =========================================
// 1. AOS ANIMATION INIT
// =========================================
if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 600,
        easing: 'ease-out-cubic',
        once: true,
        offset: 30,
        disable: window.innerWidth < 768
    });
}

// =========================================
// 2. NAVBAR SCROLL EFFECT
// =========================================
const navbar = document.getElementById('mainNav');

if (navbar) {
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });
}

// =========================================
// 3. FAQ ACCORDION
// =========================================
document.querySelectorAll('.faq-question').forEach(function(button) {
    button.addEventListener('click', function() {
        var faqItem = this.parentElement;
        var isActive = faqItem.classList.contains('active');
        
        // Close all
        document.querySelectorAll('.faq-item').forEach(function(item) {
            item.classList.remove('active');
        });
        
        // Open clicked if wasn't active
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

// =========================================
// 4. SMOOTH SCROLL
// =========================================
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        var targetId = this.getAttribute('href');
        var target = document.querySelector(targetId);
        if (target) {
            var offset = 80;
            var targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
    });
});

// =========================================
// 5. MOBILE STICKY CTA
// =========================================
var stickyCTA = document.querySelector('.mobile-sticky-cta');
var heroSection = document.querySelector('.hero');

if (stickyCTA && heroSection) {
    var stickyObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                stickyCTA.classList.remove('visible');
            } else {
                stickyCTA.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    stickyObserver.observe(heroSection);
}

// =========================================
// 6. TIMING BAR ANIMATION
// =========================================
function animateTimingBars() {
    var timingBars = document.querySelectorAll('.timing-fill, .timing-mini-fill');
    
    timingBars.forEach(function(bar) {
        var width = bar.style.width;
        bar.style.width = '0%';
        
        setTimeout(function() {
            bar.style.transition = 'width 1s ease-out';
            bar.style.width = width;
        }, 100);
    });
}

// Animate timing bars when visible
var demoCard = document.querySelector('.demo-card.v35');
if (demoCard) {
    var demoObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                animateTimingBars();
                demoObserver.disconnect();
            }
        });
    }, { threshold: 0.5 });
    
    demoObserver.observe(demoCard);
}

// =========================================
// 7. NUMBER COUNTER ANIMATION
// =========================================
function animateValue(element, start, end, duration) {
    var range = end - start;
    var startTime = performance.now();
    
    function update(currentTime) {
        var elapsed = currentTime - startTime;
        var progress = Math.min(elapsed / duration, 1);
        var easeOut = 1 - Math.pow(1 - progress, 3);
        var current = Math.round(start + (range * easeOut));
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Animate VQSG scores on scroll
var previewSection = document.getElementById('preview');
if (previewSection) {
    var animated = false;
    
    var vqsgObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting && !animated) {
                animated = true;
                document.querySelectorAll('.vqsg-score').forEach(function(score) {
                    var value = parseInt(score.textContent);
                    animateValue(score, 0, value, 1000);
                });
            }
        });
    }, { threshold: 0.3 });
    
    vqsgObserver.observe(previewSection);
}

// =========================================
// 8. CONSOLE BRANDING
// =========================================
console.log('%c FlexBit V3.5 ', 'background: linear-gradient(135deg, #439466, #b04595); color: white; font-size: 20px; font-weight: bold; padding: 10px 20px; border-radius: 8px;');
console.log('%c Narrative System - Analisis 2 Dimensi ', 'color: #8B5CF6; font-size: 12px;');

// =========================================
// DESKTOP ANIMATIONS (Only loads on desktop)
// =========================================
if (window.innerWidth > 768 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {

console.log('%c Desktop Mode Activated ', 'color: #439466; font-size: 11px;');

// =========================================
// CANDLESTICK CANVAS ANIMATION
// =========================================
var candlestickCanvas = document.getElementById('candlestick-canvas');

if (candlestickCanvas) {
    var ctx = candlestickCanvas.getContext('2d');
    var width, height;
    var candles = [];
    var animationId;
    
    var CONFIG = {
        candleCount: 20,
        candleWidth: 16,
        candleGap: 35,
        maxHeight: 100,
        minHeight: 20,
        speed: 0.4
    };
    
    function resize() {
        width = candlestickCanvas.width = window.innerWidth;
        height = candlestickCanvas.height = window.innerHeight;
        initCandles();
    }
    
    function Candle(x) {
        this.x = x;
        this.reset();
    }
    
    Candle.prototype.reset = function() {
        this.isBullish = Math.random() > 0.35;
        this.bodyHeight = Math.random() * (CONFIG.maxHeight - CONFIG.minHeight) + CONFIG.minHeight;
        this.wickTop = Math.random() * 30 + 10;
        this.wickBottom = Math.random() * 20 + 5;
        this.y = Math.random() * (height - 250) + 100;
        this.targetY = this.y + (Math.random() - 0.5) * 60;
        this.opacity = Math.random() * 0.2 + 0.08;
        this.glowIntensity = Math.random();
    };
    
    Candle.prototype.update = function() {
        this.y += (this.targetY - this.y) * 0.02;
        
        if (Math.abs(this.y - this.targetY) < 1) {
            this.targetY = this.y + (Math.random() - 0.5) * 60;
        }
        
        this.x -= CONFIG.speed;
        this.glowIntensity = 0.5 + Math.sin(Date.now() * 0.002 + this.x) * 0.5;
        
        if (this.x < -CONFIG.candleWidth * 2) {
            this.x = width + CONFIG.candleWidth;
            this.reset();
        }
    };
    
    Candle.prototype.draw = function() {
        ctx.globalAlpha = this.opacity;
        
        var color = this.isBullish ? 'rgba(67, 148, 102,' : 'rgba(239, 68, 68,';
        
        ctx.shadowColor = color + (0.3 * this.glowIntensity) + ')';
        ctx.shadowBlur = 15 * this.glowIntensity;
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.x + CONFIG.candleWidth / 2, this.y - this.wickTop);
        ctx.lineTo(this.x + CONFIG.candleWidth / 2, this.y + this.bodyHeight + this.wickBottom);
        ctx.stroke();
        
        ctx.fillStyle = color + '0.35)';
        ctx.fillRect(this.x, this.y, CONFIG.candleWidth, this.bodyHeight);
        
        ctx.strokeStyle = color + '0.5)';
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, this.y, CONFIG.candleWidth, this.bodyHeight);
        
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
    };
    
    function initCandles() {
        candles = [];
        for (var i = 0; i < CONFIG.candleCount; i++) {
            candles.push(new Candle(i * (CONFIG.candleWidth + CONFIG.candleGap)));
        }
    }
    
    function animateCandles() {
        ctx.clearRect(0, 0, width, height);
        
        candles.forEach(function(candle) {
            candle.update();
            candle.draw();
        });
        
        animationId = requestAnimationFrame(animateCandles);
    }
    
    var resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resize, 250);
    });
    
    resize();
    animateCandles();
    
    var candleObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                if (!animationId) animateCandles();
            } else {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        });
    }, { threshold: 0.1 });
    
    candleObserver.observe(candlestickCanvas);
}

// =========================================
// PARTICLE NETWORK ANIMATION
// =========================================
var particlesCanvas = document.getElementById('particles-canvas');

if (particlesCanvas) {
    var pCtx = particlesCanvas.getContext('2d');
    var pWidth, pHeight;
    var particles = [];
    var mouse = { x: -1000, y: -1000 };
    var particleAnimationId;
    
    var PCONFIG = {
        particleCount: 50,
        connectionDistance: 120,
        mouseRadius: 150
    };
    
    function resizeParticles() {
        pWidth = particlesCanvas.width = window.innerWidth;
        pHeight = particlesCanvas.height = window.innerHeight;
        initParticles();
    }
    
    function Particle() {
        this.x = Math.random() * pWidth;
        this.y = Math.random() * pHeight;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.4 + 0.1;
    }
    
    Particle.prototype.update = function() {
        var dx = mouse.x - this.x;
        var dy = mouse.y - this.y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < PCONFIG.mouseRadius) {
            var force = (PCONFIG.mouseRadius - distance) / PCONFIG.mouseRadius;
            this.vx -= (dx / distance) * force * 0.3;
            this.vy -= (dy / distance) * force * 0.3;
        }
        
        this.x += this.vx;
        this.y += this.vy;
        
        this.vx *= 0.99;
        this.vy *= 0.99;
        
        if (this.x < 0 || this.x > pWidth) this.vx *= -1;
        if (this.y < 0 || this.y > pHeight) this.vy *= -1;
    };
    
    Particle.prototype.draw = function() {
        pCtx.beginPath();
        pCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        pCtx.fillStyle = 'rgba(67, 148, 102, ' + this.opacity + ')';
        pCtx.fill();
    };
    
    function initParticles() {
        particles = [];
        for (var i = 0; i < PCONFIG.particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    function drawConnections() {
        for (var i = 0; i < particles.length; i++) {
            for (var j = i + 1; j < particles.length; j++) {
                var dx = particles[i].x - particles[j].x;
                var dy = particles[i].y - particles[j].y;
                var distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < PCONFIG.connectionDistance) {
                    var opacity = (1 - distance / PCONFIG.connectionDistance) * 0.12;
                    pCtx.beginPath();
                    pCtx.strokeStyle = 'rgba(67, 148, 102, ' + opacity + ')';
                    pCtx.lineWidth = 1;
                    pCtx.moveTo(particles[i].x, particles[i].y);
                    pCtx.lineTo(particles[j].x, particles[j].y);
                    pCtx.stroke();
                }
            }
        }
    }
    
    function animateParticles() {
        pCtx.clearRect(0, 0, pWidth, pHeight);
        drawConnections();
        particles.forEach(function(p) {
            p.update();
            p.draw();
        });
        particleAnimationId = requestAnimationFrame(animateParticles);
    }
    
    document.addEventListener('mousemove', function(e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    
    document.addEventListener('mouseleave', function() {
        mouse.x = -1000;
        mouse.y = -1000;
    });
    
    var pResizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(pResizeTimeout);
        pResizeTimeout = setTimeout(resizeParticles, 250);
    });
    
    resizeParticles();
    animateParticles();
}

// =========================================
// CURSOR GLOW EFFECT
// =========================================
var cursorGlow = document.createElement('div');
cursorGlow.className = 'cursor-glow';
cursorGlow.style.cssText = 'position: fixed; width: 300px; height: 300px; background: radial-gradient(circle, rgba(67, 148, 102, 0.08) 0%, transparent 70%); border-radius: 50%; pointer-events: none; z-index: 9999; transform: translate(-50%, -50%); transition: opacity 0.3s ease; opacity: 0;';
document.body.appendChild(cursorGlow);

var cursorTimeout;
document.addEventListener('mousemove', function(e) {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
    cursorGlow.style.opacity = '1';
    
    clearTimeout(cursorTimeout);
    cursorTimeout = setTimeout(function() {
        cursorGlow.style.opacity = '0';
    }, 1000);
});

// =========================================
// STAGGERED REVEAL ANIMATIONS
// =========================================

// Problem Cards
var problemCards = document.querySelectorAll('.problem-card');
problemCards.forEach(function(card) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
});

if (problemCards.length > 0) {
    var problemGrid = problemCards[0].closest('.problem-grid');
    if (problemGrid) {
        var problemObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    problemCards.forEach(function(card, index) {
                        setTimeout(function() {
                            card.style.transition = 'all 0.5s ease';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                    problemObserver.disconnect();
                }
            });
        }, { threshold: 0.2 });
        
        problemObserver.observe(problemGrid);
    }
}

// Feature Cards
var featureCards = document.querySelectorAll('.feature-card');
featureCards.forEach(function(card) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
});

if (featureCards.length > 0) {
    var featureGrid = featureCards[0].closest('.feature-grid');
    if (featureGrid) {
        var featureObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    featureCards.forEach(function(card, index) {
                        setTimeout(function() {
                            card.style.transition = 'all 0.5s ease';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 80);
                    });
                    featureObserver.disconnect();
                }
            });
        }, { threshold: 0.2 });
        
        featureObserver.observe(featureGrid);
    }
}

// Table Rows
var tableRows = document.querySelectorAll('.stock-table tbody tr');
tableRows.forEach(function(row) {
    row.style.opacity = '0';
    row.style.transform = 'translateX(-20px)';
});

if (tableRows.length > 0) {
    var table = tableRows[0].closest('table');
    if (table) {
        var tableObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    tableRows.forEach(function(row, index) {
                        setTimeout(function() {
                            row.style.transition = 'all 0.4s ease';
                            row.style.opacity = '1';
                            row.style.transform = 'translateX(0)';
                        }, index * 80);
                    });
                    tableObserver.disconnect();
                }
            });
        }, { threshold: 0.2 });
        
        tableObserver.observe(table);
    }
}

// Timing Cards
var timingCards = document.querySelectorAll('.timing-card');
timingCards.forEach(function(card) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
});

if (timingCards.length > 0) {
    var timingGrid = timingCards[0].closest('.timing-grid');
    if (timingGrid) {
        var timingObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    timingCards.forEach(function(card, index) {
                        setTimeout(function() {
                            card.style.transition = 'all 0.4s ease';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 60);
                    });
                    timingObserver.disconnect();
                }
            });
        }, { threshold: 0.2 });
        
        timingObserver.observe(timingGrid);
    }
}

// Investor Cards
var investorCards = document.querySelectorAll('.investor-card');
investorCards.forEach(function(card) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
});

if (investorCards.length > 0) {
    var investorGrid = investorCards[0].closest('.investor-grid');
    if (investorGrid) {
        var investorObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    investorCards.forEach(function(card, index) {
                        setTimeout(function() {
                            card.style.transition = 'all 0.4s ease';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 60);
                    });
                    investorObserver.disconnect();
                }
            });
        }, { threshold: 0.2 });
        
        investorObserver.observe(investorGrid);
    }
}

// Story Phases Animation
var storyPhases = document.querySelectorAll('.story-phase');
storyPhases.forEach(function(phase) {
    phase.style.opacity = '0';
    phase.style.transform = 'translateX(-20px)';
});

if (storyPhases.length > 0) {
    var storyTimeline = storyPhases[0].closest('.story-timeline');
    if (storyTimeline) {
        var storyObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    storyPhases.forEach(function(phase, index) {
                        setTimeout(function() {
                            phase.style.transition = 'all 0.5s ease';
                            phase.style.opacity = '1';
                            phase.style.transform = 'translateX(0)';
                        }, index * 200);
                    });
                    storyObserver.disconnect();
                }
            });
        }, { threshold: 0.3 });
        
        storyObserver.observe(storyTimeline);
    }
}

// Transparency Cards Animation
var transCards = document.querySelectorAll('.trans-card');
transCards.forEach(function(card) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
});

if (transCards.length > 0) {
    var transGrid = transCards[0].closest('.transparency-grid');
    if (transGrid) {
        var transObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    transCards.forEach(function(card, index) {
                        setTimeout(function() {
                            card.style.transition = 'all 0.4s ease';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                    transObserver.disconnect();
                }
            });
        }, { threshold: 0.2 });
        
        transObserver.observe(transGrid);
    }
}

// =========================================
// PRICE COUNTER ANIMATION
// =========================================
var priceAmount = document.querySelector('.price-now .amount');
if (priceAmount) {
    var priceObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var targetNum = 199;
                var currentNum = 0;
                
                var interval = setInterval(function() {
                    currentNum += Math.ceil((targetNum - currentNum) / 10);
                    if (currentNum >= targetNum) {
                        currentNum = targetNum;
                        clearInterval(interval);
                    }
                    priceAmount.innerHTML = currentNum + '<span class="decimal">.000</span>';
                }, 30);
                
                priceObserver.disconnect();
            }
        });
    }, { threshold: 0.5 });
    
    priceObserver.observe(priceAmount);
}

console.log('%c All desktop animations loaded! ', 'color: #5fb584; font-size: 10px;');

} // End desktop check