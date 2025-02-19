<script setup>
import InputElement from '../components/InputElement.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const playerCount = ref("")

const goToGame = () => {
  const data = { playerName: 'Player 1', time: 1800 }
  router.push({ name: 'game', params: { data: JSON.stringify(data) } })
}
</script>

<template>
  <main>
  <p class="h1">Home View</p>
  <div class="form-group">
    <label for="playercount">Player Count</label>
    <InputElement
      v-model="playerCount"
    />
  </div>

  </main>
</template>