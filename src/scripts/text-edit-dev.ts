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

function report() {
  if (!focused) return post('xions:text-selected', null);
  const style = getComputedStyle(focused);
  post('xions:text-selected', {
    path: describe(focused),
    text: clean(focused.textContent || ''),
    fontFamily: focused.style.fontFamily || '',
    fontSize: Math.round(parseFloat(style.fontSize) * 10) / 10,
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
    const styled = el.style.fontFamily || el.style.fontSize;
    if (text === before.text && el.innerHTML === before.html && !styled) return [];
    return [{
      path: describe(el),
      original: before.text,
      updated: text,
      originalHtml: before.html === clean(before.html) ? undefined : before.html,
      updatedHtml: el.innerHTML === text ? undefined : el.innerHTML,
      fontFamily: el.style.fontFamily || undefined,
      fontSize: el.style.fontSize || undefined
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
    if (detail?.fontFamily !== undefined) focused.style.fontFamily = detail.fontFamily;
    if (detail?.fontSize !== undefined) focused.style.fontSize = detail.fontSize ? `${detail.fontSize}px` : '';
    report();
    post('xions:text-dirty', { count: changes().length });
  }
  if (type === 'xions:text-collect') post('xions:text-changes', { page: location.pathname, changes: changes() });
  if (type === 'xions:text-revert') {
    for (const el of fields()) {
      const before = ORIGINAL.get(el);
      if (!before) continue;
      el.innerHTML = before.html;
      el.style.fontFamily = '';
      el.style.fontSize = '';
    }
    post('xions:text-dirty', { count: 0 });
    report();
  }
});
post('xions:text-ready', { page: location.pathname });
