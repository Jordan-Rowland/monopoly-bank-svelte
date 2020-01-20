<script>
import { createEventDispatcher } from "svelte";
const dispatch = createEventDispatcher();
import SelectPlayer from "./SelectPlayer.svelte";
import ConfirmBankrupt from "./ConfirmBankrupt.svelte";
import playerStore from "./player-store.js";
import potStore from "./pot-store.js";

export let id;
export let name;
export let money;

const promptComponents = {
  payPrompt: {
    action: "Pay",
    transaction: payPlayer,
    transactionPot: payPot,
  },
  collectPrompt: {
    action: "Collect",
    transaction: collectFrom,
    transactionPot: collectPot,
  }
};

let prompt = false;
let confirmBankrupt = false;
let classes = "";


$: otherPlayers = $playerStore.filter(
  player => player.name !== name
);


function payPlayer(event) {
  const payer = name;
  const payee = event.detail.player;
  const amount = event.detail.amount;
  if (!amount || amount < 1) {
    dispatch("error", "Please enter an amount");
    return false;
  }
  if (payee === 'all') {
    dispatch("send-message", `${name} is paying all`);
    let total = amount * otherPlayers.length;
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
      dispatch("send-message", `${name} paid ${player.name} $${amount}`);
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
    dispatch("send-message", `${name} paid ${payee} $${amount}`);
   }
  prompt = false;
}


function collectFrom(event) {
  const payer = event.detail.player;
  const payee = name;
  const amount = event.detail.amount;
  if (!amount || amount < 1) {
    dispatch("error", "Please enter an amount");
    return false;
  }
  if (payer === "all") {
    dispatch("send-message", `${name} is collecting from all`);
    for (const player of otherPlayers) {
      if (player.money < amount) {
        dispatch("error", `${player.name} does not have enough money for this transaction`);
      } else {
        playerStore.payPlayer(
          player.name,
          payee,
          amount,
        );
        dispatch("send-message", `${name} collected $${amount} from ${player.name}`);
      }
    }
  } else {
    let payerPlayer = otherPlayers.filter(player => payer === player.name);
    if (payerPlayer) {
      payerPlayer = payerPlayer[0]
    }
    if (payerPlayer.money < amount) {
        dispatch("error", `${payer} does not have enough money for this transaction`);
        return false;
      }
    playerStore.payPlayer(
      payer,
      payee,
      amount,
    );
    dispatch("send-message", `${name} collected $${amount} from ${payer}`);
  }
  prompt = false;
}


