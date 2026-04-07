<script lang="ts">
  import { allAartis } from './lib/data/aartis';
  import './app.css';

  const title = "Mantra Japa";
  const subtitle = "Discover Peace & Devotion";
</script>

<svelte:head>
  <title>Mantra | Authentic Aartis, Stotrams, and Japa Counter</title>
  <meta name="description" content="A premium sanctuary for spiritual practice. Read authentic Aartis, Chalisa, and Stotrams in 8 languages with a built-in virtual Japa Meditation Counter." />
</svelte:head>

<div class="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] w-full overflow-hidden">
  
  <!-- Hero Section -->
  <header class="relative overflow-hidden pt-28 pb-20 px-6 text-center lg:pt-36 lg:pb-28">
    <!-- Abstract background effect -->
    <div class="absolute inset-0 z-0 opacity-60">
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[500px] bg-[var(--accent)] rounded-full blur-[150px] mix-blend-screen pointer-events-none"></div>
    </div>

    <div class="relative z-10 space-y-6 max-w-3xl mx-auto">
      <h1 class="text-6xl md:text-8xl font-bold tracking-tight bg-gradient-to-b from-white to-[var(--text-secondary)] bg-clip-text text-transparent drop-shadow-sm pb-2">
        {title}
      </h1>
      <p class="text-xl md:text-3xl text-[var(--text-secondary)] font-medium max-w-2xl mx-auto drop-shadow-sm">
        {subtitle}
      </p>
      
      <div class="mt-12 pt-4">
        <a 
          href="/japacounter" 
          class="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-[var(--accent)] text-white font-bold text-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_50px_rgba(249,115,22,0.5)] hover:shadow-[0_0_80px_rgba(249,115,22,0.8)] border border-[var(--accent-hover)]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          Open Japa Counter
        </a>
      </div>
    </div>
  </header>

  <!-- Main Content Areas -->
  <main class="relative z-10 px-4 md:px-8 max-w-7xl mx-auto pb-32 space-y-24">
    
    <!-- Sacred Texts Collection -->
    <section>
      <div class="flex items-end justify-between mb-8">
        <div>
          <h2 class="text-3xl font-bold font-serif text-[var(--text-primary)]">Sacred Texts</h2>
          <p class="text-[var(--text-secondary)] mt-2">Authentic Aartis, Stotrams, and Chalisa</p>
        </div>
        <span class="text-sm font-medium text-[var(--accent)] bg-[var(--accent-dim)] px-3 py-1 rounded-full">{allAartis.length} available</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {#each allAartis as aarti}
          <a 
            href={`/aarti/${aarti.slug}`}
            class="group block p-6 md:p-8 rounded-[2rem] bg-gradient-to-b from-[var(--bg-surface)] to-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--accent)] transition-all hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:-translate-y-2 relative overflow-hidden backdrop-blur-sm"
          >
            <!-- Hover highlight glow -->
            <div class="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div class="relative z-10 flex items-start gap-5">
              <div class="w-16 h-16 shrink-0 rounded-2xl bg-[var(--bg-primary)] flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-500 shadow-inner border border-[var(--border)]/50">
                <span class="filter drop-shadow-md">{aarti.deityEmoji}</span>
              </div>
              <div class="space-y-1.5 flex-1 pt-1">
                <h3 class="font-bold text-xl text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors line-clamp-1">{aarti.name}</h3>
                <p class="text-sm text-[var(--text-muted)] line-clamp-2 leading-relaxed opacity-90">{aarti.description}</p>
              </div>
            </div>
          </a>
        {/each}
      </div>
    </section>

    <!-- Future Offerings / Coming Soon -->
    <section class="opacity-80">
      <h2 class="text-2xl font-bold font-serif text-[var(--text-primary)] mb-6 text-center">Spiritual Journey Ahead</h2>
      
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {#each [
          { title: 'Meditation Timers', icon: '⏱️', desc: 'Guided soundscapes and interval bells.' },
          { title: 'Vedic Astrology', icon: '🌜', desc: 'Daily Panchang and auspicious timings.' },
          { title: 'Satsang Connect', icon: '🙏', desc: 'Join global chanting sessions.' }
        ] as feature}
          <div class="p-6 rounded-3xl border border-[var(--border)] bg-[var(--bg-secondary)]/50 text-center space-y-3 relative overflow-hidden">
            <div class="absolute -right-4 -top-4 bg-[var(--bg-surface)] text-[10px] font-bold tracking-widest uppercase text-[var(--text-muted)] px-8 py-1 rotate-45">Coming Soon</div>
            <div class="text-4xl grayscale opacity-50">{feature.icon}</div>
            <h3 class="font-bold text-[var(--text-secondary)]">{feature.title}</h3>
            <p class="text-xs text-[var(--text-muted)] leading-relaxed">{feature.desc}</p>
          </div>
        {/each}
      </div>
    </section>

  </main>
</div>
