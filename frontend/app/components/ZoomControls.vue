<script setup lang="ts">
defineProps<{ zoom: number }>()
const emit = defineEmits<{ zoom: [factor: number] }>()
</script>

<template>
  <div class="absolute right-4 bottom-4 flex items-center rounded-lg bg-white text-sm shadow-md">
    <button type="button" class="px-3 py-2 hover:bg-neutral-100" @click="emit('zoom', 1 / 1.25)">−</button>
    <span class="w-12 text-center tabular-nums">{{ Math.round(zoom * 100) }}%</span>
    <button type="button" class="px-3 py-2 hover:bg-neutral-100" @click="emit('zoom', 1.25)">+</button>
  </div>
</template>
