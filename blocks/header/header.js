// Alaska Airlines header (en-gb) — faithful rebuild of the live borealis-header.
// Single light-blue bar: brand (Alaska wordmark + oneworld) on the left,
// icon cluster (advisories, search, language, account, Menu) on the right.
// Account opens a dropdown; Menu opens a right slide-in panel with accordion nav.

const isDesktop = window.matchMedia('(min-width: 769px)');
const SITE = 'https://www.alaskaair.com/en-gb';

// Nav model extracted from the live /en-gb header (Menu panel + account dropdown).
const MENU_SECTIONS = [
  {
    label: 'Book',
    expandable: true,
    links: [
      ['Flights', `${SITE}/`],
      ['Flight Pass', `${SITE}/content/flight-pass`],
      ['Hotels', `${SITE}/hotels`],
      ['Cars', `${SITE}/car-rental`],
      ['Vacation packages', `${SITE}/deals/vacations`],
      ['Cruises', `${SITE}/cruises`],
    ],
  },
  { label: 'Find my trip', href: `${SITE}/booking/reservation-lookup/` },
  { label: 'Check in', href: 'https://reservations.alaskaair.com/en-gb/checkin' },
  { label: 'Flight Status', href: `${SITE}/flightstatus` },
  { label: 'Atmos™ Rewards Visa® credit cards', href: `${SITE}/atmosrewards/content/credit-cards` },
  { label: 'Atmos™ Rewards', href: `${SITE}/atmosrewards/content` },
  {
    label: 'Where we fly',
    expandable: true,
    links: [
      ['Route map', `${SITE}/content/route-map`],
      ['Destinations', `${SITE}/content/explore`],
      ['Partner airlines', `${SITE}/atmosrewards/content/partners/airlines`],
      ['New routes', `${SITE}/content/new-flights`],
    ],
  },
  {
    label: 'Traveling with us',
    expandable: true,
    links: [
      ['Travel info', `${SITE}/content/travel-info`],
      ['Baggage', `${SITE}/content/travel-info/baggage`],
      ['Accessible services', `${SITE}/content/travel-info/accessible-services`],
      ['Our aircraft', `${SITE}/content/travel-info/our-aircraft`],
      ['Flight experience', `${SITE}/content/travel-info/flight-experience`],
    ],
  },
];

const ACCOUNT_LINKS = [
  ['Account overview', `${SITE}/betaaccount/profile-settings`],
  ['Find my trip', `${SITE}/booking/reservation-lookup/`],
  ['Wallet', `${SITE}/betaaccount/wallet`],
  ['Profile and settings', `${SITE}/betaaccount/profile-settings`],
  ['Rewards', `${SITE}/atmosrewards/content`],
];
const ACCOUNT_LINKS_SECONDARY = [
  ['Discounts/Companion Fare', `${SITE}/atmosrewards/content/benefits`],
  ['Points activity', `${SITE}/atmosrewards/content`],
  ['Buy, share, or gift points', `${SITE}/atmosrewards/content/use-points`],
  ['Membership card', `${SITE}/atmosrewards/content`],
];

const ICONS = {
  advisories: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a6 6 0 0 0-6 6v4l-2 3v1h16v-1l-2-3V9a6 6 0 0 0-6-6Zm0 18a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 21Z"/></svg>',
  search: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 14h-.8l-.3-.3a6.5 6.5 0 1 0-.7.7l.3.3v.8l5 5 1.5-1.5-5-5Zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14Z"/></svg>',
  language: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm6.9 6h-2.95a15.7 15.7 0 0 0-1.4-3.6A8 8 0 0 1 18.9 8ZM12 4a14 14 0 0 1 1.9 4h-3.8A14 14 0 0 1 12 4ZM4.26 14a7.8 7.8 0 0 1 0-4h3.38a16.6 16.6 0 0 0 0 4Zm.84 2h2.95a15.7 15.7 0 0 0 1.4 3.6A8 8 0 0 1 5.1 16Zm2.95-8H5.1a8 8 0 0 1 4.35-3.6A15.7 15.7 0 0 0 8.05 8ZM12 20a14 14 0 0 1-1.9-4h3.8A14 14 0 0 1 12 20Zm2.36-6H9.64a14.7 14.7 0 0 1 0-4h4.72a14.7 14.7 0 0 1 0 4Zm.59 5.6a15.7 15.7 0 0 0 1.4-3.6h2.95a8 8 0 0 1-4.35 3.6ZM16.36 14a16.6 16.6 0 0 0 0-4h3.38a7.8 7.8 0 0 1 0 4Z"/></svg>',
  account: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-3.3 0-10 1.67-10 5v3h20v-3c0-3.33-6.7-5-10-5Z"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10l5 5 5-5z"/></svg>',
};

