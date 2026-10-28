<script setup lang="ts">
import type { Rect } from '~/types/board'

type Corner = 'nw' | 'ne' | 'sw' | 'se'
type Mode = 'move' | Corner

const MIN_SIZE = GRID_SIZE * 3
const HANDLE_CLASSES: Record<Corner, string> = {
  nw: 'left-0 top-0 cursor-nwse-resize',
  ne: 'left-full top-0 cursor-nesw-resize',
  sw: 'left-0 top-full cursor-nesw-resize',
  se: 'left-full top-full cursor-nwse-resize',
}

const props = defineProps<{ item: Rect; selected: boolean; editable?: boolean; square?: boolean }>()
const emit = defineEmits<{ select: []; move: [x: number, y: number]; resize: [rect: Rect] }>()

const scale = inject<Ref<number>>('canvasScale', ref(1))
const editing = ref(false)

let interaction: { mode: Mode; startX: number; startY: number; start: Rect } | null = null

function startInteraction(event: PointerEvent, mode: Mode) {
  event.stopPropagation()
  emit('select')
  if (editing.value) return
  const { x, y, width, height } = props.item
  interaction = { mode, startX: event.clientX, startY: event.clientY, start: { x, y, width, height } }
  ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
}

// Resizing from a north or west corner moves the item so the opposite corner stays put.
function resizedRect(mode: Corner, start: Rect, dx: number, dy: number): Rect {
  let width = Math.max(MIN_SIZE, snapToGrid(start.width + (mode.endsWith('e') ? dx : -dx)))
  let height = Math.max(MIN_SIZE, snapToGrid(start.height + (mode.startsWith('s') ? dy : -dy)))
  if (props.square) width = height = Math.max(width, height)
  return {
    width,
    height,
    x: mode.endsWith('w') ? start.x + start.width - width : start.x,
    y: mode.startsWith('n') ? start.y + start.height - height : start.y,
  }
}

function onPointerMove(event: PointerEvent) {
  if (!interaction) return
  const dx = (event.clientX - interaction.startX) / scale.value
  const dy = (event.clientY - interaction.startY) / scale.value
  const { mode, start } = interaction
  if (mode === 'move') emit('move', snapToGrid(start.x + dx), snapToGrid(start.y + dy))
  else emit('resize', resizedRect(mode, start, dx, dy))
}

function onPointerUp() {
  interaction = null
}

function startEditing() {
  if (props.editable) editing.value = true
}

function stopEditing() {
  editing.value = false
}
</script>

<template>
  <div
    class="absolute touch-none"
    :class="[selected ? 'ring-2 ring-blue-300' : '', editing ? 'cursor-text' : 'cursor-move']"
    :style="{ left: `${item.x}px`, top: `${item.y}px`, width: `${item.width}px`, height: `${item.height}px` }"
    @pointerdown="startInteraction($event, 'move')"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @dblclick="startEditing"
  >
    <slot :editing="editing" :stop-editing="stopEditing" />

    <template v-if="selected && !editing">
      <div
        v-for="(classes, corner) in HANDLE_CLASSES"
        :key="corner"
        class="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-sm border-2 border-blue-500 bg-background"
        :class="classes"
        @pointerdown="startInteraction($event, corner)"
      />
    </template>
  </div>
</template>
