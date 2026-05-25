// ─── Animated mesh gradient background ───
(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const blobs = [
    { x: 0.25, y: 0.15, r: 0.55, color: [180, 70, 40],  vx:  0.00012, vy:  0.00008 },
    { x: 0.75, y: 0.40, r: 0.45, color: [214, 101, 75], vx: -0.00010, vy:  0.00014 },
    { x: 0.50, y: 0.80, r: 0.50, color: [150, 55, 30],  vx:  0.00008, vy: -0.00012 },
    { x: 0.10, y: 0.65, r: 0.40, color: [200, 140, 100],vx:  0.00014, vy: -0.00008 },
    { x: 0.85, y: 0.85, r: 0.42, color: [120, 45, 25],  vx: -0.00009, vy:  0.00010 },
  ];
  const alphas = [0.22, 0.10, 0.18, 0.09, 0.15];

  function drawBlob(b, a) {
    const W = canvas.width, H = canvas.height;
    const cx = b.x * W, cy = b.y * H;
    const r = b.r * Math.max(W, H);
    const [R, G, B] = b.color;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    grad.addColorStop(0,   `rgba(${R},${G},${B},${a})`);
    grad.addColorStop(0.5, `rgba(${R},${G},${B},${a * 0.4})`);
    grad.addColorStop(1,   `rgba(${R},${G},${B},0)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#FFF1D0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    blobs.forEach((b, i) => {
      b.x += b.vx; b.y += b.vy;
      if (b.x < 0 || b.x > 1) b.vx *= -1;
      if (b.y < 0 || b.y > 1) b.vy *= -1;
      const breathe = alphas[i] + Math.sin(Date.now() * 0.0003 + i * 1.3) * 0.03;
      drawBlob(b, breathe);
    });
    requestAnimationFrame(tick);
  }
  tick();
})();

// ─── Cursor glow ───
const glow = document.getElementById('cursor-glow');
const dot  = document.getElementById('cursor-dot');
let mx = 0, my = 0, gx = 0, gy = 0, raf;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  dot.style.opacity = '1'; glow.style.opacity = '1';
  if (!raf) raf = requestAnimationFrame(animateGlow);
});

document.addEventListener('mouseleave', () => {
  dot.style.opacity = '0'; glow.style.opacity = '0';
});

function animateGlow() {
  gx += (mx - gx) * 0.08; gy += (my - gy) * 0.08;
  glow.style.left = gx + 'px'; glow.style.top = gy + 'px';
  raf = requestAnimationFrame(animateGlow);
}

document.querySelectorAll('a, button, .practice-card, .stat-card, .case-item, .matter-card').forEach(el => {
  el.addEventListener('mouseenter', () => dot.style.transform = 'translate(-50%,-50%) scale(2.5)');
  el.addEventListener('mouseleave', () => dot.style.transform = 'translate(-50%,-50%) scale(1)');
});

// ─── Sticky nav on scroll ───
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

// ─── Scroll reveal ───
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ─── Contact form (UX only) ───
const submitBtn = document.querySelector('button[type="submit"]');
if (submitBtn) {
  submitBtn.addEventListener('click', function (e) {
    e.preventDefault();
    this.textContent = 'Message Sent ✓';
    this.style.background = 'var(--steel-dim)';
    setTimeout(() => {
      this.textContent = 'Submit Enquiry';
      this.style.background = '';
    }, 3000);
  });
}
