<script>
	import Player from "./Player.svelte";
	import playerStore from "./player-store.js";


</script>

{#each $playerStore as player}
	<Player
		name={player.name}
		money={player.money}
	/>
{/each}

<style>

button {
	width: 200px;
}

</style>
