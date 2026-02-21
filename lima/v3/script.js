/**
 * ============================================================================
 * LIMAOS - EVENT OPERATING SYSTEM
 * Premium Edition - Award-Winning Standard
 * Version: 3.0 - Awwwards Quality
 * ============================================================================
 */

(function() {
  'use strict';

  // ========================================================================
  // ENHANCED CONFIGURATION
  // ========================================================================
  const CONFIG = {
    scrollRevealThreshold: 0.15,
    navbarScrollThreshold: 50,
    counterDuration: 2400,
    cursorGlowEnabled: true,
    tiltMaxRotation: 8,
    smoothScrollOffset: -80,
    parallaxStrength: 0.5,
    scrollLinkedAnimations: true,
    advancedAnimations: true,
    performanceMonitoring: true
  };

  // ========================================================================
  // ADVANCED UTILITIES
  // ========================================================================
  
  /**
   * Cubic Bezier easing functions for premium feel
   */
  const Easing = {
    easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    },
    easeOutQuint(t) {
      return 1 - Math.pow(1 - t, 5);
    },
    easeOutExpo(t) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    },
    easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    },
    easeOutElastic(t) {
      const c5 = (2 * Math.PI) / 4.5;
      return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c5) + 1;
    }
  };

  /**
   * Debounce with edge options
   */
  function debounce(func, wait = 100, immediate = false) {
    let timeout;
    return function(...args) {
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
      if (callNow) func.apply(this, args);
    };
  }

  /**
   * Throttle for scroll performance
   */
  function throttle(func, limit = 16) {
    let inThrottle, lastFunc, lastRan;
    return function(...args) {
      const context = this;
      if (!lastRan) {
        func.apply(context, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(() => {
          if (Date.now() - lastRan >= limit) {
            func.apply(context, args);
            lastRan = Date.now();
          }
        }, Math.max(limit - (Date.now() - lastRan), 0));
      }
    };
  }

  /**
   * RequestAnimationFrame wrapper
   */
  function requestFrame(callback) {
    return requestAnimationFrame(callback);
  }

  /**
   * Check mobile/touch
   */
  function isMobile() {
    return window.innerWidth <= 1024 || ('ontouchstart' in window && window.innerWidth <= 768);
  }

  // ========================================================================
  // DOM CACHE
  // ========================================================================
  const DOM = {
    navbar: document.getElementById('navbar'),
    menuToggle: document.getElementById('menuToggle'),
    cursorGlow: document.getElementById('cursorGlow'),
    scrollRevealElements: document.querySelectorAll('.scroll-reveal'),
    counters: document.querySelectorAll('[data-counter]'),
    tiltElements: document.querySelectorAll('[data-tilt]'),
    parallaxElements: document.querySelectorAll('[data-parallax]'),
    anchorLinks: document.querySelectorAll('a[href^="#"]'),
    buttons: document.querySelectorAll('button, a.btn')
  };

  // ========================================================================
  // ENHANCED NAVBAR
  // ========================================================================
  const Navbar = {
    state: { scrolled: false, menuOpen: false },
    
    init() {
      this.setupListeners();
      this.handleScroll();
    },

    setupListeners() {
      window.addEventListener('scroll', throttle(() => this.handleScroll(), 16), { passive: true });
      if (DOM.menuToggle) {
        DOM.menuToggle.addEventListener('click', () => this.toggleMenu());
      }
    },

    handleScroll() {
      if (!DOM.navbar) return;
      const scrollY = window.scrollY;
      const shouldScroll = scrollY > CONFIG.navbarScrollThreshold;
      
      if (shouldScroll !== this.state.scrolled) {
        this.state.scrolled = shouldScroll;
        DOM.navbar.classList.toggle('scrolled', shouldScroll);
      }
    },

    toggleMenu() {
      this.state.menuOpen = !this.state.menuOpen;
      DOM.menuToggle.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    }
  };

  // ========================================================================
  // ADVANCED SCROLL REVEAL WITH STAGGER
  // ========================================================================
  const ScrollReveal = {
    observer: null,
    revealedElements: new Set(),

    init() {
      if (!('IntersectionObserver' in window)) {
        DOM.scrollRevealElements.forEach(el => el.classList.add('revealed'));
        return;
      }

      const options = {
        threshold: [0, CONFIG.scrollRevealThreshold],
        rootMargin: '0px 0px -80px 0px'
      };

      this.observer = new IntersectionObserver((entries) => this.handleIntersect(entries), options);
      DOM.scrollRevealElements.forEach(el => this.observer.observe(el));
    },

    handleIntersect(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.revealedElements.has(entry.target)) {
          this.revealedElements.add(entry.target);
          
          // Apply stagger to children if applicable
          const children = entry.target.querySelectorAll('[data-stagger]');
          if (children.length > 0) {
            children.forEach((child, index) => {
              child.style.transitionDelay = `${index * 0.08}s`;
            });
          }

          entry.target.classList.add('revealed');

          // Trigger counter if present
          const counter = entry.target.querySelector('[data-counter]');
          if (counter && !counter.dataset.animated) {
            requestFrame(() => CounterAnimation.animate(counter));
          }

          this.observer.unobserve(entry.target);
        }
      });
    }
  };

  // ========================================================================
  // PREMIUM COUNTER ANIMATION
  // ========================================================================
  const CounterAnimation = {
    animate(element) {
      const target = parseFloat(element.dataset.counter);
      const suffix = element.dataset.suffix || '';
      const prefix = element.dataset.prefix || '';
      const duration = CONFIG.counterDuration;
      const startTime = performance.now();
      
      element.dataset.animated = 'true';
      element.setAttribute('aria-live', 'polite');

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = Easing.easeOutQuint(progress);
        const currentValue = target * easedProgress;

        if (target % 1 !== 0) {
          element.textContent = prefix + currentValue.toFixed(1) + suffix;
        } else {
          element.textContent = prefix + Math.floor(currentValue) + suffix;
        }

        if (progress < 1) {
          requestFrame(updateCounter);
        } else {
          element.textContent = prefix + target + suffix;
        }
      };

      requestFrame(updateCounter);
    }
  };

  // ========================================================================
  // ADVANCED PARALLAX SCROLLING
  // ========================================================================
  const ParallaxScroll = {
    elements: [],

    init() {
      DOM.parallaxElements.forEach(el => {
        const strength = parseFloat(el.dataset.parallax) || CONFIG.parallaxStrength;
        this.elements.push({ el, strength, offset: 0 });
      });

      if (this.elements.length > 0) {
        window.addEventListener('scroll', throttle(() => this.update(), 16), { passive: true });
      }
    },

    update() {
      const scrollY = window.scrollY;
      this.elements.forEach(({ el, strength }) => {
        const offset = scrollY * strength;
        el.style.transform = `translateY(${offset}px)`;
      });
    }
  };

  // ========================================================================
  // SMOOTH ANIMATED CURSOR GLOW
  // ========================================================================
  const CursorGlow = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    rafId: null,
    active: false,

    init() {
      if (isMobile() || !CONFIG.cursorGlowEnabled || !DOM.cursorGlow) return;

      document.addEventListener('mousemove', (e) => this.onMouseMove(e), { passive: true });
      document.addEventListener('mouseleave', () => this.onMouseLeave());
      document.addEventListener('mouseenter', () => this.onMouseEnter());
      
      this.animate();
    },

    onMouseMove(e) {
      this.targetX = e.clientX;
      this.targetY = e.clientY;
    },

    onMouseLeave() {
      this.active = false;
      DOM.cursorGlow.classList.remove('active');
    },

    onMouseEnter() {
      this.active = true;
      DOM.cursorGlow.classList.add('active');
    },

    animate() {
      const ease = 0.08;
      this.x += (this.targetX - this.x) * ease;
      this.y += (this.targetY - this.y) * ease;

      DOM.cursorGlow.style.left = `${this.x}px`;
      DOM.cursorGlow.style.top = `${this.y}px`;

      this.rafId = requestFrame(() => this.animate());
    },

    destroy() {
      if (this.rafId) cancelAnimationFrame(this.rafId);
    }
  };

  // ========================================================================
  // ENHANCED 3D TILT EFFECT
  // ========================================================================
  const TiltEffect = {
    elements: [],

    init() {
      if (isMobile()) return;

      DOM.tiltElements.forEach(element => {
        this.elements.push(element);
        element.addEventListener('mouseenter', (e) => this.onEnter(e, element));
        element.addEventListener('mousemove', (e) => this.onMove(e, element));
        element.addEventListener('mouseleave', (e) => this.onLeave(e, element));
      });
    },

    onEnter(e, element) {
      element.style.transition = 'none';
    },

    onMove(e, element) {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const mouseX = (e.clientX - centerX) / (rect.width / 2);
      const mouseY = (e.clientY - centerY) / (rect.height / 2);

      const rotateX = -mouseY * CONFIG.tiltMaxRotation;
      const rotateY = mouseX * CONFIG.tiltMaxRotation;

      element.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
    },

    onLeave(e, element) {
      element.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.320, 1)';
      element.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }
  };

  // ========================================================================
  // SMOOTH SCROLL TO ANCHOR
  // ========================================================================
  const SmoothScroll = {
    init() {
      DOM.anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => this.handleClick(e, link));
      });
    },

    handleClick(e, link) {
      const href = link.getAttribute('href');
      if (href === '#' || !href.startsWith('#')) return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      
      const targetPosition = target.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = targetPosition + CONFIG.smoothScrollOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      if (document.body.classList.contains('menu-open')) {
        Navbar.toggleMenu();
      }
    }
  };

  // ========================================================================
  // LAZY LOAD IMAGES
  // ========================================================================
  const LazyLoad = {
    init() {
      const images = document.querySelectorAll('img[data-src]');
      
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              img.classList.add('loaded');
              imageObserver.unobserve(img);
            }
          });
        }, { rootMargin: '50px' });

        images.forEach(img => imageObserver.observe(img));
      } else {
        images.forEach(img => {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        });
      }
    }
  };

  // ========================================================================
  // PAGE VISIBILITY & PERFORMANCE
  // ========================================================================
  const PageVisibility = {
    init() {
      document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
    },

    handleVisibilityChange() {
      const hidden = document.hidden;
      document.body.classList.toggle('animations-paused', hidden);
      if (hidden) {
        CursorGlow.destroy();
      } else {
        CursorGlow.animate();
      }
    }
  };

  // ========================================================================
  // BUTTON RIPPLE EFFECT
  // ========================================================================
  const ButtonEffects = {
    init() {
      DOM.buttons.forEach(button => {
        button.addEventListener('click', (e) => this.createRipple(e, button));
      });
    },

    createRipple(e, button) {
      const ripple = document.createElement('span');
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple');

      button.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    }
  };

  // ========================================================================
  // RESIZE HANDLER
  // ========================================================================
  const ResizeHandler = {
    init() {
      window.addEventListener('resize', debounce(() => this.handleResize(), 250));
    },

    handleResize() {
      if (isMobile()) {
        CursorGlow.destroy();
        DOM.cursorGlow?.classList.remove('active');
      }
    }
  };

  // ========================================================================
  // PERFORMANCE MONITOR
  // ========================================================================
  const PerformanceMonitor = {
    init() {
      if (!CONFIG.performanceMonitoring) return;

      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0];
          if (perfData) {
            console.log(
              '%c⚡ LimaOS Premium Performance',
              'font-size: 14px; font-weight: bold; color: #06B6D4;'
            );
            console.log(`DOM: ${Math.round(perfData.domContentLoadedEventEnd)}ms`);
            console.log(`Load: ${Math.round(perfData.loadEventEnd)}ms`);
            console.log(`FCP: ${Math.round(perfData.responseEnd)}ms`);
          }
        }, 0);
      });
    }
  };

  // ========================================================================
  // EASTER EGG
  // ========================================================================
  const EasterEgg = {
    init() {
      console.log(
        '%c🎯 LimaOS Premium - Event Operating System',
        'font-size: 20px; font-weight: bold; color: #EC4899; text-shadow: 0 0 10px rgba(236,72,153,0.5);'
      );
      console.log(
        '%cBuilt with premium standards by Flexeet 🚀\n%cAWWWARDS QUALITY LEVEL',
        'font-size: 12px; color: #64748B;',
        'font-size: 11px; font-weight: bold; color: #14B8A6; text-shadow: 0 0 5px rgba(20,184,166,0.4);'
      );
    }
  };

  // ========================================================================
  // MAIN INITIALIZATION
  // ========================================================================
  function init() {
    // Core
    Navbar.init();
    ScrollReveal.init();
    SmoothScroll.init();

    // Visual enhancements
    ParallaxScroll.init();
    CursorGlow.init();
    TiltEffect.init();
    ButtonEffects.init();

    // Utilities
    LazyLoad.init();
    PageVisibility.init();
    ResizeHandler.init();
    PerformanceMonitor.init();
    EasterEgg.init();

    // Mark loaded
    document.body.classList.add('js-loaded');
  }

  // ========================================================================
  // DOM READY
  // ========================================================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
