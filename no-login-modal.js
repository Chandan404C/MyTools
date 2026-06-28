/**
 * no-login-modal.js
 * Auto-injects a "no login needed" modal and wires every
 * .btn-pill and .gradient-btn navbar button that has href="#"
 * to open it instead of doing nothing.
 *
 * Include ONCE before </body> on every page.
 */
(function () {
  'use strict';

  /* ── 1. Inject modal HTML ─────────────────────────────────── */
  const modalHTML = `
  <div id="nlModal" class="nl-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="nlModalTitle">
    <div class="nl-modal-box">
      <button class="nl-modal-close" id="nlModalClose" aria-label="Close">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>

      <div class="nl-modal-icon">🚀</div>

      <p class="nl-modal-title" id="nlModalTitle">No Login Needed!</p>
      <p class="nl-modal-sub">
        All DocFixer tools are <strong>100% free</strong> and work instantly in your browser —
        no account, no sign-up, no password. Ever.
      </p>

      <div class="nl-modal-pills">
        <span class="nl-pill">✅ Always Free</span>
        <span class="nl-pill">🔒 100% Private</span>
        <span class="nl-pill">⚡ No Signup</span>
        <span class="nl-pill">💻 Browser-Based</span>
      </div>

      <a href="tools.html" class="nl-modal-btn">
        🛠️ &nbsp;Start Using Free Tools →
      </a>
      <p class="nl-modal-note">Your files never leave your device. Zero data collected.</p>
    </div>
  </div>`;

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  /* ── 2. References ────────────────────────────────────────── */
  const overlay  = document.getElementById('nlModal');
  const closeBtn = document.getElementById('nlModalClose');

  /* ── 3. Open / Close helpers ──────────────────────────────── */
  function openModal() {
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeModal() {
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  /* ── 4. Wire login & signup buttons ──────────────────────── */
  // Targets: any <a href="#"> that contains "Log in" or "Sign up" text
  document.querySelectorAll('a[href="#"]').forEach(function (el) {
    const text = el.textContent.trim().toLowerCase();
    if (text.includes('log in') || text.includes('sign up') || text.includes('login') || text.includes('signup')) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        openModal();
      });
    }
  });

  /* ── 5. Close on button / backdrop / Escape ───────────────── */
  closeBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('show')) closeModal();
  });

})();
