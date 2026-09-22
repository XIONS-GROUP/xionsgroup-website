// Dev-only in-place copy editing, driven by the design toolbox in the parent frame.
// Nothing here ships: the entry point is behind an import.meta.env.DEV guard.

// Block-level text containers. Inline formatting (em, strong, br) is deliberately absent so a
// heading like "Imaginer<br><em>la beauté</em>" stays one editable field instead of fragmenting.
const CANDIDATE = 'h1,h2,h3,h4,h5,h6,p,li,blockquote,figcaption,td,th,dt,dd,summary,label,button,a,span';
const ORIGINAL = new WeakMap<HTMLElement, {text: string; html: string}>();
let editing = false;
let focused: HTMLElement | null = null;

const clean = (value: string) => value.replace(/\s+/g, ' ').trim();

function fields() {
  const withText = [...document.querySelectorAll<HTMLElement>(CANDIDATE)]
    .filter(el => !el.closest('#local-preview-launcher') && clean(el.textContent || '') !== '');
  // Keep the innermost text-bearing containers. Only descendants that carry text disqualify a
  // parent, otherwise a link whose arrow sits in an empty <span> would exclude itself and the
  // span both, leaving its words uneditable.
  return withText.filter(el => !withText.some(other => other !== el && el.contains(other)));
}

function describe(el: HTMLElement) {
  const path: string[] = [];
  for (let node: HTMLElement | null = el; node && node !== document.body; node = node.parentElement) {
    const classes = [...node.classList].filter(c => !c.startsWith('astro-')).slice(0, 2);
    path.unshift(node.tagName.toLowerCase() + classes.map(c => `.${c}`).join(''));
  }
  return path.slice(-4).join(' > ');
}

// Type overrides are written as media-query-scoped rules, not inline styles. An inline
// font-size wins at every width, so a desktop value used to leak onto mobile and blow the
// type up there. The preview frame is resized to the device being edited, so the matching
// query is the one that applies.
type Override = { fontFamily?: string; fontSize?: number; lineHeight?: number };
const SCOPES = { mobile: '@media (max-width:700px)', desktop: '@media (min-width:701px)' } as const;
type Scope = keyof typeof SCOPES;
const overrides = new Map<number, Partial<Record<Scope, Override>>>();
let styleSeed = 0;
let overrideSheet: HTMLStyleElement | null = null;

function keyFor(el: HTMLElement) {
  if (!el.dataset.xionsStyle) el.dataset.xionsStyle = String(++styleSeed);
  return Number(el.dataset.xionsStyle);
}

function writeSheet() {
  if (!overrideSheet) {
    overrideSheet = document.createElement('style');
    overrideSheet.id = 'xions-text-overrides';
    document.head.append(overrideSheet);
  }
  const blocks: string[] = [];
  for (const [scope, query] of Object.entries(SCOPES) as [Scope, string][]) {
    const rules: string[] = [];
    for (const [id, byScope] of overrides) {
      const value = byScope[scope];
      if (!value) continue;
      // Astro scopes component rules as `.display[data-astro-cid-…]`, which outranks a plain
      // attribute selector, so this deliberate override layer has to win explicitly.
      const declarations = [
        value.fontFamily ? `font-family:${value.fontFamily} !important` : '',
        value.fontSize ? `font-size:${value.fontSize}px !important` : '',
        value.lineHeight ? `line-height:${value.lineHeight} !important` : ''
      ].filter(Boolean).join(';');
      if (declarations) rules.push(`[data-xions-style="${id}"]{${declarations}}`);
    }
    if (rules.length) blocks.push(`${query}{${rules.join('')}}`);
  }
  overrideSheet.textContent = blocks.join('\n');
}

