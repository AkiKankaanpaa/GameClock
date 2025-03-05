import { defineStore } from 'pinia';

export const useGameStore = defineStore('game', {
  state: () => ({
    players: {},
    initialTime: 1200,
    increment: 60,
    activePlayer: 0,
    paused: true,
  }),
  actions: {
    setInitialGameData(gameData) {
      console.log('Setting initial game data:', gameData);
      Object.entries(gameData.players).forEach(([key, value]) => {
        this.players[key] = {
          name: value,
          time: gameData.time,
      }});
      this.initialTime = gameData.time;
      this.increment = gameData.increment;
      this.activePlayer = 0;
      console.log(this.players)
    },

    updateGameData(updateData) {
      this.players = updateData.players;
      this.time = updateData.time;
    }
  },
});