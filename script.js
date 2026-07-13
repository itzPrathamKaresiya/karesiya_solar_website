/* ============================
   Karesiya Solar Energy Pvt. Ltd.
   script.js - Interactivity
============================= */

'use strict';

// ========================
// NAVBAR: Scroll & Mobile
// ========================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
    document.getElementById('backToTop').classList.add('visible');
  } else {
    navbar.classList.remove('scrolled');
    document.getElementById('backToTop').classList.remove('visible');
  }
  updateActiveNavLink();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close mobile nav on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// Active nav link on scroll
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollMid = window.scrollY + window.innerHeight / 2;
  sections.forEach(section => {
    const link = document.querySelector(`.nav-link[href="#${section.id}"]`);
    if (!link) return;
    const top = section.offsetTop - 100;
    const bottom = top + section.offsetHeight;
    if (scrollMid >= top && scrollMid < bottom) {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
}

// ========================
// PARTICLES (Hero section)
// ========================
const particlesContainer = document.getElementById('particles');
const PARTICLE_COUNT = 30;

function createParticles() {
  if (!particlesContainer) return;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size = Math.random() * 4 + 2 + 'px';
    p.style.cssText = `
      width: ${size};
      height: ${size};
      left: ${Math.random() * 100}%;
      bottom: ${-10 + Math.random() * 10}px;
      animation-duration: ${6 + Math.random() * 10}s;
      animation-delay: ${Math.random() * 8}s;
      opacity: ${0.3 + Math.random() * 0.7};
    `;
    particlesContainer.appendChild(p);
  }
}
createParticles();

// ========================
// COUNTER ANIMATION (Stats)
// ========================
function animateCounter(el, target, duration = 2000) {
  const start = 0;
  const startTime = performance.now();
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(start + (target - start) * eased);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }
  requestAnimationFrame(update);
}

let countersStarted = false;
function checkAndStartCounters() {
  if (countersStarted) return;
  const statsSection = document.querySelector('.stats-section');
  if (!statsSection) return;
  const rect = statsSection.getBoundingClientRect();
  if (rect.top < window.innerHeight - 100) {
    countersStarted = true;
    document.querySelectorAll('.counter').forEach(counter => {
      const target = parseInt(counter.dataset.target);
      animateCounter(counter, target);
    });
  }
}
window.addEventListener('scroll', checkAndStartCounters);
checkAndStartCounters();

