<script setup>
import { ref, computed, onBeforeUnmount, watch } from 'vue';
import wss from '../services/socketservice';
import { useGameStore } from '../stores/gamestore'

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

wss.connection.value.onmessage = (event) => {
  const timers = JSON.parse(event.data);
  if (timers[props.timerId]) {
    time.value = timers[props.timerId].time;
  }
};

const sendTimerState = () => {
  const data = {
    timerId: props.timerId,
    time: time.value,
  }
  wss.send(JSON.stringify(data))
}

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
    console.log(gameStore.activePlayer, playerCount)
    gameStore.activePlayer = 0;
  } else {
    gameStore.activePlayer = gameStore.activePlayer + 1;
  }
  console.log("Switched player to ", gameStore.activePlayer)
};

watch(() => gameStore.activePlayer, (newVal) => {
  console.log("Switching player",
              "\nActive - ", gameStore.activePlayer,
              "\nTimer - ", Number(props.timerId))
  if (gameStore.activePlayer === Number(props.timerId) && !gameStore.paused) {
    startTimer();
  } else {
    stopTimer();
  }
});

watch(() => gameStore.paused, () => {
  console.log("Pause - ", gameStore.paused,
              "\nActive - ", gameStore.activePlayer,
              "\nTimer - ", Number(props.timerId))
  if (gameStore.paused === true) {
    stopTimer();
  } else if (gameStore.activePlayer === Number(props.timerId)) {
    console.log("Starting timer")
    startTimer();
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