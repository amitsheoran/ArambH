/* ═══════════════════════════════════════════════════════════════
   ARAMBH AUTISM CENTRE — JavaScript
   Mobile menu, contact form to WhatsApp, scroll animations, gallery
   ═══════════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  // ━━━ CONFIG — change these in one place ━━━
  const CONFIG = {
    whatsappNumber: '919455920030',  // CHANGE THIS to actual number (with country code, no + or spaces)
    formIntroLine: 'Hello Arambh Autism Centre!',
    formOutroLine: 'Looking forward to your response.\nVia: arambhautismcentre.in'
  };

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     1. MOBILE NAVIGATION
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const overlay = document.querySelector('.mobile-nav-overlay');

    if (!hamburger || !mobileNav) return;

    function toggle(open) {
      const isOpen = open !== undefined ? open : !mobileNav.classList.contains('open');
      hamburger.classList.toggle('active', isOpen);
      mobileNav.classList.toggle('open', isOpen);
      if (overlay) overlay.classList.toggle('show', isOpen);
      document.body.classList.toggle('no-scroll', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    }

    hamburger.addEventListener('click', () => toggle());
    if (overlay) overlay.addEventListener('click', () => toggle(false));

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => toggle(false));
    });

    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) toggle(false);
    });
  }


  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     2. STICKY HEADER ON SCROLL
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  function initStickyHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    let ticking = false;
    function updateHeader() {
      header.classList.toggle('scrolled', window.scrollY > 24);
      ticking = false;
    }
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });
  }


  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     3. ACTIVE NAV LINK
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  function initActiveNav() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.main-nav a, .mobile-nav a').forEach(link => {
      const href = link.getAttribute('href');
      if (!href || link.classList.contains('btn')) return;
      if (href === path || (path === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }


  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     4. SCROLL FADE-IN ANIMATIONS
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  function initScrollAnimations() {
    // Add js-fade class to html so fade-in elements get hidden initial state
    document.documentElement.classList.add('js-fade');

    const elements = document.querySelectorAll('.fade-in');
    if (!elements.length || !('IntersectionObserver' in window)) {
      elements.forEach(el => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(el => observer.observe(el));

    // Safety net: after 4 seconds, force-show any remaining hidden elements
    // (covers users who scrolled past quickly, headless browsers, screen readers)
    setTimeout(() => {
      document.querySelectorAll('.fade-in:not(.visible)').forEach(el => {
        el.classList.add('visible');
      });
    }, 4000);
  }


  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     5. CONTACT FORM → WHATSAPP
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    function showError(group) { group.classList.add('error'); }
    function clearErrors() {
      form.querySelectorAll('.form-group.error').forEach(g => g.classList.remove('error'));
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();
      let valid = true;

      // Helpers
      const getEl = (id) => form.querySelector('#' + id);
      const getGroup = (id) => getEl(id) ? getEl(id).closest('.form-group') : null;

      // Name
      const name = getEl('name');
      if (!name || !name.value.trim() || name.value.trim().length < 2) {
        showError(getGroup('name')); valid = false;
      }

      // Phone (Indian friendly: 10-15 digits, allow +/space/dash/parens)
      const phone = getEl('phone');
      const phoneVal = phone ? phone.value.trim() : '';
      if (!phoneVal || !/^[\d\s+\-()]{10,15}$/.test(phoneVal)) {
        showError(getGroup('phone')); valid = false;
      }

      // Email (optional but if provided must be valid)
      const email = getEl('email');
      if (email && email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        showError(getGroup('email')); valid = false;
      }

      // Child age (optional - dropdown values are passed through as-is)
      // No validation needed since values come from the select options

      // Service selection (required if marked)
      const service = getEl('service');
      if (service && service.hasAttribute('required') && !service.value) {
        showError(getGroup('service')); valid = false;
      }
      // Message
      const message = getEl('message');
      if (!message || !message.value.trim() || message.value.trim().length < 10) {
        showError(getGroup('message')); valid = false;
      }

      if (!valid) {
        const firstError = form.querySelector('.form-group.error');
        if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      // Build WhatsApp message
      const lines = [CONFIG.formIntroLine, ''];
      lines.push("I'd like to enquire about your services.");
      lines.push('');
      lines.push('━━━━━━━━━━━━━━━━━━━━');
      lines.push('Name: ' + name.value.trim());
      if (phoneVal) lines.push('Phone: ' + phoneVal);
      if (email && email.value.trim()) lines.push('Email: ' + email.value.trim());
      const childAge = getEl('childAge');
      if (childAge && childAge.value.trim()) lines.push("Child's Age: " + childAge.value.trim());
      if (service && service.value) lines.push('Service Interested In: ' + service.value);
      lines.push('');
      lines.push('Message:');
      lines.push(message.value.trim());
      lines.push('━━━━━━━━━━━━━━━━━━━━');
      lines.push('');
      lines.push(CONFIG.formOutroLine);

      const text = encodeURIComponent(lines.join('\n'));
      const url = 'https://wa.me/' + CONFIG.whatsappNumber + '?text=' + text;

      // Open WhatsApp
      window.open(url, '_blank', 'noopener');

      // Show success state
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        const original = submitBtn.innerHTML;
        submitBtn.innerHTML = '✓ Message Sent - Opening WhatsApp...';
        submitBtn.disabled = true;
        setTimeout(() => {
          submitBtn.innerHTML = original;
          submitBtn.disabled = false;
          form.reset();
        }, 3500);
      }
    });

    // Clear errors on input
    form.querySelectorAll('input, select, textarea').forEach(input => {
      input.addEventListener('input', () => {
        const group = input.closest('.form-group');
        if (group) group.classList.remove('error');
      });
      input.addEventListener('change', () => {
        const group = input.closest('.form-group');
        if (group) group.classList.remove('error');
      });
    });
  }


  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     6. CURRENT YEAR IN FOOTER
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  function initFooterYear() {
    document.querySelectorAll('[data-year]').forEach(el => {
      el.textContent = new Date().getFullYear();
    });
  }


  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     7. GALLERY LIGHTBOX (simple)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  function initGalleryLightbox() {
    const items = document.querySelectorAll('.gallery-item');
    if (!items.length) return;

    // Build lightbox dynamically
    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML = `
      <button class="lightbox-close" aria-label="Close">&times;</button>
      <button class="lightbox-prev" aria-label="Previous">&#10094;</button>
      <img alt="" />
      <button class="lightbox-next" aria-label="Next">&#10095;</button>
    `;
    document.body.appendChild(lb);

    // Inject lightbox styles
    const style = document.createElement('style');
    style.textContent = `
      .lightbox {
        position: fixed; inset: 0;
        background: rgba(0, 0, 0, 0.9);
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 1100;
        padding: 1rem;
      }
      .lightbox.active { display: flex; }
      .lightbox img {
        max-width: 90vw;
        max-height: 85vh;
        border-radius: 12px;
      }
      .lightbox button {
        position: absolute;
        background: rgba(255,255,255,0.1);
        color: white;
        width: 50px; height: 50px;
        border-radius: 50%;
        font-size: 1.5rem;
        cursor: pointer;
        backdrop-filter: blur(8px);
        transition: background 0.2s;
      }
      .lightbox button:hover { background: rgba(255,255,255,0.2); }
      .lightbox-close { top: 20px; right: 20px; font-size: 2rem; }
      .lightbox-prev { left: 20px; }
      .lightbox-next { right: 20px; }
      @media (max-width: 600px) {
        .lightbox-prev, .lightbox-next { width: 40px; height: 40px; }
      }
    `;
    document.head.appendChild(style);

    const img = lb.querySelector('img');
    const closeBtn = lb.querySelector('.lightbox-close');
    const prevBtn = lb.querySelector('.lightbox-prev');
    const nextBtn = lb.querySelector('.lightbox-next');
    let currentIdx = 0;

    function open(idx) {
      currentIdx = idx;
      const sourceImg = items[idx].querySelector('img');
      img.src = sourceImg.src;
      img.alt = sourceImg.alt;
      lb.classList.add('active');
      document.body.classList.add('no-scroll');
    }
    function close() {
      lb.classList.remove('active');
      document.body.classList.remove('no-scroll');
    }
    function prev() {
      currentIdx = (currentIdx - 1 + items.length) % items.length;
      const i = items[currentIdx].querySelector('img');
      img.src = i.src; img.alt = i.alt;
    }
    function next() {
      currentIdx = (currentIdx + 1) % items.length;
      const i = items[currentIdx].querySelector('img');
      img.src = i.src; img.alt = i.alt;
    }

    items.forEach((item, idx) => item.addEventListener('click', () => open(idx)));
    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);
    lb.addEventListener('click', e => { if (e.target === lb) close(); });
    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('active')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    });
  }


  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     INIT ON DOM READY
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  function init() {
    initMobileNav();
    initStickyHeader();
    initActiveNav();
    initScrollAnimations();
    initContactForm();
    initFooterYear();
    initGalleryLightbox();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
