const body = document.body;
const themeToggle = document.querySelector('.theme-toggle');
const mobileBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a');
const revealEls = document.querySelectorAll('.reveal');
const filterButtons = document.querySelectorAll('.filter-chip');
const projectCards = document.querySelectorAll('.project-card');
const cursorGlow = document.querySelector('.cursor-glow');
const copyBtn = document.getElementById('copy-email-btn');
const copyFeedback = document.getElementById('copy-feedback');
const modalBackdrop = document.getElementById('modal-backdrop');
const modalContent = document.getElementById('modal-content');
const openModalButtons = document.querySelectorAll('.open-modal');
const closeModalBtn = document.querySelector('.modal-close');

const savedTheme = localStorage.getItem('site-theme');
if (savedTheme === 'light') body.classList.add('light');

themeToggle?.addEventListener('click', () => {
  body.classList.toggle('light');
  localStorage.setItem('site-theme', body.classList.contains('light') ? 'light' : 'dark');
});

mobileBtn?.addEventListener('click', () => {
  const expanded = mobileBtn.getAttribute('aria-expanded') === 'true';
  mobileBtn.setAttribute('aria-expanded', String(!expanded));
  nav.classList.toggle('open');
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    mobileBtn?.setAttribute('aria-expanded', 'false');
  });
});

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.16 });
revealEls.forEach(el => sectionObserver.observe(el));

const sections = document.querySelectorAll('main section[id]');
const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    }
  });
}, { rootMargin: '-40% 0px -45% 0px', threshold: 0 });
sections.forEach(section => activeObserver.observe(section));

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;

    projectCards.forEach(card => {
      const categories = card.dataset.category.split(' ');
      const visible = filter === 'all' || categories.includes(filter);
      card.style.display = visible ? 'flex' : 'none';
    });
  });
});

window.addEventListener('mousemove', (event) => {
  if (!cursorGlow) return;
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
});

copyBtn?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText('doriany7702@gmail.com');
    copyFeedback.textContent = 'Email copied to clipboard.';
  } catch {
    copyFeedback.textContent = 'Unable to copy automatically. Please copy: doriany7702@gmail.com';
  }
  setTimeout(() => { copyFeedback.textContent = ''; }, 2500);
});

function openModal(id) {
  const template = document.getElementById(id);
  if (!template) return;
  modalContent.innerHTML = template.innerHTML;
  modalBackdrop.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalBackdrop.hidden = true;
  modalContent.innerHTML = '';
  document.body.style.overflow = '';
}

openModalButtons.forEach(button => {
  button.addEventListener('click', () => openModal(button.dataset.modal));
});

closeModalBtn?.addEventListener('click', closeModal);
modalBackdrop?.addEventListener('click', (event) => {
  if (event.target === modalBackdrop) closeModal();
});
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !modalBackdrop.hidden) closeModal();
});
