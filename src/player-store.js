import { writable } from 'svelte/store';


const players = writable([]);


const playerStore = {
  subscribe: players.subscribe,

  setPlayers: existingPlayers => {
    players.set(existingPlayers);
  },

  payPot: (name, amount) => {
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

  collectPot: (selectedPlayer, amount) => {
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

  bankrupt: name => {
    players.update(players => {
      let updatedPlayers = [...players];
      updatedPlayers = updatedPlayers.filter(player => player.name !== name);
      return updatedPlayers;
    });
  }

};

export default playerStore;
