// Sitewide cursor movement effect
const glow = document.getElementById('cursorGlow');
if (glow) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

  if (prefersReducedMotion || hasCoarsePointer) {
    glow.style.display = 'none';
  } else {
    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const follower = { x: pointer.x, y: pointer.y };

    const interactiveSelector = 'a, button, .btn-primary, .btn-outline, .btn-hire, .project-card, .service-card, .testimonial-card, .contact-item, .social-btn, .filter-btn';

    document.addEventListener('mousemove', (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    });

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveSelector)) {
        glow.classList.add('cursor-glow-active');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveSelector)) {
        glow.classList.remove('cursor-glow-active');
      }
    });

    document.addEventListener('mousedown', () => glow.classList.add('cursor-glow-press'));
    document.addEventListener('mouseup', () => glow.classList.remove('cursor-glow-press'));

    const follow = () => {
      follower.x += (pointer.x - follower.x) * 0.14;
      follower.y += (pointer.y - follower.y) * 0.14;
      glow.style.left = `${follower.x}px`;
      glow.style.top = `${follower.y}px`;
      requestAnimationFrame(follow);
    };
    follow();
  }
}

// Theme toggle
const toggle = document.getElementById('themeToggle');
if (toggle) {
  toggle.addEventListener('click', () => {
    const html = document.documentElement;
    const isLight = html.getAttribute('data-theme') === 'light';
    html.setAttribute('data-theme', isLight ? 'dark' : 'light');
    toggle.textContent = isLight ? '🌙' : '☀️';
  });
}

// Mobile menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
}
function closeMobile() { if (mobileMenu) mobileMenu.classList.remove('open'); }

// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
reveals.forEach(el => observer.observe(el));

// Filter buttons
const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(btn => {
  btn.addEventListener('click', function() {
    filterButtons.forEach(b => b.classList.remove('active'));
    this.classList.add('active');
  });
});

// Form submit
function handleSubmit(btn) {
  const original = btn.innerHTML;
  btn.innerHTML = '<span>✅ Message Sent!</span>';
  btn.style.background = 'var(--accent3)';
  setTimeout(() => {
    btn.innerHTML = original;
    btn.style.background = '';
  }, 3000);
}

// Animated counter
function animateCounter(el, target, suffix='') {
  let start = 0;
  const duration = 1500;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.querySelector('.num').textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// Smooth active nav link
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.getAttribute('id');
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--text)' : '';
  });
});

// Progress bar animation on scroll
const progressObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.progress-fill').forEach(fill => {
        fill.style.animation = 'none';
        fill.offsetHeight;
        fill.style.animation = 'fillBar 1.5s ease forwards';
      });
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.hero-card').forEach(el => progressObserver.observe(el));

// Mouse movement tilt/parallax effect for cards
function initMouseMovementEffect() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
  if (prefersReducedMotion || hasCoarsePointer) return;

  const tiltTargets = document.querySelectorAll(
    '.project-card, .testimonial-card, .service-card, .contact-form, .timeline-card, .skill-group'
  );

  tiltTargets.forEach((card) => {
    card.style.transformStyle = 'preserve-3d';
    card.style.willChange = 'transform';

    card.addEventListener('mousemove', (event) => {
      const rect = card.getBoundingClientRect();
      const relX = (event.clientX - rect.left) / rect.width;
      const relY = (event.clientY - rect.top) / rect.height;

      const rotateY = (relX - 0.5) * 10;
      const rotateX = (0.5 - relY) * 8;

      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

function initThreeScene() {
  const container = document.getElementById('threeScene');
  if (!container || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.set(0, 1.2, 4);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  const ambient = new THREE.AmbientLight(0xffffff, 0.7);
  const directional = new THREE.DirectionalLight(0xffffff, 0.8);
  directional.position.set(5, 3, 5);
  scene.add(ambient, directional);

  const stage = new THREE.Group();
  scene.add(stage);

  const baseMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.25,
    roughness: 0.35,
    transparent: true,
    opacity: 0.92,
    envMapIntensity: 0.7,
  });

  const accentMaterial = new THREE.MeshStandardMaterial({
    color: 0x7c5cfc,
    emissive: 0x4f46e5,
    emissiveIntensity: 0.4,
    metalness: 0.5,
    roughness: 0.3,
    opacity: 0.95,
    transparent: true,
  });

  for (let i = 0; i < 12; i += 1) {
    const geometry = new THREE.TorusKnotGeometry(0.18 + (i * 0.02), 0.06, 100, 16);
    const mesh = new THREE.Mesh(geometry, i % 2 ? accentMaterial : baseMaterial);
    const angle = (i / 12) * Math.PI * 2;
    mesh.position.set(Math.cos(angle) * 1.4, (i - 6) * 0.1, Math.sin(angle) * 1.4);
    mesh.rotation.set(angle * 0.75, angle * 0.5, angle * 0.3);
    stage.add(mesh);
  }

  const particleGeometry = new THREE.SphereGeometry(0.03, 8, 8);
  const particleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 });
  const particles = new THREE.Group();
  for (let i = 0; i < 40; i += 1) {
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    particle.position.set((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 4);
    particles.add(particle);
  }
  scene.add(particles);

  const target = new THREE.Vector2(0, 0);
  const pointer = new THREE.Vector2(0, 0);
  window.addEventListener('mousemove', (event) => {
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;
    target.set(x, y);
  });

  const resize = () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  };
  window.addEventListener('resize', resize);

  const clock = new THREE.Clock();
  const animate = () => {
    const elapsed = clock.getElapsedTime();
    particles.children.forEach((particle, idx) => {
      const phase = elapsed * 0.5 + idx;
      particle.position.y += Math.sin(phase) * 0.0015;
      particle.position.x += Math.cos(phase * 0.7) * 0.0015;
    });

    pointer.lerp(target, 0.07);
    stage.rotation.y = pointer.x * 0.25;
    stage.rotation.x = pointer.y * 0.15;

    stage.children.forEach((child, idx) => {
      child.rotation.x += 0.0015 + idx * 0.0003;
      child.rotation.y += 0.002;
    });

    camera.position.x = pointer.x * 0.4;
    camera.position.y = 1.1 + pointer.y * 0.2;
    camera.lookAt(0, 0.8, 0);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };

  animate();
  resize();
}

initThreeScene();
initMouseMovementEffect();

window.addEventListener('load', () => {
  const loader = document.getElementById('pageLoader');
  if (!loader) return;
  loader.classList.add('loaded');
  setTimeout(() => loader.remove(), 600);
});
