const navLinks = document.querySelectorAll('a[href^="#"]');
const burgerButton = document.querySelector('.burger');
const mobileMenu = document.querySelector('.mobile-nav');
const revealBlocks = document.querySelectorAll('.reveal');
const splitTexts = document.querySelectorAll('.split-text');
const heroImage = document.querySelector('.hero-media');
const parallaxSections = document.querySelectorAll('[data-parallax]');
const magneticItems = document.querySelectorAll('.magnetic');
const tiltCards = document.querySelectorAll('.tilt-card');
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

const closeMobileMenu = () => {
  if (!burgerButton || !mobileMenu) return;
  burgerButton.classList.remove('is-open');
  mobileMenu.classList.remove('is-open');
  burgerButton.setAttribute('aria-expanded', 'false');
};

const setupNavigation = () => {
  if (burgerButton && mobileMenu) {
    burgerButton.addEventListener('click', () => {
      const isOpen = burgerButton.classList.toggle('is-open');
      mobileMenu.classList.toggle('is-open', isOpen);
      burgerButton.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (!mobileMenu.classList.contains('is-open')) return;
      if (target.closest('.mobile-nav') || target.closest('.burger')) return;
      closeMobileMenu();
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      closeMobileMenu();
    });
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMobileMenu();
  });
};

const setupSplitText = () => {
  splitTexts.forEach((element) => {
    const words = element.textContent.trim().split(/\s+/);
    element.textContent = '';
    words.forEach((word, index) => {
      const span = document.createElement('span');
      span.className = 'word';
      span.textContent = word;
      span.style.transitionDelay = `${index * 0.03}s`;
      element.appendChild(span);
      element.appendChild(document.createTextNode(' '));
    });
  });
};

const setupReveal = () => {
  if (!revealBlocks.length) return;
  const observer = new IntersectionObserver(
    (entries, revealObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        const split = entry.target.querySelector('.split-text');
        if (split) split.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.18, rootMargin: '0px 0px -8% 0px' }
  );

  revealBlocks.forEach((block) => observer.observe(block));
};

const setupParallax = () => {
  if (!heroImage) return;
  let ticking = false;

  const update = () => {
    const y = window.scrollY || 0;
    const heroOffset = Math.min(y * 0.07, 30);
    heroImage.style.transform = `translateY(${heroOffset}px) scale(1.03)`;

    parallaxSections.forEach((section, index) => {
      const drift = Math.max(-8, Math.min(8, y * 0.017 * (index % 2 === 0 ? 1 : -1)));
      section.style.transform = `translateY(${drift}px)`;
    });
  };

  window.addEventListener('scroll', () => {
    if (ticking) return;
    window.requestAnimationFrame(() => {
      update();
      ticking = false;
    });
    ticking = true;
  });
};

const setupMagnetic = () => {
  magneticItems.forEach((item) => {
    item.addEventListener('mousemove', (event) => {
      const rect = item.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      item.style.transform = `translate(${x * 0.07}px, ${y * 0.07}px)`;
    });

    item.addEventListener('mouseleave', () => {
      item.style.transform = '';
    });
  });
};

const setupTiltCards = () => {
  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (event) => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      const rotateY = (px - 0.5) * 4;
      const rotateX = (0.5 - py) * 3;
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
};

const setupCursor = () => {
  const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
  if (!hasFinePointer || !cursorDot || !cursorRing) return;

  let mouseX = 0;
  let mouseY = 0;
  let ringX = 0;
  let ringY = 0;
  document.body.classList.add('cursor-active');

  const animate = () => {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
    window.requestAnimationFrame(animate);
  };

  document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
  });

  document.querySelectorAll('a, button, .tilt-card').forEach((target) => {
    target.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    target.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  animate();
};

const setupContactForm = () => {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button');
    const originalText = btn.textContent;
    
    btn.textContent = 'Envoi en cours...';
    btn.style.opacity = '0.7';
    btn.style.pointerEvents = 'none';

    setTimeout(() => {
      btn.textContent = 'Message envoyé !';
      btn.style.background = '#28a745';
      form.reset();
      
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.style.opacity = '';
        btn.style.pointerEvents = '';
      }, 3000);
    }, 1500);
  });
};

