<script setup lang="ts">
import type { TextObject, Rect } from '~/types/board'

defineProps<{ object: TextObject; selected: boolean }>()
const emit = defineEmits<{ select: []; move: [x: number, y: number]; resize: [rect: Rect]; text: [text: string] }>()
</script>

<template>
  <BoardItem
    v-slot="{ editing, stopEditing }"
    :item="object"
    :style="{ color: object.color }"
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
