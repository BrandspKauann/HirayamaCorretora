
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.main-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
}

document.querySelectorAll('.nav-dropdown-trigger').forEach((button) => {
  button.addEventListener('click', () => {
    const dropdown = button.closest('.nav-dropdown');
    const open = dropdown?.classList.toggle('open');
    button.setAttribute('aria-expanded', String(Boolean(open)));
  });
});

const slides = [...document.querySelectorAll('.hero-slide')];
let slideIndex = 0;
if (slides.length > 1) {
  setInterval(() => {
    slides[slideIndex].classList.remove('active');
    slideIndex = (slideIndex + 1) % slides.length;
    slides[slideIndex].classList.add('active');
  }, 4200);
}

document.querySelectorAll('[data-hero-bg-rotator]').forEach((rotator) => {
  const bgSlides = [...rotator.querySelectorAll('.hero-bg-slide')];
  const bgActions = [...document.querySelectorAll('[data-hero-bg-action]')];
  let bgIndex = 0;
  if (bgSlides.length <= 1) return;

  setInterval(() => {
    bgSlides[bgIndex].classList.remove('active');
    bgActions[bgIndex]?.classList.remove('active');
    bgIndex = (bgIndex + 1) % bgSlides.length;
    bgSlides[bgIndex].classList.add('active');
    bgActions[bgIndex]?.classList.add('active');
  }, 3000);
});

document.querySelectorAll('[data-service-carousel]').forEach((viewport) => {
  const section = viewport.closest('.service-carousel-section');
  const serviceSlides = [...viewport.querySelectorAll('[data-service-slide]')];
  const dots = [...(section?.querySelectorAll('[data-service-dot]') || [])];
  const prev = section?.querySelector('[data-service-prev]');
  const next = section?.querySelector('[data-service-next]');
  if (!serviceSlides.length) return;

  const currentIndex = () => {
    let active = 0;
    let distance = Number.POSITIVE_INFINITY;
    serviceSlides.forEach((slide, index) => {
      const slideDistance = Math.abs(slide.offsetLeft - viewport.scrollLeft);
      if (slideDistance < distance) {
        distance = slideDistance;
        active = index;
      }
    });
    return active;
  };

  const setActiveDot = () => {
    const active = currentIndex();
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === active);
      if (index === active) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  };

  const goTo = (index) => {
    const nextIndex = (index + serviceSlides.length) % serviceSlides.length;
    viewport.scrollTo({ left: serviceSlides[nextIndex].offsetLeft, behavior: 'smooth' });
  };

  prev?.addEventListener('click', () => goTo(currentIndex() - 1));
  next?.addEventListener('click', () => goTo(currentIndex() + 1));
  dots.forEach((dot, index) => dot.addEventListener('click', () => goTo(index)));

  let isDragging = false;
  let startX = 0;
  let startLeft = 0;
  let moved = false;

  const finishDrag = (event) => {
    if (!isDragging) return;
    isDragging = false;
    viewport.classList.remove('is-dragging');
    viewport.releasePointerCapture?.(event.pointerId);
    setActiveDot();
  };

  viewport.addEventListener('pointerdown', (event) => {
    if (event.button && event.button !== 0) return;
    isDragging = true;
    moved = false;
    startX = event.clientX;
    startLeft = viewport.scrollLeft;
    viewport.classList.add('is-dragging');
    viewport.setPointerCapture?.(event.pointerId);
  });

  viewport.addEventListener('pointermove', (event) => {
    if (!isDragging) return;
    const delta = event.clientX - startX;
    if (Math.abs(delta) > 6) moved = true;
    viewport.scrollLeft = startLeft - delta;
  });

  viewport.addEventListener('pointerup', finishDrag);
  viewport.addEventListener('pointercancel', finishDrag);
  viewport.addEventListener('click', (event) => {
    if (!moved) return;
    event.preventDefault();
    event.stopPropagation();
  }, true);

  let scrollTimer;
  viewport.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(setActiveDot, 80);
  }, { passive: true });

  setActiveDot();
});

