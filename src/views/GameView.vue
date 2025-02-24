<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import TimerContainer from '../components/TimerContainer.vue'

const route = useRoute()
const gameData = computed(() => JSON.parse(route.params.data))
console.log(gameData.value)
</script>

<template>
  <main>
    <TimerContainer/>
  </main>
</template>