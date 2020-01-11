<script>
import Player from "./Player.svelte";
import playerStore from "./player-store.js";


</script>

<main>
  <section>
    {#each $playerStore as player (player.id)}
    	<Player
        id={player.id}
    		name={player.name}
    		money={player.money}
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
