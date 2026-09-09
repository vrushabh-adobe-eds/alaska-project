/*
 * Reusable form validation engine.
 * Shared by every `form` block instance — no per-page duplication.
 * Each rule is a pure-ish function: (value, param, formData) => boolean.
 */

/** Resolve a relative date token to a Date.
 *  Supports: today, +Ndays, -Ndays, field:name, ISO string. */
function resolveDate(param, formData) {
  if (!param) return null;
  if (param === 'today') {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }
  const rel = /^([+-])(\d+)days$/.exec(param);
  if (rel) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + (rel[1] === '-' ? -1 : 1) * parseInt(rel[2], 10));
    return d;
  }
  if (param.startsWith('field:')) {
    const other = formData[param.slice(6)];
    return other ? new Date(other) : null;
  }
  const d = new Date(param);
  return Number.isNaN(d.getTime()) ? null : d;
}

// Domain-specific custom rules (extend as needed per project).
export const customRules = {
  validAirport: (v, formData, ctx) => {
    if (!v) return false;
    const list = ctx?.datasources?.airports;
    if (!Array.isArray(list) || !list.length) return true; // no list loaded → don't block
    const q = v.trim().toLowerCase();
    return list.some((a) => (a.code && a.code.toLowerCase() === q)
      || (a.city && a.city.toLowerCase() === q)
      || (a.name && a.name.toLowerCase().includes(q)));
  },
  maxTotalPassengers: (v, formData) => {
    const total = (Number(formData.adults) || 0)
      + (Number(formData.children) || 0)
      + (Number(formData.infants) || 0);
    return total <= 9;
  },
};

// Core rule map.
export const rules = {
  required: (v) => v !== null && v !== undefined && v.toString().trim() !== '',
  minLength: (v, min) => !v || v.toString().length >= Number(min),
  maxLength: (v, max) => !v || v.toString().length <= Number(max),
  pattern: (v, regex) => !v || new RegExp(regex).test(v),
  minDate: (v, param, formData) => {
    if (!v) return true;
    const min = resolveDate(param, formData);
    return !min || new Date(v) >= min;
  },
  maxDate: (v, param, formData) => {
    if (!v) return true;
    const max = resolveDate(param, formData);
    return !max || new Date(v) <= max;
  },
  notEqualTo: (v, otherField, formData) => !v || v !== formData[otherField],
  maxTotal: (v, max, formData) => customRules.maxTotalPassengers(v, formData),
  customRule: (v, ruleName, formData, ctx) => {
    const fn = customRules[ruleName];
    return fn ? fn(v, formData, ctx) : true;
  },
};

// Which validation keys are handled as rules (order matters for message lookup).
const RULE_KEYS = ['required', 'minLength', 'maxLength', 'pattern', 'minDate', 'maxDate', 'notEqualTo', 'maxTotal', 'customRule'];

const DEFAULT_MESSAGES = {
  required: 'This field is required.',
  minLength: 'Value is too short.',
  maxLength: 'Value is too long.',
  pattern: 'Please enter a valid value.',
  minDate: 'Date is too early.',
  maxDate: 'Date is too late.',
  notEqualTo: 'Values must be different.',
  maxTotal: 'Total exceeds the allowed maximum.',
  customRule: 'Invalid value.',
};

/**
 * Validate a single field value against its validation spec.
 * @returns {string|null} error message, or null if valid.
 */
export function validateField(value, validation, formData = {}, ctx = {}) {
  if (!validation) return null;
  const failedKey = RULE_KEYS.find((key) => {
    if (!(key in validation)) return false;
    const fn = rules[key];
    if (!fn) return false;
    return !fn(value, validation[key], formData, ctx);
  });
  if (!failedKey) return null;
  return (validation.messages && validation.messages[failedKey])
    || DEFAULT_MESSAGES[failedKey]
    || 'Invalid value.';
}

/**
 * Validate a set of fields. Returns { valid, errors: {name: message} }.
 * @param {Array} fields flat list of field definitions with .name + .validation
 * @param {Object} formData current values keyed by field name
 */
export function validateFields(fields, formData, ctx = {}) {
  const errors = {};
  fields.forEach((f) => {
    if (!f.name || !f.validation) return;
    const msg = validateField(formData[f.name], f.validation, formData, ctx);
    if (msg) errors[f.name] = msg;
  });
  return { valid: Object.keys(errors).length === 0, errors };
}
