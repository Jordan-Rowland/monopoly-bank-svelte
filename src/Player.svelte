<script>
import { createEventDispatcher } from "svelte";
const dispatch = createEventDispatcher();
import SelectPlayer from "./SelectPlayer.svelte";
import playerStore from "./player-store.js";
import potStore from "./pot-store.js";

export let id;
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
  console.log(`${name} paid ${potAmount} to community pot`);
  money -= potAmount;
  potStore.payPot(potAmount);

  potAmount = null;
}

function collectPot() {
  playerStore.collect(name, $potStore);
  console.log(`${name} collected ${$potStore} from community pot`);
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

<section id="p{id}">
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
  --p1-bg-color: hsl(210, 100%, 95%);
  --p1-border-color: hsl(210, 100%, 80%);
  --p1-text-color: hsl(210, 100%, 25%);
  --p2-bg-color: hsl(160, 100%, 95%);
  --p2-border-color: hsl(160, 100%, 80%);
  --p2-text-color: hsl(160, 100%, 25%);
  --p3-bg-color: hsl(110, 100%, 95%);
  --p3-border-color: hsl(110, 100%, 80%);
  --p3-text-color: hsl(110, 100%, 25%);
  --p4-bg-color: hsl(260, 100%, 95%);
  --p4-border-color: hsl(260, 100%, 80%);
  --p4-text-color: hsl(260, 100%, 25%);
}

section {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: stretch;
  border-radius: 4px;
  margin: 1.2rem;
  padding: .25rem 3rem;
  width: 45%;
  height: 66%;
}

#p1 {
  background-color: var(--p1-bg-color);
  border: 1.7px solid var(--p1-border-color);
  color: var(--p1-text-color);
}

#p2 {
  background-color: var(--p2-bg-color);
  border: 1.7px solid var(--p2-border-color);
  color: var(--p2-text-color);
}

#p3 {
  background-color: var(--p3-bg-color);
  border: 1.7px solid var(--p3-border-color);
  color: var(--p3-text-color);
}

#p4 {
  background-color: var(--p4-bg-color);
  border: 1.7px solid var(--p4-border-color);
  color: var(--p4-text-color);
}

button {
  width: 100%;
  border-radius: 3px;
  background-color: hsla(0, 100%, 100%, 0.5);
  border-color: hsla(0, 0%, 0%, 0.4);
}

input {
  width: 100%;
  border-radius: 3px;
  border-color: hsla(0, 0%, 0%, 0.4);
}

</style>
