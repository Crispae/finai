<template>
    <div class="markdown-content max-w-full">
        <div v-html="renderedContent"></div>
    </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js' // code higlighting
import { createApp, h } from 'vue'
import CodeBlock from './CodeBlock.vue'

const contentRef = ref<HTMLElement | null>(null)

const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,

    highlight: function (str, lang) {
        
      if (lang && hljs.getLanguage(lang)) {
        try {
          return `<pre class="hljs" data-language="${lang}">
                    <code>${hljs.highlight(str, { language: lang }).value}</code>
                  </pre>`} 
        catch (__) 
          {}
      }
      return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
    }
  })












</script>

<style>
</style>