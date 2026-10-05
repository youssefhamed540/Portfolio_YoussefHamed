/**
 * ══════════════════════════════════════════════════════════════════════════
 * PORTFOLIO CLIENT SCRIPT: Youssef Hamed Mohamed Rezk
 * Machine Learning Student | Aspiring AI Engineer
 * Vanilla JavaScript (No frameworks, No backend required)
 * ══════════════════════════════════════════════════════════════════════════
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. INITIALIZE LUCIDE ICONS
     ========================================================================== */
  function refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }
  refreshIcons();

  /* ==========================================================================
     2. THEME MANAGEMENT (DARK / LIGHT MODE)
     ========================================================================== */
  const themeToggleBtn = document.getElementById('themeToggle');
  const htmlRoot = document.documentElement;

  // Retrieve saved theme or default to 'dark'
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  setTheme(savedTheme, false);

  function setTheme(theme, save = true) {
    htmlRoot.setAttribute('data-theme', theme);
    if (save) {
      localStorage.setItem('portfolio-theme', theme);
    }
    // Update canvas colors if canvas is active
    if (window.updateCanvasColors) {
      window.updateCanvasColors();
    }
    refreshIcons();
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme, true);
    });
  }

  /* ==========================================================================
     3. STICKY NAVBAR & SCROLL SHADOW
     ========================================================================== */
  const navbarHeader = document.querySelector('.navbar-header');
  const floatingBackToTop = document.getElementById('floatingBackToTop');

  function handleWindowScroll() {
    const scrollY = window.scrollY || window.pageYOffset;

    // Header sticky shadow
    if (scrollY > 30) {
      navbarHeader.classList.add('scrolled');
    } else {
      navbarHeader.classList.remove('scrolled');
    }

    // Floating Back to Top Button
    if (floatingBackToTop) {
      if (scrollY > 350) {
        floatingBackToTop.classList.add('visible');
      } else {
        floatingBackToTop.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', handleWindowScroll, { passive: true });
  handleWindowScroll(); // Initial check on load

  /* ==========================================================================
     4. MOBILE MENU DRAWER
     ========================================================================== */
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');
  const drawerBackdrop = document.getElementById('mobileDrawerBackdrop');
  const navLinks = document.querySelectorAll('.nav-link');

  function openMobileMenu() {
    mobileToggle.classList.add('active');
    mobileToggle.setAttribute('aria-expanded', 'true');
    navMenu.classList.add('open');
    drawerBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileToggle.classList.remove('active');
    mobileToggle.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('open');
    drawerBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', closeMobileMenu);
  }

  // Close mobile drawer upon clicking any navigation link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        closeMobileMenu();
      }
    });
  });

  // Close with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  /* ==========================================================================
     5. ACTIVE NAVIGATION SECTION INDICATOR (INTERSECTION OBSERVER)
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');

  const navObserverOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${currentId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, navObserverOptions);

  sections.forEach(sec => navObserver.observe(sec));

  /* ==========================================================================
     6. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
     ========================================================================== */
  const reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // Reveal only once for performance
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver not supported
    reveals.forEach(el => el.classList.add('revealed'));
  }

  /* ==========================================================================
     7. BACK TO TOP BUTTONS
     ========================================================================== */
  function scrollToHero() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  if (floatingBackToTop) {
    floatingBackToTop.addEventListener('click', scrollToHero);
  }

  const footerBackToTop = document.getElementById('footerBackToTop');
  if (footerBackToTop) {
    footerBackToTop.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToHero();
    });
  }

  /* ==========================================================================
     8. HERO TYPING EFFECT
     ========================================================================== */
  const typingElement = document.getElementById('typingText');
  const phrases = [
    "Machine Learning Student | Aspiring AI Engineer",
    "Predictive Modeling & Data Preprocessing",
    "End-to-End Supervised ML Pipelines",
    "Turning Real-World Data into Practical AI"
  ];

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (typingElement && !prefersReducedMotion) {
    let phraseIndex = 0;
    let charIndex = phrases[0].length;
    let isDeleting = true;
    let typingSpeed = 60;
    let delayBetweenPhrases = 2400;

    function typeLoop() {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 30;
      } else {
        typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 60;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        // Finished typing word, wait before deleting
        isDeleting = true;
        setTimeout(typeLoop, delayBetweenPhrases);
        return;
      } else if (isDeleting && charIndex === 0) {
        // Finished deleting, move to next phrase
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 200;
      }

      setTimeout(typeLoop, typingSpeed);
    }

    // Start typing cycle after initial pause so user reads initial text first
    setTimeout(() => {
      typeLoop();
    }, 2800);
  }

  /* ==========================================================================
     9. SUBTLE AI NEURAL PARTICLES BACKGROUND CANVAS
     ========================================================================== */
  const canvas = document.getElementById('neuralCanvas');
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let animationFrameId;
    let mouse = { x: null, y: null, radius: 120 };

    let nodeColor = 'rgba(56, 189, 248, 0.45)';
    let lineColor = 'rgba(99, 102, 241, 0.12)';

    window.updateCanvasColors = function() {
      const isDark = (htmlRoot.getAttribute('data-theme') || 'dark') === 'dark';
      nodeColor = isDark ? 'rgba(56, 189, 248, 0.45)' : 'rgba(2, 132, 199, 0.4)';
      lineColor = isDark ? 'rgba(99, 102, 241, 0.12)' : 'rgba(79, 70, 229, 0.08)';
    };
    window.updateCanvasColors();

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    }

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.radius = Math.random() * 1.5 + 1.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce gently at screen boundaries
        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;

        // Subtle mouse repulsion/interaction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= (dx / dist) * force * 1.2;
            this.y -= (dy / dist) * force * 1.2;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      // Adjust density for mobile vs desktop for optimal FPS
      const count = width < 768 ? 28 : Math.floor(width / 35);
      const safeCount = Math.min(count, 55);

      for (let i = 0; i < safeCount; i++) {
        particles.push(new Particle());
      }
    }

    function renderCanvas() {
      ctx.clearRect(0, 0, width, height);

      // Connect close nodes with faint edges
      const maxDistance = width < 768 ? 85 : 125;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 1 - dist / maxDistance;
            ctx.stroke();
          }
        }
      }

      // Update and draw nodes
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(renderCanvas);
    }

    window.addEventListener('resize', () => {
      resizeCanvas();
    });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Pause rendering when browser tab is inactive to preserve CPU / battery
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        renderCanvas();
      }
    });

    resizeCanvas();
    renderCanvas();
  }

  /* ==========================================================================
     10. COPY EMAIL BUTTON
     ========================================================================== */
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = copyEmailBtn.getAttribute('data-copy');
      const tooltip = copyEmailBtn.querySelector('.copy-tooltip');

      try {
        await navigator.clipboard.writeText(email);
        if (tooltip) {
          tooltip.classList.add('show');
          setTimeout(() => {
            tooltip.classList.remove('show');
          }, 2000);
        }
      } catch (err) {
        // Fallback prompt if clipboard API is restricted
        prompt('Copy this email address:', email);
      }
    });
  }

  /* ==========================================================================
     11. CONTACT FORM VALIDATION & HANDLING
     ========================================================================== */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatusMessage');

  if (contactForm) {
    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const subjectInput = document.getElementById('contactSubject');
    const messageInput = document.getElementById('contactMessage');

    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const subjectError = document.getElementById('subjectError');
    const messageError = document.getElementById('messageError');

    function validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(String(email).toLowerCase());
    }

    function clearErrors() {
      [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
        if (input) input.classList.remove('invalid');
      });
      [nameError, emailError, subjectError, messageError].forEach(err => {
        if (err) {
          err.textContent = '';
          err.classList.remove('visible');
        }
      });
    }

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();

      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        nameInput.classList.add('invalid');
        nameError.textContent = 'Please enter your name.';
        nameError.classList.add('visible');
        isValid = false;
      }

      // Validate Email
      if (!emailInput.value.trim()) {
        emailInput.classList.add('invalid');
        emailError.textContent = 'Please enter your email address.';
        emailError.classList.add('visible');
        isValid = false;
      } else if (!validateEmail(emailInput.value.trim())) {
        emailInput.classList.add('invalid');
        emailError.textContent = 'Please enter a valid email address.';
        emailError.classList.add('visible');
        isValid = false;
      }

      // Validate Subject
      if (!subjectInput.value.trim()) {
        subjectInput.classList.add('invalid');
        subjectError.textContent = 'Please enter a subject.';
        subjectError.classList.add('visible');
        isValid = false;
      }

      // Validate Message
      if (!messageInput.value.trim()) {
        messageInput.classList.add('invalid');
        messageError.textContent = 'Please enter your message.';
        messageError.classList.add('visible');
        isValid = false;
      }

      if (isValid) {
        // Display required confirmation message
        if (formStatus) {
          formStatus.style.display = 'flex';
          formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        // Reset inputs
        contactForm.reset();

        // Refresh icons inside status banner if any
        refreshIcons();

        // Hide success banner automatically after 6 seconds
        setTimeout(() => {
          if (formStatus) {
            formStatus.style.display = 'none';
          }
        }, 6000);
      }
    });

    // Remove inline error state on user typing
    [nameInput, emailInput, subjectInput, messageInput].forEach(field => {
      if (field) {
        field.addEventListener('input', () => {
          field.classList.remove('invalid');
          const errSpan = field.parentElement.querySelector('.field-error-message');
          if (errSpan) {
            errSpan.classList.remove('visible');
          }
        });
      }
    });
  }

  /* ==========================================================================
     12. SMOOTH SCROLLING FOR ALL ANCHOR LINKS
     ========================================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 76;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

});
