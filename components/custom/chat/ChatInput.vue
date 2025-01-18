<template>
    <div class="border-t border-main-border p-4 bg-main dark:bg-gray-900 shrink-0">
      <div class="max-w-3xl mx-auto">
        <FileDropZone
          v-model="files"
          :show="showFileZone"
          @update:show="showFileZone = $event"
        />
        
        <div class="flex items-end gap-2">
          <div class="flex-grow relative">
            <textarea
              v-model="localValue"
              rows="1"
              :disabled="isLoading"
              class="w-full resize-none rounded-lg border transition-colors duration-200
                     bg-white dark:bg-gray-800
                     text-gray-900 dark:text-gray-100
                     border-gray-200 dark:border-gray-700
                     focus:border-accent dark:focus:border-accent-light focus:ring-0
                     placeholder-gray-400 dark:placeholder-gray-500
                     p-3 pr-12
                     disabled:opacity-50
                     disabled:bg-gray-50 dark:disabled:bg-gray-900"
              placeholder="Message AutobytesAI..."
              @keydown.enter.prevent="sendMessage"
              @input="autoResize"
              ref="textareaRef"
            ></textarea>
            <button 
              @click="toggleFileZone"
              class="absolute right-3 bottom-3 
                     text-gray-400 hover:text-gray-600
                     dark:text-gray-500 dark:hover:text-gray-300
                     transition-colors duration-200"
            >
              <Paperclip class="w-5 h-5" />
            </button>
          </div>
          <button 
            @click="sendMessage"
            :disabled="(!localValue.trim() && files.length === 0) || isLoading"
            class="p-3 rounded-lg transition-all duration-200
                   bg-accent hover:bg-accent-hover
                   dark:bg-accent-light dark:hover:bg-accent-light-hover
                   text-white
                   disabled:opacity-50 disabled:cursor-not-allowed
                   focus:outline-none focus:ring-2 focus:ring-accent/50 dark:focus:ring-accent-light/50"
          >
            <SendHorizontal class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch, onMounted } from 'vue'
  import { Paperclip, SendHorizontal } from 'lucide-vue-next'
  import FileDropZone from './FileDropZone.vue'
  
  const props = defineProps<{
    modelValue: string
    isLoading: boolean
  }>()
  
  const emit = defineEmits(['update:modelValue', 'send'])
  
  const localValue = ref(props.modelValue)
  const textareaRef = ref<HTMLTextAreaElement | null>(null)
  const showFileZone = ref(false)
  const files = ref<File[]>([])
  
  watch(() => props.modelValue, (newValue) => {
    localValue.value = newValue
    // Ensure autoResize is called when value changes externally
    nextTick(() => {
      autoResize()
    })
  })
  
  const autoResize = () => {
    const textarea = textareaRef.value
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
      // Limit maximum height
      const maxHeight = 200 // pixels
      if (textarea.scrollHeight > maxHeight) {
        textarea.style.height = `${maxHeight}px`
        textarea.style.overflowY = 'auto'
      } else {
        textarea.style.overflowY = 'hidden'
      }
    }
    emit('update:modelValue', localValue.value)
  }
  
  const toggleFileZone = () => {
    showFileZone.value = !showFileZone.value
  }
  
  const sendMessage = () => {
    if ((!localValue.value.trim() && files.value.length === 0) || props.isLoading) {
      return
    }
    emit('send')
  }
  
  // Handle Cmd/Ctrl + Enter to send
  const handleKeydown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      sendMessage()
    }
  }
  
  onMounted(() => {
    if (textareaRef.value) {
      textareaRef.value.addEventListener('keydown', handleKeydown)
      autoResize() // Initial resize
    }
  })
  
  onUnmounted(() => {
    if (textareaRef.value) {
      textareaRef.value.removeEventListener('keydown', handleKeydown)
    }
  })
  </script>
  
  <style scoped>
  /* Custom scrollbar styles */
  textarea::-webkit-scrollbar {
    width: 4px;
  }
  
  textarea::-webkit-scrollbar-track {
    background: transparent;
  }
  
  textarea::-webkit-scrollbar-thumb {
    background-color: rgba(156, 163, 175, 0.5);
    border-radius: 2px;
  }
  
  textarea::-webkit-scrollbar-thumb:hover {
    background-color: rgba(156, 163, 175, 0.7);
  }
  
  /* Dark mode scrollbar */
  .dark textarea::-webkit-scrollbar-thumb {
    background-color: rgba(156, 163, 175, 0.3);
  }
  
  .dark textarea::-webkit-scrollbar-thumb:hover {
    background-color: rgba(156, 163, 175, 0.5);
  }
  
  /* Focus styles */
  textarea:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(var(--accent-color), 0.2);
  }
  
  /* Placeholder color transition */
  textarea::placeholder {
    transition: color 0.2s ease;
  }
  
  /* Disabled state improvements */
  textarea:disabled {
    cursor: not-allowed;
  }
  
  /* Animation for height changes */
  textarea {
    transition: height 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
  }
  
  /* Custom styles for Firefox */
  @-moz-document url-prefix() {
    textarea {
      scrollbar-width: thin;
      scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
    }
    
    .dark textarea {
      scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
    }
  }
  </style>
  
  <script lang="ts">
  // Define your theme variables in your CSS or Tailwind config
  export default {
    theme: {
      extend: {
        colors: {
          accent: {
            DEFAULT: 'var(--accent-color, #2563eb)',
            hover: 'var(--accent-hover-color, #1d4ed8)',
            light: 'var(--accent-light-color, #3b82f6)',
            'light-hover': 'var(--accent-light-hover-color, #2563eb)',
          },
        },
      },
    },
  }
  </script>