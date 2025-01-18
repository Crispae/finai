// stores/fileTree.ts
import { defineStore } from 'pinia'
import type { FileItem, FileTreeState } from '~/types/fileTree'

export const useFileTreeStore = defineStore('fileTree', {
  state: (): FileTreeState => ({
    items: [],
    selectedPath: null,
    loading: false
  }),

  actions: {
    async loadWorkspace(path: string) {
      this.loading = true
      try {
        const response = await fetch('http://localhost:8001/api/v1/directory-tree', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path })
        })

        if (!response.ok) throw new Error('Failed to load workspace')
        const data = await response.json()
        this.items = data
      } catch (error) {
        console.error('Error loading workspace:', error)
      } finally {
        this.loading = false
      }
    },

    selectPath(path: string) {
      this.selectedPath = path
    }
  }
})