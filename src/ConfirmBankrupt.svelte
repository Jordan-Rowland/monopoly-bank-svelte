<script>
import BackDrop from "./UI/BackDrop.svelte";

export let name;
export let message = "To declare bankruptcy, type 'BANKRUPT' in the field below"
let verify;

function confirmBankrupt() {
  if (verify === "BANKRUPT") {
    dispatch('bankrupt-user')
  }
}
</script>

<BackDrop />
<div class="card">
  <p>
    {message}
  </p>
  <input type="text" name="confirm" bind:value={verify}>
  <button>Confirm</button>
</div>

<style>



</style>
