<script setup lang="ts">
import { Bold } from '@lucide/vue'
import { Button } from '@/components/ui/button'

defineProps<{ value: boolean }>()
const emit = defineEmits<{ change: [on: boolean] }>()
</script>

<template>
  <Button size="icon" :variant="value ? 'secondary' : 'ghost'" aria-label="Fett" @click="emit('change', !value)">
    <Bold />
  </Button>
</template>
