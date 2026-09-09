# Header Migration Plan — alaskaair.com/en-gb (Phase 1: Global Elements)

## Objective
Build a two-tier, sticky, responsive Alaska Airlines **header** block for the EDS project, instrumented from the live source `https://www.alaskaair.com/en-gb/`, matching all 12 requirement groups (two-tier structure, mega-menus, sticky collapse, mobile drawer, en-gb locale, oneworld badge, search). This is Phase 1 of the migration, building on the Phase 0 design tokens already committed.

## Approach
Use the **`excat-navigation-orchestrator`** skill — it is purpose-built for header/nav instrumentation via desktop, mobile, megamenu, and validation sub-agents, requires real screenshots (never assumes structure), and drives Playwright hover-per-item extraction for mega-menus. This matches the requirement to "measure source height exactly — do not guess." A manual build would risk the exact-measurement and hover-reveal pitfalls the requirements call out.

Source of truth: the live `/en-gb/` page rendered in a headless browser (the site is JS-rendered, so static fetch is insufficient — confirmed earlier in this project).

## Key inputs already in place (Phase 0)
- `styles/brand.css` — Alaska tokens: navy `#01426a`, blue `#2774ae`, `Circular`/`AS Circular` font stack, `--nav-height`.
- Requirement adds teal `#00838A`, midnight `#01426A`, and `ASCircularWeb` font family — will reconcile these into the header block CSS / brand tokens.
- Confirmed CMS: AEM, JS-rendered; `/en-gb/` is one of 6 locale variants.

## Requirement coverage map (all applied upfront)
- **Two-tier structure** — dark utility bar (AS mark, Help, locale, Sign In) + white main nav (full logo, nav links, search, oneworld) as two rows in one `<header>`.
- **Mega-menus** — Book / Manage / Atmos Rewards full-width overlay panels, hover(desktop)/tap(mobile), fade-in 0.15s. Contents extracted live via per-item hover.
- **Sticky** — no shadow at load; `.header-sticky` at ~60px scroll → `position:fixed`, desktop shadow, utility bar collapses via `max-height`+`overflow:hidden`, `transition:all .25s ease`.
- **Desktop dims** — utility 36px, nav 64→56px sticky, logo 32→26px, links 14–15px/500 with `#00838A` underline. `--header-height` overridden at mobile.
- **Mobile ≤768px** — single ~56px bar: hamburger L, centred wordmark, search R; utility content moves into drawer; no height change / no shadow on mobile sticky.
- **Mobile hamburger** — 3 lines ~2px/5px, teal, morph to ✕ 0.3s.
- **Mobile drawer** — left slide-in 300px, `translateX(-100%→0)` .3s, Sign In top (teal), accordion nav groups, locale row bottom, scrim `rgba(0,0,0,.5)` (desktop `display:none`).
- **en-gb locale** — GB flag + "English (UK)" in utility bar (popover) and drawer bottom.
- **oneworld** — ~20px roundel far-right desktop; footer-only on mobile.
- **Search** — desktop inline expand (.2s, Esc/✕ collapse); mobile full-width dropdown.

## Deliverables
- `blocks/header/header.js` + `blocks/header/header.css` (instrumented behaviour + styles), plus nav fragment/content wiring.
- Reconciled brand tokens (teal + midnight added).
- Screenshot-based visual verification desktop + mobile vs source, iterated to match.
- Committed to a `phase1-header` branch with a preview link.

## Open items / assumptions
- Locale: header sourced from **/en-gb** per this prompt (utility bar shows English (UK) + GB flag), even though the site inventory analysis was scoped to English-default. Header markup is global; only the locale indicator differs.
- Footer is a separate requirement — this plan covers **header only** (footer will be Phase 1b).
- Proprietary `ASCircularWeb`/`AS Circular` font is not redistributable → system fallback stack (as in Phase 0).

## Checklist
- [ ] Confirm/launch `excat-navigation-orchestrator` for `https://www.alaskaair.com/en-gb/` (header/nav scope)
- [ ] Render `/en-gb/` in headless browser; capture desktop + mobile header screenshots (baseline, no assumptions)
- [ ] Measure exact heights: utility bar, main nav, logo (desktop non-sticky/sticky + mobile)
- [ ] Extract primary nav items and hover-reveal each mega-menu (Book, Manage, Atmos Rewards) panel contents
- [ ] Extract utility-bar items (AS mark, Help, locale/en-gb, Sign In) and right-side items (search, oneworld)
- [ ] Reconcile brand tokens — add teal `#00838A`, midnight `#01426A`, hover `#006269` to header CSS/tokens
- [ ] Build two-tier `<header>` markup (utility row + main nav row) in the header block
- [ ] Implement mega-menu dropdowns (full-width overlay, box-shadow, 0.15s fade-in)
- [ ] Implement sticky behaviour (`.header-sticky` at ~60px, fixed, desktop shadow, utility collapse)
- [ ] Implement sticky collapse transitions (`transition:all .25s ease`, `max-height`+`overflow:hidden`)
- [ ] Apply desktop dimensions + nav link styling with `#00838A` underline states
- [ ] Override `--header-height` at mobile breakpoint (avoid empty white band)
- [ ] Build mobile compact single bar (hamburger L / centred wordmark / search R, ~56px)
- [ ] Implement mobile hamburger → ✕ morph (3 lines, teal, 0.3s)
- [ ] Build left slide-in drawer (300px, Sign In top, accordion nav, locale bottom, scrim)
- [ ] Scope sticky shadow to desktop only; mobile sticky flat + same height
- [ ] Implement en-gb locale indicator (GB flag + "English (UK)") in utility bar + drawer
- [ ] Add oneworld roundel far-right desktop; omit on mobile
- [ ] Implement desktop inline search expand + mobile full-width search dropdown
- [ ] Visual-verify desktop + mobile against source; iterate to match
- [ ] Commit to `phase1-header` branch, preview, and report the `.aem.page` link

---
*This is a planning artifact. Executing the instrumentation, browser rendering, and file writes requires Execute mode.*
