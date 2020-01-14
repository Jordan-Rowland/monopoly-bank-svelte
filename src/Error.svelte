<script>
import { fly } from "svelte/transition";

export let messages = [];

</script>


{#if messages}
  <div class="errors">
    {#each messages as message}
      <section
        transition:fly={{x: 900, duration: 500}}
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
  width: 20rem;
  height: 3rem;
  background-color: white;
  border: 2px solid blue;
  padding: 10px;
  margin: 0.25rem 0;
  border-radius: 3px;
}

</style>
