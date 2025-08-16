<template>
  <div class="flex items-center justify-center p-4">
    <div class="flex items-center space-x-2">
      <div class="animate-spin rounded-full h-6 w-6 border-2 border-primary-500 border-t-transparent"></div>
      <span v-if="text" class="text-sm text-gray-600">{{ text }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  text?: string
}

defineProps<Props>()
</script>