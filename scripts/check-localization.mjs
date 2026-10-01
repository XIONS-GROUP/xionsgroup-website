import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
import { parse } from 'parse5';
import { routes, origin } from '../src/i18n/routes.ts';
import { translate, translations, normalize } from '../src/i18n/en.ts';

const invariant = new Set([
  'XIONS Group', 'XIONS GROUP', 'Xions Group · Paris', 'L’Entropiste', 'Betenoir', 'Sunlution', 'Masqly',
  'Press', 'Contact', 'Menu', 'Français', 'FR', '/', 'English', 'EN', 'Page', 'Langue', 'Language',
  'Beauty · Creativity · Future', 'Instagram', 'LinkedIn', 'Email', 'Cookies', 'Body care · Rituals',
  'Dorian’s Spleen', 'Smart Shield', 'Cellular Reset', 'Structure Renew', 'Paris · France',
  'contact@xionsgroup.com', '.', 'Denis Bellaïche', 'Kris Fang', 'Neo Su', 'Golden Globes',
  'Grammy Awards', 'César', 'Oscars', 'Festival de Cannes', 'Emmy Awards', 'Hollywood',
  'Contact — XIONS GROUP', 'Betenoir — XIONS GROUP', 'L’Entropiste — XIONS GROUP',
  'Sunlution — XIONS GROUP', 'Masqly — XIONS GROUP', 'Logo L’Entropiste', 'Logo Betenoir', 'Logo Sunlution', 'Logo Masqly'
]);
function documentAt(path) {
  const html = readFileSync(`dist${path}index.html`, 'utf8');
  const nodes = [], copy = [];
  function visit(n, excluded = false) {
    nodes.push(n);
    excluded ||= ['script','style','svg','code'].includes(n.tagName);
    if (!excluded && n.nodeName === '#text' && normalize(n.value)) copy.push(normalize(n.value));
    if (!excluded) for (const a of n.attrs || []) {
      if (['alt','aria-label','placeholder','title'].includes(a.name) && a.value) copy.push(normalize(a.value));
      if (n.tagName === 'meta' && a.name === 'content' && (attr(n,'name') === 'description' || ['og:title','og:description'].includes(attr(n,'property')))) copy.push(normalize(a.value));
    }
    (n.childNodes || []).forEach(c => visit(c, excluded));
  }
  visit(parse(html));
  return {html, nodes, copy};
}
function attr(node, name) { return node.attrs?.find(a => a.name === name)?.value; }
const titleSet = new Set();
const sitemap = readFileSync('dist/sitemap.xml', 'utf8');
const live = process.env.CONTEXT === 'production' && process.env.ALLOW_INDEXING === 'true';
const imageOrigin = process.env.CONTEXT && process.env.CONTEXT !== 'production' && process.env.DEPLOY_PRIME_URL ? new URL(process.env.DEPLOY_PRIME_URL).origin : origin;
let pageCount = 0;
for (const [fr, en] of routes) {
  const paths = {fr:`/fr/${fr ? `${fr}/` : ''}`, en:`/en/${en ? `${en}/` : ''}`};
  const french = documentAt(paths.fr);
  const english = documentAt(paths.en);
  for (const value of french.copy) {
    const known = translations[value] !== undefined || invariant.has(value) || /^(?:\d+|© \d{4} XIONS GROUP|Visual study · [\d:]+|\d+ × \d+ px)$/.test(value);
    assert(known, `Missing English copy: ${value}`);
    assert(english.copy.includes(normalize(translate(value))) || ['Langue'].includes(value), `English translation absent on ${paths.en}: ${value}`);
  }
  for (const [locale, doc] of [['fr',french],['en',english]]) {
    const at = paths[locale];
    const find = (tag, name, value) => doc.nodes.find(n => n.tagName === tag && attr(n,name) === value);
    assert.equal(attr(doc.nodes.find(n => n.tagName === 'html'),'lang'), locale, at);
    assert.equal(doc.nodes.filter(n => n.tagName === 'h1').length, 1, `One h1: ${at}`);
    assert.equal(attr(find('link','rel','canonical'),'href'), origin + at, at);
    for (const lang of ['fr','en']) {
      assert.equal(attr(find('link','hreflang',lang),'href'), origin + paths[lang], at);
      const switchers = doc.nodes.filter(n => n.tagName === 'a' && attr(n,'data-language') === lang);
      assert.equal(switchers.length, lang === locale ? 1 : 2, `Mobile choices and single footer toggle: ${at}`);
      for (const link of switchers) assert.equal(attr(link,'href'), paths[lang], at);
    }
    const toggle=doc.nodes.find(n=>n.tagName==='a' && attr(n,'data-language-toggle')!==undefined);
    assert.equal(toggle.childNodes.map(n=>n.value||'').join(''),locale.toUpperCase(),`Footer shows current language: ${at}`);
    assert.equal(attr(toggle,'href'),paths[locale==='fr'?'en':'fr'],`Footer switches language: ${at}`);
    const excluded = ['merci','404'].includes(fr);
    assert.equal(attr(find('meta','name','robots'),'content'), live && !excluded ? 'index, follow' : 'noindex, nofollow', at);
    assert.equal(attr(find('meta','property','og:url'),'content'), origin + at, at);
    assert.equal(attr(find('meta','property','og:image'),'content'), `${imageOrigin}/images/social/xionsgroup-og.png`, at);
    assert.equal(attr(find('meta','name','twitter:card'),'content'),'summary_large_image',at);
    const json = find('script','type','application/ld+json');
    const schema = JSON.parse(json.childNodes.map(n => n.value || '').join(''));
    assert.equal(schema['@graph'].find(n => n['@type'] === 'WebPage').inLanguage,locale,at);
    if (!excluded) {
      const title = attr(find('meta','property','og:title'),'content');
      assert(!titleSet.has(`${locale}:${title}`),`Duplicate title: ${at}`);
      titleSet.add(`${locale}:${title}`);
    }
    assert.equal(sitemap.includes(`<loc>${origin}${at}</loc>`), !excluded, at);
    assert(!doc.html.includes('Plan des visuels · preview'),at);
    for (const n of doc.nodes) {
      const src = attr(n,'src');
      if (src?.startsWith('/')) assert(existsSync(`dist${src.split('?')[0]}`), `Missing asset ${src}`);
      if (locale === 'en' && n.tagName === 'a' && !attr(n,'data-language')) assert(!attr(n,'href')?.startsWith('/fr'),`French link on ${at}`);
    }
    pageCount++;
  }
  if (fr === 'contact') {
    const fields = doc => doc.nodes.filter(n => ['input','select','textarea'].includes(n.tagName)).map(n => [attr(n,'name'), attr(n,'required') !== undefined]);
    assert.deepEqual(fields(english), fields(french), 'Contact form field contract changed');
    const options = doc => doc.nodes.filter(n => n.tagName === 'option').map(n => attr(n,'value') ?? n.childNodes.map(c=>c.value||'').join(''));
    assert.deepEqual(options(english),options(french),'Category values must remain stable');
    assert.equal(attr(english.nodes.find(n=>n.tagName==='form'),'action'),paths.en.replace('contact','thank-you'));
  }
}
assert(!sitemap.includes('visual-plan'));
assert.equal((sitemap.match(/<loc>/g)||[]).length,30);
console.log(`Verified ${pageCount} localized pages: full copy coverage, language pairs, metadata, sitemap, assets and contact field compatibility.`);
