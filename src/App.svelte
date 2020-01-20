<script>
import Player from "./Player.svelte";
import LastMove from "./LastMove.svelte";
import MoveHistory from "./MoveHistory.svelte";
import Error from "./UI/Error.svelte";
import ToolTip from "./UI/ToolTip.svelte";
import StartGame from "./StartGame.svelte";

import playerStore from "./player-store.js";


let viewHistory = false;
let moveHistory = [];
let lastMove = "Click a player's money to bankrupt them";
let errorMessages = [];
let clickedError = "";
let startGamePrompt = true;


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
{#if startGamePrompt}
  <StartGame
    on:error={showError}
    on:initialize-game={() => startGamePrompt = false} />
{:else}


<header>
  <LastMove
    message={lastMove}
    on:click={() => viewHistory = !viewHistory}
  />
</header>
  {#if viewHistory}
    <MoveHistory
      moveHistory={moveHistory}
      on:click={() => viewHistory = false}
    />
  {/if}

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
{/if}

<style>

main {
  margin: 70px auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

section {
  display: flex;
  flex-direction: row;
  width: 100%;
}

@media (min-width: 1280px) {
  section {
    width: 80%;
    justify-content: center;
    align-items: center;
  }

}

@media (max-width: 640px) {
  section {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

}

</style>
