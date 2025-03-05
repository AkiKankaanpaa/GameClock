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
const clockIncrement = ref("1")

const goToGame = () => {
  updatePlayerNames()
  const data = {
    players: playerNames.value.map((name, index) => ({
      playerName: name || `Player ${index + 1}`
    })),
    time: [60 * Number(clockBase.value), 60 * Number(clockIncrement.value)]
  }

  gameStore.setGameData(data)
  wss.sendMessage(JSON.stringify({
    type: 'initialData',
    data: data
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
          <InputElement :label="'Base Time'" v-model="clockBase" />
          <InputElement :label="'Clock Increment'" v-model="clockIncrement" />
          
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