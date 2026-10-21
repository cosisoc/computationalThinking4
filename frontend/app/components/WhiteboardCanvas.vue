<script setup lang="ts">
import type { Note } from '~/types/note'
import type { Stamp } from '~/types/stamp'

const NOTE_SIZE = 192

const { view, zoomAt, toWorld, onWheel, onPanStart } = useViewport()

let nextId = 1
function createNote(x: number, y: number): Note {
  return { id: nextId++, x, y, width: NOTE_SIZE, height: NOTE_SIZE, text: '', color: NOTE_COLORS[0]!.value }
}

const notes = ref<Note[]>([createNote(96, 96)])
const stamps = ref<Stamp[]>([])
const stamping = ref(false)

// Places a new note in the middle of the visible area.
function addNote() {
  const center = toWorld(window.innerWidth / 2, window.innerHeight / 2)
  notes.value.push(createNote(snapToGrid(center.x - NOTE_SIZE / 2), snapToGrid(center.y - NOTE_SIZE / 2)))
}

// Centers a new stamp on the clicked point.
function placeStamp(event: PointerEvent) {
  if (event.button !== 0) return
  const point = toWorld(event.clientX, event.clientY)
  stamps.value.push({
    id: nextId++,
    x: snapToGrid(point.x - STAMP_SIZE / 2),
    y: snapToGrid(point.y - STAMP_SIZE / 2)
  })
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') stamping.value = false
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))

function zoomCentered(factor: number) {
  zoomAt(factor, window.innerWidth / 2, window.innerHeight / 2)
}
</script>

<template>
  <div
    class="relative h-screen w-screen cursor-grab overflow-hidden bg-neutral-100 select-none active:cursor-grabbing"
    :style="{
      backgroundImage: 'radial-gradient(circle at 1px 1px, #c4c4c4 1px, transparent 0)',
      backgroundSize: `${GRID_SIZE * view.zoom}px ${GRID_SIZE * view.zoom}px`,
      backgroundPosition: `${view.x}px ${view.y}px`
    }"
    @pointerdown.self="onPanStart"
    @wheel.prevent="onWheel"
  >
    <div
      class="absolute top-0 left-0 origin-top-left"
      :style="{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.zoom})` }"
    >
      <StickyNote v-for="(note, i) in notes" :key="note.id" v-model="notes[i]!" :zoom="view.zoom" />
      <FrogStamp v-for="(stamp, i) in stamps" :key="stamp.id" v-model="stamps[i]!" :zoom="view.zoom" />
    </div>
    <!-- While stamping, this layer catches clicks so they don't reach notes or stamps. -->
    <div v-if="stamping" class="absolute inset-0 cursor-crosshair" @pointerdown="placeStamp" />
    <NoteSidebar :stamping="stamping" @add="addNote" @stamp="stamping = !stamping" />
    <ZoomControls :zoom="view.zoom" @zoom="zoomCentered" />
  </div>
</template>
