import { ref } from 'vue'

export function useFiles() {
  
    const files = ref<File[]>([])
  const isDragging = ref(false)

  
  const handleFileDrop = (event: DragEvent) => {
    isDragging.value = false
    if (event.dataTransfer) {
      const newFiles = Array.from(event.dataTransfer.files)
      files.value = [...files.value, ...newFiles]
    }
  }

  
  const removeFile = (fileToRemove: File) => {
    files.value = files.value.filter(file => file !== fileToRemove)
  }

  
  return {
    files,
    isDragging,
    handleFileDrop,
    removeFile
  }

}