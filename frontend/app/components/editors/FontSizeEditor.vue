<script setup lang="ts">
import type { FontSize } from '~/types/board'
import { Button } from '@/components/ui/button'

const SIZES: FontSize[] = ['S', 'M', 'L']

defineProps<{ value: FontSize }>()
const emit = defineEmits<{ change: [size: FontSize] }>()
</script>

<template>
  <div class="flex items-center">
    <Button
      v-for="size in SIZES"
      :key="size"
      size="icon"
      :variant="size === value ? 'secondary' : 'ghost'"
      :aria-label="`Schriftgröße ${size}`"
      @click="emit('change', size)"
    >
      {{ size }}
    </Button>
  </div>
</template>
