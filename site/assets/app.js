
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

const revealCards = [...document.querySelectorAll('.service-tile, .info-grid article, .process-grid article, .latest-grid article, .ewerton-card')];
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

document.querySelector('[data-contact-form]')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const body = ['nome', 'email', 'telefone', 'mensagem']
    .map((key) => key + ': ' + (data.get(key) || ''))
    .join('\n');
  location.href = 'mailto:contato@hirayamacorretora.com.br?subject=Contato pelo site&body=' + encodeURIComponent(body);
});

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
