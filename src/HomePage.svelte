<script lang="ts">
  import { allAartis, getAvailableLanguages, SUPPORTED_LANGUAGES } from './lib/data/aartis';
  import type { Aarti, Language } from './lib/data/aartis';
  import './app.css';

  const brand = 'Mantra';
  const subtitle = 'Sacred texts and a private japa counter, designed for daily practice instead of cluttered browsing.';

  type LibraryEntry = Aarti & {
    languages: Language[];
    languageCount: number;
  };

  const library: LibraryEntry[] = allAartis.map((aarti) => {
    const languages = getAvailableLanguages(aarti);

    return {
      ...aarti,
      languages,
      languageCount: languages.length,
    };
  });

  const featuredSlugs = ['hanuman-chalisa', 'shiv-aarti', 'ganesh-aarti'];

  const featuredTexts = featuredSlugs.reduce<LibraryEntry[]>((items, slug) => {
    const match = library.find((entry) => entry.slug === slug);

    if (match) {
      items.push(match);
    }

    return items;
  }, []);

  const stats = [
    {
      value: `${library.length}`,
      label: 'Sacred texts',
      detail: 'Aarti, chalisa, stotram, and ashtakam.',
    },
    {
      value: `${SUPPORTED_LANGUAGES.length}`,
      label: 'Languages',
      detail: 'Read in the script you actually pray in.',
    },
    {
      value: `${new Set(library.map((entry) => entry.deity)).size}`,
      label: 'Devotional paths',
      detail: 'Shiva, Vishnu, Devi, Hanuman, Surya, and more.',
    },
  ];

  const practiceHighlights = [
    {
      title: 'Built for recitation',
      description: 'High-contrast reading surfaces keep verses calm and legible during daily use.',
    },
    {
      title: 'Language-specific sharing',
      description: 'Each text opens with routeable language views, so the exact script is easy to revisit.',
    },
    {
      title: 'Japa without friction',
      description: 'The counter opens instantly and stays private, offline, and distraction free.',
    },
  ];

  const libraryTags = ['Aarti', 'Chalisa', 'Stotram', 'Ashtakam', 'Sahasranamam'];
</script>

<svelte:head>
  <title>Mantra | Sacred texts and private japa counter</title>
  <meta
    name="description"
    content="Read authentic Aartis, Chalisa, and Stotrams in Indian languages and move directly into a private japa counter built for daily practice."
  />
</svelte:head>

