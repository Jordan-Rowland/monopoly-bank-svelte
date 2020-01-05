import { writable } from 'svelte/store';
import playerStore from "./player-store.js";


const pot = writable(150);


const potStore = {
  subscribe: pot.subscribe,

  collectPot: () => {
    pot.update(
      item => 0
    );
  },

  payPot: amount => {
    pot.update(
      item => item += amount
    );
  },

};


export default potStore;

// export default pot;
