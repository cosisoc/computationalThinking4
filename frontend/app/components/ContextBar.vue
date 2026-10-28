<script setup lang="ts">
import type { Component } from 'vue'
import type { Attribute, BoardObject } from '~/types/board'
import ColorEditor from './editors/ColorEditor.vue'
import FontSizeEditor from './editors/FontSizeEditor.vue'
import BorderEditor from './editors/BorderEditor.vue'
import BoldEditor from './editors/BoldEditor.vue'

const props = defineProps<{ object: BoardObject }>()

const { setColor, setFontSize, setBorder, setBold } = useBoard()
const scale = inject<Ref<number>>('canvasScale', ref(1))

// Which editor belongs to which attribute, and which board function it changes.
const EDITORS: Record<Attribute, { editor: Component; set: (id: string, value: any) => void }> = {
  color: { editor: ColorEditor, set: setColor },
  fontSize: { editor: FontSizeEditor, set: setFontSize },
  border: { editor: BorderEditor, set: setBorder },
  bold: { editor: BoldEditor, set: setBold },
}

function valueOf(attribute: Attribute) {
  return (props.object as Partial<Record<Attribute, unknown>>)[attribute]
}
</script>

<template>
  <!-- Sits just above the object and undoes the canvas zoom so it always has the same size on screen. -->
  <div
    class="absolute origin-top-left"
    :style="{ left: `${object.x}px`, top: `${object.y}px`, transform: `scale(${1 / scale})` }"
  >
    <div
      class="absolute bottom-4 left-0 flex items-center gap-1 rounded-xl border bg-background p-1 shadow-lg"
      @pointerdown.stop
    >
      <template v-for="(attribute, index) in ATTRIBUTES[object.kind]" :key="attribute">
        <div v-if="index > 0" class="mx-0.5 h-6 w-px bg-border" />
        <component
          :is="EDITORS[attribute].editor"
          :value="valueOf(attribute)"
          @change="(value: unknown) => EDITORS[attribute].set(object.id, value)"
        />
      </template>
    </div>
  </div>
</template>
