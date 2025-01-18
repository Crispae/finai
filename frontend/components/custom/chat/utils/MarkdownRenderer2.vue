<template>
    <div class="markdown-content max-w-none p-6 bg-slate-50 dark:bg-slate-900 rounded-lg shadow-xl">
      <div 
        ref="contentRef" 
        class="prose prose-invert max-w-none prose-pre:p-0 prose-pre:m-0 prose-pre:bg-transparent"
        v-html="renderedContent"
      ></div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import MarkdownIt from 'markdown-it'
  import hljs from 'highlight.js'
  import { createApp, h } from 'vue'
  
  const contentRef = ref<HTMLElement | null>(null)
  
  // Configure markdown-it with custom rendering rules
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return `<pre class="hljs" data-language="${lang}"><code>${
            hljs.highlight(str, { language: lang }).value
          }</code></pre>`
        } catch (__) {}
      }
      return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
    }
  })
  
  // Custom renderer rules
  md.renderer.rules.heading_open = (tokens, idx) => {
    const token = tokens[idx]
    const classes = {
      h1: 'text-4xl font-bold mb-8 pb-4 border-b border-slate-700 text-white',
      h2: 'text-3xl font-semibold mt-8 mb-4 pb-2 border-b border-slate-700 text-slate-200',
      h3: 'text-2xl font-semibold mt-6 mb-3 text-slate-200'
    }
    return `<${token.tag} class="${classes[token.tag] || ''}">`
  }
  
  md.renderer.rules.paragraph_open = () => {
    return '<p class="text-slate-300 leading-7 mb-4">'
  }
  
  md.renderer.rules.link_open = () => {
    return '<a class="text-blue-400 hover:text-blue-300 underline">'
  }
  
  md.renderer.rules.bullet_list_open = () => {
    return '<ul class="list-disc mb-4 space-y-2 text-slate-300 pl-6 marker:text-slate-500">'
  }
  
  md.renderer.rules.ordered_list_open = () => {
    return '<ol class="list-decimal mb-4 space-y-2 text-slate-300 pl-6 marker:text-slate-500">'
  }
  
  md.renderer.rules.blockquote_open = () => {
    return '<blockquote class="border-l-4 border-slate-600 bg-slate-800/50 pl-4 py-2 my-4 italic text-slate-300">'
  }
  
  const props = defineProps<{
    content: string
  }>()
  
  const renderedContent = computed(() => {
    return md.render(props.content)
  })
  
  // Code block component with copy functionality
  const CodeBlock = {
    props: ['language'],
    setup(props, { slots }) {
      const isCopied = ref(false)
  
      const handleCopy = async () => {
        const code = slots.default?.()?.[0]?.el?.textContent
        if (code) {
          await navigator.clipboard.writeText(code.trim())
          isCopied.value = true
          setTimeout(() => {
            isCopied.value = false
          }, 2000)
        }
      }
  
      return () => h('div', { class: 'relative group my-6' }, [
        h('div', { 
          class: 'absolute top-0 right-0 left-0 h-12 bg-gray-500/20 rounded-t-lg border-b border-gray-400/20'
        }, [
          h('div', { class: 'flex items-center justify-between px-4 h-full' }, [
            h('span', { class: 'text-sm text-slate-400' }, props.language),
            h('button', {
              onClick: handleCopy,
              class: `${isCopied.value ? 'text-green-400' : 'text-slate-400 hover:text-slate-300'} transition-colors`,
              title: isCopied.value ? 'Copied!' : 'Copy code'
            }, [
              isCopied.value ? '✓' : '📋'
            ])
          ])
        ]),
        slots.default?.()
      ])
    }
  }
  
  // Mount code blocks
  onMounted(() => {
    if (contentRef.value) {
      const preElements = contentRef.value.querySelectorAll('pre')
      preElements.forEach((pre) => {
        const language = pre.querySelector('code')?.className.replace('language-', '') || 
                        pre.getAttribute('data-language') || ''
        
        const wrapper = document.createElement('div')
        wrapper.className = 'code-block-container'
        
        pre.parentNode?.insertBefore(wrapper, pre)
        wrapper.appendChild(pre)
  
        const app = createApp({
          render: () => h(CodeBlock, { language }, () => [pre.cloneNode(true)])
        })
        
        const mountEl = document.createElement('div')
        wrapper.parentNode?.insertBefore(mountEl, wrapper)
        wrapper.remove()
        app.mount(mountEl)
      })
    }
  })
  </script>
  
  
  <style>
.markdown-content {
  width: 100%;
}

.hljs {
  @apply bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-200 transition-colors duration-200;
  padding: 2.5rem 1rem 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  max-width: 100%;
  word-wrap: normal;
  position: relative;
}

pre {
  margin: 0;
  white-space: pre;
  word-wrap: normal;
  overflow-x: auto;
  max-width: 100%;
}

code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

/* Inline code styling */
:not(pre) > code {
  @apply px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-slate-200 font-mono text-sm transition-colors duration-200;
}

.code-block-container {
  @apply relative my-6;
}

/* Animation for copy button */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.code-copy-btn {
  animation: fadeIn 0.2s ease-out;
}

/* Syntax highlighting colors - Light theme */
:root {
  --syntax-keyword: theme('colors.pink.600');
  --syntax-string: theme('colors.green.600');
  --syntax-number: theme('colors.blue.600');
  --syntax-comment: theme('colors.gray.500');
  --syntax-variable: theme('colors.orange.600');
  --syntax-title: theme('colors.purple.600');
  --syntax-attr: theme('colors.blue.600');
  --syntax-built-in: theme('colors.yellow.600');
  --syntax-literal: theme('colors.blue.600');
  --syntax-type: theme('colors.red.600');
  --syntax-meta: theme('colors.gray.600');
  --syntax-regexp: theme('colors.green.600');
}

/* Syntax highlighting colors - Dark theme */
.dark {
  --syntax-keyword: theme('colors.pink.400');
  --syntax-string: theme('colors.green.300');
  --syntax-number: theme('colors.blue.300');
  --syntax-comment: theme('colors.gray.500');
  --syntax-variable: theme('colors.orange.300');
  --syntax-title: theme('colors.purple.300');
  --syntax-attr: theme('colors.blue.300');
  --syntax-built-in: theme('colors.yellow.300');
  --syntax-literal: theme('colors.blue.300');
  --syntax-type: theme('colors.red.300');
  --syntax-meta: theme('colors.gray.400');
  --syntax-regexp: theme('colors.green.300');
}

/* Syntax highlighting applying CSS variables */
.hljs-keyword,
.hljs-function { color: var(--syntax-keyword); }

.hljs-string { color: var(--syntax-string); }

.hljs-number { color: var(--syntax-number); }

.hljs-comment { color: var(--syntax-comment); }

.hljs-variable { color: var(--syntax-variable); }

.hljs-title { color: var(--syntax-title); }
.hljs-attr { color: var(--syntax-attr); }
.hljs-built_in { color: var(--syntax-built-in); }
.hljs-literal { color: var(--syntax-literal); }
.hljs-type { color: var(--syntax-type); }
.hljs-meta { color: var(--syntax-meta); }
.hljs-regexp { color: var(--syntax-regexp); }

/* Responsive adjustments */
@media (max-width: 640px) {
  .hljs {
    @apply text-sm p-3 pt-12;
  }
  
  pre {
    @apply text-sm;
  }
}

/* Smooth transitions for theme switching */
.markdown-content *:not(pre):not(code) {
  @apply transition-colors duration-200;
}
</style>