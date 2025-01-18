<template>
    <div class="code-block-wrapper relative group">
      <div class="absolute top-0 right-0 left-0 h-12 bg-slate-700/50 rounded-t-lg border-b border-slate-600/50">
        <div class="flex items-center justify-between px-4 h-full">
          <span class="text-sm text-slate-400">{{ language }}</span>
          <button
            @click="copyCode"
            class="code-copy-btn flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all duration-200"
            :class="copied ? 'bg-green-500/20 text-green-400' : 'bg-slate-600/50 hover:bg-slate-500/50 text-slate-300'"
          >
            <Check v-if="copied" class="w-3 h-3" />
            <Copy v-else class="w-3 h-3" />
            {{ copied ? 'Copied!' : 'Copy' }}
          </button>
        </div>
      </div>
      <pre class="hljs !mt-0 !bg-transparent" :data-language="language">
        <code class="!p-0 !bg-transparent" v-html="code"></code>
      </pre>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { Copy, Check } from 'lucide-vue-next'
  
  const props = defineProps<{
    language?: string
    code: string
  }>()
  
  const copied = ref(false)
  
  const copyCode = async () => {
    const codeElement = document.querySelector('.code-block-wrapper pre code')
    if (codeElement) {
      try {
        // Remove extra whitespace and get text content
        const textToCopy = codeElement.textContent?.trim() || ''
        await navigator.clipboard.writeText(textToCopy)
        copied.value = true
        setTimeout(() => {
          copied.value = false
        }, 2000)
      } catch (err) {
        console.error('Failed to copy code:', err)
      }
    }
  }
  </script>
  
  <style scoped>
  .code-block-wrapper {
    @apply rounded-lg overflow-hidden;
    background: rgb(30, 41, 59) !important;
  }
  
  .code-block-wrapper pre {
    margin: 0 !important;
    padding: 1rem !important;
    padding-top: 3rem !important;
  }
  
  .code-copy-btn {
    backdrop-filter: blur(4px);
  }
  </style>