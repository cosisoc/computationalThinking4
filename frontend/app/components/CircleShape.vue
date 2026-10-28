<script setup lang="ts">
import type { CircleObject, Rect } from '~/types/board'

defineProps<{ object: CircleObject; selected: boolean }>()
const emit = defineEmits<{ select: []; move: [x: number, y: number]; resize: [rect: Rect] }>()
</script>

<template>
  <BoardItem
    :item="object"
    class="rounded-full shadow-md"
    :class="{ 'border-2 border-gray-800': object.border }"
    :style="{ backgroundColor: object.color }"
    :selected="selected"
    square
    @select="emit('select')"
    @move="(x, y) => emit('move', x, y)"
    @resize="emit('resize', $event)"
  />
</template>
