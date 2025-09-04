<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTeacherStore } from '@/stores/teacher'
import PageHeader from '@/components/common/PageHeader.vue'

const teacherStore = useTeacherStore()

const loading = computed(() => teacherStore.loading)
const students = computed(() => teacherStore.students)
const searchQuery = ref('')
const filterRole = ref('')
const currentPage = ref(1)
const pageSize = ref<number>(10)

const filteredStudents = computed(() => {
    let filtered = students.value

    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(student =>
            student.fullName.toLowerCase().includes(query) ||
            student.email.toLowerCase().includes(query)
        )
    }

    if (filterRole.value) {
        filtered = filtered.filter(student => student.role === filterRole.value)
    }

    return filtered
})

const totalPages = computed(() => Math.ceil(filteredStudents.value.length / pageSize.value))

const paginatedStudents = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return filteredStudents.value.slice(start, end)
})

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('uz-UZ')
}

const clearFilters = () => {
    searchQuery.value = ''
    filterRole.value = ''
    currentPage.value = 1
}

// const viewStudentDetails = (student: any) => {
//     // TODO: Navigate to student details page or open modal
//     console.log('View student details:', student)
// }

onMounted(async () => {
    await teacherStore.fetchStudents()
})
</script>

<template>
    <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <PageHeader :title="$t('students.title')" :description="$t('students.allStudentListandResults')" />

        <!-- Search and Filter -->
        <div class="bg-white shadow rounded-lg p-6 mb-8">
            <div class="flex flex-col sm:flex-row gap-4">
                <div class="flex-1">
                    <input v-model="searchQuery" type="text" :placeholder="$t('students.placeholder')"
                        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
            </div>
        </div>

        <!-- Students List -->
        <div class="bg-white shadow rounded-lg">
            <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-medium text-gray-900">{{ $t('students.studentList') }}</h3>
            </div>

            <div v-if="loading" class="p-6 text-center">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                <p class="mt-2 text-gray-600">{{ $t('students.loading') }}</p>
            </div>

            <div v-else-if="filteredStudents.length === 0" class="p-6 text-center">
                <p class="text-gray-500">{{ $t('students.noStudentsFound') }}</p>
            </div>

            <div v-else class="divide-y divide-gray-200">
                <div v-for="student in paginatedStudents" :key="student._id" class="p-6 hover:bg-gray-50">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-4">
                            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <span class="text-lg font-semibold text-blue-600">
                                    {{ student.fullName.charAt(0).toUpperCase() }}
                                </span>
                            </div>
                            <div>
                                <h4 class="text-lg font-medium text-gray-900">{{ student.fullName }}</h4>
                                <p class="text-sm text-gray-600">{{ student.email }}</p>
                                <p class="text-xs text-gray-500">{{ $t('students.regestered') }}: {{
                                    formatDate(student.createdAt)
                                    }}</p>
                            </div>
                        </div>

                        <div class="flex items-center space-x-4">
                            <div class="text-right">
                                <p class="text-sm font-medium text-gray-900">{{ student.totalSubmissions || 0 }}</p>
                                <p class="text-xs text-gray-500">{{ $t('students.tasks') }}</p>
                            </div>
                            <div class="text-right">
                                <p class="text-sm font-medium text-gray-900">{{ student.averageScore || 0 }}/100</p>
                                <p class="text-xs text-gray-500">{{ $t('students.averageScore') }}</p>
                            </div>
                            <div class="text-right">
                                <p class="text-sm font-medium text-gray-900">{{ student.completionRate || 0 }}%</p>
                                <p class="text-xs text-gray-500">{{ $t('students.completed') }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="px-6 py-4 border-t border-gray-200">
                <div class="flex items-center justify-between">
                    <div class="text-sm text-gray-700">
                        {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize,
                            filteredStudents.length) }}
                        {{ $t('students.from') }} {{ filteredStudents.length }} {{ $t('students.students') }}
                    </div>
                    <div class="flex space-x-2">
                        <button @click="currentPage--" :disabled="currentPage === 1"
                            class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50">
                            {{ $t('students.previous') }}
                        </button>
                        <span class="px-3 py-1 text-sm text-gray-700">
                            {{ currentPage }} / {{ totalPages }}
                        </span>
                        <button @click="currentPage++" :disabled="currentPage === totalPages"
                            class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50">
                            {{ $t('students.next') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>