<script>
import BackDrop from "./UI/BackDrop.svelte";

import { createEventDispatcher } from "svelte";
const dispatch = createEventDispatcher();

import potStore from "./pot-store.js";

export let players;
export let action;

let player;
let amount;
let placeholder = `Amount to ${action}`;


function selectPlayer(event) {
  let innerText = event.target.innerText;
  player = innerText.split(" ")[1];
  dispatch('transaction', {player: player, amount: amount});
}


function selectPot(event) {
  dispatch('transaction-pot', {amount: amount});
}


function closeModal() {
  dispatch("close-modal");
}

</script>

<BackDrop on:click={closeModal} />
<div class="container">
  <section>
    <label>
      <input
        type="number"
        bind:value={amount}
        {placeholder}>
    </label>
    {#if action === "Pay"}
      {#each players as player (player.name)}
        <button
          on:click={selectPlayer}>
            {action} {player.name}
        </button>
      {/each}
    {/if}
    {#if players.length > 1}
      <button
        on:click={selectPlayer}>
          {action} all
      </button>
    {:else if action === "Collect"}
      <button
        on:click={selectPlayer}>
          {action} {players[0].name}
      </button>
    {/if}
    <button
      on:click={selectPlayer}>
        {action} bank
    </button>
    <button
      on:click={selectPot}>
        {action} Community Pot(${$potStore})
    </button>
    <button
      class="cancel-button"
      on:click={closeModal}>
        Cancel
    </button>
  </section>
</div>

<style>

section {
  position: absolute;
  z-index: 2;
  top: 25%;
  left: 43%;
  display: flex;
  flex-direction: column;
  width: 15rem;
}

input {
  width: 15rem;
}

.cancel-button {
  display: none;
}


@media (max-width: 640px) {
  .container {
    display: flex;
    justify-content: center;
  }

  .cancel-button {
    display: block;
  }

  section {
    top: 0;
    left: 0;
    position: relative;
    flex-direction: column;
    width: 15rem;
  }

}


main {
  margin-top: 50px;
}

</style>
