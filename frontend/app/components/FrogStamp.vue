<script setup lang="ts">
import type { Stamp } from '~/types/stamp'

const props = defineProps<{ zoom: number }>()
const stamp = defineModel<Stamp>({ required: true })

let start: Stamp
const onMoveStart = useDrag(
  () => { start = { ...stamp.value } },
  (dx, dy) => {
    stamp.value = {
      ...stamp.value,
      x: snapToGrid(start.x + dx / props.zoom),
      y: snapToGrid(start.y + dy / props.zoom)
    }
  }
)
</script>

<template>
  <div
    class="absolute cursor-move"
    :style="{ left: `${stamp.x}px`, top: `${stamp.y}px`, width: `${STAMP_SIZE}px`, height: `${STAMP_SIZE}px` }"
    @pointerdown="onMoveStart"
  >
    <img src="/frog.png" alt="Frosch" draggable="false" class="size-full object-contain drop-shadow-md">
  </div>
</template>
