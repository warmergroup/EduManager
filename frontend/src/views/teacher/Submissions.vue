<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useTasksStore } from '@/stores/tasks'
import { useSubmissionsStore } from '@/stores/submissions'
import type { SubmissionData } from '@/types'
import { formatDate } from '@/utils/date'
import Loading from '@/components/ui/Loading.vue'
import Alert from '@/components/ui/Alert.vue'

// Stores
const taskStore = useTasksStore()
const submissionStore = useSubmissionsStore()
const { tasks } = storeToRefs(taskStore)
const { submissions, loading, error } = storeToRefs(submissionStore)

// State
const selectedTask = ref('')
const showGradeModal = ref(false)
const selectedSubmission = ref<SubmissionData | null>(null)
const gradeForm = ref({
    score: 0,
    feedback: ''
})

// Methods
const getStudentName = (submission: SubmissionData) => {
    return submission.studentName
}

const gradeSubmission = (submission: SubmissionData) => {
    selectedSubmission.value = submission
    gradeForm.value = {
        score: submission.score || 0,
        feedback: submission.feedback || ''
    }
    showGradeModal.value = true
}

const editGrade = (submission: SubmissionData) => {
    gradeSubmission(submission)
}

const closeGradeModal = () => {
    showGradeModal.value = false
    selectedSubmission.value = null
    gradeForm.value = {
        score: 0,
        feedback: ''
    }
}

const submitGrade = async () => {
    if (!selectedSubmission.value) return

    try {
        await submissionStore.gradeSubmission(
            selectedSubmission.value.id,
            gradeForm.value
        )
        closeGradeModal()
    } catch (err) {
        console.error('Failed to submit grade:', err)
    }
}

// Watch for task selection changes
watch(selectedTask, async (taskId) => {
    if (taskId) {
        await submissionStore.fetchSubmissionsForTask(taskId)
    } else {
        await submissionStore.fetchMySubmissions()
    }
})

// Lifecycle
onMounted(async () => {
    await taskStore.fetchTasks()
    await submissionStore.fetchMySubmissions()
})
</script>


<template>
    <div class="container mx-auto px-4 py-8">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold">Submissions</h1>
            <div class="flex gap-4">
                <select v-model="selectedTask" class="px-4 py-2 border rounded-lg">
                    <option value="">All Tasks</option>
                    <option v-for="task in tasks" :key="task._id" :value="task._id">
                        {{ task.title }}
                    </option>
                </select>
            </div>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="flex justify-center py-8">
            <Loading />
        </div>

        <!-- Error state -->
        <Alert v-if="error" show type="error" title="Error" :message="error" />

        <!-- Submissions list -->
        <div v-if="!loading && submissions.length > 0" class="grid gap-4">
            <div v-for="submission in submissions" :key="submission.id" class="bg-white rounded-lg shadow p-6">
                <!-- Student Info -->
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h3 class="text-lg font-semibold">
                            {{ getStudentName(submission) }}
                        </h3>
                        <p class="text-sm text-gray-500">
                            Submitted: {{ formatDate(submission.submittedAt) }}
                        </p>
                    </div>
                    <div :class="[
                        'px-2 py-1 text-sm rounded-full',
                        submission.isGraded
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                    ]">
                        {{ submission.isGraded ? 'Graded' : 'Pending' }}
                    </div>
                </div>

                <!-- File Info -->
                <div class="flex items-center mb-4 p-3 bg-gray-50 rounded-lg">
                    <svg class="h-6 w-6 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <div>
                        <p class="font-medium">{{ submission.fileName }}</p>
                        <p class="text-sm text-gray-500">File uploaded</p>
                    </div>
                    <a :href="submission.fileUrl" target="_blank" class="ml-auto text-blue-500 hover:text-blue-600">
                        Download
                    </a>
                </div>

                <!-- Grade Form -->
                <div class="border-t pt-4">
                    <div v-if="submission.isGraded">
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-gray-600">Score:</span>
                            <span class="font-semibold">{{ submission.score }}/100</span>
                        </div>
                        <p v-if="submission.feedback" class="text-gray-600 text-sm">
                            {{ submission.feedback }}
                        </p>
                        <button @click="editGrade(submission)" class="mt-2 text-blue-500 hover:text-blue-600 text-sm">
                            Edit Grade
                        </button>
                    </div>
                    <button v-else @click="gradeSubmission(submission)"
                        class="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                        Grade Submission
                    </button>
                </div>
            </div>
        </div>

        <!-- Empty state -->
        <div v-if="!loading && submissions.length === 0" class="text-center py-8 text-gray-500">
            No submissions found
        </div>

        <!-- Grade Modal -->
        <div v-if="showGradeModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-lg w-full max-w-md p-6">
                <h3 class="text-lg font-semibold mb-4">Grade Submission</h3>

                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Score (0-100)
                    </label>
                    <input v-model.number="gradeForm.score" type="number" min="0" max="100" required
                        class="w-full px-3 py-2 border rounded-lg" />
                </div>

                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Feedback
                    </label>
                    <textarea v-model="gradeForm.feedback" rows="3"
                        class="w-full px-3 py-2 border rounded-lg"></textarea>
                </div>

                <div class="flex justify-end gap-4">
                    <button @click="closeGradeModal"
                        class="px-4 py-2 text-gray-600 hover:text-gray-700 border rounded-lg">
                        Cancel
                    </button>
                    <button @click="submitGrade" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                        Submit Grade
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
