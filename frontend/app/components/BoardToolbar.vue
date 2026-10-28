<script setup lang="ts">
import { Circle, StickyNote, Type } from '@lucide/vue'
import type { BoardObjectKind } from '~/types/board'
import { Button } from '@/components/ui/button'

const emit = defineEmits<{ create: [kind: BoardObjectKind] }>()

const TOOLS = [
  { kind: 'note', label: 'Post-it', icon: StickyNote },
  { kind: 'text', label: 'Text', icon: Type },
  { kind: 'circle', label: 'Kreis', icon: Circle },
] as const
</script>

<template>
  <div class="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-xl border bg-background p-1.5 shadow-lg">
    <Button v-for="tool in TOOLS" :key="tool.kind" variant="ghost" @click="emit('create', tool.kind)">
      <component :is="tool.icon" />
      {{ tool.label }}
    </Button>
  </div>
</template>
