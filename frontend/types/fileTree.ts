// types/fileTree.ts
export interface FileItem {
    name: string
    path: string
    type: 'file' | 'directory'
    children?: FileItem[]
  }
  
  export interface FileTreeState {
    items: FileItem[]
    selectedPath: string | null
    loading: boolean
  }