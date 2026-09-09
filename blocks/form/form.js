/*
 * JSON-driven form block.
 * Authored as a 2-row table:  | Form |  /  | Source | /forms/flight-search.json |
 * Reads the definition (JSON file or DA sheet), renders tabs + fields,
 * and wires the shared validation engine (scripts/form-validator.js).
 */
import { validateField, validateFields } from '../../scripts/form-validator.js';

const ICONS = {
  plane: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L11 19v-5.5L21 16Z"/></svg>',
  'check-circle': '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-2 15-5-5 1.4-1.4L10 14.2l7.6-7.6L19 8l-9 9Z"/></svg>',
  suitcase: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M17 6V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3ZM9 4h6v2H9V4Z"/></svg>',
  search: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M15.5 14h-.8l-.3-.3a6.5 6.5 0 1 0-.7.7l.3.3v.8l5 5 1.5-1.5-5-5Zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14Z"/></svg>',
};

function el(tag, cls, html) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html !== undefined) n.innerHTML = html;
  return n;
}

/** Load a form definition from a JSON file or a DA/Helix sheet. */
async function loadDefinition(source) {
  const res = await fetch(source);
  if (!res.ok) throw new Error(`form source ${source} → ${res.status}`);
  const json = await res.json();
  // Already in native form-definition shape.
  if (json.fieldsets || json.tabs) return json;
  // Otherwise treat as a sheet: rows of Field Name / Type / Label / ... columns.
  const rows = json.data || [];
  const fields = rows.map((r) => {
    const v = {};
    if (String(r.Required).toLowerCase() === 'true') v.required = true;
    if (r.Pattern) v.pattern = r.Pattern;
    if (r.Min) v.minLength = r.Min;
    if (r.Max) v.maxLength = r.Max;
    if (r['Error Message']) v.messages = { required: r['Error Message'], pattern: r['Error Message'] };
    const field = {
      name: r['Field Name'], type: r.Type || 'text', label: r.Label, validation: v,
    };
    if (r.Placeholder) field.placeholder = r.Placeholder;
    return field;
  });
  return { id: 'sheet-form', fieldsets: [{ tab: 'default', fields, submit: { label: 'Submit', style: 'primary' } }] };
}

async function loadDatasource(url, ctx, key) {
  if (!url || ctx.datasources[key]) return;
  try {
    const res = await fetch(url);
    if (!res.ok) return;
    const json = await res.json();
    ctx.datasources[key] = json.data || json;
  } catch (e) { /* datasource optional */ }
}

function labelEl(field, id) {
  const l = el('label', 'form-label');
  l.setAttribute('for', id);
  l.textContent = field.label || field.name;
  return l;
}

function errorEl(id) {
  const e = el('div', 'form-error');
  e.id = `${id}-error`;
  e.setAttribute('aria-live', 'polite');
  return e;
}

/* ---- field renderers ---- */
function renderText(field, id, ctx) {
  const wrap = el('div', 'form-field');
  wrap.append(labelEl(field, id));
  const input = el('input');
  input.type = field.type === 'date' ? 'date' : 'text';
  input.id = id;
  input.name = field.name;
  if (field.placeholder) input.placeholder = field.placeholder;
  if (field.accessibility?.['aria-label']) input.setAttribute('aria-label', field.accessibility['aria-label']);
  input.setAttribute('aria-describedby', `${id}-error`);
  wrap.append(input, errorEl(id));
  ctx.inputs[field.name] = () => input.value;
  return wrap;
}

function renderAutocomplete(field, id, ctx) {
  const wrap = el('div', 'form-field form-autocomplete');
  wrap.append(labelEl(field, id));
  const input = el('input');
  input.type = 'text';
  input.id = id;
  input.name = field.name;
  input.autocomplete = 'off';
  input.setAttribute('role', 'combobox');
  input.setAttribute('aria-autocomplete', 'list');
  input.setAttribute('aria-expanded', 'false');
  if (field.placeholder) input.placeholder = field.placeholder;
  if (field.accessibility?.['aria-label']) input.setAttribute('aria-label', field.accessibility['aria-label']);
  input.setAttribute('aria-describedby', `${id}-error`);
  const list = el('ul', 'form-suggestions');
  list.setAttribute('role', 'listbox');
  loadDatasource(field.datasource, ctx, 'airports');
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    list.innerHTML = '';
    if (q.length < 2) { input.setAttribute('aria-expanded', 'false'); return; }
    const items = (ctx.datasources.airports || []).filter((a) => {
      const code = a.code && a.code.toLowerCase().startsWith(q);
      const city = a.city && a.city.toLowerCase().includes(q);
      const name = a.name && a.name.toLowerCase().includes(q);
      return code || city || name;
    }).slice(0, 6);
    items.forEach((a) => {
      const li = el('li', 'form-suggestion', `<strong>${a.code}</strong> ${a.city} — <span>${a.name}</span>`);
      li.setAttribute('role', 'option');
      li.tabIndex = 0;
      const pick = () => {
        input.value = a.code;
        list.innerHTML = '';
        input.setAttribute('aria-expanded', 'false');
        input.dispatchEvent(new Event('blur'));
      };
      li.addEventListener('click', pick);
      li.addEventListener('keydown', (e) => { if (e.key === 'Enter') pick(); });
      list.append(li);
    });
    input.setAttribute('aria-expanded', items.length ? 'true' : 'false');
  });
  input.addEventListener('blur', () => setTimeout(() => { list.innerHTML = ''; input.setAttribute('aria-expanded', 'false'); }, 150));
  wrap.append(input, list, errorEl(id));
  ctx.inputs[field.name] = () => input.value;
  return wrap;
}

