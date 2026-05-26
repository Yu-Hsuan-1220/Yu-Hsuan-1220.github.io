/* =========================================
   Easter egg — avatar hover swaps name
   ========================================= */
const avatarWrap   = document.querySelector('.avatar-wrap');
const sidebarName  = document.querySelector('.sidebar-name');

if (avatarWrap && sidebarName) {
  const origHTML   = sidebarName.innerHTML;
  const easterHTML = 'Kim Chaewon<br><span style="font-weight:400;font-size:0.9em;">Wife</span>';

  avatarWrap.addEventListener('mouseenter', () => { sidebarName.innerHTML = easterHTML; });
  avatarWrap.addEventListener('mouseleave', () => { sidebarName.innerHTML = origHTML;   });
}

/* =========================================
   0. Typed.js tagline
   ========================================= */
const taglineEl = document.getElementById('tagline-typed');
if (taglineEl) {
  new Typed('#tagline-typed', {
    strings: [
      '"Turning curiosity into code."',
      '"Stay hungry, stay foolish."',
      '"Simplicity is the ultimate sophistication."',
      '"Driven by passion, defined by code."',
      '"Code is poetry in motion."',
      '"Make it work, make it right, make it fast."',
      '"Dream big. Code daily. Stay humble."',
      '"Chasing excellence, one line at a time."',
      '"The best way to predict the future is to invent it."',
      '"First, solve the problem. Then, write the code."',
      '"Chaewon is my wife."',
    ],
    startDelay:  600,
    typeSpeed:   60,
    backSpeed:   30,
    backDelay:  2000,
    loop:        true,
    smartBackspace: true,
  });
}

/* =========================================
   1. Footer year
   ========================================= */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* =========================================
   2. Reduced-motion: skip all animations
   ========================================= */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  document.querySelectorAll('.fade-in-section').forEach(el => {
    el.classList.add('is-visible');
  });
}

/* =========================================
   3. Entrance animations (Intersection Observer)
   ========================================= */
if (!prefersReducedMotion) {
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.fade-in-section').forEach(el => {
    fadeObserver.observe(el);
  });
}

/* =========================================
   4. Scrollspy — active sidebar nav link
   ========================================= */
const sectionIds = ['about', 'experience', 'news', 'projects', 'teaching', 'contact'];
const navLinks = {};

sectionIds.forEach(id => {
  navLinks[id] = document.querySelector(`.sidebar-nav a[href="#${id}"]`);
});

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      Object.values(navLinks).forEach(link => link?.classList.remove('active'));
      navLinks[entry.target.id]?.classList.add('active');
    }
  });
}, { rootMargin: '-38% 0px -58% 0px' });

sectionIds.forEach(id => {
  const el = document.getElementById(id);
  if (el) sectionObserver.observe(el);
});

/* =========================================
   5. News filter + "Show more / Show less"
   ========================================= */
const newsItems  = Array.from(document.querySelectorAll('.news-item'));
const newsToggle = document.getElementById('news-toggle');
const filterBtns = document.querySelectorAll('.filter-btn');
const NEWS_PREVIEW = 5;
let currentFilter = 'all';
let newsExpanded  = false;

function renderNews() {
  const visible = currentFilter === 'all'
    ? newsItems
    : newsItems.filter(el => el.dataset.category === currentFilter);

  newsItems.forEach(el => el.style.display = 'none');

  if (currentFilter === 'all') {
    visible.forEach((el, i) => {
      el.style.display = (i < NEWS_PREVIEW || newsExpanded) ? '' : 'none';
    });
    if (newsToggle) {
      newsToggle.style.display = visible.length > NEWS_PREVIEW ? '' : 'none';
      newsToggle.textContent = newsExpanded ? 'Show less' : 'Show more';
    }
  } else {
    visible.forEach(el => el.style.display = '');
    if (newsToggle) newsToggle.style.display = 'none';
  }
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    newsExpanded  = false;
    renderNews();
  });
});

newsToggle?.addEventListener('click', () => {
  newsExpanded = !newsExpanded;
  renderNews();
});

renderNews();

/* =========================================
   6. Timeline expand / collapse
   ========================================= */
document.querySelectorAll('.texpand-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.timelineitem');
    const expanded = item.classList.toggle('expanded');
    btn.textContent = expanded ? 'Show less' : 'Show more';
  });
});

/* =========================================
   7. Mobile sidebar drawer
   ========================================= */
const burgerBtn = document.getElementById('burger-btn');
const sidebar   = document.getElementById('sidebar');
const overlay   = document.getElementById('sidebar-overlay');

function openSidebar() {
  sidebar?.classList.add('sidebar-open');
  overlay?.classList.add('active');
  burgerBtn?.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeSidebar() {
  sidebar?.classList.remove('sidebar-open');
  overlay?.classList.remove('active');
  burgerBtn?.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

burgerBtn?.addEventListener('click', () => {
  const isOpen = sidebar?.classList.contains('sidebar-open');
  isOpen ? closeSidebar() : openSidebar();
});

overlay?.addEventListener('click', closeSidebar);

document.querySelectorAll('.sidebar-nav a').forEach(link => {
  link.addEventListener('click', closeSidebar);
});

/* Close drawer on Escape key */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeSidebar();
});
