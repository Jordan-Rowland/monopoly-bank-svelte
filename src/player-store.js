import { writable } from 'svelte/store';


const players = writable([
  {
    id: 1,
    name: "Michael",
    money: 2000,
  },
  {
    id: 2,
    name: "Jan",
    money: 1500,
  },
  {
    id: 3,
    name: "Dwight",
    money: 1000,
  },
  {
    id: 4,
    name: "Oscar",
    money: 500,
  },
]);


const playerStore = {
  subscribe: players.subscribe,

  pay: (name, amount) => {
    players.update(items => {
      const payerIndex = items.findIndex(player => player.name === name);
      const updatedPlayers = [...items];
      const updatedPayer = {...items[payerIndex]};
      updatedPayer.money -= parseInt(amount);
      updatedPlayers[payerIndex] = updatedPayer;
      return updatedPlayers.sort(
        (a,b) => a.money < b.money ? 1 : -1
      );
    });
  },

  collect: (selectedPlayer, amount) => {
    players.update(items => {
      const payeeIndex = items.findIndex(player => player.name === selectedPlayer);
      const updatedPlayers = [...items];
      const updatedPayee = {...items[payeeIndex]};
      console.log(updatedPayee);
      console.log(updatedPlayers);
      updatedPayee.money += parseInt(amount);
      updatedPlayers[payeeIndex] = updatedPayee;
      return updatedPlayers.sort(
        (a,b) => a.money < b.money ? 1 : -1
      );
    });
  },

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
  },


};

export default playerStore;
