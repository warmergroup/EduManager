<template>
    <div class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-xl font-bold text-gray-900">{{ t('centers.createCenter') }}</h3>
                <button @click="emit('close')" class="text-gray-400 hover:text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12">
                        </path>
                    </svg>
                </button>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Center Name -->
                    <div>
                        <label for="name" class="block text-sm font-semibold text-gray-700 mb-2">
                            {{ t('centers.centerName') }} *
                        </label>
                        <input type="text" id="name" v-model="form.name"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            :placeholder="t('centers.centerName')" required />
                    </div>

                    <!-- Email -->
                    <div>
                        <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
                            {{ t('centers.email') }} *
                        </label>
                        <input type="email" id="email" v-model="form.email"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            :placeholder="t('centers.email')" required />
                    </div>

                    <!-- Phone -->
                    <div>
                        <label for="phone" class="block text-sm font-semibold text-gray-700 mb-2">
                            {{ t('centers.phone') }} *
                        </label>
                        <input type="tel" id="phone" v-model="form.phone"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            :placeholder="t('centers.phone')" required />
                    </div>

                    <!-- Website -->
                    <div>
                        <label for="website" class="block text-sm font-semibold text-gray-700 mb-2">
                            {{ t('centers.website') }}
                        </label>
                        <input type="url" id="website" v-model="form.website"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            :placeholder="t('centers.website')" />
                    </div>
                </div>

                <!-- Address -->
                <div>
                    <label for="address" class="block text-sm font-semibold text-gray-700 mb-2">
                        {{ t('centers.address') }} *
                    </label>
                    <textarea id="address" v-model="form.address" rows="3"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        :placeholder="t('centers.address')" required></textarea>
                </div>

                <!-- Description -->
                <div>
                    <label for="description" class="block text-sm font-semibold text-gray-700 mb-2">
                        {{ t('centers.description') }}
                    </label>
                    <textarea id="description" v-model="form.description" rows="3"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        :placeholder="t('centers.description')"></textarea>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Admin Email -->
                    <div>
                        <label for="adminEmail" class="block text-sm font-semibold text-gray-700 mb-2">
                            {{ t('centers.adminEmail') }} *
                        </label>
                        <input type="email" id="adminEmail" v-model="form.adminEmail"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            :placeholder="t('centers.adminEmail')" required />
                        <p class="text-xs text-gray-500 mt-1">
                            {{ t('centers.adminEmailHelp') }}
                        </p>
                    </div>

                    <!-- Subscription Plan -->
                    <div>
                        <label for="subscriptionPlan" class="block text-sm font-semibold text-gray-700 mb-2">
                            {{ t('centers.subscriptionPlan') }} *
                        </label>
                        <select id="subscriptionPlan" v-model="form.subscriptionPlanId"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required>
                            <option value="">{{ t('common.select') }}</option>
                            <option v-for="plan in subscriptionPlans" :key="plan._id" :value="plan._id">
                                {{ plan.name }} - {{ plan.price === 0 ? t('subscriptionPlans.free') : `${plan.price}
                                ${plan.currency} ${t('subscriptionPlans.perMonth')}` }}
                            </option>
                        </select>
                    </div>
                </div>

                <!-- Buttons -->
                <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button type="button" @click="emit('close')"
                        class="px-6 py-2 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                        {{ t('common.cancel') }}
                    </button>
                    <button type="submit" :disabled="loading"
                        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
                        <span v-if="!loading">{{ t('common.create') }}</span>
                        <span v-else>{{ t('common.creating') }}...</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCentersStore } from '@/stores/centers'
import api from '@/services/api'

const { t } = useI18n()

const emit = defineEmits<{
    close: []
    created: []
}>()

const centersStore = useCentersStore()

const form = ref({
    name: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    description: '',
    adminEmail: '',
    subscriptionPlanId: ''
})

const subscriptionPlans = ref<any[]>([])
const loading = ref(false)

const fetchSubscriptionPlans = async () => {
    try {
        const response = await api.get('/api/subscription-plans')
        if (response.data.success) {
            subscriptionPlans.value = response.data.data.plans
        }
    } catch (error) {
        console.error('Error fetching subscription plans:', error)
    }
}

const handleSubmit = async () => {
    try {
        loading.value = true
        await centersStore.createCenter(form.value)
        emit('created')
    } catch (error) {
        console.error('Error creating center:', error)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchSubscriptionPlans()
})
</script>