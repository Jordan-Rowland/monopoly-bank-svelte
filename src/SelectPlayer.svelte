<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let players;
  let player;

  function selectPlayer(event) {
    player = event.target.innerText;
    // dispatch("select-player", player);
  }

  function pay() {
    dispatch('transaction', player);
  }

</script>

<div id="black-drop"></div>
<section>
  <label>
    Amount
    <input type="number">
  </label>
  <button
    on:click={pay}>
      Transaction
  </button>
  {#each players as player}
    <button
      on:click={selectPlayer}>
        {player.name}
    </button>
  {/each}
</section>

<style>

section {
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 5rem;
  left: 45%;
  top: 35%;
}

#black-drop {
  position: absolute;
  background-color: hsla(0, 0%, 0%, .4);
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}

</style>
