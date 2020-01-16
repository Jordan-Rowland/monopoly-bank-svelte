<script>
import Player from "./Player.svelte";
import LastMove from "./LastMove.svelte";
import MoveHistory from "./MoveHistory.svelte";
import Error from "./UI/Error.svelte";
import ToolTip from "./UI/ToolTip.svelte";

import playerStore from "./player-store.js";


let viewHistory = false;
let moveHistory = [];
let lastMove = "Make a move!";
let errorMessages = [];
let clickedError = "";

function receiveMessage(event) {
  lastMove = event.detail;
  moveHistory = [lastMove ,...moveHistory];
}

function showError(event) {
  errorMessages = [...errorMessages, event.detail];
}

function clearErrors(event) {
  const error = event.target.innerText;
  errorMessages = errorMessages.filter(i => {
    return i !== error;
  });
}

</script>

{#if errorMessages}
  <Error messages={errorMessages}
    on:click={clearErrors} />
{/if}


<header>
  <LastMove
    message={lastMove}
    on:click={() => viewHistory = !viewHistory}
  />
  {#if viewHistory}
    <MoveHistory
      moveHistory={moveHistory}
      on:click={() => viewHistory = false}
    />
  {/if}
</header>

<main>
  <section>
    {#each $playerStore as player (player.id)}
    	<Player
        id={player.id}
    		name={player.name}
    		money={player.money}
        on:send-message={receiveMessage}
        on:error={showError}
    	/>
    {/each}
  </section>
</main>

<ToolTip />

<style>

@media (max-width: 640px) {
  section {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

}

main {
  margin-top: 70px
}

section {
  display: flex;
}


</style>