function report() {
  if (!focused) return post('xions:text-selected', null);
  const style = getComputedStyle(focused);
  const stored = overrides.get(keyFor(focused)) ?? {};
  post('xions:text-selected', {
    path: describe(focused),
    text: clean(focused.textContent || ''),
    overrides: stored,
    fontSize: Math.round(parseFloat(style.fontSize) * 10) / 10,
    lineHeight: Math.round((parseFloat(style.lineHeight) / parseFloat(style.fontSize)) * 100) / 100,
    computedFamily: style.fontFamily.split(',')[0].replace(/["']/g, '')
  });
}

function post(type: string, detail: unknown) {
  parent.postMessage({ type, detail }, location.origin);
}

function changes() {
  return fields().flatMap(el => {
    const before = ORIGINAL.get(el);
    if (!before) return [];
    const text = clean(el.textContent || '');
    const styled = el.dataset.xionsStyle ? overrides.get(Number(el.dataset.xionsStyle)) : undefined;
    if (text === before.text && el.innerHTML === before.html && !styled) return [];
    return [{
      path: describe(el),
      original: before.text,
      updated: text,
      originalHtml: before.html === clean(before.html) ? undefined : before.html,
      updatedHtml: el.innerHTML === text ? undefined : el.innerHTML,
      style: styled || undefined
    }];
  });
}

function onKeydown(event: KeyboardEvent) {
  // Match the source markup, which uses <br /> inside headings rather than block splits.
  if (event.key !== 'Enter') return;
  event.preventDefault();
  const selection = getSelection();
  if (!selection?.rangeCount) return;
  const range = selection.getRangeAt(0);
  range.deleteContents();
  const br = document.createElement('br');
  range.insertNode(br);
  range.setStartAfter(br);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
  onInput();
}
function onFocusIn(event: FocusEvent) {
  const el = (event.target as HTMLElement)?.closest<HTMLElement>('[data-xions-editable]');
  focused = el || null;
  report();
}
function onInput() { post('xions:text-dirty', { count: changes().length }); }
// Links stay editable but must not navigate away from the page being edited.
function onClick(event: MouseEvent) {
  if ((event.target as HTMLElement)?.closest('a')) event.preventDefault();
}

function setEditing(next: boolean) {
  if (next === editing) return;
  editing = next;
  document.documentElement.toggleAttribute('data-xions-editing', editing);
  for (const el of fields()) {
    if (editing) {
      if (!ORIGINAL.has(el)) ORIGINAL.set(el, { text: clean(el.textContent || ''), html: el.innerHTML });
      el.setAttribute('data-xions-editable', '');
      el.contentEditable = 'true';
      el.spellcheck = false;
    } else {
      el.removeAttribute('data-xions-editable');
      el.removeAttribute('contenteditable');
    }
  }
  const method = editing ? 'addEventListener' : 'removeEventListener';
  document[method]('keydown', onKeydown as EventListener, true);
  document[method]('focusin', onFocusIn as EventListener);
  document[method]('input', onInput);
  document[method]('click', onClick as EventListener, true);
  if (!editing) { focused = null; }
  report();
  post('xions:text-dirty', { count: editing ? changes().length : 0 });
}

const style = document.createElement('style');
style.textContent = `
  /* The hero copy sits in a pointer-events:none overlay, so clicks would pass straight through. */
  [data-xions-editing] [data-xions-editable] { pointer-events:auto; outline:1px dashed rgba(194,0,0,.35); outline-offset:3px; cursor:text; }
  [data-xions-editing] [data-xions-editable]:hover { outline-color:rgba(194,0,0,.7); }
  [data-xions-editing] [data-xions-editable]:focus { outline:2px solid #c20000; outline-offset:3px; }
  [data-xions-editing] .light-toggle { display:none !important; }`;
document.head.append(style);

addEventListener('message', event => {
  if (event.origin !== location.origin) return;
  const { type, detail } = event.data || {};
  if (type === 'xions:text-edit-mode') setEditing(!!detail?.enabled);
  if (type === 'xions:text-style' && focused) {
    const scope: Scope = detail?.scope === 'mobile' ? 'mobile' : 'desktop';
    const id = keyFor(focused);
    const byScope = overrides.get(id) ?? {};
    const value: Override = { ...byScope[scope] };
    if (detail?.fontFamily !== undefined) value.fontFamily = detail.fontFamily || undefined;
    if (detail?.fontSize !== undefined) value.fontSize = detail.fontSize || undefined;
    if (detail?.lineHeight !== undefined) value.lineHeight = detail.lineHeight || undefined;
    byScope[scope] = value;
    overrides.set(id, byScope);
    writeSheet();
    report();
    post('xions:text-dirty', { count: changes().length });
  }
  if (type === 'xions:text-collect') post('xions:text-changes', { page: location.pathname, changes: changes() });
  if (type === 'xions:text-revert') {
    for (const el of fields()) {
      const before = ORIGINAL.get(el);
      if (!before) continue;
      el.innerHTML = before.html;
    }
    overrides.clear();
    writeSheet();
    post('xions:text-dirty', { count: 0 });
    report();
  }
});
post('xions:text-ready', { page: location.pathname });

export {};
