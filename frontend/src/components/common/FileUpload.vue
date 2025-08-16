<template>
    <div class="w-full">
        <div @drop.prevent="handleDrop" @dragover.prevent="dragover = true" @dragleave.prevent="dragover = false"
            :class="[
                'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
                dragover ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            ]">
            <div class="space-y-4">
                <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>

                <div class="text-gray-600">
                    <label :for="inputId" class="cursor-pointer">
                        <span class="font-medium text-blue-600 hover:text-blue-500">Faylni yuklang</span>
                        <span class="text-gray-500"> yoki tortib tashlang</span>
                    </label>
                    <input :id="inputId" ref="fileInput" type="file" :accept="accept" :multiple="multiple"
                        @change="handleFileSelect" class="hidden" />
                </div>

                <p class="text-xs text-gray-500">
                    {{ acceptDescription || `Ruxsat etilgan formatlar: ${accept}` }}
                </p>

                <p v-if="maxSize" class="text-xs text-gray-500">
                    Maksimal hajm: {{ formatFileSize(maxSize) }}
                </p>
            </div>
        </div>

        <!-- Selected Files -->
        <div v-if="selectedFiles.length > 0" class="mt-4 space-y-2">
            <div v-for="(file, index) in selectedFiles" :key="index"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center space-x-3">
                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                        </path>
                    </svg>
                    <div>
                        <p class="text-sm font-medium text-gray-900">{{ file.name }}</p>
                        <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
                    </div>
                </div>

                <button @click="removeFile(index)" class="text-red-400 hover:text-red-600" type="button">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12">
                        </path>
                    </svg>
                </button>
            </div>
        </div>

        <!-- Error Message -->
        <p v-if="error" class="mt-2 text-sm text-red-600">{{ error }}</p>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Props {
    modelValue?: File[]
    accept?: string
    multiple?: boolean
    maxSize?: number
    acceptDescription?: string
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: () => [],
    accept: '*/*',
    multiple: false,
    maxSize: undefined,
    acceptDescription: ''
})

const emit = defineEmits<{
    'update:modelValue': [files: File[]]
    'files-selected': [files: File[]]
}>()

const dragover = ref(false)
const selectedFiles = ref<File[]>(props.modelValue || [])
const error = ref('')
const fileInput = ref<HTMLInputElement>()

const inputId = computed(() => `file-upload-${Math.random().toString(36).substr(2, 9)}`)

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const validateFile = (file: File): boolean => {
    error.value = ''

    if (props.maxSize && file.size > props.maxSize) {
        error.value = `Fayl hajmi ${formatFileSize(props.maxSize)} dan katta bo'lishi mumkin emas`
        return false
    }

    return true
}

const addFiles = (files: FileList | File[]) => {
    const newFiles = Array.from(files).filter(validateFile)

    if (props.multiple) {
        selectedFiles.value = [...selectedFiles.value, ...newFiles]
    } else {
        selectedFiles.value = newFiles.slice(0, 1)
    }

    emit('update:modelValue', selectedFiles.value)
    emit('files-selected', selectedFiles.value)
}

const handleFileSelect = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files) {
        addFiles(target.files)
    }
}

const handleDrop = (event: DragEvent) => {
    dragover.value = false
    if (event.dataTransfer?.files) {
        addFiles(event.dataTransfer.files)
    }
}

const removeFile = (index: number) => {
    selectedFiles.value.splice(index, 1)
    emit('update:modelValue', selectedFiles.value)
}

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
    selectedFiles.value = newValue || []
}, { deep: true })
</script>
