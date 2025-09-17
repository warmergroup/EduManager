<template>
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <PageHeader :title="t('groups.title')" :description="t('groups.description')">
      <button @click="showCreateModal = true"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
        <svg class="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        {{ t('groups.createGroup') }}
      </button>
    </PageHeader>

    <!-- Search and Filters -->
    <div class="mb-6 flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <input v-model="searchQuery" type="text" :placeholder="t('common.search')"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
      </div>
      <div class="flex gap-2">
        <select v-model="centerFilter"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="">{{ t('common.allCenters') }}</option>
          <option v-for="center in centers" :key="center._id" :value="center._id">
            {{ center.name }}
          </option>
        </select>
        <select v-model="subjectFilter"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="">{{ t('common.allSubjects') }}</option>
          <option value="mathematics">{{ t('subjects.mathematics') }}</option>
          <option value="physics">{{ t('subjects.physics') }}</option>
          <option value="chemistry">{{ t('subjects.chemistry') }}</option>
          <option value="biology">{{ t('subjects.biology') }}</option>
          <option value="english">{{ t('subjects.english') }}</option>
          <option value="russian">{{ t('subjects.russian') }}</option>
          <option value="uzbek">{{ t('subjects.uzbek') }}</option>
        </select>
      </div>
    </div>

    <!-- Groups List -->
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">{{ t('common.loading') }}...</p>
    </div>

    <div v-else-if="groups.length === 0" class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z">
          </path>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">{{ t('groups.noGroups') }}</h3>
      <p class="text-gray-600 mb-4">{{ t('groups.noGroupsDescription') }}</p>
      <button @click="showCreateModal = true"
        class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
        {{ t('groups.createGroup') }}
      </button>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="group in filteredGroups" :key="group._id"
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ group.name }}</h3>
            <p class="text-sm text-gray-600">{{ group.subject }}</p>
          </div>
          <span class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            {{ group.students?.length || 0 }}/{{ group.maxStudents }}
          </span>
        </div>

        <div class="space-y-2 mb-4">
          <div class="flex items-center text-sm text-gray-600">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4">
              </path>
            </svg>
            {{ getCenterName(group.centerId) }}
          </div>
          <div class="flex items-center text-sm text-gray-600">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z">
              </path>
            </svg>
            {{ getTeacherName(group.teacherId) }}
          </div>
          <div v-if="group.schedule" class="flex items-center text-sm text-gray-600">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            {{ formatSchedule(group.schedule) }}
          </div>
        </div>

        <!-- Students List -->
        <div v-if="group.students && group.students.length > 0" class="mb-4">
          <h4 class="text-sm font-medium text-gray-700 mb-2">{{ t('groups.students') }} ({{ group.students.length }})
          </h4>
          <div class="flex flex-wrap gap-1">
            <span v-for="student in group.students.slice(0, 3)" :key="student._id"
              class="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
              {{ student.fullName }}
            </span>
            <span v-if="group.students.length > 3" class="px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded-full">
              +{{ group.students.length - 3 }} {{ t('common.more') }}
            </span>
          </div>
        </div>

        <div class="flex items-center justify-between pt-4 border-t border-gray-200">
          <div class="text-sm text-gray-500">
            {{ t('groups.created') }}: {{ formatDate(group.createdAt) }}
          </div>
          <div class="flex space-x-2">
            <button @click="editGroup(group)" class="text-blue-600 hover:text-blue-800 text-sm font-medium">
              {{ t('common.edit') }}
            </button>
            <button @click="deleteGroup(group._id)" class="text-red-600 hover:text-red-800 text-sm font-medium">
              {{ t('common.delete') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="mt-8 flex justify-center">
      <div class="flex space-x-2">
        <button @click="currentPage = Math.max(1, currentPage - 1)" :disabled="currentPage === 1"
          class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
          {{ t('common.previous') }}
        </button>

        <span v-for="page in visiblePages" :key="page" @click="currentPage = page"
          class="px-3 py-2 text-sm font-medium rounded-lg cursor-pointer"
          :class="page === currentPage ? 'bg-blue-600 text-white' : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'">
          {{ page }}
        </span>

        <button @click="currentPage = Math.min(totalPages, currentPage + 1)" :disabled="currentPage === totalPages"
          class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
          {{ t('common.next') }}
        </button>
      </div>
    </div>

    <!-- Create Group Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-2xl mx-4">
        <h3 class="text-xl font-bold text-gray-900 mb-4">{{ t('groups.createGroup') }}</h3>
        <p class="text-gray-600 mb-4">{{ t('groups.createGroupDescription') }}</p>
        <div class="flex justify-end space-x-3">
          <button @click="showCreateModal = false"
            class="px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
            {{ t('common.close') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGroupsStore } from '@/stores/groups'
import { useCentersStore } from '@/stores/centers'
import PageHeader from '@/components/common/PageHeader.vue'

const { t } = useI18n()

const groupsStore = useGroupsStore()
const centersStore = useCentersStore()

const loading = ref(false)
const groups = ref<any[]>([])
const centers = ref<any[]>([])
const searchQuery = ref('')
const centerFilter = ref('')
const subjectFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(12)
const totalPages = ref(0)
const showCreateModal = ref(false)

const filteredGroups = computed(() => {
  let filtered = groups.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(group =>
      group.name.toLowerCase().includes(query) ||
      group.subject.toLowerCase().includes(query)
    )
  }

  if (centerFilter.value) {
    filtered = filtered.filter(group => group.centerId === centerFilter.value)
  }

  if (subjectFilter.value) {
    filtered = filtered.filter(group => group.subject === subjectFilter.value)
  }

  return filtered
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const getCenterName = (centerId: string) => {
  const center = centers.value.find(c => c._id === centerId)
  return center ? center.name : 'Unknown Center'
}

const getTeacherName = (teacherId: string) => {
  // TODO: Implement teacher name lookup
  return 'Teacher Name'
}

const formatSchedule = (schedule: any) => {
  if (!schedule) return 'No schedule'
  // TODO: Format schedule properly
  return 'Mon, Wed, Fri'
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('uz-UZ')
}

const fetchGroups = async () => {
  try {
    loading.value = true
    await groupsStore.fetchGroups({
      page: currentPage.value,
      limit: pageSize.value
    })
    groups.value = groupsStore.groups
    totalPages.value = groupsStore.totalPages
  } catch (error) {
    console.error('Error fetching groups:', error)
  } finally {
    loading.value = false
  }
}

const fetchCenters = async () => {
  try {
    await centersStore.fetchCenters({ limit: 100 })
    centers.value = centersStore.centers
  } catch (error) {
    console.error('Error fetching centers:', error)
  }
}

const editGroup = (group: any) => {
  // TODO: Implement edit functionality
  console.log('Edit group:', group)
}

const deleteGroup = async (groupId: string) => {
  if (confirm('Are you sure you want to delete this group?')) {
    try {
      await groupsStore.deleteGroup(groupId)
      await fetchGroups()
    } catch (error) {
      console.error('Error deleting group:', error)
    }
  }
}

watch(currentPage, () => {
  fetchGroups()
})

onMounted(async () => {
  await Promise.all([fetchGroups(), fetchCenters()])
})
</script>
