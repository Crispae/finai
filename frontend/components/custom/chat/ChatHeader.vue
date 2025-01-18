<template>
    <div class="border-b border-main-border p-4 shrink-0 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <button 
          @click="$emit('toggle-sidebar')"
          class="p-2 rounded-md hover:bg-main-hover"
        >
          <ChevronRight v-if="!sidebarOpen" class="w-5 h-5" />
          <ChevronLeft v-else class="w-5 h-5" />
        </button>
        <ModelSelector
          :modelId="currentModelId"
          @update:modelId="$emit('update:currentModelId', $event)"
          @change="$emit('change-model', $event)"
        />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ChevronRight, ChevronLeft } from 'lucide-vue-next'
  import ModelSelector from './ModelSelector.vue'
  
  defineProps<{
    sidebarOpen: boolean
    currentModelId: string
  }>()
  
  defineEmits(['toggle-sidebar', 'change-model', 'update:currentModelId'])
  </script>