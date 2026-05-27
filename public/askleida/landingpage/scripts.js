// Extracted from index.html

// Reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Demo video tap-to-play
(function() {
  const video = document.getElementById('demo-video');
  const playBtn = document.getElementById('demo-play');
  const wrap = document.getElementById('demo-wrap');
  if (!video || !playBtn || !wrap) return;

  function play() {
    video.play().then(() => {
      playBtn.classList.add('is-hidden');
    }).catch(() => {
      video.muted = true;
      video.play();
      playBtn.classList.add('is-hidden');
    });
  }

  playBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    play();
  });

  wrap.addEventListener('click', () => {
    if (video.paused) play();
    else { video.pause(); playBtn.classList.remove('is-hidden'); }
  });

  video.addEventListener('ended', () => {
    playBtn.classList.remove('is-hidden');
  });

  video.addEventListener('pause', () => {
    if (!video.ended && video.currentTime > 0) {
      playBtn.classList.remove('is-hidden');
    }
  });
})();
(function() {
  const carousel = document.querySelector('.pdf-carousel');
  if (!carousel) return;

  const total = parseInt(carousel.dataset.total, 10);
  const pages = carousel.querySelectorAll('.pdf-page-img');
  const dots = carousel.querySelectorAll('.pdf-dot');
  const prevBtn = document.getElementById('pdf-prev');
  const nextBtn = document.getElementById('pdf-next');
  let current = 1;

  function goTo(n) {
    if (n < 1) n = total;
    if (n > total) n = 1;
    current = n;
    pages.forEach(img => {
      img.classList.toggle('is-active', parseInt(img.dataset.page, 10) === current);
    });
    dots.forEach(dot => {
      dot.classList.toggle('is-active', parseInt(dot.dataset.page, 10) === current);
    });
    carousel.dataset.current = current;
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));
  dots.forEach(dot => {
    dot.addEventListener('click', () => goTo(parseInt(dot.dataset.page, 10)));
  });

  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(current - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); }
  });

  const viewer = carousel.querySelector('.pdf-viewer');
  viewer.style.cursor = 'pointer';
  viewer.addEventListener('click', () => goTo(current + 1));

  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  let swipeHandled = false;
  const SWIPE_THRESHOLD = 40;

  viewer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
    swipeHandled = false;
  }, { passive: true });

  viewer.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      swipeHandled = true;
      if (dx < 0) goTo(current + 1);
      else goTo(current - 1);
    }
  }, { passive: true });

  viewer.addEventListener('click', (e) => {
    if (swipeHandled) {
      e.stopImmediatePropagation();
      swipeHandled = false;
    }
  }, true);
})();

const form = document.getElementById('waitlist-form');
const formState = document.querySelector('.form-state');
const successState = document.getElementById('waitlist-success');
const submitBtn = document.getElementById('waitlist-submit');
const errorEl = document.getElementById('waitlist-error');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.classList.remove('show');
    errorEl.textContent = '';

    const emailInput = form.querySelector('input[name="fields[email]"]');
    const email = (emailInput.value || '').trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errorEl.textContent = 'Please enter a valid email address.';
      errorEl.classList.add('show');
      emailInput.focus();
      return;
    }

    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Joining…';

    try {
      const formData = new FormData(form);
      await fetch(form.action, {
        method: 'POST',
        mode: 'no-cors',
        body: formData,
      });
      formState.style.display = 'none';
      successState.classList.add('show');
    } catch (err) {
      errorEl.textContent = 'Something went wrong. Please try again, or email millie@askleida.com.';
      errorEl.classList.add('show');
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}
