<template>
  <div class="markdown-content max-w-full">
    <div v-html="renderedContent"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'

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

md.renderer.rules.heading_open = (tokens:any, idx:any) => {
    const token = tokens[idx]

    const classes = {
      h1: 'text-3xl font-bold mb-8 pb-4 border-b border-[var(--border-color)] text-[var(--heading-color)]',
      h2: 'text-2xl font-semibold mt-8 mb-4 pb-2 border-b border-[var(--border-color)] text-[var(--heading-color)]',
      h3: 'text-xl font-semibold mt-6 mb-3 text-[var(--heading-color)]'
    }

    return `<${token.tag} class="${classes[token.tag] || ''}">`
  }

  md.renderer.rules.paragraph_open = () => {
  return '<p class="text-[var(--text-color)] leading-7 mb-4">'
}

md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  const token = tokens[idx];
  const href = token.attrGet('href');
  return `<a href="${href}" class="text-[var(--link-color)] hover:text-[var(--link-hover-color)] underline" target="_blank" rel="noopener noreferrer">`;
}

md.renderer.rules.bullet_list_open = () => {
  return '<ul class="list-disc mb-4 space-y-2 text-[var(--text-color)] pl-6 marker:text-[var(--marker-color)]">'
}

md.renderer.rules.ordered_list_open = () => {
  return '<ol class="list-decimal mb-4 space-y-2 text-[var(--text-color)] pl-6 marker:text-[var(--marker-color)]">'
}

md.renderer.rules.blockquote_open = () => {
  return '<blockquote class="border-l-4 border-[var(--blockquote-border)] bg-[var(--blockquote-bg)] pl-4 py-2 my-4 italic text-[var(--text-color)]">'
}





const props = defineProps<{
  content: string
}>()

const renderedContent = computed(() => {
  return md.render(props.content)
})
</script>

<style>
.markdown-content {
  width: 100%;
}

.hljs {
  background: var(--code-bg);
  color: var(--code-text);
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  max-width: 100%;
  word-wrap: normal;
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

/* Light theme variables */
:root {
  --code-bg: #f6f8fa;
  --code-text: #24292e;

   /* Add these link color variables */
  --link-color: #0066cc;         /* Bright blue for light mode */
  --link-hover-color: #0052a3;   /* Darker blue for hover in light mode */


}

/* Dark theme variables */
@media (prefers-color-scheme: dark) {
  :root {
    --code-bg: #1e1e1e;
    --code-text: #e1e1e1;

    /* Add these link color variables */
    --link-color: #66b3ff;       /* Lighter blue for dark mode */
    --link-hover-color: #99ccff; /* Even lighter blue for hover in dark mode */
    
  }
}

/* Syntax highlighting colors - Light theme */
.hljs-keyword,
.hljs-function { color: #cf222e; }

.hljs-string { color: #0a3069; }

.hljs-number { color: #0550ae; }

.hljs-comment { color: #6e7781; }

.hljs-variable { color: #953800; }

/* Syntax highlighting colors - Dark theme */
@media (prefers-color-scheme: dark) {
  .hljs-keyword,
  .hljs-function { color: #ff7b72; }

  .hljs-string { color: #a5d6ff; }

  .hljs-number { color: #79c0ff; }

  .hljs-comment { color: #8b949e; }

  .hljs-variable { color: #ffa657; }
}

/* Additional syntax highlighting styles */
.hljs-title { color: #6f42c1; }
.hljs-attr { color: #005cc5; }
.hljs-built_in { color: #e36209; }
.hljs-literal { color: #005cc5; }
.hljs-type { color: #d73a49; }
.hljs-meta { color: #6a737d; }
.hljs-regexp { color: #032f62; }

/* Dark theme additional syntax highlighting */
@media (prefers-color-scheme: dark) {
  .hljs-title { color: #d2a8ff; }
  .hljs-attr { color: #79c0ff; }
  .hljs-built_in { color: #ffa657; }
  .hljs-literal { color: #79c0ff; }
  .hljs-type { color: #ff7b72; }
  .hljs-meta { color: #8b949e; }
  .hljs-regexp { color: #a5d6ff; }
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .hljs {
    font-size: 0.875rem;
    padding: 0.75rem;
  }
  
  pre {
    font-size: 0.875rem;
  }
}
</style>