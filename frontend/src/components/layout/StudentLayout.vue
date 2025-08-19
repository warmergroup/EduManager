<script setup lang="ts">
import { onMounted } from 'vue'
import Navbar from './Navbar.vue'
import Sidebar from './Sidebar.vue'
import { useSidebarStore } from '@/stores/sidebar'

const sidebarStore = useSidebarStore()

onMounted(() => {
    sidebarStore.checkMobile()
})
</script>

<template>
    <div class="min-h-screen bg-gray-50">
        <Navbar />
        <div class="flex">
            <Sidebar />
            <main class="flex-1 h-[90vh] overflow-auto p-4 transition-all duration-500 ease-in-out"
                :style="{ marginLeft: sidebarStore.mainContentMargin }">
                <router-view />
            </main>
        </div>
    </div>
</template>
