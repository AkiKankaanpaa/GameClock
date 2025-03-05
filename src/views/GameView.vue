<script setup>
  import { computed, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import PlayerTimer from '../components/PlayerTimer.vue'
  import { useGameStore } from '../stores/gamestore'

  import { onMounted } from 'vue'
  import wss from '../services/socketservice'

  const gameStore = useGameStore()

  const players = computed(() => gameStore.players)
  const time = computed(() => gameStore.time)

  const currentTimerIndex = ref(0)

  const handleTimerPaused = (index) => {
    if (index < players.length - 1) {
      currentTimerIndex.value = index + 1
    } else {
      currentTimerIndex.value = 0
    }
  }

  wss.connection.value.onmessage = (event) => {
    const timers = JSON.parse(event.data);
    players.value.forEach((player, index) => {
      if (timers[`timer-${index}`]) {
        player.time = timers[`timer-${index}`].time;
        player.isRunning = timers[`timer-${index}`].isRunning;
      }
    });
  };

  wss.sendMessage(JSON.stringify({ type: 'requestInitialData' }));
</script>

<template>
  <main>
    <PlayerTimer v-for="(player, index) in gameStore.players"
      :key="index"
      :playerName="player.playerName"
      :initialTime="time[0]" 
      :timerId="'timer-' + index"
      :isActive="index === currentTimerIndex"
      @timerPaused="handleTimerPaused(index)"/>
  </main>
</template>