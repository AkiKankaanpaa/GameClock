<script setup>
import InputElement from '../components/InputElement.vue'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import { useGameStore } from '../stores/gamestore'
import wss from '../services/socketservice'

const router = useRouter()
const gameStore = useGameStore()

const playerCount = ref(1)
const playerNames = ref([])

const clockBase = ref("20")
const clockIncrement = ref("60")

const goToGame = () => {
  updatePlayerNames()

  const playerData = Array.from({ length: playerCount.value }, (_, i) => ({
    name: playerNames.value[i],
    time: clockBase.value * 60
  }))

  console.log('Setting players: \n', playerData)

  gameStore.setInitialGameData({
    players: playerData,
    initialTime: Number(clockBase.value) * 60,
    increment: Number(clockIncrement.value),
    activePlayer: 0,
    paused: true
  })

  const data = gameStore.returnUpdateData()

  console.log('Sending initial data: \n', data)
  wss.sendMessage(JSON.stringify({
    type: 'initialData',
    data: data.players
  }))

  router.push({ name: 'game' })
}

const updatePlayerNames = () => {
  playerNames.value = Array.from({ length: playerCount.value }, (_, i) => playerNames.value[i] || '')
}

watch(playerCount, updatePlayerNames)
</script>

<template>
  <body>
    <main>
      <p class="h1">Home View</p>
        <div class="form-group">
          <InputElement :label="'Base Time (minutes)'" v-model="clockBase" />
          <InputElement :label="'Clock Increment (seconds)'" v-model="clockIncrement" />
          
          <label for="playercount">Player Count</label>
          <input type="number" id="playercount" v-model.number="playerCount" class="form-control" min="1" max="6" />
          <div id="playerNames">
            <InputElement v-for="(name, index) in playerCount" :key="index" 
              :label="'Player ' + (index + 1)" v-model="playerNames[index]" />
          </div>
        </div>

      <button type="button" class="btn btn-primary mt-2" @click="goToGame">Go to Game</button>

    </main>
  </body>
</template>