<template>
    <div class="flex gap-4 max-w-3xl mx-auto p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      <!-- Avatar Container -->
      <div 
        class="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white"
        :class="[
          message.role === 'assistant' 
            ? 'bg-blue-500 dark:bg-blue-600' 
            : 'bg-gray-500 dark:bg-gray-600'
        ]"
      >
        <Bot v-if="message.role === 'assistant'" class="w-5 h-5" />
        <User v-else class="w-5 h-5" />
      </div>
  
      <!-- Message Content Container -->
      <div class="flex-1 min-w-0">
        <!-- Role Label -->
        <div class="text-sm font-medium mb-1 text-gray-500 dark:text-gray-400">
          {{ message.role === 'assistant' ? 'Assistant' : 'You' }}
        </div>
        
        <!-- Message Content -->
        <div 
          class="prose prose-sm dark:prose-invert max-w-none text-gray-800 dark:text-gray-200"
        >
          {{ message.content }}
        </div>
  
        <!-- Attached Files -->
        <div v-if="message.files?.length" class="mt-2 flex flex-wrap gap-2">
          <div 
            v-for="file in message.files" 
            :key="file.name"
            class="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-md text-sm flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
          >
            <FileText class="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span class="truncate">{{ file.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { Bot, User, FileText } from 'lucide-vue-next'
  
  defineProps<{
    message: {
      role: 'assistant' | 'user'
      content: string
      files?: File[]
    }
  }>()
  </script>
  
  <style scoped>
  /* Add any additional custom styles here */
  .prose {
    line-height: 1.6;
  }
  
  .prose p:first-child {
    margin-top: 0;
  }
  
  .prose p:last-child {
    margin-bottom: 0;
  }
  </style>