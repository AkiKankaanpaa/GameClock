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
    },

    updateGameData(updateData) {
      this.players = updateData.players;
      this.activePlayer = updateData.activePlayer;
      this.paused = updateData.paused;
    },

    returnUpdateData() {
      return {
        players: this.players,
        activePlayer: this.activePlayer,
        paused: this.paused,
      }
    }
  },
});