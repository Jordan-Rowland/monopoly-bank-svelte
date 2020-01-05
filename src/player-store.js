import { writable } from 'svelte/store';


const players = writable([
  {
    name: "Michael",
    money: 2000,
  },
  {
    name: "Jan",
    money: 1500,
  },
  {
    name: "Dwight",
    money: 1000,
  },
  {
    name: "Oscar",
    money: 500,
  },
]);


const playerStore = {
  subscribe: players.subscribe,

  payPlayer: (name, selectedPlayer, amount) => {
    players.update(items => {
      const updatedPlayers = [...items];

      const payerIndex = items.findIndex(player => player.name === name);
      const updatedPayer = {...items[payerIndex]};
      updatedPayer.money -= amount;
      updatedPlayers[payerIndex] = updatedPayer;

      if (selectedPlayer !== 'bank') {
        const payeeIndex = items.findIndex(player => player.name === selectedPlayer);
        const updatedPayee = {...items[payeeIndex]};
        updatedPayee.money += amount;
        updatedPlayers[payeeIndex] = updatedPayee;
      }

      return updatedPlayers.sort(
        (a,b) => a.money < b.money ? 1 : -1
      );

    });
  }

};

export default playerStore;
