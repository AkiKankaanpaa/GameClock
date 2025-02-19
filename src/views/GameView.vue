<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import TimerContainer from '../components/TimerContainer.vue'

const route = useRoute()
const gameData = computed(() => JSON.parse(route.params.data))
</script>

<template>
  <main>
    <h1>Game View</h1>
    <p>Player Name: {{ gameData.playerName }}</p>
    <p>Time: {{ gameData.time }}</p>
  </main>
</template>