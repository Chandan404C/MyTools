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

  /* ── 6. Rate Us Modal ─────────────────────────────────────── */
  const rateUsHTML = `
  <div id="rateUsModal" class="nl-modal-overlay" role="dialog" aria-modal="true">
    <div class="nl-modal-box" style="max-width: 400px; padding: 2rem;">
      <button class="nl-modal-close" id="rateUsModalClose" aria-label="Close">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>

      <div id="rateUsContent">
        <div class="nl-modal-icon" style="font-size: 2.5rem; margin-bottom: 10px;">⭐</div>
        <p class="nl-modal-title" style="font-size: 1.4rem; margin-bottom: 5px;">Rate Your Experience</p>
        <p class="nl-modal-sub" style="margin-bottom: 20px;">How did this tool work for you?</p>
        
        <form id="rateUsForm" style="text-align: left;">
          <div class="mb-3 text-center" id="starRatingContainer" style="font-size: 2.2rem; color: #ddd; cursor: pointer;">
            <i class="bi bi-star-fill rate-star" data-value="1" style="transition: color 0.2s;"></i>
            <i class="bi bi-star-fill rate-star" data-value="2" style="transition: color 0.2s;"></i>
            <i class="bi bi-star-fill rate-star" data-value="3" style="transition: color 0.2s;"></i>
            <i class="bi bi-star-fill rate-star" data-value="4" style="transition: color 0.2s;"></i>
            <i class="bi bi-star-fill rate-star" data-value="5" style="transition: color 0.2s;"></i>
          </div>
          <input type="hidden" id="rateValue" name="rating" value="0">
          
          <div class="mb-3">
            <label class="form-label text-secondary small fw-bold mb-1">Name</label>
            <input type="text" class="form-control p-2" required placeholder="John Doe" style="border-radius: 8px; border: 1px solid #cde0f2;">
          </div>
          <div class="mb-3">
            <label class="form-label text-secondary small fw-bold mb-1">Email (Optional)</label>
            <input type="email" class="form-control p-2" placeholder="john@example.com" style="border-radius: 8px; border: 1px solid #cde0f2;">
          </div>
          <div class="mb-3">
            <label class="form-label text-secondary small fw-bold mb-1">Comment</label>
            <textarea class="form-control p-2" required rows="2" placeholder="Tell us what you think..." style="border-radius: 8px; border: 1px solid #cde0f2;"></textarea>
          </div>
          <button type="submit" class="w-100 mt-2" style="background: #215f8a; color: white; padding: 0.8rem; border-radius: 12px; font-weight: 700; border: none; cursor: pointer; transition: 0.2s;">Submit Rating</button>
        </form>
      </div>

      <div id="rateUsSuccess" style="display: none; text-align: center; padding: 30px 0;">
        <div style="font-size: 3rem; margin-bottom: 15px;">🎉</div>
        <h4 style="color: #215f8a; font-weight: 700; margin-bottom: 10px;">Thank You!</h4>
        <p class="text-secondary">Your feedback helps us improve.</p>
      </div>
    </div>
  </div>`;

  document.body.insertAdjacentHTML('beforeend', rateUsHTML);

  const rateOverlay = document.getElementById('rateUsModal');
  const rateCloseBtn = document.getElementById('rateUsModalClose');
  const rateForm = document.getElementById('rateUsForm');
  const stars = document.querySelectorAll('.rate-star');
  const rateInput = document.getElementById('rateValue');
  
  let hasRated = false;

  function openRateModal(bypassGuard) {
    if (!bypassGuard && hasRated) return;
    // Reset form to initial state if opening manually after a previous submission
    if (bypassGuard && hasRated) {
      document.getElementById('rateUsContent').style.display = '';
      document.getElementById('rateUsSuccess').style.display = 'none';
      rateForm.reset();
      rateInput.value = '0';
      stars.forEach(s => s.style.color = '#ddd');
      const submitBtn = rateForm.querySelector('button[type="submit"]');
      submitBtn.innerText = 'Submit Rating';
      submitBtn.disabled = false;
      hasRated = false;
    }
    rateOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  // Expose globally for floating widget
  window.openRateUsModal = function() { openRateModal(true); };

  function closeRateModal() {
    rateOverlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  rateCloseBtn.addEventListener('click', closeRateModal);
  rateOverlay.addEventListener('click', function(e) {
    if (e.target === rateOverlay) closeRateModal();
  });
  
  // Star rating logic
  stars.forEach(star => {
    star.addEventListener('click', function() {
      const val = parseInt(this.getAttribute('data-value'));
      rateInput.value = val;
      stars.forEach(s => {
        if (parseInt(s.getAttribute('data-value')) <= val) {
          s.style.color = '#ffc107'; // Yellow
        } else {
          s.style.color = '#ddd'; // Gray
        }
      });
    });
    // Hover effects
    star.addEventListener('mouseover', function() {
      const val = parseInt(this.getAttribute('data-value'));
      stars.forEach(s => {
        if (parseInt(s.getAttribute('data-value')) <= val) {
          s.style.color = '#ffc107';
        } else {
          s.style.color = '#ddd';
        }
      });
    });
    star.addEventListener('mouseout', function() {
      const currentVal = parseInt(rateInput.value);
      stars.forEach(s => {
        if (parseInt(s.getAttribute('data-value')) <= currentVal) {
          s.style.color = '#ffc107';
        } else {
          s.style.color = '#ddd';
        }
      });
    });
  });

  // Handle form submission
  rateForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    if (rateInput.value === "0") {
      alert("Please select a star rating.");
      return;
    }
    
    const submitBtn = rateForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerText;
    submitBtn.innerText = "Submitting...";
    submitBtn.disabled = true;

    const emailVal = rateForm.querySelector('input[type="email"]').value.trim();
    const commentsVal = rateForm.querySelector('textarea').value.trim();

    const payload = {
      name: rateForm.querySelector('input[type="text"]').value.trim(),
      email: emailVal !== "" ? emailVal : null,
      rating: parseInt(rateInput.value),
      comments: commentsVal !== "" ? commentsVal : null
    };

    try {
      const response = await fetch('https://docfixerapi2.runasp.net/api/Review/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.warn('API returned non-OK status:', response.status, errorText);
        
        // Re-enable button on error so they can try again if they want
        submitBtn.innerText = "Submit Rating";
        submitBtn.disabled = false;
        return; // Don't show success message
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      // Let it pass through to success screen on network error for good UX, or revert:
      submitBtn.innerText = "Submit Rating";
      submitBtn.disabled = false;
      return; 
    }

    hasRated = true;
    document.getElementById('rateUsContent').style.display = 'none';
    document.getElementById('rateUsSuccess').style.display = 'block';
    setTimeout(closeRateModal, 2500);
  });

  // Show modal on download action
  document.addEventListener('click', function(e) {
    const downloadBtn = e.target.closest('.btn-download') || e.target.closest('a[download]');
    if (downloadBtn) {
      setTimeout(openRateModal, 1500);
    }
  });

})();
