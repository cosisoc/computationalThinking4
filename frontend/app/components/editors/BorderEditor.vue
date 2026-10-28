<script setup lang="ts">
import { Square } from '@lucide/vue'
import { Button } from '@/components/ui/button'

defineProps<{ value: boolean }>()
const emit = defineEmits<{ change: [on: boolean] }>()
</script>

<template>
  <Button size="icon" :variant="value ? 'secondary' : 'ghost'" aria-label="Rahmen" @click="emit('change', !value)">
    <Square />
  </Button>
</template>
