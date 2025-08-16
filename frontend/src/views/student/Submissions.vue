<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useSubmissionsStore } from '@/stores/submissions.ts'
import SubmissionCard from '@/components/student/SubmissionCard.vue'
import Loading from '@/components/ui/Loading.vue'
import Alert from '@/components/ui/Alert.vue'

// Store
const submissionStore = useSubmissionsStore()
const { submissions, loading, error } = storeToRefs(submissionStore)

// Lifecycle
onMounted(async () => {
    await submissionStore.fetchSubmissions()
})
</script>


<template>
    <div class="container mx-auto px-4 py-8">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold">My Submissions</h1>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="flex justify-center py-8">
            <Loading />
        </div>

        <!-- Error state -->
        <Alert v-if="error" :show="!!error" type="error" :title="'Error'" :message="error" class="mb-4" />

        <!-- Submissions list -->
        <div v-if="!loading && submissions.length > 0" class="grid gap-4">
            <SubmissionCard v-for="submission in submissions" :key="submission.id" :submission="submission" />
        </div>

        <!-- Empty state -->
        <div v-if="!loading && submissions.length === 0" class="text-center py-8 text-gray-500">
            No submissions yet
        </div>
    </div>
</template>
