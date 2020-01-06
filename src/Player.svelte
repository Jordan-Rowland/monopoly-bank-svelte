<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  import SelectPlayer from "./SelectPlayer.svelte";
  import playerStore from "./player-store.js";
  import potStore from "./pot-store.js";


  export let name;
  export let money;
  const players = $playerStore;

  let selectPlayerPayPrompt = false;
  let selectPlayerCollectPrompt = false;
  let classes = "";
  let potAmount;

  const otherPlayers = players.filter(
    player => player.name !== name
  );

  function pay(event) {
    const payer = name;
    const payee = event.detail.player;
    const amount = event.detail.amount;
    if (!amount) {
      console.log("No amount");
    }
    // Move this logic to store
    if (money < amount) {
      console.log("Not enough money");
      return false;
    }
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

  function collect(event) {
    const payer = event.detail.player;
    const payee = name;
    const amount = event.detail.amount;
    if (!amount) {
      console.log("No amount");
    }
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

  function payPot() {
    playerStore.pay(name, potAmount);
    console.log(`Paid ${potAmount} to community pot`);
    money -= potAmount;
    potStore.payPot(potAmount);

    potAmount = null;
  }

  function collectPot() {
    playerStore.collect(name, $potStore);
    console.log(`Collected ${$potStore} from community pot`);
    money += $potStore;
    potStore.collectPot();
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
  <div>
    <h2>{name}</h2>
    <h4>${money}</h4>
  </div>

  <div>
    <button
      on:click={() => selectPlayerPayPrompt = true}>
      Pay Player
    </button>
  </div>
  <div>
    <button
      on:click={() => selectPlayerCollectPrompt = true}>
      Collect Money
    </button>
  </div>
  <div>
    <input type="number" bind:value={potAmount}>
    <button
      on:click={payPot}>
      Pay pot
    </button>
  </div>
  <div>
    <button
      on:click={collectPot}>
      Collect pot(${$potStore})
    </button>
  </div>
</section>

<style>

:root {
  --main-bg-color: hsl(210, 100%, 95%);
  --main-border-color: hsl(210, 100%, 80%);
  --main-text-color: hsl(210, 100%, 25%);
}

section {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: stretch;
  background-color: var(--main-bg-color);
  border: 1.7px solid var(--main-border-color);
  color: var(--main-text-color);
  border-radius: 4px;
  margin: 1.2rem;
  padding: .25rem 3rem;
  width: 45%;
  height: 66%;
}

button {
  width: 100%;
}

input {
  width: 100%;
}

</style>