function renderRadioGroup(field, id, ctx) {
  const wrap = el('div', 'form-field form-radio-group');
  const legend = el('span', 'form-label');
  legend.textContent = field.label;
  wrap.append(legend);
  const row = el('div', 'form-radio-row');
  row.setAttribute('role', 'radiogroup');
  row.setAttribute('aria-label', field.label);
  let current = (field.options.find((o) => o.default) || field.options[0]).value;
  field.options.forEach((o) => {
    const bId = `${id}-${o.value}`;
    const btn = el('button', 'form-radio', o.label);
    btn.type = 'button';
    btn.id = bId;
    btn.setAttribute('role', 'radio');
    btn.setAttribute('aria-checked', o.value === current ? 'true' : 'false');
    btn.addEventListener('click', () => {
      current = o.value;
      row.querySelectorAll('.form-radio').forEach((b) => b.setAttribute('aria-checked', 'false'));
      btn.setAttribute('aria-checked', 'true');
      ctx.onChange();
    });
    row.append(btn);
  });
  wrap.append(row);
  ctx.inputs[field.name] = () => current;
  return wrap;
}

function renderDate(field, id, ctx) { return renderText({ ...field, type: 'date' }, id, ctx); }

function renderToggle(field, id, ctx) {
  const wrap = el('div', 'form-field form-toggle-field');
  const btn = el('button', 'form-toggle');
  btn.type = 'button';
  btn.id = id;
  btn.setAttribute('role', 'switch');
  let on = !!field.default;
  btn.setAttribute('aria-checked', String(on));
  btn.innerHTML = `<span class="form-toggle-track"><span class="form-toggle-thumb"></span></span><span class="form-toggle-label">${field.label}</span>`;
  btn.addEventListener('click', () => { on = !on; btn.setAttribute('aria-checked', String(on)); });
  wrap.append(btn);
  ctx.inputs[field.name] = () => (on ? 'true' : 'false');
  return wrap;
}

function renderStepperGroup(field, id, ctx) {
  const wrap = el('div', 'form-field form-stepper-group');
  const legend = el('span', 'form-label');
  legend.textContent = field.label;
  wrap.append(legend);
  field.fields.forEach((sf) => {
    let val = sf.default ?? sf.min ?? 0;
    const row = el('div', 'form-stepper');
    const lbl = el('span', 'form-stepper-label', sf.label);
    const dec = el('button', 'form-stepper-btn', '−');
    const num = el('span', 'form-stepper-value', String(val));
    const inc = el('button', 'form-stepper-btn', '+');
    [dec, inc].forEach((b) => { b.type = 'button'; });
    dec.setAttribute('aria-label', `Decrease ${sf.label}`);
    inc.setAttribute('aria-label', `Increase ${sf.label}`);
    const upd = (d) => {
      val = Math.max(sf.min ?? 0, Math.min(sf.max ?? 99, val + d));
      num.textContent = String(val);
      ctx.onChange();
    };
    dec.addEventListener('click', () => upd(-1));
    inc.addEventListener('click', () => upd(1));
    row.append(lbl, dec, num, inc);
    wrap.append(row);
    ctx.inputs[sf.name] = () => val;
  });
  wrap.append(errorEl(id));
  ctx.groupValidation[field.name] = { validation: field.validation, errId: `${id}-error` };
  return wrap;
}

const RENDERERS = {
  text: renderText,
  autocomplete: renderAutocomplete,
  date: renderDate,
  'radio-group': renderRadioGroup,
  toggle: renderToggle,
  'stepper-group': renderStepperGroup,
};

function collectData(ctx) {
  const data = {};
  Object.entries(ctx.inputs).forEach(([k, get]) => { data[k] = get(); });
  return data;
}

function showError(wrap, name, msg) {
  const errBox = wrap.querySelector(`#${CSS.escape(name)}-error`) || wrap.querySelector('.form-error');
  const input = wrap.querySelector(`[name="${name}"]`);
  if (errBox) errBox.textContent = msg || '';
  if (input) input.setAttribute('aria-invalid', msg ? 'true' : 'false');
  wrap.classList.toggle('has-error', !!msg);
}

