<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 transform scale-95"
    enter-to-class="opacity-100 transform scale-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 transform scale-100"
    leave-to-class="opacity-0 transform scale-95"
  >
    <div
      v-if="show"
      class="fixed top-4 right-4 z-50 max-w-sm w-full"
      :class="alertClasses"
    >
      <div class="p-4 rounded-lg shadow-lg border">
        <div class="flex">
          <div class="flex-shrink-0">
            <component :is="iconComponent" class="w-5 h-5" />
          </div>
          <div class="ml-3 flex-1">
            <p class="text-sm font-medium">{{ title }}</p>
            <p v-if="message" class="text-sm mt-1 opacity-90">{{ message }}</p>
          </div>
          <div class="ml-4 flex-shrink-0">
            <button @click="close" class="inline-flex text-sm opacity-70 hover:opacity-100">
              <XMarkIcon class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

interface Props {
  show: boolean
  type: 'success' | 'warning' | 'error' | 'info'
  title: string
  message?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const alertClasses = computed(() => {
  const baseClasses = 'text-sm'
  const typeClasses = {
    success: 'bg-green-50 text-green-800 border-green-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200'
  }
  return `${baseClasses} ${typeClasses[props.type]}`
})

const iconComponent = computed(() => {
  const icons = {
    success: CheckCircleIcon,
    warning: ExclamationTriangleIcon,
    error: XCircleIcon,
    info: InformationCircleIcon
  }
  return icons[props.type]
})

const close = () => {
  emit('close')
}
</script>