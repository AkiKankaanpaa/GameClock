import { defineStore } from 'pinia';

export const useGameStore = defineStore('game', {
  state: () => ({
    players: [],
    time: [],
  }),
  actions: {
    setGameData(gameData) {
      this.players = gameData.players;
      this.time = gameData.time;
    },
  },
});