const revealCards = [...document.querySelectorAll('.service-tile, .service-showcase-slide, .service-showcase-panel li, .consortium-focus-map article, .info-grid article, .process-grid article, .latest-grid article, .ewerton-card, .method-steps article, .type-list article, .partner-briefs article')];
if (revealCards.length && 'IntersectionObserver' in window) {
  revealCards.forEach((card, index) => {
    card.classList.add('will-reveal');
    card.style.setProperty('--reveal-delay', String((index % 6) * 55) + 'ms');
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -40px 0px' });

  revealCards.forEach((card) => revealObserver.observe(card));
} else {
  revealCards.forEach((card) => card.classList.add('is-visible'));
}

const cookieBar = document.querySelector('[data-cookie-bar]');
if (cookieBar && localStorage.getItem('hirayama-cookie-ok') !== '1') {
  cookieBar.classList.add('show');
}
document.querySelector('[data-cookie-accept]')?.addEventListener('click', () => {
  localStorage.setItem('hirayama-cookie-ok', '1');
  cookieBar?.classList.remove('show');
});

const setFormStatus = (form, message, state) => {
  const status = form.querySelector('[data-form-status]');
  if (!status) return;
  status.textContent = message;
  status.classList.remove('success', 'error');
  status.classList.add('show', state);
};

const resetConsent = (form) => {
  const consent = form.querySelector('input[name="consentimento"]');
  if (consent) consent.checked = true;
};

const EXIT_INTENT_SESSION_KEY = 'hirayama_exit_intent_shown';

document.querySelectorAll('[data-contact-form]').forEach((form) => {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    const defaultText = button?.textContent || 'Enviar solicitação';
    const data = new FormData(form);
    const serviceSelect = form.querySelector('select[name="servico"]');
    const serviceLabel = serviceSelect?.selectedOptions?.[0]?.textContent?.trim() || String(data.get('servico') || '');
    const name = String(data.get('nome') || '').trim();
    const email = String(data.get('email') || '').trim();
    const phone = String(data.get('telefone') || '').trim();
    const message = String(data.get('message') || '').trim();
    const source = String(data.get('origem') || 'site').trim();
    data.set('_page_url', location.href);
    data.set('_replyto', email);
    data.set('_subject', '[Site Hirayama Corretora] ' + (serviceLabel || 'Novo contato') + (name ? ' - ' + name : ''));
    data.set('servico_nome', serviceLabel);
    data.set('message', [
      'Novo contato pelo site Hirayama Corretora.',
      '',
      'Nome: ' + name,
      'Email: ' + email,
      'Telefone: ' + phone,
      'Serviço desejado: ' + serviceLabel,
      'Origem: ' + source,
      'Página: ' + location.href,
      '',
      'Mensagem:',
      message || 'Quero falar com a Hirayama Corretora.'
    ].join('\n'));

    if (!data.get('servico')) {
      setFormStatus(form, 'Selecione o serviço para a equipe entender melhor sua necessidade.', 'error');
      return;
    }

    try {
      if (button) {
        button.disabled = true;
        button.textContent = 'Enviando...';
      }
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || 'Não foi possível enviar agora. Tente novamente ou fale pelo WhatsApp.');
      }
      setFormStatus(form, 'Recebemos sua solicitação. A Hirayama vai retornar em breve.', 'success');
      form.reset();
      resetConsent(form);
      try {
        sessionStorage.setItem(EXIT_INTENT_SESSION_KEY, '1');
      } catch {
        // Storage can be blocked in private browsing.
      }
      if (form.closest('[data-exit-popup]')) {
        window.setTimeout(() => closeExitPopup(), 1400);
      }
    } catch (error) {
      setFormStatus(form, error?.message || 'Não foi possível enviar agora. Tente novamente.', 'error');
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = defaultText;
      }
    }
  });
});

const exitPopup = document.querySelector('[data-exit-popup]');

