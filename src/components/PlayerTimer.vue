<template>
    <div class="playertimer">
      <button type="button" class="btn btn-primary" @click="toggleTimer">{{ playerName + " - " + formattedTime }}</button>
      <button @click="resetTimer">Reset</button>
    </div>
  </template>
  
  <script setup>

  import { ref, computed, onBeforeUnmount } from 'vue';
  
  const time = ref(1800);
  const isRunning = ref(false);
  const playerName = ref("Player 1");
  let timerInterval = null;
  
  const formattedTime = computed(() => {
    const minutes = String(Math.floor(time.value / 60)).padStart(2, '30');
    const seconds = String(time.value % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  });
  
  const startTimer = () => {
    if (!isRunning.value) {
      isRunning.value = true;
      timerInterval = setInterval(() => {
        time.value--;
      }, 1000);
    }
  };
  
  const stopTimer = () => {
    isRunning.value = false;
    clearInterval(timerInterval);
  };
  
  const toggleTimer = () => {
    if (isRunning.value) {
      stopTimer();
    } else {
      startTimer();
    }
  };
  
  const resetTimer = () => {
    stopTimer();
    time.value = 0;
  };
  
  onBeforeUnmount(() => {
    clearInterval(timerInterval);
  });
  </script>
  
  <style scoped>
  .timer {
    text-align: center;
  }
  .btn-primary {
    font-size: 3em;
    margin: 20px 0;
    cursor: pointer;
    white-space: nowrap;
    text-align: center;
  }
  button {
    margin: 5px;
  }
  </style>