window.addEventListener('load', () => {
  document.body.classList.add('is-ready');
});

setupNavigation();
setupSplitText();
setupReveal();
setupParallax();
setupMagnetic();
setupTiltCards();
setupCursor();
setupContactForm();

const setupPlanning = () => {
  const calendarGrid = document.querySelector('.calendar-grid');
  if (!calendarGrid) return;

  // Mock data for events
  const events = [
    { id: 1, title: 'Cocktail de Luxe - Dior', date: '12 Mai 2026', time: '18:00 - 00:00', location: 'Musée du Louvre', spots: 12, max: 15, status: 'available' },
    { id: 2, title: 'Mariage Champêtre', date: '15 Mai 2026', time: '14:00 - 02:00', location: 'Château de Fontainebleau', spots: 3, max: 20, status: 'available' },
    { id: 3, title: 'Séminaire Corporate', date: '18 Mai 2026', time: '08:00 - 18:00', location: 'Hôtel Ritz Paris', spots: 0, max: 10, status: 'full' },
    { id: 4, title: 'Dîner de Gala', date: '22 Mai 2026', time: '19:00 - 01:00', location: 'Palais Garnier', spots: 5, max: 8, status: 'available' }
  ];

  // Simple calendar generator (for May 2026)
  const generateCalendar = () => {
    const daysInMonth = 31;
    const startDay = 5; // May 1st 2026 is a Friday (index 5)
    
    calendarGrid.innerHTML = '';
    
    // Day headers
    ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].forEach(day => {
      const head = document.createElement('div');
      head.className = 'calendar-day-head';
      head.textContent = day;
      calendarGrid.appendChild(head);
    });

    // Empty slots before start
    for (let i = 0; i < startDay - 1; i++) {
      calendarGrid.appendChild(document.createElement('div'));
    }

    // Days
    for (let d = 1; d <= daysInMonth; d++) {
      const dayEl = document.createElement('div');
      dayEl.className = 'calendar-day';
      if (d === 7) dayEl.classList.add('today'); // Mocking today as May 7th
      
      const hasEvent = [12, 15, 18, 22].includes(d);
      if (hasEvent) dayEl.classList.add('has-event');

      dayEl.innerHTML = `<span class="day-num">${d}</span>`;
      calendarGrid.appendChild(dayEl);
    }
  };

  const setupRegistration = () => {
    const regButtons = document.querySelectorAll('.reg-btn');
    regButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.event-card');
        const spotsCount = card.querySelector('.spots-count');
        const badge = card.querySelector('.status-badge');
        let currentSpots = parseInt(spotsCount.textContent);

        if (btn.classList.contains('btn-reg')) {
          // Register
          if (currentSpots > 0) {
            currentSpots--;
            spotsCount.textContent = currentSpots;
            btn.textContent = 'Inscrit';
            btn.classList.remove('btn-reg');
            btn.classList.add('btn-unreg');
            badge.textContent = 'Inscrit';
            badge.className = 'status-badge status-registered';
            
            // Visual feedback
            btn.style.transform = 'scale(1.1)';
            setTimeout(() => btn.style.transform = '', 200);
          }
        } else {
          // Unregister
          currentSpots++;
          spotsCount.textContent = currentSpots;
          btn.textContent = "S'inscrire";
          btn.classList.remove('btn-unreg');
          btn.classList.add('btn-reg');
          badge.textContent = 'Disponible';
          badge.className = 'status-badge status-available';
        }
      });
    });
  };

  const setupViewToggle = () => {
    const btns = document.querySelectorAll('.view-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        // Logic for view switching would go here
      });
    });
  };

  generateCalendar();
  setupRegistration();
  setupViewToggle();
};

setupPlanning();
