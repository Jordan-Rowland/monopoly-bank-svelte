import { writable } from 'svelte/store';

const players = writable([
  {
    name: "Michael",
    money: 2000,
    transaction: null,
  },
  {
    name: "Jan",
    money: 1500,
    transaction: null,
  },
  {
    name: "Dwight",
    money: 1000,
    transaction: null,
  },
  {
    name: "Oscar",
    money: 500,
    transaction: null,
  }
]);


const playerStore = {
  subscribe: players.subscribe,

  payPlayer: (name, selectedPlayer, amount) => {
    players.update(items => {
      const payerIndex = items.findIndex(
        player => player.name === name
      );
      const payeeIndex = items.findIndex(
        player => player.name === selectedPlayer
      );
      const updatedPayer = {
        ...items[payerIndex]
      };
      const updatedPayee = {
        ...items[payeeIndex]
      };
      const updatedPlayers = [...items];
      updatedPayer.money -= amount;
      updatedPayee.money += amount;
      updatedPlayers[payeeIndex] = updatedPayer;
      updatedPlayers[payerIndex] = updatedPayee;
      return updatedPlayers.sort(
        (a,b) => a.money < b.money ? 1 : -1
      );
    });
  }

};

export default playerStore;
