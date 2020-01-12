<script>
import Player from "./Player.svelte";
import LastMove from "./LastMove.svelte";
import MoveHistory from "./MoveHistory.svelte";


import playerStore from "./player-store.js";
let viewHistory = true;
let moveHistory = ["Jim paid Dwight $400"];
let lastMove = "Make a move!";

function receiveMessage(event) {
  lastMove = event.detail;
  console.log(lastMove);
  moveHistory = [lastMove ,...moveHistory];
}

</script>

<header>
  <LastMove
    message={lastMove}
    on:click={() => viewHistory = true}
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
    	/>
    {/each}
  </section>
</main>

<style>

@media (max-width: 640px) {
  section {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  main {
    margin-top: 50px
  }
}

main {
  /*margin: auto;*/
  /*display: flex;*/
  margin-top: 50px
}

section {
  display: flex;
  height: 45rem;
}


</style>
