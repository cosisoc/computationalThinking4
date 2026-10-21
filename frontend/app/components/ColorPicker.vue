<script setup lang="ts">
defineProps<{ zoom: number }>()
const color = defineModel<string>({ required: true })
</script>

<!-- mousedown.prevent keeps the textarea focused, so editing doesn't end on click. -->
<template>
  <div
    class="absolute bottom-full left-1/2 mb-3 flex cursor-default gap-1.5 rounded-lg bg-white p-2 shadow-lg"
    :style="{ transform: `translateX(-50%) scale(${1 / zoom})`, transformOrigin: 'bottom center' }"
    @mousedown.prevent
    @pointerdown.stop
    @dblclick.stop
  >
    <button
      v-for="c in NOTE_COLORS"
      :key="c.value"
      type="button"
      :title="c.name"
      class="size-6 cursor-pointer rounded-full border border-black/10"
      :class="{ 'ring-2 ring-blue-500 ring-offset-1': c.value === color }"
      :style="{ backgroundColor: c.value }"
      @click="color = c.value"
    />
  </div>
</template>
