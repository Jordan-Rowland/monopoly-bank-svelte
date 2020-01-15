<script>
import { fly } from "svelte/transition";

export let messages = [];

</script>


{#if messages}
  <div class="errors">
    {#each messages as message (message)}
      <section
        transition:fly={{x: 900, duration: 300}}
        on:click>
          {message}
      </section>
    {/each}
  </div>
{/if}

<style>

.errors {
  position: fixed;
  top: 25px;
  right: 15px;
  z-index: 10;
}

section {
  font-size: 0.9rem;
  font-weight: 800;
  width: 22.3rem;
  background-color: hsl(0, 75%, 60%);
  color: hsl(0, 25%, 100%);
  padding: 0.75rem;
  margin: 0.25rem 0;
  border-radius: 5px;
}

</style>