<div class="relative min-h-screen overflow-x-hidden overflow-y-auto bg-[var(--bg-primary)] text-[var(--text-primary)]">
  <div class="pointer-events-none absolute inset-0 overflow-hidden">
    <div class="absolute left-1/2 top-[-12rem] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-[rgba(255,136,54,0.18)] blur-[140px]"></div>
    <div class="absolute right-[-8rem] top-[20rem] h-[24rem] w-[24rem] rounded-full bg-[rgba(255,211,122,0.08)] blur-[120px]"></div>
    <div class="absolute left-[-10rem] top-[42rem] h-[24rem] w-[24rem] rounded-full bg-[rgba(157,102,44,0.12)] blur-[120px]"></div>
    <div class="absolute inset-x-0 top-0 h-[36rem] bg-[linear-gradient(180deg,rgba(255,150,56,0.08),transparent)]"></div>
  </div>

  <header class="relative">
    <div class="mx-auto max-w-7xl px-5 pb-18 pt-6 sm:px-8 lg:px-10 lg:pb-24">
      <nav class="flex items-center justify-between gap-4 rounded-full border border-[var(--border)] bg-[rgba(18,13,9,0.72)] px-4 py-3 shadow-[var(--shadow-soft)] backdrop-blur-xl">
        <div class="flex items-center gap-3">
          <div class="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[radial-gradient(circle_at_top,#3d2a16,#140d08)] text-lg text-[var(--accent)] shadow-[0_10px_30px_rgba(0,0,0,0.22)]">
            ॐ
          </div>
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent-soft)]">{brand}</p>
            <p class="text-xs text-[var(--text-muted)]">Quiet tools for daily devotion</p>
          </div>
        </div>

        <a
          href="/japacounter"
          class="inline-flex items-center gap-2 rounded-full border border-[rgba(255,168,97,0.28)] bg-[rgba(255,148,59,0.12)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition duration-300 hover:border-[var(--accent)] hover:bg-[rgba(255,148,59,0.18)]"
        >
          Open Counter
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </a>
      </nav>

      <div class="grid items-end gap-10 pt-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:gap-12 lg:pt-16">
        <section class="max-w-3xl">
          <p class="text-sm font-semibold uppercase tracking-[0.36em] text-[var(--accent-soft)]">
            Sacred texts and japa
          </p>
          <h1 class="mt-6 font-serif text-6xl leading-[0.88] sm:text-7xl lg:text-[6.75rem]">
            {brand}
            <span class="mt-5 block text-[0.24em] font-sans font-medium uppercase tracking-[0.32em] text-[var(--text-secondary)]">
              for daily practice
            </span>
          </h1>
          <p class="mt-6 max-w-2xl text-base leading-8 text-[var(--text-secondary)] sm:text-lg">
            {subtitle}
          </p>

          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="/japacounter"
              class="inline-flex items-center justify-center gap-3 rounded-full bg-[var(--accent)] px-7 py-4 text-sm font-semibold text-[#2b1707] transition duration-300 hover:-translate-y-0.5 hover:brightness-105"
            >
              Open Japa Counter
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
            </a>
            <a
              href="#library"
              class="inline-flex items-center justify-center gap-3 rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.02)] px-7 py-4 text-sm font-medium text-[var(--text-primary)] transition duration-300 hover:border-[var(--accent)] hover:bg-[rgba(255,255,255,0.05)]"
            >
              Browse Sacred Texts
            </a>
          </div>

          <div class="mt-10 grid gap-3 sm:grid-cols-3">
            {#each stats as stat}
              <article class="rounded-[1.75rem] border border-[rgba(255,255,255,0.06)] bg-[rgba(17,12,8,0.72)] p-5 shadow-[var(--shadow-soft)] backdrop-blur-sm">
                <p class="text-3xl font-semibold text-[var(--text-primary)] sm:text-4xl">{stat.value}</p>
                <p class="mt-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--accent-soft)]">{stat.label}</p>
                <p class="mt-3 text-sm leading-6 text-[var(--text-muted)]">{stat.detail}</p>
              </article>
            {/each}
          </div>
        </section>

        <section class="relative lg:pl-6">
          <div class="absolute inset-0 translate-x-4 translate-y-4 rounded-[2.5rem] border border-white/5 bg-white/[0.02]"></div>
          <div class="relative rounded-[2.5rem] border border-[var(--border-strong)] bg-[linear-gradient(180deg,rgba(26,18,11,0.98),rgba(15,10,7,0.96))] p-6 shadow-[0_36px_120px_rgba(0,0,0,0.34)] sm:p-8">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.34em] text-[var(--text-muted)]">Start here</p>
                <h2 class="mt-3 font-serif text-3xl leading-tight sm:text-[2.2rem]">
                  A quieter path into evening recitation
                </h2>
              </div>
              <span class="rounded-full border border-[rgba(255,172,103,0.22)] bg-[rgba(255,148,59,0.08)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--accent-soft)]">
                Curated
              </span>
            </div>

            <div class="mt-6 space-y-3">
              {#each featuredTexts as aarti}
                <a
                  href={`/aarti/${aarti.slug}`}
                  class="group flex items-start gap-4 rounded-[1.75rem] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-4 transition duration-300 hover:-translate-y-1 hover:border-[rgba(255,151,54,0.34)] hover:bg-[rgba(255,255,255,0.04)]"
                >
                  <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.2rem] border border-white/6 bg-[rgba(7,5,4,0.42)] text-2xl shadow-inner shadow-black/30">
                    {aarti.deityEmoji}
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--text-muted)]">{aarti.deity}</p>
                    <h3 class="mt-1 text-lg font-semibold text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-soft)]">
                      {aarti.name}
                    </h3>
                    <p class="mt-1 line-clamp-2 text-sm leading-6 text-[var(--text-secondary)]">{aarti.description}</p>
                  </div>
                  <div class="shrink-0 text-right">
                    <p class="text-base font-semibold text-[var(--accent-soft)]">{aarti.languageCount}</p>
                    <p class="text-[11px] uppercase tracking-[0.18em] text-[var(--text-muted)]">languages</p>
                  </div>
                </a>
              {/each}
            </div>

            <a
              href="/japacounter"
              class="mt-6 flex items-center justify-between gap-4 rounded-[1.9rem] border border-[rgba(255,165,88,0.22)] bg-[linear-gradient(135deg,rgba(255,152,65,0.15),rgba(255,255,255,0.03))] p-5 transition duration-300 hover:-translate-y-1 hover:border-[rgba(255,165,88,0.36)]"
            >
              <div class="min-w-0">
                <p class="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--text-muted)]">Private counter</p>
                <h3 class="mt-2 text-xl font-semibold leading-snug text-[var(--text-primary)]">
                  Begin a round without leaving the page flow.
                </h3>
                <p class="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                  Open the minimal counter for 11, 21, 54, or 108 beads when you are ready to chant.
                </p>
              </div>
              <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-[#2b1707] shadow-[0_16px_32px_rgba(255,140,43,0.25)]">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v6"/><path d="M12 16v6"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="M2 12h6"/><path d="M16 12h6"/><path d="m4.93 19.07 4.24-4.24"/><path d="m14.83 9.17 4.24-4.24"/></svg>
              </div>
            </a>
          </div>
        </section>
      </div>
    </div>
  </header>

  <main class="relative">
    <section class="mx-auto max-w-7xl px-5 pb-12 sm:px-8 lg:px-10">
      <div class="grid gap-4 lg:grid-cols-[0.88fr_1.12fr]">
        <article class="rounded-[2.25rem] border border-[var(--border)] bg-[rgba(19,13,9,0.72)] p-6 shadow-[var(--shadow-soft)] backdrop-blur-sm sm:p-8">
          <p class="text-xs font-semibold uppercase tracking-[0.34em] text-[var(--accent-soft)]">Read in your script</p>
          <h2 class="mt-4 max-w-lg font-serif text-3xl leading-tight sm:text-4xl">
            One library, familiar languages, no cramped homepage.
          </h2>
          <p class="mt-4 max-w-xl text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
            The page now leads with clear entry points, better spacing, and readable contrast so the content feels devotional instead of improvised.
          </p>
          <div class="mt-6 flex flex-wrap gap-2">
            {#each SUPPORTED_LANGUAGES as language}
              <span class="rounded-full border border-[rgba(255,255,255,0.06)] bg-[rgba(7,5,4,0.34)] px-4 py-2 text-sm text-[var(--text-secondary)]">
                {language.nativeLabel}
              </span>
            {/each}
          </div>
        </article>

        <div class="grid gap-4 sm:grid-cols-3">
          {#each practiceHighlights as item}
            <article class="rounded-[2rem] border border-[rgba(255,255,255,0.06)] bg-[rgba(19,13,9,0.6)] p-5 shadow-[var(--shadow-soft)] backdrop-blur-sm sm:p-6">
              <p class="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--accent-soft)]">Practice</p>
              <h3 class="mt-4 text-xl font-semibold leading-snug text-[var(--text-primary)]">{item.title}</h3>
              <p class="mt-3 text-sm leading-6 text-[var(--text-secondary)]">{item.description}</p>
            </article>
          {/each}
        </div>
      </div>
    </section>

    <section id="library" class="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:px-10 lg:pb-24">
      <div class="flex flex-col gap-6 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div class="max-w-3xl">
          <p class="text-xs font-semibold uppercase tracking-[0.34em] text-[var(--accent-soft)]">Sacred library</p>
          <h2 class="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
            Choose a text and begin.
          </h2>
          <p class="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
            Every text opens into a clean reading view with language-specific URLs, which makes both personal recitation and sharing more reliable.
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          {#each libraryTags as tag}
            <span class="rounded-full border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
              {tag}
            </span>
          {/each}
        </div>
      </div>

      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {#each library as aarti}
          <a
            href={`/aarti/${aarti.slug}`}
            class="group rounded-[2rem] border border-[rgba(255,255,255,0.06)] bg-[linear-gradient(180deg,rgba(23,16,11,0.9),rgba(15,10,7,0.94))] p-6 shadow-[var(--shadow-soft)] transition duration-300 hover:-translate-y-1.5 hover:border-[rgba(255,155,62,0.34)] hover:shadow-[0_34px_90px_rgba(0,0,0,0.28)] sm:p-7"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="flex min-w-0 items-start gap-4">
                <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.35rem] border border-white/6 bg-[rgba(7,5,4,0.48)] text-3xl shadow-inner shadow-black/30">
                  {aarti.deityEmoji}
                </div>
                <div class="min-w-0">
                  <p class="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--text-muted)]">{aarti.deity}</p>
                  <h3 class="mt-2 text-2xl font-semibold leading-tight text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-soft)]">
                    {aarti.name}
                  </h3>
                </div>
              </div>

              <span class="shrink-0 rounded-full border border-[rgba(255,166,92,0.16)] bg-[rgba(255,148,59,0.08)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--accent-soft)]">
                {aarti.languageCount} langs
              </span>
            </div>

            <p class="mt-5 text-sm leading-7 text-[var(--text-secondary)]">
              {aarti.description}
            </p>

            <div class="mt-6 flex items-end justify-between gap-4">
              <div class="flex flex-wrap gap-2">
                {#each aarti.languages.slice(0, 3) as language}
                  <span class="rounded-full border border-[rgba(255,255,255,0.05)] bg-[rgba(8,6,4,0.34)] px-3 py-1 text-xs text-[var(--text-secondary)]">
                    {language.nativeLabel}
                  </span>
                {/each}

                {#if aarti.languageCount > 3}
                  <span class="rounded-full border border-[rgba(255,255,255,0.05)] bg-[rgba(8,6,4,0.34)] px-3 py-1 text-xs text-[var(--text-muted)]">
                    +{aarti.languageCount - 3}
                  </span>
                {/if}
              </div>

              <span class="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-[var(--accent-soft)]">
                Open
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </span>
            </div>
          </a>
        {/each}
      </div>
    </section>
  </main>

  <footer class="relative mx-auto max-w-7xl px-5 pb-14 sm:px-8 lg:px-10">
    <section class="overflow-hidden rounded-[2.4rem] border border-[var(--border-strong)] bg-[linear-gradient(135deg,rgba(255,150,56,0.13),rgba(255,255,255,0.03))] p-8 shadow-[var(--shadow-soft)] sm:p-10">
      <p class="text-xs font-semibold uppercase tracking-[0.34em] text-[var(--accent-soft)]">Ready to begin</p>
      <div class="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div class="max-w-2xl">
          <h2 class="font-serif text-3xl leading-tight sm:text-4xl">
            Move from reading to chanting without switching tools.
          </h2>
          <p class="mt-4 text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
            Browse a text, open your preferred script, and start a round when you want to keep count. The homepage now supports that path directly.
          </p>
        </div>

        <div class="flex flex-col gap-3 sm:flex-row">
          <a
            href="/japacounter"
            class="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[#2b1707] transition duration-300 hover:-translate-y-0.5 hover:brightness-105"
          >
            Open Japa Counter
          </a>
          <a
            href="#library"
            class="inline-flex items-center justify-center rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] px-6 py-3 text-sm font-medium text-[var(--text-primary)] transition duration-300 hover:border-[var(--accent)]"
          >
            Browse Library
          </a>
        </div>
      </div>
    </section>
  </footer>
</div>
