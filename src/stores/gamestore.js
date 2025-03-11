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
        console.log('Setting player:', key, value);
        this.players[key] = {
          name: value.name,
          time: value.time,
      }});
      this.initialTime = gameData.initialTime;
      this.increment = gameData.increment;
      this.activePlayer = 0;
      this.paused = true;
    },

    updateGameData(updateData) {
      this.players = updateData.players;
      this.paused = updateData.paused;
      this.activePlayer = updateData.activePlayer;
    },

    returnUpdateData() {
      return {
        players: this.players,
        initialTime: this.initialTime,
        increment: this.increment,
      }
    }
  },
});