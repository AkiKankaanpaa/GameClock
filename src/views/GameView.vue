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
    console.log('Toggling pause\n', )
    wss.sendMessage(JSON.stringify({ type: 'togglePause' }))
  }

  const toggleNext = () => {
    console.log('Toggling next player\n', )
    wss.sendMessage(JSON.stringify({ type: 'toggleNext' }))
  }

  const reset = () => {
    console.log('Resetting game\n', )
    wss.sendMessage(JSON.stringify({ type: 'reset' }))
  }

  wss.connection.value.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Received data:\n', data)
    if (data.type === 'updateData') {
      console.log("Updating data:\n", data)
      gameStore.updateGameData(data);
    }
  };
</script>

<template>
  <main>
  <div class="playertimer-container">
    <PlayerTimer v-for="(player, index) in players"
      :key="index"
      :playerName="players[index].name"
      :initialTime="players[index].time" 
      :timerId=Number(index)
      @timerPaused="handleTimerPaused(index)"/>
  </div>
    <button type="button" class="btn-primary mt-2"
      @click="toggleNext">Next Player
    </button>
    <button type="button" class="btn-primary mt-2"
      @click="togglePause">{{ pauseButtonText }}
    </button>
    <button type="button" class="btn-primary mt-2"
      @click="reset">Reset
    </button>
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