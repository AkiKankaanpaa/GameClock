<script setup>
import { ref, computed, onBeforeUnmount, watch } from 'vue';

const props = defineProps({
  playerName: {
    type: String,
    required: true,
  },
  initialTime: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['timerPaused'])

const time = ref(props.initialTime)
const isRunning = ref(false);
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
  emit('timerPaused')
};

const toggleTimer = () => {
  if (isRunning.value) {
    stopTimer();
  } else {
    startTimer();
  }
};

const resetTimer = () => {
  stopTimer()
  time.value = props.initialTime
}

watch(() => props.isActive, (newVal) => {
  if (newVal) {
    startTimer()
  } else {
    stopTimer()
  }
})

onBeforeUnmount(() => {
  clearInterval(timerInterval);
});
</script>

<template>
  <div class="playertimer">
    <button type="button" class="btn btn-primary"
      @click="toggleTimer">{{ playerName + ' - ' + formattedTime }}</button>
  </div>
</template>
  
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