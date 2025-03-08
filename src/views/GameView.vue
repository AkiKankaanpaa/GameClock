<script setup>
  import { computed, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import PlayerTimer from '../components/PlayerTimer.vue'
  import { useGameStore } from '../stores/gamestore'

  import { onBeforeMount } from 'vue'
  import wss from '../services/socketservice'

  const gameStore = useGameStore()
  const players = computed(() => gameStore.players)

  const pauseButtonText = computed(() => {
    return gameStore.paused ? 'Unpause' : 'Pause';
  });

  wss.connection.value.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === 'serverData') {
      gameStore.setGameData(data.data);
    }
  };

  const togglePause = () => {
    gameStore.paused = !gameStore.paused;
    const gameData = gameStore.returnUpdateData()

    console.log('Sending pause data: \n', gameData.players)
    wss.sendMessage(JSON.stringify({
      type: 'updateData',
      players: gameData.players,
      activePlayer: gameData.activePlayer,
      paused: gameData.paused
    }))
  }

  wss.connection.value.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Received data:\n', data)
    if (data.type === 'serverData') {
      gameStore.updateGameData(data.data);
    }
  };

  setTimeout(() => {
    wss.sendMessage(JSON.stringify({ type: 'requestData' }));
  }, 1000);
</script>

<template>
  <main>
  <div class="playertimer-container">
    <PlayerTimer v-for="(player, index) in gameStore.players"
      :key="index"
      :playerName="players[index].name"
      :initialTime="players[index].time" 
      :timerId="index"
      :isActive="index === gameStore.activePlayer"
      @timerPaused="handleTimerPaused(index)"/>
  </div>
    <button type="button" class="btn btn-primary mt-2"
      @click="togglePause">{{ pauseButtonText }}</button>
  </main>
</template>
  
<style scoped>
.playertimer-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.playertimer {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 600px;
  margin: 10px 0;
}

button {
  margin: 5px;
  width: 100%;
}

.timer {
  text-align: left;
}

.btn-primary {
  font-size: 3em;
  margin: 20px 0;
  cursor: pointer;
  white-space: nowrap;
  text-align: center;
}
</style>