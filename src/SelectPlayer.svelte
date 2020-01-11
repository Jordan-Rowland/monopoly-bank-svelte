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
<div class="container">
  <section>
    <label>
      <input
        type="number"
        bind:value={amount}
        placeholder="Amount to pay">
    </label>
    {#each players as player (player.name)}
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

      <button
        class="cancel-button"
        on:click={closeModal}>
          Cancel
      </button>
  </section>
</div>

<style>

#black-drop {
  position: absolute;
  background-color: hsla(0, 0%, 0%, .4);
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}

.container {
  /*position: absolute;*/
  /*position: relative;*/
  /*display: flex;*/
  /*justify-content: center;*/
  /*align-items: center;*/
}

section {
  position: absolute;
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

  #black-drop {
    display: none;
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
