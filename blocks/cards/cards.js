import { createOptimizedPicture } from '../../scripts/aem.js';

/*
 * Cards block.
 * Two authoring modes:
 *  1) Query-index driven (Rule 2): authored with config rows such as
 *       | Cards (destinations) |                          |
 *       | Source               | /query-index.json        |
 *       | Sheet                | destinations             |
 *       | Limit                | 6                        |
 *     → fetches the index, renders cards dynamically with a loading skeleton.
 *  2) Static authored rows (boilerplate default) — each row becomes a card.
 * Variant classes (cards-destinations / cards-articles / cards-logos) style the grid.
 */

function readConfig(block) {
  const cfg = {};
  const rows = [...block.querySelectorAll(':scope > div')];
  let isConfig = false;
  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 2) {
      const key = cells[0].textContent.trim().toLowerCase();
      const val = cells[1].textContent.trim();
      if (['source', 'sheet', 'limit', 'filter'].includes(key)) {
        cfg[key] = val;
        isConfig = true;
      }
    }
  });
  return isConfig ? cfg : null;
}

function skeleton(count) {
  const ul = document.createElement('ul');
  ul.className = 'cards-skeleton';
  ul.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < count; i += 1) {
    const li = document.createElement('li');
    li.innerHTML = '<div class="cards-card-image skeleton-box"></div>'
      + '<div class="cards-card-body"><span class="skeleton-line"></span>'
      + '<span class="skeleton-line short"></span></div>';
    ul.append(li);
  }
  return ul;
}

function cardFromEntry(entry) {
  const li = document.createElement('li');
  const link = entry.ctaLink || entry['cta-link'] || entry.path || '#';
  const ctaText = entry.ctaText || entry['cta-text'] || 'Learn more';

  if (entry.image) {
    const imgWrap = document.createElement('div');
    imgWrap.className = 'cards-card-image';
    const pic = createOptimizedPicture(entry.image, entry.title || '', false, [{ width: '750' }]);
    const img = pic.querySelector('img');
    if (img) { img.loading = 'lazy'; img.decoding = 'async'; }
    imgWrap.append(pic);
    li.append(imgWrap);
  }

  const body = document.createElement('div');
  body.className = 'cards-card-body';
  const parts = [];
  if (entry.category) parts.push(`<p class="cards-category">${entry.category}</p>`);
  if (entry.title || entry.city) parts.push(`<h3 class="cards-title">${entry.title || entry.city}</h3>`);
  if (entry.description) parts.push(`<p class="cards-desc">${entry.description}</p>`);
  if (entry.price) {
    const cur = entry.currency || '';
    parts.push(`<p class="cards-price"><span>from</span> ${cur}${entry.price}</p>`);
  }
  parts.push(`<a class="cards-cta" href="${link}">${ctaText}</a>`);
  body.innerHTML = parts.join('');
  li.append(body);
  return li;
}

async function renderFromIndex(block, cfg) {
  const limit = parseInt(cfg.limit, 10) || 6;
  block.textContent = '';
  block.append(skeleton(limit));
  try {
    const url = new URL(cfg.source, window.location.origin);
    if (cfg.sheet) url.searchParams.set('sheet', cfg.sheet);
    url.searchParams.set('limit', String(limit));
    const res = await fetch(url);
    if (!res.ok) throw new Error(`query-index ${res.status}`);
    const json = await res.json();
    const entries = (json.data || []).slice(0, limit);
    const ul = document.createElement('ul');
    entries.forEach((e) => ul.append(cardFromEntry(e)));
    block.replaceChildren(ul);
  } catch (e) {
    // graceful: clear skeleton, leave empty grid (no hardcoded fallback per Rule 2)
    block.textContent = '';
  }
}

function renderStatic(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const pic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    const newImg = pic.querySelector('img');
    if (newImg) { newImg.loading = 'lazy'; newImg.decoding = 'async'; }
    img.closest('picture').replaceWith(pic);
  });
  block.replaceChildren(ul);
}

export default async function decorate(block) {
  const cfg = readConfig(block);
  if (cfg && cfg.source) {
    await renderFromIndex(block, cfg);
  } else {
    renderStatic(block);
  }
}
