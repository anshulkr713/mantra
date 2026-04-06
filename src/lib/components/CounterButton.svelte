<script lang="ts">
  let { onTap }: { onTap: () => void } = $props();
  let ripples = $state<Array<{ id: number; x: number; y: number }>>([]);
  let showPulse = $state(false);
  let rippleId = 0;

  function handleTap(e: MouseEvent | TouchEvent) {
    e.preventDefault();

    // Get tap coordinates
    let x: number, y: number;
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();

    if ('touches' in e && e.touches.length > 0) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else if ('clientX' in e) {
      x = (e as MouseEvent).clientX - rect.left;
      y = (e as MouseEvent).clientY - rect.top;
    } else {
      x = rect.width / 2;
      y = rect.height / 2;
    }

    // Add ripple
    const id = ++rippleId;
    ripples = [...ripples, { id, x, y }];

    // Remove ripple after animation
    setTimeout(() => {
      ripples = ripples.filter(r => r.id !== id);
    }, 600);

    // Pulse animation
    showPulse = true;
    setTimeout(() => { showPulse = false; }, 150);

    // Fire the tap handler
    onTap();
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onTap();
      showPulse = true;
      setTimeout(() => { showPulse = false; }, 150);
    }
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="absolute inset-0 z-10 cursor-pointer select-none overflow-hidden"
  ontouchstart={handleTap}
  onmousedown={handleTap}
  onkeydown={handleKeydown}
  role="button"
  tabindex="0"
  aria-label="Tap to count"
  style="touch-action: manipulation; -webkit-user-select: none;"
>
  <!-- Ripples -->
  {#each ripples as ripple (ripple.id)}
    <div
      class="absolute w-16 h-16 rounded-full pointer-events-none animate-ripple"
      style="
        left: {ripple.x - 32}px;
        top: {ripple.y - 32}px;
        background: radial-gradient(circle, var(--accent) 0%, transparent 70%);
        opacity: 0.3;
      "
    ></div>
  {/each}

  <!-- Edge pulse on tap -->
  {#if showPulse}
    <div
      class="absolute inset-0 pointer-events-none"
      style="
        background: radial-gradient(circle at center, transparent 60%, var(--accent) 140%);
        opacity: 0.08;
        animation: fade-in 0.1s ease-out;
      "
    ></div>
  {/if}
</div>
