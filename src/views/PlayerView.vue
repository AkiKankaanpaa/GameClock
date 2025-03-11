
<script setup>
  import { useRoute } from 'vue-router'
  import { useRouter } from 'vue-router'
  import { computed, ref } from 'vue'
  import wss from '../services/socketservice'

  const router = useRouter()
  const paused = ref(true)

  const pauseButtonText = computed(() => {
    return paused.value ? 'Unpause' : 'Pause';
  });

  const togglePause = () => {
    console.log('Toggling pause\n', )
    wss.sendMessage(JSON.stringify({ type: 'togglePause' }))
  }

  const toggleNext = () => {
    console.log('Toggling next player\n', )
    wss.sendMessage(JSON.stringify({ type: 'toggleNext' }))
  }

  wss.connection.value.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'updateData') {
      paused.value = sPaused;
    }
  };
</script>

<template>
  <main>
    <div class="button-container">
      <button type="button" class="btn btn-primary mt-2"
      @click="toggleNext">Next</button>
      <button type="button" class="btn btn-primary mt-2"
      @click="togglePause">{{ pauseButtonText }}</button>
    </div>
  </main>
</template>
  
<style scoped>
.playertimer-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.playertimer {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 600px;
  margin: 10px 0;
}

button {
  margin: 5px;
  width: 100%;
}

.timer {
  text-align: left;
}

.btn-primary {
  font-size: 3em;
  margin: 20px 0;
  cursor: pointer;
  white-space: nowrap;
  text-align: center;
}
</style>