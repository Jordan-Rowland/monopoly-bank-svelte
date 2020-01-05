<script>
	import Player from "./Player.svelte";
	import playerStore from "./player-store.js";

	// function pay() {
 //    playerStore.payPlayer(
 //      selectedToPay,
 //      selectedToCollect,
 //      300,
 //    );
	// }

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

.header {
	margin: 1rem;
	display: flex;
	justify-content: space-around;
}

</style>
