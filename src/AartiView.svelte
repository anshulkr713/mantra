<script lang="ts">
  import { getAartiBySlug, getAvailableLanguages, DEFAULT_LANGUAGE } from './lib/data/aartis';
  import type { Aarti } from './lib/data/aartis';
  import { router } from './lib/stores/router.svelte';

  let { slug, initialLang = '' }: { slug: string, initialLang?: string } = $props();

  let aarti = $derived(getAartiBySlug(slug));
  let availableLanguages = $derived(aarti ? getAvailableLanguages(aarti) : []);
  
  let selectedLangCode = $state(initialLang || DEFAULT_LANGUAGE);
  
  // Reset language when navigating or parsing initialLang
  $effect(() => {
    if (aarti) {
      if (initialLang && availableLanguages.some(l => l.code === initialLang)) {
        selectedLangCode = initialLang;
      } else {
        const hasHindi = availableLanguages.some(l => l.code === DEFAULT_LANGUAGE);
        selectedLangCode = hasHindi ? DEFAULT_LANGUAGE : (availableLanguages[0]?.code ?? '');
        // Silent update to URL to reflect default if none was provided
        if (selectedLangCode) {
          router.navigate(`/aarti/${slug}/${selectedLangCode}`, true);
        }
      }
    }
  });

  // Keep route synced when user clicks a language pill
  function handleLangSelect(code: string) {
    selectedLangCode = code;
    router.navigate(`/aarti/${slug}/${code}`, true);
  }

  let currentTranslation = $derived(aarti?.translations[selectedLangCode]);
  let currentLanguageObj = $derived(availableLanguages.find(l => l.code === selectedLangCode));
</script>

<svelte:head>
  {#if aarti && currentLanguageObj}
    <title>{aarti.name} in {currentLanguageObj.label} - Read Authentic Lyrics | Mantra Japa</title>
    <meta name="description" content="Read the powerful {aarti.name} in {currentLanguageObj.label}. {aarti.description} Complete authentic verses and lyrics." />
  {:else if aarti}
    <title>{aarti.name} - Authentic Lyrics | Mantra Japa</title>
    <meta name="description" content="{aarti.description}" />
  {/if}
</svelte:head>

{#if !aarti}
  <div class="flex h-screen items-center justify-center p-8 text-center bg-[var(--bg-primary)]">
    <div class="space-y-4">
      <h1 class="text-3xl font-bold text-[var(--accent)]">Not Found</h1>
      <p class="text-[var(--text-secondary)]">The requested Aarti could not be located.</p>
      <a href="/" class="inline-block mt-4 rounded-full px-6 py-2 border font-medium hover:bg-[var(--bg-surface)] border-[var(--border)] text-[var(--text-primary)]">Return Home</a>
    </div>
  </div>
{:else}
  <div class="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-y-auto pb-32 w-full">
    <!-- Header -->
    <header class="sticky top-0 z-40 bg-[var(--bg-primary)]/90 backdrop-blur-md border-b border-[var(--border)] px-4 py-4 md:px-8">
      <div class="max-w-4xl mx-auto flex items-center gap-4">
        <a href="/" class="p-2 -ml-2 rounded-full hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] transition-colors" aria-label="Go back">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </a>
        <div>
          <h1 class="text-xl md:text-2xl font-bold flex items-center gap-2">
            {aarti.name} <span class="text-2xl">{aarti.deityEmoji}</span>
          </h1>
          <p class="text-sm text-[var(--text-muted)] truncate max-w-sm">{aarti.description}</p>
        </div>
      </div>
    </header>

    <!-- Language Selector -->
    {#if availableLanguages.length > 0}
      <div class="max-w-4xl mx-auto px-4 py-6 md:px-8">
        <div class="flex flex-wrap gap-2">
          {#each availableLanguages as lang}
            <button
              onclick={() => handleLangSelect(lang.code)}
              class="px-4 py-1.5 rounded-full text-sm font-medium transition-all shadow-sm {selectedLangCode === lang.code ? 'bg-[var(--accent)] text-white border-[var(--accent)] scale-105' : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border)] hover:brightness-110'} border"
            >
              {lang.nativeLabel}
            </button>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Verses Content -->
    <main class="max-w-4xl mx-auto px-4 md:px-8 pt-4 pb-12">
      {#if currentTranslation}
        <div class="space-y-6 md:space-y-8 animate-fade-in text-center">
          {#each currentTranslation.verses as verse, i}
            <p 
              class="text-lg md:text-2xl leading-relaxed text-[var(--text-primary)]"
              style="font-family: {availableLanguages.find(l => l.code === selectedLangCode)?.fontFamily || 'var(--font-serif)'};"
            >
              {verse}
            </p>
          {/each}
        </div>
      {:else}
        <div class="text-center py-20 text-[var(--text-muted)] animate-pulse">
          Translating lyrics...
        </div>
      {/if}
    </main>

    <!-- Floating Action Button for Japa -->
    <div class="fixed bottom-6 right-6 z-50">
      <a 
        href="/japacounter" 
        class="flex items-center gap-2 bg-[var(--accent)] text-white px-6 py-3 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:scale-105 active:scale-95 transition-transform font-bold"
        aria-label="Start Japa Meditation"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        Start Japa
      </a>
    </div>
  </div>
{/if}
