/*
 * Hero block.
 * Default: full-bleed background image with overlaid headline / sub-copy / CTA.
 * Variant `hero (split)`: two-up — copy on one side, image on the other
 *   (used for the Atmos Rewards promo). Variant class comes from the block name.
 * The hero image is the LCP element → loaded eager with high fetch priority.
 */
export default function decorate(block) {
  // promote the hero image for LCP
  const img = block.querySelector('img');
  if (img) {
    img.loading = 'eager';
    img.setAttribute('fetchpriority', 'high');
    img.decoding = 'async';
  }

  // identify the picture wrapper vs the text content
  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => {
      if (cell.querySelector('picture') && cell.children.length <= 1) {
        cell.classList.add('hero-media');
      } else if (cell.textContent.trim() || cell.querySelector('a, h1, h2, p')) {
        cell.classList.add('hero-content');
      }
    });
  });

  // author-friendly: unstyled links in hero content become buttons
  block.querySelectorAll('.hero-content a').forEach((a) => {
    if (!a.className) a.classList.add('button');
  });
}
