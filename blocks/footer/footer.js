// Alaska Airlines footer (en-gb) — self-contained rebuild of the live footer.
// Three stacked zones on one navy (#01426A) block:
//   A: link columns (accordion on mobile)  B: app + social  C: legal / logos.
// Vanilla HTML+CSS+minimal JS (accordion only) — no framework dependency.

const SITE = 'https://www.alaskaair.com/en-gb';
const ICON = '/blocks/footer/icons';

// external-link + new-tab indicator icons (inline, ~10px)
const EXT = '<svg class="ind ind-ext" viewBox="0 0 24 24" width="10" height="10" aria-hidden="true"><path d="M14 3v2h3.59l-9.3 9.29 1.42 1.42L19 6.41V10h2V3h-7ZM5 5h5V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5h-2v5H5V5Z"/></svg>';
const NEWTAB = '<svg class="ind ind-tab" viewBox="0 0 24 24" width="10" height="10" aria-hidden="true"><path d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7ZM14 3v2h3.59l-9.29 9.29 1.41 1.41L19 6.41V10h2V3h-7Z"/></svg>';

// Zone A — link groups (exact labels/order from the live /en-gb footer).
// ext:true → external domain (shows EXT icon, opens new tab).
const GROUPS = [
  {
    heading: 'About Alaska',
    links: [
      ['Who we are', `${SITE}/content/about-us`],
      ['Careers', 'https://careers.alaskaair.com/', true],
      ['Newsroom', 'https://news.alaskaair.com/', true],
      ['Investor relations', 'https://investor.alaskaair.com/', true],
      ['Alaska Star Ventures', `${SITE}/content/about-us/alaska-star-ventures`],
      ['Legal', `${SITE}/content/legal`],
      ['Contract of Carriage', `${SITE}/content/legal/contract-of-carriage/english-COC`],
      ['Privacy notice', `${SITE}/content/legal/privacy-notice`],
    ],
  },
  {
    heading: 'Customer service',
    links: [
      ['Help center', `${SITE}/content/about-us/help-contact`],
      ['Feedback and complaints', `${SITE}/content/about-us/feedback`],
      ['Travel advisories', `${SITE}/content/advisories/travel-advisories`],
      ['Receipts', `${SITE}/booking/reservation-lookup/`],
      ['Customer service commitment', `${SITE}/content/about-us/customer-commitment/customer-commitment-overview`],
      ['Canadian air travel rights', `${SITE}/content/legal/canadian-air-passenger-protection`],
      ['EU/UK 261 air passenger rights', `${SITE}/content/legal/eu-uk-air-passenger-rights`],
      ['Tarmac delay plan', `${SITE}/content/about-us/customer-commitment/customer-commitment-extended-delays`],
      ['Site map', `${SITE}/content/site-map`],
    ],
  },
  {
    heading: 'Products and services',
    links: [
      ['Optional services and fees', `${SITE}/content/travel-info/policies/optional-services-fees`],
      ['Corporate travel', `${SITE}/content/corporate-travel`],
      ['Atmos for Business', `${SITE}/content/easybiz`],
      ['Travel agents', `${SITE}/content/travel-agent`, true],
      ['Cargo', 'https://www.alaskacargo.com/', true],
      ['Gift certificates', `${SITE}/content/gifts-and-products/gift-cards-certificates/gift-card-overview`],
      ['Travel insurance', `${SITE}/content/travel-info/travel-insurance`],
    ],
  },
  {
    heading: 'Get deals',
    cta: true,
    links: [
      ['Sign up now', `${SITE}/atmosrewards/content`, false, 'mail'],
    ],
  },
  {
    heading: 'Feedback',
    cta: true,
    links: [
      ['Give feedback', 'https://www.alaskalistens.com/', true, 'chat'],
    ],
  },
];

const SOCIAL = [
  ['Facebook', 'https://www.facebook.com/alaskaairlines/', '<path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z"/>'],
  ['X', 'https://x.com/AlaskaAir', '<path d="M17.53 3H20.5l-6.49 7.41L21.75 21h-6l-4.7-6.14L5.68 21H2.7l6.94-7.93L2.25 3h6.15l4.25 5.62L17.53 3Zm-1.05 16.2h1.65L7.6 4.71H5.83L16.48 19.2Z"/>'],
  ['Instagram', 'https://www.instagram.com/alaskaair', '<path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16Zm0 3.68A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84Zm0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4Zm6.41-10.85a1.44 1.44 0 1 0 1.44 1.44 1.44 1.44 0 0 0-1.44-1.44Z"/>'],
  ['YouTube', 'https://www.youtube.com/c/AlaskaAirlines', '<path d="M23 12s0-3.19-.4-4.72a2.5 2.5 0 0 0-1.77-1.77C19.3 5.1 12 5.1 12 5.1s-7.3 0-8.83.41A2.5 2.5 0 0 0 1.4 7.28C1 8.81 1 12 1 12s0 3.19.4 4.72a2.5 2.5 0 0 0 1.77 1.77c1.53.41 8.83.41 8.83.41s7.3 0 8.83-.41a2.5 2.5 0 0 0 1.77-1.77C23 15.19 23 12 23 12Zm-13 3.5v-7l6 3.5-6 3.5Z"/>'],
];

