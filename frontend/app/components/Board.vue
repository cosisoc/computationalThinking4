<script setup lang="ts">
import type { Component } from 'vue'
import type { BoardObject, BoardObjectKind, Rect } from '~/types/board'
import StickyNote from './StickyNote.vue'
import TextBox from './TextBox.vue'
import CircleShape from './CircleShape.vue'

const VARIANTS: Record<BoardObjectKind, Component> = { note: StickyNote, text: TextBox, circle: CircleShape }

const board = useBoard()
const { objects, addObject, moveObject, resizeObject, setText } = board
const canvas = useTemplateRef('canvas')
const selectedId = ref<string | null>(null)
const clipboard = ref<BoardObject | null>(null)
const selected = computed(() => objects.value.find((o) => o.id === selectedId.value) ?? null)

function create(kind: BoardObjectKind) {
  const center = canvas.value!.toWorld(window.innerWidth / 2, window.innerHeight / 2)
  selectedId.value = addObject(kind, center.x, center.y).id
}

// Runs the first matching shortcut, but none while text is being typed.
function onKeydown(event: KeyboardEvent) {
  if (event.target instanceof HTMLTextAreaElement) return
  const shortcut = SHORTCUTS.find((s) => s.matches(event))
  if (!shortcut) return
  event.preventDefault()
  shortcut.run(
    {
      selected: selected.value,
      select: (id) => (selectedId.value = id),
      clipboard,
      board,
      panBy: (dx, dy) => canvas.value!.panBy(dx, dy),
    },
    event,
  )
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <InfiniteCanvas ref="canvas" @pointerdown="selectedId = null">
    <component
      :is="VARIANTS[object.kind]"
      v-for="object in objects"
      :key="object.id"
      :object="object"
      :selected="object.id === selectedId"
      @select="selectedId = object.id"
      @move="(x: number, y: number) => moveObject(object.id, x, y)"
      @resize="(rect: Rect) => resizeObject(object.id, rect)"
      @text="(text: string) => setText(object.id, text)"
    />
    <ContextBar v-if="selected" :object="selected" />
  </InfiniteCanvas>
  <BoardToolbar @create="create" />
</template>
