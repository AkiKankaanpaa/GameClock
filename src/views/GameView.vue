<script setup>
  import { computed, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import PlayerTimer from '../components/PlayerTimer.vue'

  const route = useRoute()
  const gameData = ref(computed(() => JSON.parse(route.params.data)))

  const players = gameData.value.players
  const time = gameData.value.time

  const currentTimerIndex = ref(0)

  const handleTimerPaused = (index) => {
  if (index < players.length - 1) {
    currentTimerIndex.value = index + 1
  } else {
    currentTimerIndex.value = 0
  }
}
</script>

<template>
  <main>
    <PlayerTimer v-for="(player, index) in players"
      :key="index"
      :playerName="player.playerName"
      :initialTime="time[0]" 
      :isActive="index === currentTimerIndex"
      @timerPaused="handleTimerPaused(index)"/>
  </main>
</template>