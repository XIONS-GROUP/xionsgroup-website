// Subtle scroll reveal, applied site-wide from SiteLayout.
// Progressive enhancement: the hiding CSS is scoped to [data-reveal-ready], which only this
// script sets, so without JavaScript every element renders normally.
const TARGETS = '.section-head,.split,.prose,.brand-card,.event-item,.role-step,.numbered-item,.page-hero-copy,.page-hero-aside,.footer-lead,.cta-band,.quote-panel blockquote,.awards-foot,.brand-intro-foot';
const STAGGER = 70;
const MAX_STAGGER = 4;

export function initReveal() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  // The hero runs its own animation and relies on mix-blend-mode; a transform there would
  // create a stacking context and break it.
  const elements = [...document.querySelectorAll<HTMLElement>(TARGETS)].filter(el => !el.closest('.home-hero'));
  if (!elements.length || reduced.matches || !('IntersectionObserver' in window)) return;

  const order = new Map<Element, number>();
  for (const el of elements) {
    const parent = el.parentElement;
    if (!parent) continue;
    const index = order.get(parent) ?? 0;
    order.set(parent, index + 1);
    el.style.transitionDelay = `${Math.min(index, MAX_STAGGER) * STAGGER}ms`;
    el.dataset.reveal = '';
  }
  document.documentElement.dataset.revealReady = '';

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const el = entry.target as HTMLElement;
      el.dataset.reveal = 'in';
      observer.unobserve(el);
      // Drop the delay once shown so a later reflow cannot re-stagger a settled element.
      setTimeout(() => { el.style.transitionDelay = ''; }, 1200);
    }
  }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });

  for (const el of elements) observer.observe(el);
  document.addEventListener('astro:before-swap', () => observer.disconnect(), { once: true });
}
