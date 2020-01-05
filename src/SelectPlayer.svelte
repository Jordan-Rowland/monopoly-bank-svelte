<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let players;
  export let action;

  let player;
  let amount;

  function selectPlayer(event) {
    let innerText = event.target.innerText;
    player = innerText.split(" ")[1];
    dispatch('transaction', {player: player, amount: amount});
  }

  function closeModal() {
    dispatch("close-modal");
  }

</script>

<div id="black-drop" on:click={closeModal}></div>
<section>
  <label>
    <input
      type="number"
      bind:value={amount}
      placeholder="Amount to pay">
  </label>
  {#each players as player}
    <button
      on:click={selectPlayer}>
        {action} {player.name}
    </button>
  {/each}
    <button
      on:click={selectPlayer}>
        {action} all
    </button>

    <button
      on:click={selectPlayer}>
        {action} bank
    </button>
</section>

<style>

#black-drop {
  position: absolute;
  background-color: hsla(0, 0%, 0%, .4);
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}

input {
  width: 15rem;
}

section {
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 15rem;
  left: 45%;
  top: 35%;
}

</style>
