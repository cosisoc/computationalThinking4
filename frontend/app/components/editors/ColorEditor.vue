<script setup lang="ts">
defineProps<{ value: string }>()
const emit = defineEmits<{ change: [color: string] }>()
</script>

<template>
  <div class="flex items-center gap-1 px-1">
    <button
      v-for="color in COLORS"
      :key="color"
      class="size-6 rounded-full border"
      :class="color === value ? 'ring-2 ring-blue-500 ring-offset-1' : ''"
      :style="{ backgroundColor: color }"
      :aria-label="`Farbe ${color}`"
      @click="emit('change', color)"
    />
  </div>
</template>
