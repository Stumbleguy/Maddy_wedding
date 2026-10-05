// ---------- 1. Gopuram doors open as the visitor scrolls past the hero ----------
(function () {
  const hero = document.getElementById('hero');
  const wrap = document.getElementById('gopuramWrap');
  const cue = document.getElementById('scrollCue');
  if (!hero || !wrap) return;

  let opened = false;

  function checkScroll() {
    const scrolled = window.scrollY;
    const triggerPoint = window.innerHeight * 0.25;

    if (scrolled > triggerPoint && !opened) {
      wrap.classList.add('is-open');
      cue && cue.classList.add('hide');
      opened = true;
    } else if (scrolled <= triggerPoint && opened) {
      wrap.classList.remove('is-open');
      cue && cue.classList.remove('hide');
      opened = false;
    }
  }

  window.addEventListener('scroll', checkScroll, { passive: true });
  checkScroll();
})();

// ---------- 2. Reveal sections as they enter the viewport ----------
(function () {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || items.length === 0) {
    items.forEach(i => i.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach(item => observer.observe(item));
})();

// ---------- 3. RSVP form: submit via Formspree (or any endpoint you set in the
//              form's action=""), with an inline confirmation message ----------
(function () {
  const form = document.getElementById('rsvpForm');
  const status = document.getElementById('rsvpStatus');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const checked = form.querySelectorAll('input[name="events"]:checked');
    if (checked.length === 0) {
      status.textContent = 'Please select at least one event you\'ll attend.';
      status.style.color = '#8a1c1c';
      return;
    }

    const submitBtn = form.querySelector('.submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });

      if (response.ok) {
        form.reset();
        status.textContent = 'Thank you! Your RSVP has been received.';
        status.style.color = '#2f6b2f';
        submitBtn.textContent = 'Submitted';
      } else {
        throw new Error('Form endpoint rejected the submission');
      }
    } catch (err) {
      status.textContent = 'Something went wrong. Please try again, or reach out to us directly.';
      status.style.color = '#8a1c1c';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit RSVP';
    }
  });
})();
