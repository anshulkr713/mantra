<script lang="ts">
  import { getSettings, updateSetting, applyTheme } from '../stores/settings.svelte';
  import { isVibrationSupported } from '../utils/haptics';
  import { isWakeLockSupported } from '../utils/wakelock';

  let { onClose }: { onClose: () => void } = $props();

  const settings = getSettings();

  const themeOptions = [
    {
      mode: 'dark' as const,
      label: 'Dark',
      description: 'A low-glare theme for dim rooms and night japa.'
    },
    {
      mode: 'light' as const,
      label: 'Light',
      description: 'A brighter surface that stays clear in daylight.'
    },
    {
      mode: 'system' as const,
      label: 'System',
      description: 'Automatically match the theme used by your device.'
    }
  ];

  const audioOptions = [
    {
      type: 'bell' as const,
      label: 'Bell',
      description: 'A softer, meditative sound.'
    },
    {
      type: 'click' as const,
      label: 'Click',
      description: 'A short, crisp feedback sound.'
    }
  ];

  const panelStyle = `
    background:
      radial-gradient(circle at top right, color-mix(in srgb, var(--accent) 18%, transparent), transparent 34%),
      linear-gradient(180deg, color-mix(in srgb, var(--bg-secondary) 95%, transparent), var(--bg-primary));
    border-color: color-mix(in srgb, var(--border) 88%, var(--accent));
  `;

  const headerStyle = `
    background:
      linear-gradient(180deg, color-mix(in srgb, var(--bg-surface) 90%, transparent), color-mix(in srgb, var(--bg-secondary) 70%, transparent));
    border-color: var(--border);
  `;

  const sectionStyle = `
    background:
      linear-gradient(180deg, color-mix(in srgb, var(--bg-surface) 94%, transparent), color-mix(in srgb, var(--bg-secondary) 90%, var(--bg-primary)));
    border-color: var(--border);
  `;

  function handleWindowKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      onClose();
    }
  }

  function handleDarkMode(mode: 'dark' | 'light' | 'system') {
    updateSetting('darkMode', mode);
    applyTheme(mode);
  }

  function handleToggle(key: 'hapticEnabled' | 'audioEnabled' | 'wakeLockEnabled' | 'showMalaBeads') {
    updateSetting(key, !settings.value[key]);
  }

  function handleAudioType(type: 'bell' | 'click') {
    updateSetting('audioType', type);
  }

  function getSelectableStyle(selected: boolean): string {
    return `
      background: ${
        selected
          ? 'linear-gradient(180deg, color-mix(in srgb, var(--accent) 22%, var(--bg-surface)), color-mix(in srgb, var(--accent) 10%, var(--bg-secondary)))'
          : 'linear-gradient(180deg, color-mix(in srgb, var(--bg-surface) 94%, transparent), color-mix(in srgb, var(--bg-secondary) 84%, var(--bg-primary)))'
      };
      border-color: ${selected ? 'var(--accent)' : 'var(--border)'};
      color: ${selected ? 'var(--text-primary)' : 'var(--text-secondary)'};
      box-shadow: ${selected ? '0 18px 40px color-mix(in srgb, var(--accent) 16%, transparent)' : 'none'};
    `;
  }

  function getRowStyle(enabled: boolean): string {
    return `
      background: ${
        enabled
          ? 'linear-gradient(180deg, color-mix(in srgb, var(--accent) 14%, var(--bg-surface)), color-mix(in srgb, var(--bg-surface) 88%, var(--bg-secondary)))'
          : 'linear-gradient(180deg, color-mix(in srgb, var(--bg-surface) 96%, transparent), color-mix(in srgb, var(--bg-secondary) 86%, var(--bg-primary)))'
      };
      border-color: ${enabled ? 'color-mix(in srgb, var(--accent) 55%, var(--border))' : 'var(--border)'};
      box-shadow: ${enabled ? '0 14px 34px color-mix(in srgb, var(--accent) 12%, transparent)' : 'none'};
    `;
  }

  function getSwitchStyle(enabled: boolean): string {
    return `
      background-color: ${enabled ? 'var(--accent)' : 'color-mix(in srgb, var(--bg-secondary) 88%, var(--bg-primary))'};
      box-shadow: inset 0 0 0 1px ${enabled ? 'color-mix(in srgb, var(--accent) 72%, black)' : 'var(--border)'};
    `;
  }

  function getThemeLabel(): string {
    return settings.value.darkMode === 'system'
      ? 'System'
      : settings.value.darkMode === 'dark'
        ? 'Dark'
        : 'Light';
  }

  function getSoundLabel(): string {
    if (!settings.value.audioEnabled) {
      return 'Muted';
    }

    return settings.value.audioType === 'bell' ? 'Bell' : 'Click';
  }

  function getTouchLabel(): string {
    return settings.value.hapticEnabled ? 'Haptics On' : 'Haptics Off';
  }

  function getVisualLabel(): string {
    return settings.value.showMalaBeads ? 'Mala Ring' : 'Compact View';
  }

  function getSummaryCardStyle(highlighted: boolean): string {
    return `
      background: ${
        highlighted
          ? 'linear-gradient(180deg, color-mix(in srgb, var(--accent) 15%, var(--bg-surface)), color-mix(in srgb, var(--accent) 8%, var(--bg-secondary)))'
          : 'linear-gradient(180deg, color-mix(in srgb, var(--bg-surface) 92%, transparent), color-mix(in srgb, var(--bg-secondary) 86%, var(--bg-primary)))'
      };
      border-color: ${highlighted ? 'color-mix(in srgb, var(--accent) 55%, var(--border))' : 'var(--border)'};
      box-shadow: ${highlighted ? '0 16px 34px color-mix(in srgb, var(--accent) 14%, transparent)' : 'none'};
    `;
  }
