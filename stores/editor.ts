// stores/editor.ts
import { defineStore } from 'pinia'
import type { Tab, EditorState } from '~/types/editor'

export const useEditorStore = defineStore('editor', {
  state: (): EditorState => ({
    tabs: [],
    activeTabId: null,
    theme: 'vs-dark'
  }),

  getters: {
    activeTab: (state) => state.tabs.find(tab => tab.id === state.activeTabId),
    getTabByPath: (state) => (path: string) => 
      state.tabs.find(tab => tab.path === path)
  },

  actions: {
    async openFile(path: string, filename: string) {
      // Check if file is already open
      const existingTab = this.getTabByPath(path)
      if (existingTab) {
        this.activeTabId = existingTab.id
        return
      }

      try {
        // Fetch file content from backend
        const response = await fetch('http://localhost:8001/api/v1/read-file', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path })
        })

        if (!response.ok) throw new Error('Failed to read file')
        const { content, language } = await response.json()

        // Create new tab
        const newTab: Tab = {
          id: Date.now().toString(),
          filename,
          path,
          content,
          language: language || 'plaintext',
          isDirty: false
        }

        this.tabs.push(newTab)
        this.activeTabId = newTab.id
      } catch (error) {
        console.error('Error opening file:', error)
        // Handle error (show notification, etc.)
      }
    },

    closeTab(tabId: string) {
      const index = this.tabs.findIndex(tab => tab.id === tabId)
      if (this.tabs.length > 1) {
        this.tabs = this.tabs.filter(tab => tab.id !== tabId)
        if (this.activeTabId === tabId) {
          this.activeTabId = this.tabs[Math.max(0, index - 1)].id
        }
      }
    },

    updateTabContent(tabId: string, content: string) {
      const tab = this.tabs.find(t => t.id === tabId)
      if (tab) {
        tab.content = content
        tab.isDirty = true
      }
    },

    setTheme(theme: string) {
      this.theme = theme
    }
  }
})