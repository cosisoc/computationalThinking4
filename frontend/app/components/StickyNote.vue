<script setup lang="ts">
import type { NoteObject, Rect } from '~/types/board'

defineProps<{ object: NoteObject; selected: boolean }>()
const emit = defineEmits<{ select: []; move: [x: number, y: number]; resize: [rect: Rect]; text: [text: string] }>()
</script>

<template>
  <BoardItem
    v-slot="{ editing, stopEditing }"
    :item="object"
    class="shadow-md"
    :class="{ 'border-2 border-gray-800': object.border }"
    :style="{ backgroundColor: object.color }"
    :selected="selected"
    editable
    @select="emit('select')"
    @move="(x, y) => emit('move', x, y)"
    @resize="emit('resize', $event)"
  >
    <EditableText
      :item="object"
      :editing="editing"
      @stop="stopEditing"
      @text="emit('text', $event)"
      @resize="emit('resize', $event)"
    />
  </BoardItem>
</template>
