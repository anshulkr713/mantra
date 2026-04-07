// A lightweight reactivity-based SPA router for Svelte 5

export const router = $state({
  path: window.location.pathname,
  
  navigate(href: string, replace = false) {
    if (replace) {
      window.history.replaceState({}, '', href);
    } else {
      window.history.pushState({}, '', href);
    }
    this.path = window.location.pathname;
    window.scrollTo(0, 0); // scroll to top on nav
  }
});

// Setup Popstate listener for browser back/forward buttons
if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => {
    router.path = window.location.pathname;
  });

  // Global click interceptor to hijack <a> tags
  window.addEventListener('click', (e) => {
    // Find closest anchor tag
    const link = (e.target as Element).closest('a');
    if (!link) return;

    // Must be a local link
    const href = link.getAttribute('href');
    if (!href || href.startsWith('http') || link.getAttribute('target') === '_blank') return;

    // Must not have modifier keys pressed (user wants new tab)
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;

    // Prevent default reload and navigate SPA
    e.preventDefault();
    router.navigate(href);
  });
}
