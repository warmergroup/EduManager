<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Navbar -->
        <Navbar />

        <div class="flex">
            <!-- Sidebar -->
            <Sidebar />

            <!-- Main Content -->
            <main class="flex-1 h-[90vh] overflow-auto p-4">
                <router-view />
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import Navbar from './Navbar.vue'
import Sidebar from './Sidebar.vue'
</script>
