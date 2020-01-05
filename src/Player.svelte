<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  import SelectPlayer from "./SelectPlayer.svelte";
  import playerStore from "./player-store.js";


  export let name;
  export let money;
  let selectPlayerPrompt = false;

  const players = $playerStore;
  let classes = "";

  const otherPlayers = players.filter(
    player => player.name !== name
  );


</script>

{#if selectPlayerPrompt}
  <SelectPlayer players={otherPlayers} />
{/if}

<section>
  <h2>{name}</h2>
  <h5>${money}</h5>
  <button
    on:click={() => selectPlayerPrompt = true}>
    Pay Player(s)
  </button>
</section>

<style>

section {
  border-radius: 4px;
  border: 1px solid black;
  margin: 1rem;
  padding: 1rem;
}

.selected-to-pay {
  border: 1.5px solid green;
}

.selected-to-collect {
  border: 1.5px solid red;
}
</style>
