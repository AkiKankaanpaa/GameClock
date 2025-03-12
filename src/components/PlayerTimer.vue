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
      type: Number,
      required: true,
    },
  })

  const formattedTime = computed(() => {
    const minutes = String(Math.floor(gameStore
      .players[props.timerId]["time"] / 60)).padStart(2, '0');
    const seconds = String(gameStore
      .players[props.timerId]["time"] % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  });

  const toggleNext = () => {
    console.log('Toggling next player\n', )
        console.log('Timer index:', props.timerId, '\nStore Index:', gameStore.activePlayer)
    wss.sendMessage(JSON.stringify({ type: 'toggleNext' }))
  }
</script>

<template>
  <div class="playertimer-container">
    <div class="playertimer">
      <button type="button" class="btn btn-primary"
        :class="{ active: props.timerId === gameStore.activePlayer }"
        @click="toggleNext">
        <span class="player-name">{{ playerName }}</span>
      </button>
      <h1 class="player-time">{{ formattedTime }}</h1>
    </div>
  </div>
</template>
  
<style scoped>
.playertimer-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.playertimer {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

button {
  margin: 5px;
  width: 100%; /* Ensure all buttons have the same width */
}

.player-name {
  flex: 1;
  text-align: center;
}

.player-time {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 20px;
}

.timer {
  text-align: center;
}

.btn-primary {
  font-size: 3em;
  margin: 10px 0;
  cursor: pointer;
  white-space: nowrap;
  text-align: left;
}

.active {
  background-color: black;
  color: white;
  border: 2px solid #0056b3;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  opacity: 1;
}
</style>