<script setup>
import { ref } from 'vue'

defineProps({
    label: {
        type: String,
        default: "",
    },
    modelValue: {
        type: String,
        default: "",
    },
})
</script>

<template>
  <div class="form-group">
    <label>{{ label }}</label>
    <input 
      type="text"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>