// ========================
// SCROLL REVEAL
// ========================
function addRevealClasses() {
  const targets = document.querySelectorAll(
    '.stat-card, .about-content, .team-card, .service-card, .why-feature, .cert-card, .process-step, .testimonial-card, .extra-service-item, .lead-benefit'
  );
  targets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 4) * 0.1}s`;
  });
}

function checkReveal() {
  document.querySelectorAll('.reveal').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      el.classList.add('revealed');
    }
  });
}

addRevealClasses();
window.addEventListener('scroll', checkReveal, { passive: true });
// Run once on load for visible elements
setTimeout(checkReveal, 100);

// ========================
// TESTIMONIALS CAROUSEL
// ========================
const track = document.getElementById('testimonialsTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsContainer = document.getElementById('carouselDots');

let currentSlide = 0;
let slidesPerView = 3;
let totalCards = 0;
let maxSlide = 0;
let isDragging = false;
let startX = 0;
let startTranslate = 0;
let currentTranslate = 0;

function getCarouselConfig() {
  if (window.innerWidth <= 768) return 1;
  if (window.innerWidth <= 1024) return 2;
  return 3;
}

function setupCarousel() {
  if (!track) return;
  totalCards = track.children.length;
  slidesPerView = getCarouselConfig();
  maxSlide = Math.max(0, totalCards - slidesPerView);
  if (currentSlide > maxSlide) currentSlide = maxSlide;
  buildDots();
  goToSlide(currentSlide);
}

function buildDots() {
  if (!dotsContainer) return;
  dotsContainer.innerHTML = '';
  for (let i = 0; i <= maxSlide; i++) {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (i === currentSlide) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }
}

function goToSlide(index) {
  currentSlide = Math.max(0, Math.min(index, maxSlide));
  const cardWidth = track.children[0]?.offsetWidth || 0;
  const gap = 24;
  const offset = currentSlide * (cardWidth + gap);
  track.style.transform = `translateX(-${offset}px)`;
  updateDots();
}

function updateDots() {
  if (!dotsContainer) return;
  dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

// Touch/drag support
if (track) {
  track.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    const matrix = new DOMMatrix(getComputedStyle(track).transform);
    startTranslate = matrix.m41;
    track.style.transition = 'none';
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const diff = e.clientX - startX;
    track.style.transform = `translateX(${startTranslate + diff}px)`;
  });

  window.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    track.style.transition = '';
    const diff = e.clientX - startX;
    if (Math.abs(diff) > 80) {
      if (diff < 0) goToSlide(currentSlide + 1);
      else goToSlide(currentSlide - 1);
    } else {
      goToSlide(currentSlide); // snap back
    }
  });

  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    const matrix = new DOMMatrix(getComputedStyle(track).transform);
    startTranslate = matrix.m41;
    track.style.transition = 'none';
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    const diff = e.touches[0].clientX - startX;
    track.style.transform = `translateX(${startTranslate + diff}px)`;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    track.style.transition = '';
    const diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 60) {
      if (diff < 0) goToSlide(currentSlide + 1);
      else goToSlide(currentSlide - 1);
    } else {
      goToSlide(currentSlide);
    }
  });
}

setupCarousel();
window.addEventListener('resize', setupCarousel);

// Auto-advance carousel
setInterval(() => {
  if (!isDragging) {
    const next = currentSlide >= maxSlide ? 0 : currentSlide + 1;
    goToSlide(next);
  }
}, 5000);

// ========================
// LEAD FORM VALIDATION
// ========================
const form = document.getElementById('quoteForm');
const formSuccess = document.getElementById('formSuccess');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const btnLoader = document.getElementById('btnLoader');

function validateField(id, validator, errorId, message) {
  const el = document.getElementById(id);
  const errorEl = document.getElementById(errorId);
  if (!el) return true;
  const val = el.value.trim();
  if (!validator(val)) {
    errorEl.textContent = message;
    el.style.borderColor = '#EF4444';
    return false;
  }
  errorEl.textContent = '';
  el.style.borderColor = '';
  return true;
}

function validateForm() {
  let valid = true;
  valid = validateField('fname', v => v.length >= 2, 'fname-error', 'Please enter your full name.') && valid;
  valid = validateField('phone', v => /^[+\d\s\-()]{7,15}$/.test(v), 'phone-error', 'Please enter a valid phone number.') && valid;
  valid = validateField('email', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'email-error', 'Please enter a valid email address.') && valid;
  valid = validateField('city', v => v.length >= 2, 'city-error', 'Please enter your city.') && valid;
  return valid;
}

// Live validation
['fname', 'phone', 'email', 'city'].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('input', () => {
      if (el.style.borderColor === 'rgb(239, 68, 68)') {
        const errorEl = document.getElementById(`${id}-error`);
        if (el.value.trim().length > 0) {
          el.style.borderColor = '';
          if (errorEl) errorEl.textContent = '';
        }
      }
    });
  }
});

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Show loading state
    btnText.classList.add('hidden');
    btnLoader.classList.remove('hidden');
    submitBtn.disabled = true;

    // Prepare data to send to the custom email via Web3Forms
    const formData = new FormData(form);
    // Replace "YOUR_ACCESS_KEY_HERE" with your free access key from https://web3forms.com/
    formData.append("access_key", "60c17ba5-03ca-443f-b6bd-7046b128fa82");

    try {
      // Send the request to Web3Forms API
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        // Show success message
        form.classList.add('hidden');
        formSuccess.classList.remove('hidden');
      } else {
        alert("There was an error sending your request. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please check your connection and try again.");
    } finally {
      // Re-enable button
      submitBtn.disabled = false;
      btnText.classList.remove('hidden');
      btnLoader.classList.add('hidden');
    }

    // Scroll to form
    document.getElementById('lead-form').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

// ========================
// BACK TO TOP
// ========================
document.getElementById('backToTop')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ========================
// SMOOTH SCROLL for all anchors
// ========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ========================
// PAGE LOAD ANIMATION
// ========================
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  });
});

// ========================
// VIDEO MODAL
// ========================
const videoCards = document.querySelectorAll('.video-card');
const videoModal = document.getElementById('videoModal');
const closeVideoModal = document.getElementById('closeVideoModal');
const modalVideo = document.getElementById('modalVideo');

if (videoModal && closeVideoModal && modalVideo) {
  videoCards.forEach(card => {
    card.addEventListener('click', () => {
      const videoSrc = card.getAttribute('data-video-src');
      if (videoSrc) {
        modalVideo.querySelector('source').src = videoSrc;
        modalVideo.load();
        modalVideo.play();
        videoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeModal = () => {
    videoModal.classList.remove('active');
    modalVideo.pause();
    modalVideo.currentTime = 0;
    modalVideo.querySelector('source').src = '';
    modalVideo.load();
    document.body.style.overflow = '';
  };

  closeVideoModal.addEventListener('click', closeModal);
  videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal || e.target.classList.contains('video-modal-container')) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal.classList.contains('active')) {
      closeModal();
    }
  });
}
