<script lang="ts">
  import './app.css';
  import MalaRing from './lib/components/MalaRing.svelte';
  import CounterButton from './lib/components/CounterButton.svelte';
  import SettingsPanel from './lib/components/SettingsPanel.svelte';

  import { getSettings, applyTheme } from './lib/stores/settings.svelte';
  import { tapVibrate, completionVibrate } from './lib/utils/haptics';
  import { playBellSound, playClickSound, playCompletionSound } from './lib/utils/audio';
  import { requestWakeLock, releaseWakeLock } from './lib/utils/wakelock';
  import { createPersistentState } from './lib/stores/persistence.svelte';

  // Basic Persistence
  const sessionCount = createPersistentState<number>('basic-count', 0);
  const sessionTarget = createPersistentState<number>('basic-target', 108);
  const settings = getSettings();

  // State
  let count = $state(sessionCount.value);
  let target = $state(sessionTarget.value);
  let showSettings = $state(false);
  let showSelector = $state(sessionCount.value === 0);

  const QUICK_TARGETS = [11, 21, 54, 108];

  function handleTargetSelect(t: number | 'custom') {
    if (t === 'custom') {
      const val = prompt('Enter custom bead count:', target.toString());
      if (val) {
        const parsed = parseInt(val, 10);
        if (!isNaN(parsed) && parsed > 0) {
          target = parsed;
          sessionTarget.value = parsed;
          showSelector = false;
        }
      }
    } else {
      target = t;
      sessionTarget.value = t;
      showSelector = false;
    }
  }

  // Derived
  let rounds = $derived(Math.floor(count / target));

  // Sync state to persistence
  $effect(() => { sessionCount.value = count; });

  // Apply theme
  $effect(() => {
    applyTheme(settings.value.darkMode);
  });

  // Wake lock
  $effect(() => {
    if (settings.value.wakeLockEnabled) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }
  });

  function handleTap() {
    showSelector = false;
    count++;

    // Haptics
    if (settings.value.hapticEnabled) {
      if (count % target === 0) {
        completionVibrate();
      } else {
        tapVibrate();
      }
    }

    // Audio
    if (settings.value.audioEnabled) {
      if (count % target === 0) {
        playCompletionSound();
      } else {
        settings.value.audioType === 'bell' ? playBellSound() : playClickSound();
      }
    }

  }

  function handleReset() {
    if (count > 0 && confirm('Reset counter to zero?')) {
      count = 0;
      showSelector = true;
    } else if (count === 0) {
      showSelector = true;
    }
  }
</script>
<div class="flex min-h-full flex-col overflow-hidden" style="background-color: var(--bg-primary);">
  <!-- Main Display centered -->
  <main class="relative flex flex-1 flex-col items-center justify-center p-4 sm:p-6 md:p-8">
    <!-- Mala Ring -->
    <div class="relative z-10 mx-auto w-full max-w-sm sm:max-w-md md:max-w-xl lg:max-w-2xl">
      {#if settings.value.showMalaBeads}
        <MalaRing
          {count}
          {target}
          beadColor="#F97316"
        />
      {:else}
        <div
          class="space-y-3 rounded-[2rem] border px-8 py-10 text-center shadow-2xl sm:px-10 sm:py-12 md:px-14 md:py-16"
          style="
            background:
              radial-gradient(circle at top, color-mix(in srgb, var(--accent) 16%, transparent), transparent 50%),
              linear-gradient(180deg, var(--bg-surface), color-mix(in srgb, var(--bg-surface) 82%, var(--bg-secondary)));
            border-color: var(--border);
          "
        >
          <p class="text-xs font-semibold uppercase tracking-[0.35em]" style="color: var(--text-muted);">
            Current Count
          </p>
          <p class="text-6xl font-bold tabular-nums sm:text-7xl md:text-8xl" style="color: var(--text-primary);">
            {(count > 0 && count % target === 0) ? target : (count % target)}
          </p>
          <p class="text-lg sm:text-xl" style="color: var(--text-secondary);">
            of {target}
          </p>
          {#if rounds > 0}
            <p class="text-sm font-medium sm:text-base" style="color: var(--accent);">
              {rounds} round{rounds > 1 ? 's' : ''} completed
            </p>
          {/if}
        </div>
      {/if}
    </div>

    <!-- Central Selector (When count is 0) -->
    {#if showSelector}
      <div class="absolute inset-0 z-30 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm pointer-events-auto animate-fade-in sm:p-6">
        <div class="w-full max-w-xs space-y-6 rounded-3xl p-8 text-center shadow-2xl sm:max-w-sm" style="background-color: var(--bg-surface); border: 2px solid var(--border);">
          <h2 class="text-xl font-bold" style="color: var(--text-primary);">Choose Beads</h2>
          <div class="grid grid-cols-2 gap-3">
            {#each QUICK_TARGETS as t}
              <button
                onclick={() => handleTargetSelect(t)}
                class="py-3 rounded-2xl text-sm font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg border"
                style="
                  background-color: {target === t ? 'var(--accent)' : 'var(--bg-secondary)'};
                  color: {target === t ? 'white' : 'var(--text-secondary)'};
                  border-color: {target === t ? 'var(--accent)' : 'var(--border)'};
                "
              >
                {t} Beads
              </button>
            {/each}
          </div>
          <button
            onclick={() => handleTargetSelect('custom')}
            class="w-full py-3 rounded-2xl text-sm font-medium transition-all opacity-80"
            style="color: var(--text-muted); border: 1px dashed var(--border);"
          >
            Custom Count...
          </button>
        </div>
      </div>
    {/if}

    <!-- Reset Button (Very subtle at bottom) -->
    <button
      onclick={handleReset}
      onpointerdown={(e) => e.stopPropagation()}
      class="absolute bottom-4 z-20 rounded-full px-6 py-2 text-xs font-bold uppercase tracking-widest transition-all hover:brightness-125 sm:bottom-6"
      style="
        background-color: var(--bg-surface);
        color: var(--text-muted);
        border: 1px solid var(--border);
        opacity: 0.6;
      "
    >
      Restart
    </button>

    <!-- Tap Target -->
    <CounterButton onTap={handleTap} />
  </main>

  <!-- Absolute Gear Icon for Settings -->
  <button
    onclick={() => showSettings = true}
    class="absolute right-3 top-3 z-40 rounded-full p-2 transition-transform hover:rotate-45 sm:right-4 sm:top-4"
    style="color: var(--text-muted);"
    aria-label="Settings"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
  </button>

  {#if showSettings}
    <SettingsPanel onClose={() => showSettings = false} />
  {/if}
</div>
