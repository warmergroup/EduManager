<script lang="ts" setup>
import { defineProps } from 'vue';


const props = defineProps({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
})
</script>

<template>
    <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">{{ props.title }}</h1>
        <p class="mt-2 text-gray-600">{{ props.description }}</p>
    </div>
</template>