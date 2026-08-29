const DEFAULT_BASE_URL = "http://localhost/launcher.html";
const CASE_PICKER = "cases";
const LEGACY_CASE_IDS = Object.freeze({ plate: "plate-play" });

function toUrl(input, baseUrl = DEFAULT_BASE_URL) {
  if (input instanceof URL) return new URL(input.href);
  return new URL(String(input), baseUrl);
}

function toKnownSet(values) {
  if (values == null) return null;
  return values instanceof Set ? new Set(values) : new Set(values);
}

function cleanParam(value) {
  return String(value ?? "").trim();
}

function isKnown(value, values) {
  const known = toKnownSet(values);
  return known === null || known.has(value);
}

function writeOptionalParam(url, name, value) {
  if (value === undefined) return;
  const next = cleanParam(value);
  if (next) url.searchParams.set(name, next);
  else url.searchParams.delete(name);
}

function writeStyleParam(url, value, styleIds) {
  if (value === undefined) return;
  const next = cleanParam(value);
  if (next && isKnown(next, styleIds)) url.searchParams.set("style", next);
  else url.searchParams.delete("style");
}

function canonicalizeExistingCase(url, caseIds) {
  const rawCaseId = cleanParam(url.searchParams.get("case"));
  if (!rawCaseId) return;
  const caseId = normalizeCaseId(rawCaseId);
  if (caseId !== rawCaseId && isKnown(caseId, caseIds)) {
    url.searchParams.set("case", caseId);
  }
}

export function normalizeCaseId(value) {
  const caseId = cleanParam(value);
  return LEGACY_CASE_IDS[caseId] || caseId;
}

export function parseCasePickerUrl(input, {
  styleIds,
  caseIds,
  baseUrl = DEFAULT_BASE_URL,
} = {}) {
  const url = toUrl(input, baseUrl);
  const rawPicker = cleanParam(url.searchParams.get("picker"));
  const rawStyle = cleanParam(url.searchParams.get("style"));
  const rawCaseId = cleanParam(url.searchParams.get("case"));
  const normalizedCaseId = normalizeCaseId(rawCaseId);
  const style = rawStyle && isKnown(rawStyle, styleIds) ? rawStyle : null;
  const caseId = normalizedCaseId && isKnown(normalizedCaseId, caseIds) ? normalizedCaseId : null;

  return Object.freeze({
    picker: rawPicker === CASE_PICKER ? CASE_PICKER : null,
    style,
    q: cleanParam(url.searchParams.get("q")),
    category: cleanParam(url.searchParams.get("category")),
    source: cleanParam(url.searchParams.get("source")),
    caseId,
    invalid: Object.freeze({
      picker: rawPicker && rawPicker !== CASE_PICKER ? rawPicker : null,
      style: rawStyle && !style ? rawStyle : null,
      caseId: rawCaseId && !caseId ? normalizedCaseId : null,
    }),
  });
}

export function openCasePickerUrl(input, {
  style,
  q,
  category,
} = {}, {
  styleIds,
  caseIds,
  baseUrl = DEFAULT_BASE_URL,
} = {}) {
  const url = toUrl(input, baseUrl);
  url.searchParams.set("picker", CASE_PICKER);
  writeStyleParam(url, style, styleIds);
  writeOptionalParam(url, "q", q);
  writeOptionalParam(url, "category", category);
  canonicalizeExistingCase(url, caseIds);
  return url;
}

export function replaceCasePickerFiltersUrl(input, {
  style,
  q,
  category,
} = {}, {
  styleIds,
  caseIds,
  baseUrl = DEFAULT_BASE_URL,
} = {}) {
  return openCasePickerUrl(input, { style, q, category }, { styleIds, caseIds, baseUrl });
}

export function selectCaseUrl(input, selectedCaseId, {
  caseIds,
  baseUrl = DEFAULT_BASE_URL,
} = {}) {
  const url = toUrl(input, baseUrl);
  const caseId = normalizeCaseId(selectedCaseId);
  if (!caseId || !isKnown(caseId, caseIds)) {
    throw new RangeError(`Unknown case ID: ${cleanParam(selectedCaseId) || "(empty)"}`);
  }

  url.searchParams.delete("picker");
  url.searchParams.delete("q");
  url.searchParams.delete("category");
  url.searchParams.set("source", "library");
  url.searchParams.set("case", caseId);
  return url;
}

export { CASE_PICKER };
