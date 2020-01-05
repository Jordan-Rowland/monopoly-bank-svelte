<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  import SelectPlayer from "./SelectPlayer.svelte";
  import playerStore from "./player-store.js";


  export let name;
  export let money;
  let selectPlayerPayPrompt = false;
  let selectPlayerCollectPrompt = false;

  const players = $playerStore;
  let classes = "";

  const otherPlayers = players.filter(
    player => player.name !== name
  );

  function pay(event) {
    const payer = name;
    const payee = event.detail.player;
    const amount = event.detail.amount;
    if (amount) {
      if (payee === 'all') {
        for (const player of otherPlayers) {
          playerStore.payPlayer(
            payer,
            player.name,
            amount,
          );
        }
      } else {
        playerStore.payPlayer(
          payer,
          payee,
          amount,
      );
     }
      selectPlayerPayPrompt = false;
    }
  }

  function collect(event) {
    const payee = name;
    const payer = event.detail.player;
    const amount = event.detail.amount;
    if (amount) {
      if (payer === 'all') {
        for (const player of otherPlayers) {
          playerStore.payPlayer(
            player.name,
            payee,
            amount,
          );
        }
      } else {
        playerStore.payPlayer(
          payer,
          payee,
          amount,
      );
     }
      selectPlayerCollectPrompt = false;
    }
  }

</script>

{#if selectPlayerPayPrompt}
  <SelectPlayer
    players={otherPlayers}
    action="Pay"
    on:transaction={pay}
    on:close-modal={() => selectPlayerPayPrompt = false}
  />
{/if}

{#if selectPlayerCollectPrompt}
  <SelectPlayer
    players={otherPlayers}
    action="Collect"
    on:transaction={collect}
    on:close-modal={() => selectPlayerCollectPrompt = false}
  />
{/if}

<section>
  <h2>{name}</h2>
  <h5>${money}</h5>
  <button
    on:click={() => selectPlayerPayPrompt = true}>
    Pay Player
  </button>

  <button
    on:click={() => selectPlayerCollectPrompt = true}>
    Collect Money
  </button>

</section>

<style>

section {
  border-radius: 4px;
  border: 1px solid black;
  margin: 1rem auto;
  padding: 1rem;
  width: 65%;
}

.selected-to-pay {
  border: 1.5px solid green;
}

.selected-to-collect {
  border: 1.5px solid red;
}
</style>
