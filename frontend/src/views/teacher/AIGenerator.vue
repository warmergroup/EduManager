<script setup lang="ts">
import AITaskGenerator from '../../components/teacher/AITaskGenerator.vue'
import PageHeader from '@/components/common/PageHeader.vue'
</script>

<template>
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <PageHeader :title="$t('aiChat.title')" :description="$t('aiChat.teacher.description')" />
    <AITaskGenerator />
  </div>
</template>