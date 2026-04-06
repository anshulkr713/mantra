<script lang="ts">
  let { count = 0, target = 108, beadColor = '#F97316' }: {
    count: number;
    target: number;
    beadColor?: string;
  } = $props();

  const SUMERU_INDEX = 0; // Top bead is the guru/sumeru bead

  // Calculate bead positions in a circle
  function getBeadPosition(index: number, total: number, radius: number): { x: number; y: number } {
    // Start from top (-90 degrees) and go clockwise
    const angle = ((index / total) * 2 * Math.PI) - (Math.PI / 2);
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius
    };
  }

  function getBeadRadius(isSumeru = false): number {
    const maxR = 5;
    const minR = 2;
    // Circumference of radius 45 is ~282. Max diameter = 282 / target.
    let r = (282 / target) / 2 * 1.4; // allow slight overlap for realistic mala look
    r = Math.max(minR, Math.min(r, maxR));
    return isSumeru ? r * 1.5 : r; // Sumeru is bigger
  }

  function getBeadState(index: number): 'completed' | 'active' | 'inactive' {
    const effectiveCount = count % target;
    if (effectiveCount === 0 && count > 0) {
      // Just completed a round — all are completed
      return 'completed';
    }
    if (index < effectiveCount) return 'completed';
    if (index === effectiveCount) return 'active';
    return 'inactive';
  }

</script>

<div class="relative flex items-center justify-center w-full" style="aspect-ratio: 1;">
  <svg
    viewBox="-55 -55 110 110"
    class="h-full w-full max-w-[22rem] max-h-[22rem] sm:max-w-[26rem] sm:max-h-[26rem] md:max-w-[32rem] md:max-h-[32rem] lg:max-w-[35rem] lg:max-h-[35rem]"
  >
    <defs>
      <!-- 3D lighting overlay to give beads a spherical look -->
      <radialGradient id="sphere-light" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.85"/>
        <stop offset="25%" stop-color="#ffffff" stop-opacity="0.3"/>
        <stop offset="60%" stop-color="#000000" stop-opacity="0.1"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.75"/>
      </radialGradient>
      <!-- Subtle shadow underneath the beads -->
      <filter id="bead-shadow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="0.8" stdDeviation="0.8" flood-color="#000000" flood-opacity="0.5"/>
      </filter>
      <!-- Rudraksha Texture Filter -->
      <filter id="rudraksha" x="-50%" y="-50%" width="200%" height="200%">
        <feTurbulence type="turbulence" baseFrequency="1.0" numOctaves="4" result="noise" />
        <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 2 -0.6" in="noise" result="highContrast" />
        <feDiffuseLighting in="highContrast" lighting-color="#ffffff" surfaceScale="3" result="light">
          <fePointLight x="-5" y="-5" z="10" />
        </feDiffuseLighting>
        <feComposite in="light" in2="SourceGraphic" operator="in" result="textureMask" />
        <feBlend mode="multiply" in="textureMask" in2="SourceGraphic" result="textured" />
        <feDropShadow dx="0" dy="0.8" stdDeviation="0.8" flood-color="#000000" flood-opacity="0.5" in="textured" />
      </filter>
    </defs>

    <!-- Subtle ring track (thread) -->
    <circle
      cx="0" cy="0" r="45"
      fill="none"
      stroke="var(--border)"
      stroke-width="0.8"
      opacity="0.4"
    />

    <!-- Beads -->
    {#each Array(target) as _, i}
      {@const pos = getBeadPosition(i, target, 45)}
      {@const state = getBeadState(i)}
      {@const isSumeru = i === SUMERU_INDEX}
      {@const r = getBeadRadius(isSumeru)}

      <g class="transition-all duration-300">
        <!-- Base color with Rudraksha texture & shadow -->
        <circle
          cx={pos.x}
          cy={pos.y}
          {r}
          fill={state === 'inactive' ? '#444444' : beadColor}
          filter="url(#rudraksha)"
          opacity={state === 'inactive' ? 0.3 : state === 'active' ? 1 : 0.85}
        >
          {#if state === 'active'}
            <animate attributeName="r" values="{r};{r*1.3};{r*1.1}" dur="0.3s" fill="freeze" />
          {/if}
        </circle>
        
        <!-- 3D spherical lighting overlay -->
        <circle
          cx={pos.x}
          cy={pos.y}
          {r}
          fill="url(#sphere-light)"
          opacity={state === 'inactive' ? 0.4 : 1}
          style="mix-blend-mode: overlay;"
        >
          {#if state === 'active'}
            <animate attributeName="r" values="{r};{r*1.3};{r*1.1}" dur="0.3s" fill="freeze" />
          {/if}
        </circle>

        <!-- Glow effect around active bead -->
        {#if state === 'active'}
          <circle
            cx={pos.x}
            cy={pos.y}
            r={r * 1.2}
            fill="none"
            stroke={beadColor}
            stroke-width="0.5"
            opacity="0.6"
          >
            <animate attributeName="r" values="{r * 1.2};{r * 1.8};{r * 1.2}" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
          </circle>
        {/if}
      </g>
    {/each}

    <!-- Center content -->
    <text
      x="0" y="-8"
      text-anchor="middle"
      dominant-baseline="middle"
      fill="var(--text-primary)"
      font-size="18"
      font-weight="700"
      font-family="Inter, system-ui, sans-serif"
      class="select-none"
    >
      {(count > 0 && count % target === 0) ? target : (count % target)}
    </text>

    <text
      x="0" y="6"
      text-anchor="middle"
      dominant-baseline="middle"
      fill="var(--text-muted)"
      font-size="5"
      font-family="Inter, system-ui, sans-serif"
      class="select-none"
    >
      of {target}
    </text>

    <!-- Rounds indicator -->
    {#if Math.floor(count / target) > 0}
      <text
        x="0" y="16"
        text-anchor="middle"
        dominant-baseline="middle"
        fill={beadColor}
        font-size="4.5"
        font-weight="600"
        font-family="Inter, system-ui, sans-serif"
        class="select-none"
      >
        🔄 {Math.floor(count / target)} round{Math.floor(count / target) > 1 ? 's' : ''}
      </text>
    {/if}
  </svg>
</div>
