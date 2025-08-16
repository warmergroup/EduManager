<template>
    <div class="aspect-video bg-gray-100 rounded-lg overflow-hidden">
        <template v-if="videoId">
            <iframe :src="embedUrl" class="w-full h-full" title="YouTube video player" frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen></iframe>
        </template>
        <div v-else class="h-full flex flex-col items-center justify-center text-gray-400 p-4">
            <VideoCameraIcon class="w-12 h-12 mb-2" />
            <p class="text-sm text-center">
                {{ error || 'Video not available' }}
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { VideoCameraIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
    url?: string
}>()

const error = ref<string | null>(null)

const videoId = computed(() => {
    if (!props.url) {
        error.value = 'No video URL provided'
        return null
    }

    try {
        const url = new URL(props.url)

        // Handle different YouTube URL formats
        if (url.hostname.includes('youtube.com')) {
            // Standard youtube.com URLs
            if (url.pathname === '/watch') {
                const id = url.searchParams.get('v')
                if (id) return id
            }

            // Embedded URLs
            if (url.pathname.startsWith('/embed/')) {
                return url.pathname.split('/')[2]
            }
        }
        // Handle youtu.be URLs
        else if (url.hostname === 'youtu.be') {
            return url.pathname.slice(1)
        }

        error.value = 'Invalid YouTube URL format'
        return null
    } catch (err) {
        error.value = 'Invalid URL'
        return null
    }
})

const embedUrl = computed(() => {
    if (!videoId.value) return ''
    return `https://www.youtube.com/embed/${videoId.value}?autoplay=0&rel=0`
})
</script>
