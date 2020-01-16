<script>
import BackDrop from "./UI/BackDrop.svelte";

import { createEventDispatcher } from "svelte";
const dispatch = createEventDispatcher();

// export let name;
export let message = "To declare bankruptcy, type 'BANKRUPT' in the field below";
let verify;

function confirmBankrupt() {
  if (verify === "BANKRUPT") {
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
    <input type="text" name="confirm" bind:value={verify}>
    <button on:click={confirmBankrupt}>Confirm</button>
  </div>
</div>

<style>

.container {
  /*display: flex;*/
  /*justify-content: center;*/
  /*align-items: center;*/
  /*position: absolute;*/
  /*border: 2px solid red;*/
}

.card {
  z-index: 2;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 25%;
  left: 36.69%;
  background-color: hsl(0, 100%, 99%);
  padding: 1.5rem;
  border-radius: 5px;
}

</style>
