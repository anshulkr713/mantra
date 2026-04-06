<script lang="ts">
  import JapaCounter from './JapaCounter.svelte';
  import './app.css';

  // Read the current URL directly from the browser
  let currentPath = window.location.pathname;
</script>

{#if currentPath === '/japacounter' || currentPath === '/japacounter/'}
  <JapaCounter />
{:else if currentPath === '/'}
  <!-- 
    The homepage is intentionally blank for now. 
    Tomorrow, you can add your new components here! 
  -->
  <div style="background-color: var(--bg-primary); min-height: 100vh;"></div>
{:else}
  <div style="background-color: var(--bg-primary); color: var(--text-primary); min-height: 100vh; display: flex; align-items: center; justify-content: center;">
    <h1>404 - Not Found</h1>
  </div>
{/if}
