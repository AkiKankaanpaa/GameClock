<script setup>
    import { ref } from 'vue';
    import PlayerTimer from './PlayerTimer.vue';

    const numTimersInput = ref(1);
    const numTimers = ref(1);

    const updateNumTimers = () => {
        numTimers.value = numTimersInput.value;
    };
</script>

<template>
  <div class="timer-container">
    <h1>Player Timers</h1>
    <div class="row">
      <div class="form-group">
        <label for="numTimers">Number of Timers:</label>
        <input type="number" id="numTimers" v-model.number="numTimersInput" class="form-control" min="1" />
        <button type="button" class="btn btn-primary mt-2" @click="updateNumTimers">Update Timers</button>
      </div>
    </div>

    <div class="timers">
        <PlayerTimer v-for="n in numTimers" :key="n" :playerName="'Player ' + n" />
    </div>
  </div>
</template>
  
<style scoped>
  .timer-container {
    text-align: center;
    width: 300px;
  }
  .form-group {
    margin-bottom: 20px;
  }
  .timers {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  </style>