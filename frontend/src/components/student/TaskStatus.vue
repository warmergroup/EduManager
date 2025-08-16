<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    deadline: string
    isSubmitted: boolean
    isGraded?: boolean
}>()

const isPastDue = computed(() => {
    return new Date(props.deadline) < new Date()
})

const status = computed(() => {
    if (props.isGraded) return 'Graded'
    if (props.isSubmitted) return 'Submitted'
    if (isPastDue.value) return 'Past Due'
    return 'Pending'
})
</script>


<template>
    <span :class="[
        'px-2 py-1 text-xs font-medium rounded-full',
        isGraded ? 'bg-green-100 text-green-700' :
            isSubmitted ? 'bg-blue-100 text-blue-700' :
                isPastDue ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
    ]">
        {{ status }}
    </span>
</template>
