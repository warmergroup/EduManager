<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { ChatBubbleLeftRightIcon } from '@heroicons/vue/24/outline'
import { format } from 'date-fns'
import { askAI } from '@/services/ai'
import Loading from '@/components/ui/Loading.vue'
import Alert from '@/components/ui/Alert.vue'

interface AIMessage {
  id: string
  message: string
  response: string
  timestamp: string
  isUser: boolean
}

const messages = ref<AIMessage[]>([])
const newMessage = ref('')
const loading = ref(false)
const error = ref<string | undefined>(undefined)
const messagesContainer = ref<HTMLElement | null>(null)

const formatTime = (timestamp: string) => {
  return format(new Date(timestamp), 'HH:mm')
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const sendMessage = async () => {
  if (!newMessage.value.trim()) return

  const userMessage: AIMessage = {
    id: Date.now().toString(),
    message: newMessage.value,
    response: '',
    timestamp: new Date().toISOString(),
    isUser: true
  }

  messages.value.push(userMessage)
  const messageText = newMessage.value
  newMessage.value = ''
  loading.value = true
  error.value = undefined

  scrollToBottom()

  try {
    const response = await askAI(messageText)
    if (!response || !response.answer) {
      throw new Error('Invalid response from AI')
    }

    const aiMessage: AIMessage = {
      id: (Date.now() + 1).toString(),
      message: messageText,
      response: response.answer,
      timestamp: response.timestamp,
      isUser: false
    }

    messages.value.push(aiMessage)
    scrollToBottom()
  } catch (err: any) {
    error.value = err.message || 'Failed to get AI response'
  } finally {
    loading.value = false
  }
}

const clearChat = () => {
  messages.value = []
}
</script>

<template>
  <div class="card h-96 flex flex-col">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">AI Assistant</h3>
      <button @click="clearChat" class="btn-secondary text-sm">
        Clear Chat
      </button>
    </div>

    <div ref="messagesContainer" class="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-gray-50 rounded-lg">
      <div v-if="messages.length === 0" class="text-center text-gray-500 py-8">
        <ChatBubbleLeftRightIcon class="mx-auto h-8 w-8 mb-2" />
        <p>Ask me anything about your studies!</p>
      </div>

      <div v-for="message in messages" :key="message.id" class="flex"
        :class="message.isUser ? 'justify-end' : 'justify-start'">
        <div class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg text-sm" :class="message.isUser
          ? 'bg-primary-500 text-white'
          : 'bg-white text-gray-900 border border-gray-200'">
          <p>{{ message.isUser ? message.message : message.response }}</p>
          <p class="text-xs opacity-70 mt-1">{{ formatTime(message.timestamp) }}</p>
        </div>
      </div>

      <div v-if="loading" class="flex justify-start">
        <div class="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm">
          <Loading text="AI is thinking..." />
        </div>
      </div>
    </div>

    <form @submit.prevent="sendMessage" class="flex space-x-2">
      <input v-model="newMessage" type="text" placeholder="Type your message..." required :disabled="loading"
        class="flex-1 input-field" />
      <button type="submit" :disabled="loading || !newMessage.trim()" class="btn-primary">
        Send
      </button>
    </form>

    <Alert :show="!!error" type="error" title="Error" :message="error" @close="error = undefined" />
  </div>
</template>