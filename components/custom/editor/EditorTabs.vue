<!-- components/custom/editor/EditorTabs.vue -->
<template>
  <div class="editor-tabs-container h-full flex flex-col">
    <!-- Tabs Header - Made sticky -->
    <div class="tabs-header-wrapper sticky top-0 z-10">
      <div class="tabs-header flex items-center border-b bg-background p-1">
        <div class="flex-1 flex items-center space-x-1 custom-scrollbar">
          <div
            v-for="tab in tabs"
            :key="tab.id"
            class="group relative flex-shrink-0"
          >
            <Button
              variant="ghost"
              :class="[
                'h-8 px-2 py-1 flex items-center space-x-2 rounded-none',
                activeTab?.id === tab.id ? 'bg-slate-800' : ''
              ]"
              @click="switchTab(tab)"
            >
              <span class="text-sm">{{ tab.filename }}</span>
              <div 
                :class="[
                  'ml-2 transition-opacity duration-200',
                  activeTab?.id === tab.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                ]"
                @click.stop="closeTab(tab.id)"
              >
                <X 
                  class="h-3 w-3 hover:text-red-400 cursor-pointer" 
                  :class="{'opacity-100': activeTab?.id === tab.id}"
                />
              </div>
            </Button>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon"
          class="ml-2 flex-shrink-0"
          @click="createNewTab"
        >
          <Plus class="h-4 w-4" />
        </Button>
      </div>
    </div>

    <!-- Editor Container - Made scrollable -->
    <div class="editor-content flex-1 overflow-auto">
      <div class="h-full w-full">
        <MonacoEditor
          v-if="activeTab"
          v-model="activeTab.content"
          :language="activeTab.language"
          :theme="editorTheme"
          @update:modelValue="updateTabContent"
        />
      </div>
    </div>
  </div>
</template>

  
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import { X, Plus } from 'lucide-vue-next'
  import { Button } from '~/components/ui/button'
  import MonacoEditor from './MonacoEditor.vue'
  
  interface Tab {
    id: string
    filename: string
    content: string
    language: string
  }
  
  const tabs = ref<Tab[]>([
    {
      id: '1',
      filename: 'main.ts',
      content: '// Write your code here',
      language: 'typescript'
    }
  ])
  
  const activeTabId = ref<string>(tabs.value[0].id)
  const editorTheme = ref('vs-dark')
  
  const activeTab = computed(() => {
    return tabs.value.find(tab => tab.id === activeTabId.value)
  })
  
  const switchTab = (tab: Tab) => {
    activeTabId.value = tab.id
  }
  
  const closeTab = (tabId: string) => {
    const index = tabs.value.findIndex(tab => tab.id === tabId)
    if (tabs.value.length > 1) {
      tabs.value = tabs.value.filter(tab => tab.id !== tabId)
      if (activeTabId.value === tabId) {
        activeTabId.value = tabs.value[Math.max(0, index - 1)].id
      }
    }
  }
  
  const createNewTab = () => {
    const newTab: Tab = {
      id: Date.now().toString(),
      filename: `untitled-${tabs.value.length + 1}.ts`,
      content: '',
      language: 'typescript'
    }
    tabs.value.push(newTab)
    activeTabId.value = newTab.id
  }
  
  const updateTabContent = (content: string) => {
    if (activeTab.value) {
      activeTab.value.content = content
    }
  }
  </script>
  
  <style scoped>
.editor-tabs-container {
  background-color: var(--background);
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.tabs-header-wrapper {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: var(--background);
  width: 100%;
}

.tabs-header {
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
}

.editor-content {
  position: relative;
  flex: 1;
  min-height: 0; /* Important for proper flexbox behavior */
}

/* Rest of your existing styles */
.tabs-header::-webkit-scrollbar {
  height: 4px;
}

.tabs-header::-webkit-scrollbar-track {
  background: transparent;
}

.tabs-header::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.tabs-header::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.tabs-header {
  &:not(:hover)::-webkit-scrollbar-thumb {
    background-color: transparent;
  }
}

.tabs-header > div {
  white-space: nowrap;
}

.group .opacity-0 {
  transition: opacity 0.2s ease-in-out;
}

.group:hover .opacity-0,
.active .opacity-0 {
  opacity: 1;
}

.tabs-header {
  scroll-behavior: smooth;
}

.tabs-header .text-sm {
  white-space: nowrap;
}
</style>