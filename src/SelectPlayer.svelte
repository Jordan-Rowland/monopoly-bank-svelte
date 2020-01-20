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

.container, section {
  flex-direction: column;
  align-items: stretch;
}

@media (min-width: 640px) {
  .container {
    position: absolute;
    top: 45%;
    left: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  section {
    position: absolute;
    z-index: 2;
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

}

@media (max-width: 640px) {
  .container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  section {
    flex-direction: column;
    width: 80%;
  }

  button, input {
    width: 100%;
  }

  .cancel-button {
    display: block;
  }

}

main {
  margin-top: 50px;
}

</style>
