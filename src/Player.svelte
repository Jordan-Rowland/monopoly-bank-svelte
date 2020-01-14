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

const otherPlayers = players.filter(
  player => player.name !== name
);

function payPlayer(event) {
  const payer = name;
  const payee = event.detail.player;
  const amount = event.detail.amount;
  if (!amount) {
    dispatch("error", "Please enter an amount");
    return false;
  }
  if (payee === 'all') {
    let total = amount * otherPlayers.length
    if (money < total) {
      dispatch("error", `${name} does not have enough money for this transaction - $${total}`);
      return false;
    }
    for (const player of otherPlayers) {
      playerStore.payPlayer(
        payer,
        player.name,
        amount,
      );
    }
  } else {
    if (money < amount) {
      dispatch("error", `${name} does not have enough money for this transaction`);
      return false;
    }
    playerStore.payPlayer(
      payer,
      payee,
      amount,
    );
   }
  selectPlayerPayPrompt = false;
  dispatch("send-message", `${name} paid ${payee} $${amount}`);
}

function collectFrom(event) {
  const payer = event.detail.player;
  const payee = name;
  const amount = event.detail.amount;
  if (!amount) {
    dispatch("error", "Please enter an amount");
    return false;
  }
  for (const player of otherPlayers) {
    if (player.money < amount) {
      dispatch("error", `${player.name} does not have enough money for this transaction`);
    } else {
      playerStore.payPlayer(
        player.name,
        payee,
        amount,
      );
    }
  }
  selectPlayerCollectPrompt = false;
  dispatch("send-message", `${name} collected $${amount} from ${payer}`);
}

function payPot(event) {
  const potAmount = event.detail.amount;
  if (!potAmount) {
    dispatch("error", "Please enter an amount");
    return false;
  }
  if (money < potAmount) {
    dispatch("error", `${name} does not have enough money for this transaction`);
    return false;
  }
  money -= potAmount;
  playerStore.payPot(name, potAmount);
  potStore.payPot(potAmount);
  dispatch("send-message", `${name} put $${potAmount} into the Community Pot`);
  selectPlayerPayPrompt = false;
}

function collectPot() {
  playerStore.collectPot(name, $potStore);
  dispatch("send-message", `${name} collected $${$potStore} from the Community Pot`);
  money += $potStore;
  potStore.collectPot();
  selectPlayerCollectPrompt = false;
}

</script>

<section id="p{id}">
  <div class="headers">
    <div>
      <h2>{name}</h2>
      <h4>${money}</h4>
    </div>
  </div>

  <div class="buttons">
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
  </div>
<!--   <div>
    <input type="number" bind:value={potAmount}>
    <button
      on:click={payPot}>
      Pay pot
    </button>
  </div> -->
<!--   <div>
    <button
      on:click={collectPot}>
      Collect pot(${$potStore})
    </button>
  </div> -->
</section>

<!-- Dynamic component here ?? -->
{#if selectPlayerPayPrompt}
  <div class="select-player">
    <SelectPlayer
      players={otherPlayers}
      action="Pay"
      on:transaction={payPlayer}
      on:transaction-pot={payPot}
      on:close-modal={() => selectPlayerPayPrompt = false}
    />
  </div>
{/if}

{#if selectPlayerCollectPrompt}
  <div class="select-player">
    <SelectPlayer
      players={otherPlayers}
      action="Collect"
      on:transaction={collectFrom}
      on:transaction-pot={collectPot}
      on:close-modal={() => selectPlayerCollectPrompt = false}
    />
  </div>
{/if}

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
  align-items: stretch;
  border-radius: 4px;
  margin: 1.2rem;
  padding: .25rem 3rem;
  width: 45%;
  height: 35%;
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

.buttons {
  margin-top: 0.5rem;
}

input {
  width: 100%;
  border-radius: 3px;
  border-color: hsla(0, 0%, 0%, 0.4);
}

@media (max-width: 640px) {
  section {
    flex-direction: row;
    justify-content: space-between;
    width: 70%;
    margin: 0.3rem;
    padding: 0 1.5rem;
    height: 15%;
  }

  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin: 1rem 0 1rem 2rem;
    /*margin-left: 2rem;*/
  }

  button {
    width: 4.5rem;
    height: 4.5rem;
    margin: 0 0.2rem;
  }


}

@media (min-width: 640px) {
  button {
    height: 3rem;
  }
}

</style>
