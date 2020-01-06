<script>
	import Player from "./Player.svelte";
	import playerStore from "./player-store.js";


</script>

<main>
  <section>
    {#each $playerStore as player}
    	<Player
    		name={player.name}
    		money={player.money}
    	/>
    {/each}
  </section>
</main>

<style>

main {
  margin: auto;
  display: flex;
  justify-content: space-between;
  align-items: space-between;
}

section {
  display: flex;
  height: 45rem;
}

</style>