</script>

<svelte:window onkeydown={handleWindowKeydown} />

<div class="fixed inset-0 z-50 flex items-end justify-center md:items-center md:p-6 lg:p-8">
  <button
    type="button"
    class="absolute inset-0 bg-black/60 backdrop-blur-md animate-fade-in"
    onclick={onClose}
    aria-label="Close settings"
  ></button>

  <div
    role="dialog"
    aria-modal="true"
    aria-labelledby="settings-title"
    tabindex="-1"
    class="relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-[2rem] border shadow-2xl md:max-h-[88dvh] md:max-w-4xl md:rounded-[2rem]"
    style={panelStyle}
  >
    <header
      class="relative overflow-hidden border-b px-4 pb-4 pt-3 sm:px-6 sm:pb-5 md:px-8 md:pb-6 md:pt-5"
      style={headerStyle}
    >
      <div
        class="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full blur-3xl"
        style="background-color: color-mix(in srgb, var(--accent) 22%, transparent);"
      ></div>
      <div
        class="pointer-events-none absolute left-8 top-8 h-20 w-20 rounded-full blur-2xl"
        style="background-color: color-mix(in srgb, var(--text-primary) 8%, transparent);"
      ></div>
      <div class="mx-auto h-1.5 w-14 rounded-full md:hidden" style="background-color: color-mix(in srgb, var(--border) 70%, var(--text-muted));"></div>
      <div class="relative mt-4 flex items-start justify-between gap-4">
        <div class="space-y-2">
          <p class="text-[0.68rem] font-semibold uppercase tracking-[0.35em]" style="color: var(--accent);">
            Preferences
          </p>
          <h2 id="settings-title" class="text-2xl font-semibold sm:text-3xl" style="color: var(--text-primary);">
            Counter Settings
          </h2>
          <p class="max-w-2xl text-sm leading-6 sm:text-base" style="color: var(--text-secondary);">
            Adjust the look and feedback of your japa counter. Everything stays saved on this device.
          </p>
        </div>
        <button
          type="button"
          onclick={onClose}
          class="shrink-0 rounded-full border px-3 py-2 text-sm font-medium transition-transform hover:-translate-y-0.5"
          style="
            background-color: color-mix(in srgb, var(--bg-surface) 82%, transparent);
            border-color: var(--border);
            color: var(--text-secondary);
          "
        >
          Close
        </button>
      </div>

      <div class="relative mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <div
          class="rounded-2xl border px-3 py-3"
          style={getSummaryCardStyle(true)}
        >
          <p class="text-[0.65rem] font-semibold uppercase tracking-[0.22em]" style="color: var(--text-muted);">Theme</p>
          <p class="mt-2 text-sm font-semibold" style="color: var(--text-primary);">{getThemeLabel()}</p>
        </div>
        <div
          class="rounded-2xl border px-3 py-3"
          style={getSummaryCardStyle(settings.value.audioEnabled)}
        >
          <p class="text-[0.65rem] font-semibold uppercase tracking-[0.22em]" style="color: var(--text-muted);">Sound</p>
          <p class="mt-2 text-sm font-semibold" style="color: var(--text-primary);">{getSoundLabel()}</p>
        </div>
        <div
          class="rounded-2xl border px-3 py-3"
          style={getSummaryCardStyle(settings.value.hapticEnabled)}
        >
          <p class="text-[0.65rem] font-semibold uppercase tracking-[0.22em]" style="color: var(--text-muted);">Touch</p>
          <p class="mt-2 text-sm font-semibold" style="color: var(--text-primary);">{getTouchLabel()}</p>
        </div>
        <div
          class="rounded-2xl border px-3 py-3"
          style={getSummaryCardStyle(settings.value.showMalaBeads)}
        >
          <p class="text-[0.65rem] font-semibold uppercase tracking-[0.22em]" style="color: var(--text-muted);">Layout</p>
          <p class="mt-2 text-sm font-semibold" style="color: var(--text-primary);">{getVisualLabel()}</p>
        </div>
      </div>
    </header>

    <div
      class="relative overflow-y-auto px-4 pb-5 pt-4 sm:px-6 md:px-8 md:pb-8 md:pt-6"
      style="padding-bottom: calc(1rem + env(safe-area-inset-bottom));"
    >
      <div class="grid gap-4 md:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
        <div class="space-y-4">
          <section class="rounded-[1.75rem] border p-4 shadow-lg sm:p-5" style={sectionStyle}>
            <div class="mb-4">
              <p class="text-[0.7rem] font-semibold uppercase tracking-[0.3em]" style="color: var(--text-muted);">
                Appearance
              </p>
              <h3 class="mt-2 text-lg font-semibold" style="color: var(--text-primary);">Theme Mode</h3>
            </div>

            <div class="grid gap-3 sm:grid-cols-3">
              {#each themeOptions as option}
                <button
                  type="button"
                  onclick={() => handleDarkMode(option.mode)}
                  class="rounded-[1.25rem] border p-4 text-left transition-all hover:-translate-y-0.5"
                  style={getSelectableStyle(settings.value.darkMode === option.mode)}
                >
                  <div class="flex items-start justify-between gap-3">
                    <div>
                      <p class="text-sm font-semibold" style="color: var(--text-primary);">{option.label}</p>
                      <p class="mt-2 text-xs leading-5" style="color: var(--text-secondary);">{option.description}</p>
                    </div>
                    {#if settings.value.darkMode === option.mode}
                      <span
                        class="rounded-full px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em]"
                        style="
                          background-color: color-mix(in srgb, var(--accent) 22%, transparent);
                          color: var(--accent);
                        "
                      >
                        Active
                      </span>
                    {/if}
                  </div>
                </button>
              {/each}
            </div>
          </section>

          <section class="rounded-[1.75rem] border p-4 shadow-lg sm:p-5" style={sectionStyle}>
            <div class="mb-4">
              <p class="text-[0.7rem] font-semibold uppercase tracking-[0.3em]" style="color: var(--text-muted);">
                Counter
              </p>
              <h3 class="mt-2 text-lg font-semibold" style="color: var(--text-primary);">Display Options</h3>
            </div>

            <div class="space-y-3">
              <button
                type="button"
                onclick={() => handleToggle('showMalaBeads')}
                aria-pressed={settings.value.showMalaBeads}
                class="flex w-full items-center justify-between gap-4 rounded-[1.35rem] border p-4 text-left transition-all hover:-translate-y-0.5"
                style={getRowStyle(settings.value.showMalaBeads)}
              >
                <div class="min-w-0">
                  <p class="text-sm font-semibold sm:text-base" style="color: var(--text-primary);">Mala Beads</p>
                  <p class="mt-1 text-xs leading-5 sm:text-sm" style="color: var(--text-secondary);">
                    Show the bead ring instead of the compact count card.
                  </p>
                </div>
                <div class="flex items-center gap-3">
                  <span
                    class="rounded-full px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em]"
                    style="
                      background-color: color-mix(in srgb, var(--accent) 16%, transparent);
                      color: {settings.value.showMalaBeads ? 'var(--accent)' : 'var(--text-muted)'};
                    "
                  >
                    {settings.value.showMalaBeads ? 'On' : 'Off'}
                  </span>
                <span
                  class={`flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-all ${settings.value.showMalaBeads ? 'justify-end' : 'justify-start'}`}
                  style={getSwitchStyle(settings.value.showMalaBeads)}
                >
                  <span class="h-5 w-5 rounded-full bg-white shadow-md"></span>
                </span>
                </div>
              </button>

              {#if isWakeLockSupported()}
                <button
                  type="button"
                  onclick={() => handleToggle('wakeLockEnabled')}
                  aria-pressed={settings.value.wakeLockEnabled}
                  class="flex w-full items-center justify-between gap-4 rounded-[1.35rem] border p-4 text-left transition-all hover:-translate-y-0.5"
                  style={getRowStyle(settings.value.wakeLockEnabled)}
                >
                  <div class="min-w-0">
                    <p class="text-sm font-semibold sm:text-base" style="color: var(--text-primary);">Keep Screen On</p>
                    <p class="mt-1 text-xs leading-5 sm:text-sm" style="color: var(--text-secondary);">
                      Prevent the display from sleeping during longer sessions.
                    </p>
                  </div>
                  <div class="flex items-center gap-3">
                    <span
                      class="rounded-full px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em]"
                      style="
                        background-color: color-mix(in srgb, var(--accent) 16%, transparent);
                        color: {settings.value.wakeLockEnabled ? 'var(--accent)' : 'var(--text-muted)'};
                      "
                    >
                      {settings.value.wakeLockEnabled ? 'On' : 'Off'}
                    </span>
                  <span
                    class={`flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-all ${settings.value.wakeLockEnabled ? 'justify-end' : 'justify-start'}`}
                    style={getSwitchStyle(settings.value.wakeLockEnabled)}
                  >
                    <span class="h-5 w-5 rounded-full bg-white shadow-md"></span>
                  </span>
                  </div>
                </button>
              {/if}
            </div>
          </section>
        </div>

        <div class="space-y-4">
          <section class="rounded-[1.75rem] border p-4 shadow-lg sm:p-5" style={sectionStyle}>
            <div class="space-y-4">
              <div>
                <p class="text-[0.7rem] font-semibold uppercase tracking-[0.3em]" style="color: var(--text-muted);">
                  Current Setup
                </p>
                <h3 class="mt-2 text-lg font-semibold" style="color: var(--text-primary);">Session Feel</h3>
              </div>

              <div class="grid gap-3 sm:grid-cols-2 md:grid-cols-1">
                <div class="rounded-[1.35rem] border p-4" style={getSummaryCardStyle(settings.value.audioEnabled)}>
                  <p class="text-[0.68rem] font-semibold uppercase tracking-[0.2em]" style="color: var(--text-muted);">Feedback Profile</p>
                  <p class="mt-2 text-base font-semibold" style="color: var(--text-primary);">
                    {settings.value.audioEnabled ? `${getSoundLabel()} + ${getTouchLabel()}` : getTouchLabel()}
                  </p>
                  <p class="mt-1 text-xs leading-5" style="color: var(--text-secondary);">
                    Quick taps feel more deliberate when touch and sound feedback are balanced.
                  </p>
                </div>

                <div class="rounded-[1.35rem] border p-4" style={getSummaryCardStyle(settings.value.showMalaBeads)}>
                  <p class="text-[0.68rem] font-semibold uppercase tracking-[0.2em]" style="color: var(--text-muted);">Visual Rhythm</p>
                  <p class="mt-2 text-base font-semibold" style="color: var(--text-primary);">{getVisualLabel()}</p>
                  <p class="mt-1 text-xs leading-5" style="color: var(--text-secondary);">
                    Use the mala ring for a ceremonial feel, or switch to compact view when you want less visual weight.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section class="rounded-[1.75rem] border p-4 shadow-lg sm:p-5" style={sectionStyle}>
            <div class="mb-4">
              <p class="text-[0.7rem] font-semibold uppercase tracking-[0.3em]" style="color: var(--text-muted);">
                Feedback
              </p>
              <h3 class="mt-2 text-lg font-semibold" style="color: var(--text-primary);">Touch Response</h3>
            </div>

            <div class="space-y-3">
              {#if isVibrationSupported()}
                <button
                  type="button"
                  onclick={() => handleToggle('hapticEnabled')}
                  aria-pressed={settings.value.hapticEnabled}
                  class="flex w-full items-center justify-between gap-4 rounded-[1.35rem] border p-4 text-left transition-all hover:-translate-y-0.5"
                  style={getRowStyle(settings.value.hapticEnabled)}
                >
                <div class="min-w-0">
                  <p class="text-sm font-semibold sm:text-base" style="color: var(--text-primary);">Haptic Vibration</p>
                  <p class="mt-1 text-xs leading-5 sm:text-sm" style="color: var(--text-secondary);">
                    Add a light vibration on each count.
                  </p>
                </div>
                <div class="flex items-center gap-3">
                  <span
                    class="rounded-full px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em]"
                    style="
                      background-color: color-mix(in srgb, var(--accent) 16%, transparent);
                      color: {settings.value.hapticEnabled ? 'var(--accent)' : 'var(--text-muted)'};
                    "
                  >
                    {settings.value.hapticEnabled ? 'On' : 'Off'}
                  </span>
                  <span
                    class={`flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-all ${settings.value.hapticEnabled ? 'justify-end' : 'justify-start'}`}
                    style={getSwitchStyle(settings.value.hapticEnabled)}
                  >
                    <span class="h-5 w-5 rounded-full bg-white shadow-md"></span>
                  </span>
                </div>
                </button>
              {/if}

              <button
                type="button"
                onclick={() => handleToggle('audioEnabled')}
                aria-pressed={settings.value.audioEnabled}
                class="flex w-full items-center justify-between gap-4 rounded-[1.35rem] border p-4 text-left transition-all hover:-translate-y-0.5"
                style={getRowStyle(settings.value.audioEnabled)}
              >
                <div class="min-w-0">
                  <p class="text-sm font-semibold sm:text-base" style="color: var(--text-primary);">Sound</p>
                  <p class="mt-1 text-xs leading-5 sm:text-sm" style="color: var(--text-secondary);">
                    Play a subtle sound with each tap.
                  </p>
                </div>
                <div class="flex items-center gap-3">
                  <span
                    class="rounded-full px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em]"
                    style="
                      background-color: color-mix(in srgb, var(--accent) 16%, transparent);
                      color: {settings.value.audioEnabled ? 'var(--accent)' : 'var(--text-muted)'};
                    "
                  >
                    {settings.value.audioEnabled ? 'On' : 'Off'}
                  </span>
                <span
                  class={`flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-all ${settings.value.audioEnabled ? 'justify-end' : 'justify-start'}`}
                  style={getSwitchStyle(settings.value.audioEnabled)}
                >
                  <span class="h-5 w-5 rounded-full bg-white shadow-md"></span>
                </span>
                </div>
              </button>
            </div>

            {#if settings.value.audioEnabled}
              <div class="mt-4 grid gap-3 sm:grid-cols-2">
                {#each audioOptions as option}
                  <button
                    type="button"
                    onclick={() => handleAudioType(option.type)}
                    class="rounded-[1.25rem] border p-4 text-left transition-all hover:-translate-y-0.5"
                    style={getSelectableStyle(settings.value.audioType === option.type)}
                  >
                    <p class="text-sm font-semibold" style="color: var(--text-primary);">{option.label}</p>
                    <p class="mt-2 text-xs leading-5" style="color: var(--text-secondary);">{option.description}</p>
                  </button>
                {/each}
              </div>
            {/if}
          </section>

          <section class="rounded-[1.75rem] border p-4 shadow-lg sm:p-5" style={sectionStyle}>
            <div class="space-y-4">
              <div>
                <p class="text-[0.7rem] font-semibold uppercase tracking-[0.3em]" style="color: var(--text-muted);">
                  About
                </p>
                <h3 class="mt-2 text-lg font-semibold" style="color: var(--text-primary);">Quiet by Default</h3>
              </div>

              <p class="text-sm leading-6" style="color: var(--text-secondary);">
                Your preferences apply instantly and stay in this browser, so the counter feels consistent across sessions without needing an account.
              </p>

              <div class="flex flex-wrap gap-2">
                <span
                  class="rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]"
                  style="
                    background-color: color-mix(in srgb, var(--bg-surface) 80%, transparent);
                    border-color: var(--border);
                    color: var(--text-secondary);
                  "
                >
                  Private
                </span>
                <span
                  class="rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]"
                  style="
                    background-color: color-mix(in srgb, var(--bg-surface) 80%, transparent);
                    border-color: var(--border);
                    color: var(--text-secondary);
                  "
                >
                  Offline Ready
                </span>
                <span
                  class="rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]"
                  style="
                    background-color: color-mix(in srgb, var(--bg-surface) 80%, transparent);
                    border-color: var(--border);
                    color: var(--text-secondary);
                  "
                >
                  Touch Friendly
                </span>
              </div>

              <div
                class="rounded-[1.35rem] border p-4 text-sm leading-6"
                style="
                  background-color: color-mix(in srgb, var(--bg-surface) 76%, var(--bg-secondary));
                  border-color: var(--border);
                  color: var(--text-secondary);
                "
              >
                Tip: If you prefer a simpler layout on smaller screens, turn off <span style="color: var(--text-primary);">Mala Beads</span> and use the compact count card.
              </div>

              <div class="border-t pt-4 text-xs" style="border-color: var(--border); color: var(--text-muted);">
                Mantra — Japa Counter v1.0
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>

    <footer
      class="border-t px-4 py-3 sm:px-6 md:px-8"
      style="
        background-color: color-mix(in srgb, var(--bg-surface) 72%, transparent);
        border-color: var(--border);
        padding-bottom: calc(0.75rem + env(safe-area-inset-bottom));
      "
    >
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-xs sm:text-sm" style="color: var(--text-secondary);">
          Changes are saved automatically on this device.
        </p>
        <button
          type="button"
          onclick={onClose}
          class="rounded-full px-5 py-2.5 text-sm font-semibold transition-transform hover:-translate-y-0.5"
          style="
            background: linear-gradient(180deg, color-mix(in srgb, var(--accent) 92%, white 8%), var(--accent));
            color: white;
            box-shadow: 0 16px 30px color-mix(in srgb, var(--accent) 28%, transparent);
          "
        >
          Done
        </button>
      </div>
    </footer>
  </div>
</div>