function el(tag, cls, html) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html !== undefined) n.innerHTML = html;
  return n;
}

const CTA_ICONS = {
  mail: '<svg class="cta-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z"/></svg>',
  chat: '<svg class="cta-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z"/></svg>',
};

function renderLink([text, href, ext, ctaIcon]) {
  const a = el('a');
  a.href = href;
  if (ext) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
  const lead = CTA_ICONS[ctaIcon] || '';
  // external links carry a single external-link indicator (they also open a new tab)
  a.innerHTML = `${lead}<span>${text}</span>${ext ? EXT : ''}`;
  return a;
}

function buildLinkGroup(group, idx) {
  const col = el('div', group.cta ? 'footer-col footer-col-cta' : 'footer-col');
  const headId = `footer-h-${idx}`;
  const panelId = `footer-p-${idx}`;

  const toggle = el('button', 'footer-col-head');
  toggle.type = 'button';
  toggle.id = headId;
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', panelId);
  toggle.innerHTML = `<span>${group.heading}</span>`
    + '<svg class="footer-chevron" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M7 10l5 5 5-5z"/></svg>';

  const panel = el('ul', 'footer-col-links');
  panel.id = panelId;
  panel.setAttribute('role', 'region');
  panel.setAttribute('aria-labelledby', headId);
  group.links.forEach((l) => {
    const li = el('li');
    li.append(renderLink(l));
    panel.append(li);
  });

  col.append(toggle, panel);
  return col;
}

export default async function decorate(block) {
  block.textContent = '';
  const inner = el('div', 'footer-inner');

  // ===== Zone A — link columns =====
  const zoneA = el('div', 'footer-zone footer-zone-links');
  const grid = el('div', 'footer-grid');
  GROUPS.forEach((g, i) => grid.append(buildLinkGroup(g, i)));

  // "Get the app" column (QR + badges) sits alongside on desktop, in Zone B on mobile
  const appCol = el('div', 'footer-col footer-col-app');
  appCol.innerHTML = `
    <h2 class="footer-col-title">Get the app</h2>
    <div class="footer-app-badges">
      <a href="https://apps.apple.com/app/alaska-airlines/id408855703" aria-label="Download on the App Store" target="_blank" rel="noopener noreferrer"><img src="${ICON}/app-store.svg" alt="Download on the App Store" height="40"></a>
      <a href="https://play.google.com/store/apps/details?id=com.alaskaairlines.android" aria-label="Get it on Google Play" target="_blank" rel="noopener noreferrer"><img src="${ICON}/google-play.svg" alt="Get it on Google Play" height="40"></a>
      <a href="${SITE}/content/mobile" aria-label="Alaska and Hawaiian app"><img src="${ICON}/dual-brand-app.svg" alt="Alaska and Hawaiian app" height="40"></a>
    </div>`;
  grid.append(appCol);
  zoneA.append(grid);

  // ===== Zone B — Follow us + Get the app row =====
  const zoneB = el('div', 'footer-zone footer-zone-connect');
  const social = el('div', 'footer-social');
  social.innerHTML = '<h2 class="footer-col-title">Follow us</h2>';
  const socialRow = el('div', 'footer-social-row');
  SOCIAL.forEach(([label, href, path]) => {
    const a = el('a', 'footer-social-icon');
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.setAttribute('aria-label', label);
    a.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">${path}</svg>`;
    socialRow.append(a);
  });
  social.append(socialRow);
  zoneB.append(social);

  // ===== Zone C — sub-footer / legal =====
  const zoneC = el('div', 'footer-zone footer-zone-legal');
  const notices = el('div', 'footer-notices');
  notices.innerHTML = `
    <p>${EXT}<span>Notice indicator that this external link may not follow the same accessibility or privacy policies as Alaska Airlines.</span></p>
    <p>${NEWTAB}<span>Notice indicator to alert users that action will result in the browser opening a new tab or window.</span></p>`;
  const legalRow = el('div', 'footer-legal-row');
  const year = document.querySelector('meta[name="footer-year"]')?.content || '2026';
  legalRow.innerHTML = `
    <p class="footer-copy">&copy; ${year} Alaska Airlines. All Rights Reserved</p>
    <div class="footer-logos">
      <img class="footer-logo-as" src="${ICON}/alaska-logo-footer.svg" alt="Alaska Airlines" height="34">
      <a href="${SITE}/atmosrewards/content/partners/oneworld" aria-label="oneworld alliance"><img class="footer-logo-ow" src="${ICON}/oneworld.svg" alt="oneworld" height="42"></a>
    </div>`;
  zoneC.append(notices, legalRow);

  inner.append(zoneA, zoneB, zoneC);
  block.append(inner);

  // ===== mobile accordion (one open at a time) =====
  const heads = [...block.querySelectorAll('.footer-col-head')];
  heads.forEach((head) => {
    head.addEventListener('click', () => {
      // only act as accordion under the mobile breakpoint
      if (window.matchMedia('(min-width: 900px)').matches) return;
      const open = head.getAttribute('aria-expanded') === 'true';
      heads.forEach((h) => {
        h.setAttribute('aria-expanded', 'false');
        h.closest('.footer-col').classList.remove('open');
      });
      if (!open) {
        head.setAttribute('aria-expanded', 'true');
        head.closest('.footer-col').classList.add('open');
      }
    });
  });
}
