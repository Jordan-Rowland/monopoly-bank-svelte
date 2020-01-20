<script>
import BackDrop from "./UI/BackDrop.svelte";

import { createEventDispatcher } from "svelte";
const dispatch = createEventDispatcher();

let verifyInput;
export let name;
export let message = `To declare bankruptcy for ${name}, type 'BANKRUPT' in the field below`;

function confirmBankrupt() {
  if (verifyInput === "BANKRUPT") {
    dispatch('bankrupt-user');
  }
}

function closeModal() {
  dispatch("close-modal");
}

</script>

<BackDrop on:click={closeModal} />
<div class="container">
  <div class="card">
    <p>
      {message}
    </p>
    <input type="text" name="confirm" bind:value={verifyInput}>
    <button on:click={confirmBankrupt}>Confirm</button>
    <button on:click={closeModal} class="cancel-button">Cancel</button>
  </div>
</div>

<style>

.container {
  position: absolute;
  top: 25%;
  left: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card {
  position: absolute;
  z-index: 2;
  display: flex;
  flex-direction: column;
  background-color: hsl(0, 100%, 99%);
  border: 2px solid hsl(0, 100%, 92%);
  padding: 1.5rem;
  border-radius: 5px;
  width: 400px;
}

.cancel-button {
  display: none;
}

@media (max-width: 640px) {
  .container {
    position: relative;
    left: 0;
    top: 0;
    width: 90%;
  }

  .card {
    width: 85%;
  }

  .cancel-button {
    display: block;
  }

}

</style>
