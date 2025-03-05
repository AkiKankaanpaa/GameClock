<script setup>
  import { ref, computed, onBeforeUnmount, watch } from 'vue';
  import { useGameStore } from '../stores/gamestore'
  import wss from '../services/socketservice'

  const gameStore = useGameStore()
  const props = defineProps({
    playerName: {
      type: String,
      required: true,
    },
    timerId: {
      type: String,
      required: true,
    },
  })

  const isRunning = ref(false);
  let timerInterval = null;

  const formattedTime = computed(() => {
    const minutes = String(Math.floor(gameStore
      .players[Number(props.timerId)]["time"] / 60)).padStart(2, '30');
    const seconds = String(gameStore
      .players[Number(props.timerId)]["time"] % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  });

  const startTimer = () => {
    timerInterval = setInterval(() => {
      gameStore.players[Number(props.timerId)]["time"]
        = gameStore.players[Number(props.timerId)]["time"] - 1;
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerInterval);
  };

  const toggleNext = () => {
    const playerCount = Object.keys(gameStore.players).length;
    if (gameStore.activePlayer === playerCount - 1) {
      gameStore.activePlayer = 0;
    } else {
      gameStore.activePlayer = gameStore.activePlayer + 1;
    }
    console.log("Currently active player: ", gameStore.activePlayer)

    const gameData = gameStore.returnUpdateData()

    console.log('Sending toggle data: \n', gameData)
    wss.sendMessage(JSON.stringify({
      type: 'updateData',
      players: gameData.players,
      activePlayer: gameData.activePlayer,
      paused: gameData.paused
    }))
  };

  watch(() => gameStore.activePlayer, (newVal) => {
    console.log("Active player changed to: ",
                "\nActive player - ", gameStore.activePlayer,
                "\nTimerId - ", Number(props.timerId))
    if (gameStore.activePlayer === Number(props.timerId) && !gameStore.paused) {
      startTimer();
    } else {
      stopTimer();
    }
  });

  watch(() => gameStore.paused, () => {
    console.log("Pause changed to: ", gameStore.paused,
                "\nActive player - ", gameStore.activePlayer)
    if (gameStore.activePlayer === Number(props.timerId) && !gameStore.paused) {
      startTimer();
    } else {
      stopTimer();
    }
  });

  onBeforeUnmount(() => {
    clearInterval(timerInterval);
  });
</script>

<template>
  <div class="playertimer">
    <button type="button" class="btn btn-primary"
      :class="{ active: gameStore.activePlayer === Number(props.timerId) }"
      @click="toggleNext">{{ playerName + ' - ' + formattedTime }}</button>
  </div>
</template>
  
<style scoped>
button {
  margin: 5px;
}
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
.active {
  background-color: black; /* Change this color to whatever you prefer */
  color: white;
  border: 2px solid #0056b3; /* Darker border color */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); /* Add shadow for more emphasis */
  opacity: 1; /* Ensure the button is fully opaque */
}
</style>