function payPot(event) {
  const potAmount = event.detail.amount;
  if (!potAmount || potAmount < 1) {
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
  prompt = false;
}


function collectPot() {
  playerStore.collectPot(name, $potStore);
  dispatch("send-message", `${name} collected $${$potStore} from the Community Pot`);
  money += $potStore;
  potStore.collectPot();
  prompt = false;
}


function bankrupt() {
  playerStore.bankrupt(name);
  dispatch("send-message", `${name} has gone bankrupt!`);
}

</script>


<section id="p{id}">
  <div class="headers">
    <div>
      <h2>{name}</h2>
      <h4 on:click={() => confirmBankrupt = true}>${money}</h4>
    </div>
  </div>

  <div class="buttons">
    <div>
      <button
        class="normal-button"
        on:click={() => prompt = promptComponents.payPrompt}>
        Pay Player
      </button>
    </div>
    <div>
      <button
        class="normal-button"
        on:click={() => prompt = promptComponents.collectPrompt}>
        Collect Money
      </button>
      <button
        class="small-button"
        on:click={() => prompt = promptComponents.payPrompt}>
        P
      </button>
    </div>
    <div>
      <button
        class="small-button"
        on:click={() => prompt = promptComponents.collectPrompt}>
        C
      </button>
    </div>
  </div>
</section>

{#if prompt}
  <div class="select-player">
    <SelectPlayer
      players={otherPlayers}
      action={prompt.action}
      on:transaction={prompt.transaction}
      on:transaction-pot={prompt.transactionPot}
      on:close-modal={() => prompt = false}
    />
  </div>
{/if}

{#if confirmBankrupt}
  <ConfirmBankrupt
    {name}
    on:bankrupt-user={bankrupt}
    on:close-modal={() => confirmBankrupt = false}
  />
{/if}

<style>

section {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  border-radius: 4px;
  margin: 1.2rem;
  padding: .45rem 2rem;
  width: 45%;
}

button {
  width: 100%;
  border-radius: 3px;
  background-color: hsla(0, 100%, 100%, 0.5);
  border-color: hsla(0, 0%, 0%, 0.4);
  height: 3rem;
}

.buttons {
  margin-top: 0.5rem;
}

input {
  width: 100%;
  border-radius: 3px;
  border-color: hsla(0, 0%, 0%, 0.4);
}

.small-button {
  display: none;
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
    position: absolute;
    right: 50px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin: 1rem 0 1rem 2rem;
  }

  button {
    width: 4.5rem;
    height: 4.5rem;
    margin: 0 0.2rem;
  }

}

@media (max-width: 360px) {
  .buttons {
    position: absolute;
    right: 50px;
  }

  section {
    flex-direction: row;
    justify-content: space-between;
    width: 80%;
    margin: 0.3rem;
    padding: 0 0.8rem;
  }

  h2, h4 {
    margin: 0.8rem;
  }

  button {
    height: 3.5rem;
  }

}

@media (max-width: 320px) {

  .buttons {
    right: 40px;
    margin-top: 23px;
  }

  .normal-button {
    display: none;
  }

  .small-button {
    display: block;
    width: 2.3rem;
    height: 2.3rem;
  }

}

:root {
  --p1-color: 45;
  --p2-color: 90;
  --p3-color: 135;
  --p4-color: 180;
  --p5-color: 225;
  --p6-color: 270;
  --p7-color: 315;
  --p8-color: 360;
}

#p1 {
  background-color: hsl(var(--p1-color), 100%, 95%);
  border: 1.7px solid hsl(var(--p1-color), 100%, 80%);
  color: hsla(var(--p1-color), 100%, 25%, 0.8);
}

#p2 {
  background-color: hsl(var(--p2-color), 100%, 95%);
  border: 1.7px solid hsl(var(--p2-color), 100%, 80%);
  color: hsla(var(--p2-color), 100%, 25%, 0.8);
}

#p3 {
  background-color: hsl(var(--p3-color), 100%, 95%);
  border: 1.7px solid hsl(var(--p3-color), 100%, 80%);
  color: hsla(var(--p3-color), 100%, 25%, 0.8);
}

#p4 {
  background-color: hsl(var(--p4-color), 100%, 95%);
  border: 1.7px solid hsl(var(--p4-color), 100%, 80%);
  color: hsla(var(--p4-color), 100%, 25%, 0.8);
}

#p5 {
  background-color: hsl(var(--p5-color), 100%, 95%);
  border: 1.7px solid hsl(var(--p5-color), 100%, 80%);
  color: hsla(var(--p5-color), 100%, 25%, 0.8);
}

#p6 {
  background-color: hsl(var(--p6-color), 100%, 95%);
  border: 1.7px solid hsl(var(--p6-color), 100%, 80%);
  color: hsla(var(--p6-color), 100%, 25%, 0.8);
}

#p7 {
  background-color: hsl(var(--p7-color), 100%, 95%);
  border: 1.7px solid hsl(var(--p7-color), 100%, 80%);
  color: hsla(var(--p7-color), 100%, 25%, 0.8);
}

#p8 {
  background-color: hsl(var(--p8-color), 100%, 95%);
  border: 1.7px solid hsl(var(--p8-color), 100%, 80%);
  color: hsla(var(--p8-color), 100%, 25%, 0.8);
}

</style>
