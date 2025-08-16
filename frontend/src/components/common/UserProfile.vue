<template>
    <div class="bg-white shadow rounded-lg p-6">
        <div class="flex items-center space-x-4 mb-6">
            <div class="w-16 h-16 rounded-full flex items-center justify-center"
                :class="role === 'teacher' ? 'bg-green-500' : 'bg-blue-500'">
                <span class="text-xl font-bold text-white">
                    {{ user?.fullName?.charAt(0)?.toUpperCase() }}
                </span>
            </div>
            <div>
                <h2 class="text-lg font-semibold text-gray-900">{{ user?.fullName }}</h2>
                <p class="text-gray-600">{{ user?.email }}</p>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="role === 'teacher' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'">
                    {{ role === 'teacher' ? 'Teacher' : 'Student' }}
                </span>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
                <span class="text-gray-500">Ro'yxatdan o'tgan:</span>
                <span class="ml-2 font-medium">{{ formatDate(user?.createdAt) }}</span>
            </div>
            <div>
                <span class="text-gray-500">Email:</span>
                <span class="ml-2 font-medium">{{ user?.email }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface User {
    fullName: string
    email: string
    createdAt: string
    role: string
}

interface Props {
    user: User
}

const props = defineProps<Props>()

const role = computed(() => props.user?.role || 'student')

const formatDate = (date: string | Date | undefined) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('uz-UZ')
}
</script>
