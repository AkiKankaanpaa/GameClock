import { defineStore } from 'pinia';

export const useGameStore = defineStore('game', {
  state: () => ({
    players: {},
    activePlayer: 0,
    paused: true,
  }),
  actions: {
    setInitialGameData(gameData) {
      console.log('Setting initial game data:', gameData);
      Object.entries(gameData).forEach(([key, value]) => {
        console.log('Setting player:', key, value);
        this.players[key] = {
          name: value.name,
          time: value.time,
      }});
      this.activePlayer = 0;
      this.paused = true;
    },

    updateGameData(updateData) {
      updateData.players.forEach((time, index) => {
        if (this.players[index]) {
          this.players[index].time = time;
        }
      });
      this.paused = updateData.paused;
      this.activePlayer = updateData.activePlayer;
    },
  },
});