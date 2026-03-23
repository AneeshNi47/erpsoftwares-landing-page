/* ==========================================
   BROCODE SOLUTIONS — Main JavaScript
   Pure Vanilla JS (No React / No Framework)
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Navbar scroll effect ---- */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });
  }

  /* ---- Mobile menu toggle ---- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open);
    });
    mobileMenu.querySelectorAll('a').forEach(link =>
      link.addEventListener('click', () => mobileMenu.classList.remove('open'))
    );
  }

  /* ---- Smooth scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---- Animate on scroll ---- */
  const animEls = document.querySelectorAll('.animate-in');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    animEls.forEach(el => io.observe(el));
  } else {
    animEls.forEach(el => el.classList.add('visible'));
  }

  /* ================================================================
     MODAL — open on every [data-open-form] button click
  ================================================================ */
  const modal   = document.getElementById('consult-modal');
  const modalCard = document.getElementById('modal-card');
  const closeBtn  = document.getElementById('modal-close');
  const modalForm = document.getElementById('modal-form');
  const modalFormView    = document.getElementById('modal-form-view');
  const modalSuccessView = document.getElementById('modal-success-view');
  const modalCountdownEl = document.getElementById('modal-countdown');
  const modalSubmitBtn   = document.getElementById('modal-submit-btn');

  function openModal() {
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // scroll modal to top
    if (modalCard) modalCard.scrollTop = 0;
    // reset to form view
    showModalForm();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function showModalForm() {
    if (modalFormView)    modalFormView.style.display = '';
    if (modalSuccessView) modalSuccessView.style.display = 'none';
  }

  function showModalSuccess() {
    if (modalFormView)    modalFormView.style.display = 'none';
    if (modalSuccessView) modalSuccessView.style.display = '';
    let count = 5;
    if (modalCountdownEl) modalCountdownEl.textContent = count;
    const t = setInterval(() => {
      count--;
      if (modalCountdownEl) modalCountdownEl.textContent = count;
      if (count <= 0) {
        clearInterval(t);
        window.location.href = 'https://brocodesolutions.com/solutions';
      }
    }, 1000);
  }

  // All CTA buttons open modal
  document.querySelectorAll('[data-open-form]').forEach(btn =>
    btn.addEventListener('click', openModal)
  );

  // Close on X button
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Close on overlay click (outside card)
  if (modal) {
    modal.addEventListener('click', e => {
      if (e.target === modal) closeModal();
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  /* ---- Modal form submission ---- */
  if (modalForm) {
    modalForm.addEventListener('submit', async e => {
      e.preventDefault();
      if (!modalSubmitBtn) return;
      const btnText    = modalSubmitBtn.querySelector('.btn-text');
      const btnSpinner = modalSubmitBtn.querySelector('.spinner');

      modalSubmitBtn.disabled = true;
      if (btnText)    btnText.style.display = 'none';
      if (btnSpinner) btnSpinner.style.display = 'block';

      const data = {
        name:        modalForm.querySelector('#m-name')?.value  || '',
        title:       modalForm.querySelector('#m-title')?.value || '',
        email:       modalForm.querySelector('#m-email')?.value || '',
        mobile:      modalForm.querySelector('#m-mobile')?.value || '',
        company:     modalForm.querySelector('#m-company')?.value || '',
        website:     modalForm.querySelector('#m-website')?.value || '',
        industry:    modalForm.querySelector('#m-industry')?.value || '',
        companySize: modalForm.querySelector('#m-size')?.value  || '',
        location:    modalForm.querySelector('#m-location')?.value || '',
        hasERP:      modalForm.querySelector('input[name="m-hasERP"]:checked')?.value || '',
        requirements: modalForm.querySelector('#m-requirements')?.value || '',
      };

      try {
        await fetch('https://rapid-queen-4e0d.brocode-solutions.workers.dev', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      } catch (_) { /* still show success */ }

      modalSubmitBtn.disabled = false;
      if (btnText)    btnText.style.display = 'block';
      if (btnSpinner) btnSpinner.style.display = 'none';
      showModalSuccess();
    });
  }

  /* ================================================================
     Inline contact form (on the page) — also submits to API
  ================================================================ */
  const inlineForm = document.getElementById('contact-form');
  if (inlineForm) {
    inlineForm.addEventListener('submit', async e => {
      e.preventDefault();
      const submitBtn  = inlineForm.querySelector('.btn-submit');
      const btnText    = submitBtn?.querySelector('.btn-text');
      const btnSpinner = submitBtn?.querySelector('.spinner');

      if (submitBtn)  submitBtn.disabled = true;
      if (btnText)    btnText.style.display = 'none';
      if (btnSpinner) btnSpinner.style.display = 'block';

      const data = {
        name:        inlineForm.querySelector('#name')?.value || '',
        title:       inlineForm.querySelector('#title')?.value || '',
        email:       inlineForm.querySelector('#email')?.value || '',
        mobile:      inlineForm.querySelector('#mobile')?.value || '',
        company:     inlineForm.querySelector('#company')?.value || '',
        website:     inlineForm.querySelector('#website')?.value || '',
        industry:    inlineForm.querySelector('#industry')?.value || '',
        companySize: inlineForm.querySelector('#companySize')?.value || '',
        location:    inlineForm.querySelector('#location')?.value || '',
        hasERP:      inlineForm.querySelector('input[name="hasERP"]:checked')?.value || '',
        requirements: inlineForm.querySelector('#requirements')?.value || '',
      };

      try {
        await fetch('https://rapid-queen-4e0d.brocode-solutions.workers.dev', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      } catch (_) {}

      if (submitBtn)  submitBtn.disabled = false;
      if (btnText)    btnText.style.display = 'block';
      if (btnSpinner) btnSpinner.style.display = 'none';

      // Show inline success overlay
      const overlay = document.getElementById('success-overlay');
      if (overlay) {
        overlay.classList.add('show');
        const cd = document.getElementById('countdown');
        let count = 5;
        if (cd) cd.textContent = count;
        const t = setInterval(() => {
          count--;
          if (cd) cd.textContent = count;
          if (count <= 0) {
            clearInterval(t);
            window.location.href = 'https://brocodesolutions.com/solutions';
          }
        }, 1000);
      }
    });
  }

});
