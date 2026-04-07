<script lang="ts">
  import JapaCounter from './JapaCounter.svelte';
  import HomePage from './HomePage.svelte';
  import AartiView from './AartiView.svelte';
  import { router } from './lib/stores/router.svelte';
  import './app.css';

  let currentPath = $derived(router.path);
  
  // Extract slug and language if path is /aarti/some-slug/some-lang
  let isAartiRoute = $derived(currentPath.startsWith('/aarti/'));
  let routeParts = $derived(isAartiRoute ? currentPath.split('/').filter(Boolean) : []);
  let aartiSlug = $derived(routeParts[1] || '');
  let aartiLang = $derived(routeParts[2] || '');
</script>

{#if currentPath === '/japacounter' || currentPath === '/japacounter/'}
  <JapaCounter />
{:else if isAartiRoute && aartiSlug}
  <AartiView slug={aartiSlug} initialLang={aartiLang} />
{:else if currentPath === '/' || currentPath === ''}
  <HomePage />
{:else}
  <div class="flex items-center justify-center min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
    <div class="text-center space-y-4">
      <h1 class="text-6xl font-bold text-[var(--accent)]">OM</h1>
      <p class="text-xl">The path you seek is elsewhere.</p>
      <a href="/" class="inline-block mt-4 rounded-full px-6 py-2 border font-medium hover:bg-[var(--bg-surface)] border-[var(--border)] transition-colors">Return to Center</a>
    </div>
  </div>
{/if}
