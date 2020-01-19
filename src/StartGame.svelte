<script>
import { createEventDispatcher } from "svelte";
const dispatch = createEventDispatcher();

import playerStore from "./player-store.js";


let players = [
  {
    id: 1,
    name: "",
    money: 1500
  },
  {
    id: 2,
    name: "",
    money: 1500
  },
  {
    id: 3,
    name: "",
    money: 1500
  },
  {
    id: 4,
    name: "",
    money: 1500
  },
  {
    id: 5,
    name: "",
    money: 1500
  },
  {
    id: 6,
    name: "",
    money: 1500
  },
  {
    id: 7,
    name: "",
    money: 1500
  },
  {
    id: 8,
    name: "",
    money: 1500
  }
];

let numOfPlayers = 2;


function initializeGame() {
  const existingPlayers = players.filter(player => {
    if (player.name &&
        typeof player.money === 'number' &&
        player.money > 1) {
      return player.name;
    }
  });
  if (existingPlayers.length !== numOfPlayers) {
    dispatch("error", "Wrong number of players");
    return false;
  } else {
    playerStore.setPlayers(existingPlayers);
    dispatch("initialize-game");
  }
}

</script>

<div class="container">
  <h1>Monopoly Bank</h1>
  <label>
    How many players? <br>
    <input type="number" bind:value={numOfPlayers}>
  </label>
  <br>
  {#if numOfPlayers < 2 || numOfPlayers > 8 || !numOfPlayers}
    <p>Please select a number of players between 2 and 8</p>
  {:else}
    <div class="player-container">
      {#each Array(numOfPlayers) as i, index}
        <article>
          <label>
            Player Name <br>
            <input type="text" bind:value={players[index].name}>
          </label>
          <label>
            Starting Cash <br>
            <input type="number" value="1500" bind:value={players[index].money}>
          </label>
        </article>
      {/each}
    </div>
    <button on:click={initializeGame}>Start Game</button>
  {/if}
</div>

<style>

.container {
  width: 80%;
  margin: 4rem auto;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.player-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 80%;
  justify-content: center;
}

article {
  margin: 0.8rem;
}

button {
  margin-top: 30px;
  width: 60%;
  height: 3rem;
}

</style>
