/**
 * Johnny G Rapture Mobile Detailing — Main Script
 */

(function () {
  'use strict';

  /* =====================================================
     1. STICKY HEADER
     ===================================================== */
  const header = document.getElementById('site-header');

  function handleHeaderScroll() {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll(); // run once on load

  /* =====================================================
     2. MOBILE NAVIGATION TOGGLE
     ===================================================== */
  const navToggle = document.getElementById('nav-toggle');
  const navLinks  = document.getElementById('nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      // Prevent body scroll when menu is open
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close nav when a link is clicked
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close nav on outside click
    document.addEventListener('click', function (e) {
      if (!header.contains(e.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* =====================================================
     3. ACTIVE NAV LINK ON SCROLL
     ===================================================== */
  const sections = document.querySelectorAll('section[id], div[id]');
  const allNavLinks = document.querySelectorAll('.nav-link');

  function setActiveLink() {
    let current = '';
    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 80) - 10;
      if (window.scrollY >= sectionTop) {
        current = section.id;
      }
    });

    allNavLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', setActiveLink, { passive: true });

  /* =====================================================
     4. SCROLL REVEAL ANIMATIONS
     ===================================================== */
  const revealTargets = [
    '.service-card',
    '.testimonial-card',
    '.gallery-item',
    '.why-us-list li',
    '.contact-details li',
    '.section-header',
    '.why-us-image',
    '.why-us-content',
    '.contact-info',
    '.contact-form',
    '.services-cta',
  ];

  const allRevealEls = document.querySelectorAll(revealTargets.join(','));

  allRevealEls.forEach(function (el) {
    el.classList.add('reveal');
  });

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    allRevealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show everything immediately
    allRevealEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* =====================================================
     5. BACK TO TOP BUTTON
     ===================================================== */
  const backToTopBtn = document.getElementById('back-to-top');

  if (backToTopBtn) {
    function handleBackToTop() {
      if (window.scrollY > 500) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    window.addEventListener('scroll', handleBackToTop, { passive: true });

    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* =====================================================
     6. CONTACT FORM HANDLER
     ===================================================== */
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  if (contactForm && formSuccess) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name    = contactForm.querySelector('#name');
      const phone   = contactForm.querySelector('#phone');
      const submitBtn = contactForm.querySelector('button[type="submit"]');

      // Basic validation
      let valid = true;
      [name, phone].forEach(function (field) {
        if (!field.value.trim()) {
          field.style.borderColor = '#f87171';
          valid = false;
        } else {
          field.style.borderColor = '';
        }
      });

      if (!valid) {
        formSuccess.className = 'form-success error';
        formSuccess.textContent = 'Please fill in all required fields (Name and Phone).';
        return;
      }

      // Simulate submission
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      setTimeout(function () {
        formSuccess.className = 'form-success success';
        formSuccess.innerHTML = '&#10003; Thank you! We\'ve received your request and will contact you shortly to confirm your appointment.';
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Request <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';

        // Auto-hide success message after 8 seconds
        setTimeout(function () {
          formSuccess.className = 'form-success';
          formSuccess.textContent = '';
        }, 8000);
      }, 1200);
    });

    // Clear field error highlight on input
    contactForm.querySelectorAll('input, select, textarea').forEach(function (field) {
      field.addEventListener('input', function () {
        this.style.borderColor = '';
      });
    });
  }

  /* =====================================================
     7. DYNAMIC FOOTER YEAR
     ===================================================== */
  const yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* =====================================================
     8. SMOOTH ANCHOR SCROLL (with header offset)
     ===================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const headerHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--header-h')
      ) || 72;

      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });

})();