function buildTabPanel(fieldset, def, ctx) {
  const panel = el('div', 'form-panel');
  panel.dataset.tab = fieldset.tab;
  const fieldEls = {};
  fieldset.fields.forEach((field) => {
    const id = `${def.id}-${fieldset.tab}-${field.name}`;
    const renderer = RENDERERS[field.type] || renderText;
    const node = renderer(field, id, ctx);
    fieldEls[field.name] = { node, field };
    // per-field blur validation (after first interaction)
    const input = node.querySelector('input, [role="combobox"]');
    if (input && field.validation) {
      input.addEventListener('blur', () => {
        const data = collectData(ctx);
        const msg = validateField(data[field.name], field.validation, data, ctx);
        showError(node, field.name, msg);
        node.dataset.touched = 'true';
      });
      input.addEventListener('input', () => {
        if (node.dataset.touched !== 'true') return;
        const data = collectData(ctx);
        const msg = validateField(data[field.name], field.validation, data, ctx);
        showError(node, field.name, msg);
      });
    }
    panel.append(node);
  });

  // conditional dependsOn wiring
  ctx.dependencies.push(() => {
    const data = collectData(ctx);
    fieldset.fields.forEach((field) => {
      if (!field.dependsOn) return;
      const active = data[field.dependsOn.field] === field.dependsOn.value;
      const node = fieldEls[field.name]?.node;
      if (node) node.style.display = (field.dependsOn.action === 'show' ? active : !active) ? '' : 'none';
    });
  });

  // submit
  const submit = el('button', `form-submit form-submit-${fieldset.submit?.style || 'primary'}`);
  submit.type = 'submit';
  submit.innerHTML = `${fieldset.submit?.icon ? ICONS[fieldset.submit.icon] || '' : ''}<span>${fieldset.submit?.label || 'Submit'}</span>`;
  panel.append(submit);

  panel.addEventListener('submit', (e) => e.preventDefault());
  submit.addEventListener('click', (e) => {
    e.preventDefault();
    const data = collectData(ctx);
    const visibleFields = fieldset.fields.filter((f) => {
      const node = fieldEls[f.name]?.node;
      return !node || node.style.display !== 'none';
    });
    const { valid, errors } = validateFields(visibleFields, data, ctx);
    // group (stepper) validation
    Object.entries(ctx.groupValidation).forEach(([gname, g]) => {
      const msg = validateField(null, g.validation, data, ctx);
      const box = panel.querySelector(`#${CSS.escape(gname)}-${''}`) || document.getElementById(g.errId);
      if (box) box.textContent = msg || '';
      if (msg) errors[gname] = msg;
    });
    Object.entries(fieldEls).forEach(([name, { node }]) => showError(node, name, errors[name] || ''));
    if (!valid || Object.keys(errors).length) {
      const firstBad = Object.keys(errors)[0];
      panel.querySelector(`[name="${firstBad}"]`)?.focus();
      return;
    }
    // build GET action URL
    const url = new URL(def.action, window.location.origin);
    Object.entries(data).forEach(([k, v]) => { if (v !== '' && v != null) url.searchParams.set(k, v); });
    window.open(url.toString(), '_blank', 'noopener');
  });

  return panel;
}

export default async function decorate(block) {
  // read Source from the authored table
  let source = '/forms/flight-search.json';
  const rows = [...block.querySelectorAll(':scope > div')];
  rows.forEach((r) => {
    const cells = [...r.children];
    if (cells.length >= 2 && /source/i.test(cells[0].textContent)) {
      source = cells[1].textContent.trim();
    }
  });
  block.textContent = '';

  let def;
  try {
    def = await loadDefinition(source);
  } catch (e) {
    block.append(el('p', 'form-error', 'Unable to load the form.'));
    return;
  }

  const ctx = {
    inputs: {}, datasources: {}, dependencies: [], groupValidation: {}, onChange: () => {},
  };

  const form = el('form', 'form-root');
  form.setAttribute('novalidate', '');
  if (def.title) {
    const h = el('h2', 'form-title', def.title);
    form.append(h);
  }

  const fallbackTab = (def.fieldsets[0] || {}).tab || 'default';
  const tabs = def.tabs || [{ id: fallbackTab, label: def.title || 'Form', default: true }];
  const tablist = el('div', 'form-tabs');
  tablist.setAttribute('role', 'tablist');
  const panels = el('div', 'form-panels');

  def.fieldsets.forEach((fs) => { panels.append(buildTabPanel(fs, def, ctx)); });

  const activate = (tabId) => {
    tablist.querySelectorAll('.form-tab').forEach((t) => t.setAttribute('aria-selected', String(t.dataset.tab === tabId)));
    panels.querySelectorAll('.form-panel').forEach((p) => { p.hidden = p.dataset.tab !== tabId; });
  };

  tabs.forEach((t) => {
    const btn = el('button', 'form-tab');
    btn.type = 'button';
    btn.dataset.tab = t.id;
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', String(!!t.default));
    btn.innerHTML = `${t.icon ? ICONS[t.icon] || '' : ''}<span>${t.label}</span>`;
    btn.addEventListener('click', () => activate(t.id));
    tablist.append(btn);
  });

  ctx.onChange = () => ctx.dependencies.forEach((fn) => fn());

  form.append(tablist, panels);
  block.append(form);

  const initial = (tabs.find((t) => t.default) || tabs[0]).id;
  activate(initial);
  ctx.onChange();
}