function closeExitPopup() {
  if (!exitPopup) return;
  exitPopup.classList.remove('open');
  exitPopup.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

function openExitPopup(source) {
  if (!exitPopup || exitPopup.classList.contains('open')) return;
  const sourceField = exitPopup.querySelector('input[name="origem"]');
  if (sourceField && source) sourceField.value = source;
  exitPopup.classList.add('open');
  exitPopup.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  window.setTimeout(() => exitPopup.querySelector('.contact-form input:not([type="hidden"]), .contact-form select, .contact-form textarea, .contact-form button')?.focus(), 80);
}

function useExitIntent({ onExitIntent, delayMs = 5000, storageKey = EXIT_INTENT_SESSION_KEY } = {}) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return () => {};
  if (typeof onExitIntent !== 'function') return () => {};
  if (window.matchMedia && !window.matchMedia('(pointer: fine)').matches) return () => {};

  let canTrigger = false;
  let disposed = false;
  let timer;

  const hasShown = () => {
    try {
      return sessionStorage.getItem(storageKey) === '1';
    } catch {
      return false;
    }
  };

  const markShown = () => {
    try {
      sessionStorage.setItem(storageKey, '1');
    } catch {
      // Storage can be blocked in private browsing.
    }
  };

  function cleanup() {
    if (disposed) return;
    disposed = true;
    if (timer) window.clearTimeout(timer);
    window.removeEventListener('load', armExitIntent);
    document.removeEventListener("mouseout", handleMouseOut);
  }

  function handleMouseOut(event) {
    if (disposed || !canTrigger || hasShown()) return;
    if (event.clientY <= 20 && event.relatedTarget === null) {
      markShown();
      onExitIntent(event);
      cleanup();
    }
  }

  function armExitIntent() {
    if (disposed) return;
    timer = window.setTimeout(() => {
      canTrigger = true;
    }, delayMs);
  }

  if (document.readyState === 'complete') armExitIntent();
  else window.addEventListener('load', armExitIntent, { once: true });

  document.addEventListener("mouseout", handleMouseOut);
  return cleanup;
}

if (exitPopup) {
  exitPopup.querySelectorAll('[data-exit-close]').forEach((button) => {
    button.addEventListener('click', closeExitPopup);
  });
  exitPopup.addEventListener('click', (event) => {
    if (event.target === exitPopup) closeExitPopup();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeExitPopup();
  });

  const cleanupExitIntent = useExitIntent({
    onExitIntent: () => openExitPopup('exit_intent'),
    delayMs: 5000,
    storageKey: EXIT_INTENT_SESSION_KEY
  });
  window.addEventListener('pagehide', cleanupExitIntent, { once: true });
}

document.querySelectorAll('[data-share]').forEach((button) => {
  const defaultText = button.textContent;
  const showFeedback = (text, state) => {
    button.textContent = text;
    button.dataset.state = state;
    window.clearTimeout(button._shareTimer);
    button._shareTimer = window.setTimeout(() => {
      button.textContent = defaultText;
      delete button.dataset.state;
    }, 2200);
  };

  const copyWithSelection = (url) => {
    const field = document.createElement('textarea');
    field.value = url;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.left = '-9999px';
    field.style.top = '0';
    document.body.appendChild(field);
    field.select();
    const copied = document.execCommand('copy');
    field.remove();
    return copied;
  };

  const copyLink = async (url) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        showFeedback('Link copiado', 'success');
        return;
      }
    } catch {
      // Some browsers expose clipboard but block it without a permission gesture.
    }

    if (copyWithSelection(url)) {
      showFeedback('Link copiado', 'success');
      return;
    }

    location.href = 'mailto:?subject=' + encodeURIComponent(button.dataset.shareTitle || document.title) + '&body=' + encodeURIComponent(url);
  };

  button.addEventListener('click', async () => {
    const url = new URL(button.dataset.shareUrl || location.href, location.origin).href;
    const title = button.dataset.shareTitle || document.title;
    const text = button.dataset.shareText || '';

    try {
      const mobileShare = typeof navigator.share === 'function' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || '');
      if (mobileShare) {
        await navigator.share({ title, text, url });
        return;
      }
      await copyLink(url);
    } catch (error) {
      if (error?.name === 'AbortError') return;
      try {
        await copyLink(url);
      } catch {
        showFeedback('Não foi possível copiar', 'error');
      }
    }
  });
});

const filterButtons = [...document.querySelectorAll('[data-filter]')];
const posts = [...document.querySelectorAll('[data-category]')];
if (filterButtons.length) {
  filterButtons[0].classList.add('active');
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      const filter = button.dataset.filter;
      posts.forEach((post) => {
        post.hidden = filter !== 'Todos posts' && post.dataset.category !== filter;
      });
    });
  });
}
