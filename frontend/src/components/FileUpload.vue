<script setup lang="ts">
import { ref, computed } from 'vue'
import { CloudArrowUpIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import FileIcon from './FileIcon.vue'

interface FilePreview {
    name: string
    size: number
    type: string
    file: File
}

interface Props {
    accept?: string
    multiple?: boolean
    maxSize?: number // bytes
    fileTypes?: string[]
}

const props = withDefaults(defineProps<Props>(), {
    accept: 'image/*,.pdf,.doc,.docx',
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB
    fileTypes: () => ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
})

const emit = defineEmits<{
    'file-selected': [file: File]
    'file-removed': []
}>()

const fileInput = ref<HTMLInputElement>()
const filePreview = ref<FilePreview | null>(null)
const isDragOver = ref(false)
const error = ref('')

const maxSizeText = computed(() => {
    if (props.maxSize >= 1024 * 1024) {
        return `${Math.round(props.maxSize / (1024 * 1024))}MB`
    }
    return `${Math.round(props.maxSize / 1024)}KB`
})

const fileTypesText = computed(() => {
    const types = props.fileTypes.map(type => {
        if (type.startsWith('image/')) return 'Rasmlar'
        if (type.includes('pdf')) return 'PDF'
        if (type.includes('word') || type.includes('docx')) return 'Word hujjatlar'
        return type
    })
    return types.join(', ')
})

const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > props.maxSize) {
        error.value = `Fayl hajmi ${maxSizeText.value} dan katta bo'lishi mumkin emas`
        return false
    }

    // Check file type
    if (!props.fileTypes.includes(file.type)) {
        error.value = 'Bu fayl turi qo\'llab-quvvatlanmaydi'
        return false
    }

    error.value = ''
    return true
}

const handleFileSelect = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]

    if (file && validateFile(file)) {
        filePreview.value = {
            name: file.name,
            size: file.size,
            type: file.type,
            file
        }
        emit('file-selected', file)
    }
}

const handleDrop = (event: DragEvent) => {
    isDragOver.value = false
    const files = event.dataTransfer?.files

    if (files && files.length > 0) {
        const file = files[0]
        if (validateFile(file)) {
            filePreview.value = {
                name: file.name,
                size: file.size,
                type: file.type,
                file
            }
            emit('file-selected', file)
        }
    }
}

const removeFile = () => {
    filePreview.value = null
    if (fileInput.value) {
        fileInput.value.value = ''
    }
    emit('file-removed')
}

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<template>
    <div class="file-upload">
        <!-- File Preview -->
        <div v-if="filePreview" class="file-preview mb-4">
            <div class="flex items-center p-3 bg-gray-50 rounded-lg border">
                <div class="flex-shrink-0 mr-3">
                    <FileIcon :file="filePreview" />
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">
                        {{ filePreview.name }}
                    </p>
                    <p class="text-sm text-gray-500">
                        {{ formatFileSize(filePreview.size) }}
                    </p>
                </div>
                <button @click="removeFile" type="button"
                    class="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors">
                    <XMarkIcon class="w-5 h-5" />
                </button>
            </div>
        </div>

        <!-- Upload Area -->
        <div v-if="!filePreview" @drop="handleDrop" @dragover.prevent @dragenter.prevent class="upload-area"
            :class="{ 'border-blue-500 bg-blue-50': isDragOver }">
            <div class="text-center">
                <CloudArrowUpIcon class="mx-auto h-12 w-12 text-gray-400" />
                <div class="mt-4">
                    <label for="file-upload"
                        class="cursor-pointer rounded-md bg-white font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2">
                        <span>Fayl yuklash</span>
                        <input id="file-upload" ref="fileInput" type="file" :accept="accept" :multiple="multiple"
                            class="sr-only" @change="handleFileSelect" />
                    </label>
                    <p class="text-xs text-gray-500 mt-1">
                        yoki faylni bu yerga tashlang
                    </p>
                </div>
                <p class="text-xs text-gray-500 mt-2">
                    {{ fileTypesText }} • Maksimal hajm: {{ maxSizeText }}
                </p>
            </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mt-2 text-sm text-red-600">
            {{ error }}
        </div>
    </div>
</template>

<style scoped>
/* don't use @apply because it's not working*/
/* .upload-area {
    @apply border-2 border-dashed border-gray-300 rounded-lg p-6 transition-colors duration-200;
}

.upload-area:hover {
    @apply border-gray-400;
}

.file-upload {
    @apply w-full;
} */
</style>
