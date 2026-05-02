// ─── Sticky nav avec effet scroll ───────────────────
const nav = document.getElementById('nav');
let lastY = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y > 30) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
  lastY = y;
}, { passive: true });

// ─── Reveal au scroll ────────────────────────────────
const reveal = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
      reveal.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.card, .rule-card, .download-card, .security-item, .faq-item, .screen-tile').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1)';
  reveal.observe(el);
});

// ─── Parallax léger sur le hero ──────────────────────
const heroBg = document.querySelector('.hero-bg');
const cards = document.querySelectorAll('.float-card');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y < 800) {
    if (heroBg) heroBg.style.transform = `translateY(${y * 0.3}px)`;
    cards.forEach((c, i) => {
      const speed = 0.15 + (i % 3) * 0.08;
      c.style.translate = `0 ${y * speed}px`;
    });
  }
}, { passive: true });

// ─── Smooth scroll renforcé pour anchors ─────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length > 1) {
      const t = document.querySelector(id);
      if (t) {
        e.preventDefault();
        t.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});
