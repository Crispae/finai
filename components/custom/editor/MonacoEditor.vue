<!-- components/custom/editor/MonacoEditor.vue -->
<template>
  <div ref="editorContainer" class="monaco-editor-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import loader from '@monaco-editor/loader'
import type * as Monaco from 'monaco-editor'

// Register languages and themes
const configureMonaco = async (monaco: typeof Monaco) => {
  // Configure language features
  const languages = ['javascript', 'typescript', 'html', 'css', 'json', 'python', 'markdown']
  
  languages.forEach(lang => {
    monaco.languages.register({ id: lang })
  })

  // Configure themes
  monaco.editor.defineTheme('vs-dark-custom', {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#1E1E1E',
    }
  })
}

const props = withDefaults(defineProps<{
  modelValue?: string
  language?: string
  theme?: string
  options?: Monaco.editor.IStandaloneEditorConstructionOptions
}>(), {
  modelValue: '',
  language: 'typescript',
  theme: 'vs-dark',
  options: () => ({})
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'editorDidMount': [editor: Monaco.editor.IStandaloneCodeEditor]
}>()

const editorContainer = ref<HTMLElement | null>(null)
let editor: Monaco.editor.IStandaloneCodeEditor | null = null
let monaco: typeof Monaco | null = null

const initMonaco = async () => {
  if (!editorContainer.value) return

  try {
    monaco = await loader.init()
    await configureMonaco(monaco)
    
    const defaultOptions: Monaco.editor.IStandaloneEditorConstructionOptions = {
      value: props.modelValue,
      language: props.language,
      theme: props.theme,
      automaticLayout: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      roundedSelection: false,
      padding: { top: 8, bottom: 8 },
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, Consolas, monospace',
      lineNumbers: 'on',
      scrollbar: {
        vertical: 'visible',
        horizontal: 'visible',
        useShadows: false,
        verticalScrollbarSize: 10,
        horizontalScrollbarSize: 10
      },
      suggest: {
        showWords: true,
        snippets: 'inline',
        showClasses: true,
        showFunctions: true,
        showVariables: true
      }
    }

    editor = monaco.editor.create(editorContainer.value, {
      ...defaultOptions,
      ...props.options
    })

    editor.onDidChangeModelContent(() => {
      emit('update:modelValue', editor?.getValue() || '')
    })

    const resizeObserver = new ResizeObserver(() => {
      setTimeout(() => editor?.layout(), 0)
    })
    
    resizeObserver.observe(editorContainer.value)
    emit('editorDidMount', editor)

  } catch (error) {
    console.error('Failed to initialize Monaco Editor:', error)
  }
}

// Watchers
watch(() => props.modelValue, (newValue) => {
  if (editor && newValue !== editor.getValue()) {
    editor.setValue(newValue)
  }
})

watch(() => props.language, (newValue) => {
  if (editor && monaco) {
    const model = editor.getModel()
    if (model) {
      monaco.editor.setModelLanguage(model, newValue)
    }
  }
})

watch(() => props.theme, (newValue) => {
  if (monaco) {
    monaco.editor.setTheme(newValue)
  }
})

// Lifecycle hooks
onMounted(async () => {
  await initMonaco()
})

onBeforeUnmount(() => {
  editor?.dispose()
})

defineExpose({
  getEditor: () => editor,
  getMonaco: () => monaco
})
</script>

<style>
.monaco-editor-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.monaco-editor {
  padding: 8px 0;
}
</style>