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
    <button @click="resetTimer">Reset</button>
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

  
export default{
  props:{
    p:{
      type:String, 
        default:
    }
  }
}