import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSidebarStore = defineStore('sidebar', () => {
  const isOpen = ref(true)
  const isMobile = ref(false)

  const checkMobile = () => {
    isMobile.value = window.innerWidth < 1024
    if (isMobile.value) {
      isOpen.value = false
    }
  }

  const toggle = () => {
    isOpen.value = !isOpen.value
  }
  const close = () => { isOpen.value = false }
  const open = () => { isOpen.value = true }

  const sidebarTransform = computed(() => {
    if (isMobile.value) {
      return isOpen.value ? 'translate-x-0' : '-translate-x-full'
    }
    return 'translate-x-0'
  })

  const sidebarWidth = computed(() => {
    if (isMobile.value) {
      return isOpen.value ? '70vw' : '0'
    }
    return isOpen.value ? '240px' : '60px'
  })

  const mainContentMargin = computed(() => {
    if (isMobile.value) return '0'
    return isOpen.value ? '0' : '0'
  })

  const isCollapsed = computed(() => !isOpen.value)

  return {
    isOpen,
    isMobile,
    isCollapsed,
    sidebarTransform,
    sidebarWidth,
    mainContentMargin,
    toggle,
    close,
    open,
    checkMobile
  }
})