function el(tag, cls, html) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html !== undefined) n.innerHTML = html;
  return n;
}

function buildBrand() {
  const brand = el('div', 'nav-brand');
  const logo = el('a', 'nav-logo');
  logo.href = `${SITE}/`;
  logo.setAttribute('aria-label', 'Alaska Airlines home');
  const logoImg = el('img');
  logoImg.loading = 'eager';
  logoImg.alt = 'Alaska Airlines Logo';
  logoImg.width = 238;
  logoImg.height = 44;
  logoImg.src = '/blocks/header/alaska-logo.svg';
  // CSP-safe fallback wordmark if the remote logo fails to load
  logoImg.addEventListener('error', () => {
    const text = el('span', 'nav-logo-text');
    text.textContent = 'Alaska';
    logoImg.replaceWith(text);
  });
  logo.append(logoImg);
  // The Alaska "lockup" SVG already includes the oneworld roundel.
  brand.append(logo);
  return brand;
}

function buildAccountDropdown() {
  const wrap = el('div', 'nav-account');
  const btn = el('button', 'nav-account-toggle');
  btn.type = 'button';
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-label', 'Account menu');
  btn.innerHTML = `<span class="nav-icon">${ICONS.account}</span><span class="nav-chevron">${ICONS.chevron}</span>`;
  const panel = el('div', 'nav-account-panel');
  const primaryList = ACCOUNT_LINKS.map(([t, h]) => `<li><a href="${h}">${t}</a></li>`).join('');
  const secondaryList = ACCOUNT_LINKS_SECONDARY.map(([t, h]) => `<li><a href="${h}">${t}</a></li>`).join('');
  panel.innerHTML = `
    <a class="nav-cta nav-cta-primary" href="${SITE}/betaaccount/profile-settings">Sign in</a>
    <a class="nav-cta nav-cta-outline" href="${SITE}/atmosrewards/content">Join now</a>
    <ul class="nav-account-links">${primaryList}</ul>
    <hr>
    <ul class="nav-account-links nav-account-secondary">${secondaryList}</ul>`;
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', open ? 'false' : 'true');
    wrap.classList.toggle('open', !open);
  });
  wrap.append(btn, panel);
  return wrap;
}

function buildMenuPanel() {
  const scrim = el('div', 'nav-scrim');
  const panel = el('aside', 'nav-panel');
  panel.setAttribute('aria-hidden', 'true');

  const head = el('div', 'nav-panel-head');
  const searchBox = el('div', 'nav-panel-search', `<span class="nav-icon">${ICONS.search}</span><input type="search" placeholder="Search" aria-label="Search">`);
  const close = el('button', 'nav-panel-close', '&times;');
  close.type = 'button';
  close.setAttribute('aria-label', 'Close menu');
  head.append(searchBox, close);

  const ctas = el('div', 'nav-panel-ctas');
  ctas.innerHTML = `<a class="nav-cta nav-cta-primary" href="${SITE}/betaaccount/profile-settings">Sign in</a>`
    + `<a class="nav-cta nav-cta-outline" href="${SITE}/atmosrewards/content">Join now</a>`;

  const list = el('ul', 'nav-panel-list');
  MENU_SECTIONS.forEach((s) => {
    const li = el('li', s.expandable ? 'nav-panel-item nav-drop' : 'nav-panel-item');
    if (s.expandable) {
      const toggle = el('button', 'nav-panel-toggle');
      toggle.type = 'button';
      toggle.setAttribute('aria-expanded', 'false');
      toggle.innerHTML = `<span>${s.label}</span><span class="nav-chevron">${ICONS.chevron}</span>`;
      const sub = el('ul', 'nav-panel-sub');
      sub.innerHTML = s.links.map(([t, h]) => `<li><a href="${h}">${t}</a></li>`).join('');
      toggle.addEventListener('click', () => {
        const open = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', open ? 'false' : 'true');
        li.classList.toggle('open', !open);
      });
      li.append(toggle, sub);
    } else {
      li.innerHTML = `<a href="${s.href}">${s.label}</a>`;
    }
    list.append(li);
  });

  panel.append(head, ctas, list);
  return { panel, scrim, close };
}

