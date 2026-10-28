<script setup lang="ts">
import type { NoteObject, Rect, TextObject } from '~/types/board'

const MIN_SIZE = GRID_SIZE * 3

const props = defineProps<{ item: NoteObject | TextObject; editing: boolean }>()
const emit = defineEmits<{ stop: []; text: [text: string]; resize: [rect: Rect] }>()

const textarea = useTemplateRef<HTMLTextAreaElement>('textarea')
const content = useTemplateRef<HTMLElement>('content')

watch(
  () => props.editing,
  async (editing) => {
    if (!editing) return
    await nextTick()
    textarea.value?.focus()
    textarea.value?.select()
  },
)

const textClasses = computed(() => [FONT_SIZE_CLASSES[props.item.fontSize], props.item.bold ? 'font-bold' : ''])

function updateText(event: Event) {
  emit('text', (event.target as HTMLTextAreaElement).value)
}

// Grows the item to the next grid line when its text no longer fits.
async function fitToContent() {
  await nextTick()
  const element = textarea.value ?? content.value
  if (!element) return
  const needed = Math.max(MIN_SIZE, Math.ceil(element.scrollHeight / GRID_SIZE) * GRID_SIZE)
  const { x, y, width, height } = props.item
  if (needed > height) emit('resize', { x, y, width, height: needed })
}

watch(
  () => [props.item.text, props.item.width, props.item.height, props.item.fontSize, props.item.bold, props.editing],
  fitToContent,
)
onMounted(fitToContent)
</script>

<template>
  <textarea
    v-if="editing"
    ref="textarea"
    class="size-full p-4 bg-transparent resize-none outline-none"
    :class="textClasses"
    :value="item.text"
    @input="updateText"
    @blur="emit('stop')"
    @keydown.escape="emit('stop')"
  />
  <div
    v-else
    ref="content"
    class="size-full p-4 overflow-hidden whitespace-pre-wrap break-words select-none"
    :class="textClasses"
  >
    {{ item.text }}
  </div>
</template>
