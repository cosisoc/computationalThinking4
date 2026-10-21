<script setup lang="ts">
defineProps<{ stamping: boolean }>()
const emit = defineEmits<{ add: [], stamp: [] }>()
</script>

<template>
  <div class="absolute top-1/2 left-4 flex -translate-y-1/2 flex-col gap-2 rounded-xl bg-white p-2 shadow-md">
    <button
      type="button"
      title="Post-it hinzufügen"
      class="flex size-10 cursor-pointer items-center justify-center rounded-lg hover:bg-neutral-100"
      @click="emit('add')"
    >
      <span class="size-6 rounded-sm shadow-sm" :style="{ backgroundColor: NOTE_COLORS[0]!.value }" />
    </button>
    <button
      type="button"
      title="Frosch-Stempel (Esc zum Beenden)"
      class="flex size-10 cursor-pointer items-center justify-center rounded-lg p-1"
      :class="stamping ? 'bg-blue-100 ring-2 ring-blue-500' : 'hover:bg-neutral-100'"
      @click="emit('stamp')"
    >
      <img src="/frog.png" alt="Frosch" draggable="false" class="size-full object-contain">
    </button>
  </div>
</template>