/**
 * loads and decorates the Alaska header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  block.textContent = '';
  const nav = el('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Main');

  // left: brand
  nav.append(buildBrand());

  // right: icon cluster + account + Menu
  const tools = el('div', 'nav-tools');

  const advisories = el('a', 'nav-icon-btn');
  advisories.href = `${SITE}/content/advisories/travel-advisories`;
  advisories.setAttribute('aria-label', 'Travel Advisories');
  advisories.innerHTML = ICONS.advisories;

  const searchBtn = el('button', 'nav-icon-btn nav-search-toggle', ICONS.search);
  searchBtn.type = 'button';
  searchBtn.setAttribute('aria-label', 'Search');

  const langBtn = el('a', 'nav-icon-btn');
  langBtn.href = `${SITE}/content/site-map`;
  langBtn.setAttribute('aria-label', 'Language and Currency');
  langBtn.innerHTML = ICONS.language;

  const account = buildAccountDropdown();

  const menuBtn = el('button', 'nav-menu-toggle');
  menuBtn.type = 'button';
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.setAttribute('aria-label', 'Open menu');
  menuBtn.innerHTML = '<span class="nav-hamburger-icon"></span><span class="nav-menu-label">Menu</span>';

  // desktop inline search expand field (inserted before account)
  const searchField = el('div', 'nav-search-field', '<input type="search" placeholder="Search" aria-label="Search">');

  tools.append(advisories, searchBtn, langBtn, searchField, account, menuBtn);
  nav.append(tools);

  // right slide-in Menu panel + scrim
  const { panel, scrim, close } = buildMenuPanel();

  const openPanel = () => {
    panel.classList.add('open');
    scrim.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflowY = 'hidden';
  };
  const closePanel = () => {
    panel.classList.remove('open');
    scrim.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflowY = '';
  };
  menuBtn.addEventListener('click', () => (panel.classList.contains('open') ? closePanel() : openPanel()));
  close.addEventListener('click', closePanel);
  scrim.addEventListener('click', closePanel);

  searchBtn.addEventListener('click', () => {
    const open = tools.classList.toggle('search-open');
    if (open) searchField.querySelector('input').focus();
  });

  // global key/close handlers
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') {
      closePanel();
      tools.classList.remove('search-open');
      const acc = nav.querySelector('.nav-account.open');
      if (acc) {
        acc.classList.remove('open');
        acc.querySelector('.nav-account-toggle').setAttribute('aria-expanded', 'false');
      }
    }
  });
  document.addEventListener('click', (e) => {
    const acc = nav.querySelector('.nav-account.open');
    if (acc && !acc.contains(e.target)) {
      acc.classList.remove('open');
      acc.querySelector('.nav-account-toggle').setAttribute('aria-expanded', 'false');
    }
  });

  // sticky behaviour (desktop shadow only, ~60px threshold)
  const onScroll = () => {
    const header = document.querySelector('header');
    if (header) header.classList.toggle('header-sticky', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const navWrapper = el('div', 'nav-wrapper');
  navWrapper.append(nav);
  block.append(navWrapper, panel, scrim);

  // close the slide-in panel when growing back to desktop
  isDesktop.addEventListener('change', () => { if (isDesktop.matches) closePanel(); });
}
