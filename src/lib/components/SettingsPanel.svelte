<script lang="ts">
  import { getSettings, updateSetting, applyTheme } from '../stores/settings.svelte';
  import { isVibrationSupported } from '../utils/haptics';
  import { isWakeLockSupported } from '../utils/wakelock';

  let { onClose }: { onClose: () => void } = $props();

  const settings = getSettings();

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
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
  onclick={onClose}
  onkeydown={(e) => e.key === 'Escape' && onClose()}>

  <!-- Backdrop -->
  <div class="absolute inset-0 bg-black/50 animate-fade-in"></div>

  <!-- Sheet -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div
    class="relative max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-t-2xl p-6 animate-slide-up sm:max-h-[85vh] sm:rounded-3xl sm:border sm:shadow-2xl"
    style="background-color: var(--bg-secondary); border-color: var(--border);"
    onclick={(e) => e.stopPropagation()}
  >
    <!-- Handle -->
    <div class="w-10 h-1 rounded-full mx-auto mb-4" style="background-color: var(--border);"></div>

    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-bold" style="color: var(--text-primary);">Settings</h2>
      <button
        onclick={onClose}
        class="p-2 rounded-lg text-lg transition-all hover:scale-110"
        style="color: var(--text-muted);"
      >✕</button>
    </div>

    <div class="space-y-6">
      <!-- Theme -->
      <div>
        <h3 class="text-xs font-semibold uppercase tracking-wider mb-2" style="color: var(--text-muted);">
          Appearance
        </h3>
        <div class="flex gap-2">
          {#each [
            { mode: 'dark' as const, icon: '🌙', label: 'Dark' },
            { mode: 'light' as const, icon: '☀️', label: 'Light' },
            { mode: 'system' as const, icon: '💻', label: 'System' }
          ] as { mode, icon, label }}
            <button
              onclick={() => handleDarkMode(mode)}
              class="flex-1 flex flex-col items-center gap-1 py-3 rounded-xl text-sm transition-all"
              style="
                background-color: {settings.value.darkMode === mode ? 'var(--accent-dim)' : 'var(--bg-surface)'};
                border: 1px solid {settings.value.darkMode === mode ? 'var(--accent)' : 'var(--border)'};
                color: {settings.value.darkMode === mode ? 'var(--accent)' : 'var(--text-secondary)'};
              "
            >
              <span class="text-lg">{icon}</span>
              <span class="text-xs font-medium">{label}</span>
            </button>
          {/each}
        </div>
      </div>

      <!-- Counter Options -->
      <div>
        <h3 class="text-xs font-semibold uppercase tracking-wider mb-2" style="color: var(--text-muted);">
          Counter
        </h3>
        <div class="space-y-1">
          <!-- Show mala beads -->
          <label class="flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all hover:brightness-105"
            style="background-color: var(--bg-surface);">
            <div>
              <p class="text-sm font-medium" style="color: var(--text-primary);">Mala Beads</p>
              <p class="text-xs" style="color: var(--text-muted);">Show bead ring visualization</p>
            </div>
            <input
              type="checkbox"
              checked={settings.value.showMalaBeads}
              onchange={() => handleToggle('showMalaBeads')}
              class="w-5 h-5 accent-[var(--accent)]"
            />
          </label>

          <!-- Wake Lock -->
          {#if isWakeLockSupported()}
            <label class="flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all hover:brightness-105"
              style="background-color: var(--bg-surface);">
              <div>
                <p class="text-sm font-medium" style="color: var(--text-primary);">Keep Screen On</p>
                <p class="text-xs" style="color: var(--text-muted);">Prevent screen from sleeping</p>
              </div>
              <input
                type="checkbox"
                checked={settings.value.wakeLockEnabled}
                onchange={() => handleToggle('wakeLockEnabled')}
                class="w-5 h-5 accent-[var(--accent)]"
              />
            </label>
          {/if}
        </div>
      </div>

      <!-- Feedback -->
      <div>
        <h3 class="text-xs font-semibold uppercase tracking-wider mb-2" style="color: var(--text-muted);">
          Feedback
        </h3>
        <div class="space-y-1">
          <!-- Haptic -->
          {#if isVibrationSupported()}
            <label class="flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all hover:brightness-105"
              style="background-color: var(--bg-surface);">
              <div>
                <p class="text-sm font-medium" style="color: var(--text-primary);">Haptic Vibration</p>
                <p class="text-xs" style="color: var(--text-muted);">Vibrate on each count</p>
              </div>
              <input
                type="checkbox"
                checked={settings.value.hapticEnabled}
                onchange={() => handleToggle('hapticEnabled')}
                class="w-5 h-5 accent-[var(--accent)]"
              />
            </label>
          {/if}

          <!-- Audio -->
          <label class="flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all hover:brightness-105"
            style="background-color: var(--bg-surface);">
            <div>
              <p class="text-sm font-medium" style="color: var(--text-primary);">Sound</p>
              <p class="text-xs" style="color: var(--text-muted);">Play sound on each count</p>
            </div>
            <input
              type="checkbox"
              checked={settings.value.audioEnabled}
              onchange={() => handleToggle('audioEnabled')}
              class="w-5 h-5 accent-[var(--accent)]"
            />
          </label>

          {#if settings.value.audioEnabled}
            <div class="flex gap-2 px-3 pb-2">
              <button
                onclick={() => handleAudioType('bell')}
                class="flex-1 py-2 rounded-lg text-xs font-medium transition-all"
                style="
                  background-color: {settings.value.audioType === 'bell' ? 'var(--accent-dim)' : 'var(--bg-secondary)'};
                  color: {settings.value.audioType === 'bell' ? 'var(--accent)' : 'var(--text-muted)'};
                  border: 1px solid {settings.value.audioType === 'bell' ? 'var(--accent)' : 'var(--border)'};
                "
              >🔔 Bell</button>
              <button
                onclick={() => handleAudioType('click')}
                class="flex-1 py-2 rounded-lg text-xs font-medium transition-all"
                style="
                  background-color: {settings.value.audioType === 'click' ? 'var(--accent-dim)' : 'var(--bg-secondary)'};
                  color: {settings.value.audioType === 'click' ? 'var(--accent)' : 'var(--text-muted)'};
                  border: 1px solid {settings.value.audioType === 'click' ? 'var(--accent)' : 'var(--border)'};
                "
              >🔊 Click</button>
            </div>
          {/if}
        </div>
      </div>

      <!-- About -->
      <div class="text-center pt-2 pb-4">
        <p class="text-xs" style="color: var(--text-muted);">
          Mantra — Japa Counter v1.0
        </p>
        <p class="text-[10px] mt-1" style="color: var(--text-muted);">
          Your data is stored locally. No account needed.
        </p>
      </div>
    </div>
  </div>
</div>
