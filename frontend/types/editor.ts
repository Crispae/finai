// types/editor.ts
export interface Tab {
    id: string
    filename: string
    path: string
    content: string
    language: string
    isDirty: boolean
  }
  
  export interface EditorState {
    tabs: Tab[]
    activeTabId: string | null
    theme: string
  }