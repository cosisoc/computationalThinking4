<script setup lang="ts">
import type { Note } from '~/types/note'

const MIN_SIZE = GRID_SIZE * 4

const props = defineProps<{ zoom: number }>()
const note = defineModel<Note>({ required: true })
const editing = ref(false)
const textarea = ref<HTMLTextAreaElement>()

function update(patch: Partial<Note>) {
  note.value = { ...note.value, ...patch }
}

let start: Note
const remember = () => { start = { ...note.value } }

// Pointer offsets are in screen pixels; divide by zoom to get canvas pixels.
const onMoveStart = useDrag(remember, (dx, dy) =>
  update({ x: snapToGrid(start.x + dx / props.zoom), y: snapToGrid(start.y + dy / props.zoom) })
)

const onResizeStart = useDrag(remember, (dx, dy) =>
  update({
    width: Math.max(MIN_SIZE, snapToGrid(start.width + dx / props.zoom)),
    height: Math.max(MIN_SIZE, snapToGrid(start.height + dy / props.zoom))
  })
)

async function startEditing() {
  editing.value = true
  await nextTick()
  textarea.value?.focus()
}
</script>

<template>
  <div
    class="absolute rounded-sm p-4 shadow-md"
    :class="editing ? 'cursor-text' : 'cursor-move'"
    :style="{
      left: `${note.x}px`,
      top: `${note.y}px`,
      width: `${note.width}px`,
      height: `${note.height}px`,
      backgroundColor: note.color
    }"
    @pointerdown="!editing && onMoveStart($event)"
    @dblclick="startEditing"
  >
    <ColorPicker
      v-if="editing"
      :zoom="zoom"
      :model-value="note.color"
      @update:model-value="update({ color: $event })"
    />
    <textarea
      v-if="editing"
      ref="textarea"
      class="size-full resize-none bg-transparent outline-none select-text"
      :value="note.text"
      @input="update({ text: ($event.target as HTMLTextAreaElement).value })"
      @blur="editing = false"
    />
    <p v-else class="size-full overflow-hidden break-words whitespace-pre-wrap">
      <span v-if="note.text">{{ note.text }}</span>
      <span v-else class="text-black/40">Doppelklick zum Schreiben</span>
    </p>
    <div
      class="absolute -right-1.5 -bottom-1.5 size-3 cursor-nwse-resize rounded-full border-2 border-blue-500 bg-white"
      @pointerdown.stop="onResizeStart"
    />
  </div>
</template>
