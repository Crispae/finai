<template>
    <div ref="container" class="flex-1 overflow-y-auto p-4 space-y-6 min-h-0">
      <template v-for="message in messages" :key="message.id">
        <div 
          :class="[
            'flex gap-4 max-w-5xl mx-auto p-4 rounded-lg',
            message.role === 'assistant' ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'
          ]"
        >
          <div 
            class="w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-white"
            :class="message.role === 'assistant' ? 'bg-accent' : 'bg-user'"
          >
            <Bot v-if="message.role === 'assistant'" class="w-5 h-5" />
            <User v-else class="w-5 h-5" />
          </div>
  
          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium mb-1 text-gray-500 dark:text-gray-400">
              {{ message.role === 'assistant' ? 'Assistant' : 'You' }}
            </div>
            
            <MarkdownRenderer 
              v-if="message.role === 'assistant'"
              :content="message.content"
              class="prose dark:prose-invert max-w-none overflow-hidden"
            />
            
            <div 
              v-else 
              class="prose dark:prose-invert text-main-text whitespace-pre-wrap break-words"
            >
              {{ message.content }}
            </div>
  
            <div v-if="message.files?.length" class="mt-2 flex flex-wrap gap-2">
              <div 
                v-for="file in message.files" 
                :key="file.name"
                class="bg-main-hover px-3 py-1 rounded-md text-sm flex items-center gap-2"
              >
                <FileText class="w-4 h-4" />
                <span>{{ file.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>
      
      <div 
        v-if="isLoading" 
        class="flex gap-4 max-w-3xl mx-auto p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
      >
        <div class="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white">
          <Bot class="w-5 h-5 animate-pulse" />
        </div>
        <div class="flex-1">
          <div class=" text-main-text">Assistant is typing...</div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { watch, ref } from 'vue'
  import { Bot, User, FileText } from 'lucide-vue-next'
  import MarkdownRenderer from './utils/MarkdownRenderer.vue'
  
  const props = defineProps<{
    messages: Array<{
      id: number
      role: 'assistant' | 'user'
      content: string
      files?: File[]
    }>
    isLoading: boolean
  }>()
  
  const container = ref<HTMLElement | null>(null)
  
  watch(() => props.messages.length, () => {
    setTimeout(() => {
      if (container.value) {
        container.value.scrollTop = container.value.scrollHeight
      }
    }, 0)
  })
  </script>
  
  <style>
 

  
  
  
 
  </style>