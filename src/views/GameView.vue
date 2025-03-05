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

  const handleNextPlayer = () => {
    gameStore.paused = !gameStore.paused;
    const gameData = gameStore.returnUpdateData()

    console.log('Sending pause data: \n', gameData)
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
    <PlayerTimer v-for="(player, index) in gameStore.players"
      :key="index"
      :playerName="players[index].name"
      :initialTime="players[index].time" 
      :timerId="index"
      :isActive="index === gameStore.activePlayer"
      @timerPaused="handleTimerPaused(index)"/>
    <button type="button" class="btn btn-primary mt-2"
      @click="togglePause">{{ pauseButtonText }}</button>
  </main>
</template>
  
<style scoped>
.timer {
  text-align: center;
}
.btn-primary {
  font-size: 3em;
  margin: 20px 0;
  cursor: pointer;
  white-space: nowrap;
  text-align: center;
}
button {
  margin: 5px;
}
</style>