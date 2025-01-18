// composables/useFileSystemAccess.ts
export function useFileSystemAccess() {
    /**
     * Opens the directory picker and returns the selected directory path.
     * Note: The File System Access API requires a secure context (HTTPS) and user interaction.
     */
    const selectDirectory = async (): Promise<string | null> => {
      try {
        // Ensure this runs only on the client
        if (process.client && 'showDirectoryPicker' in window) {
          const dirHandle = await (window as any).showDirectoryPicker()
          // You can customize what you return here. For simplicity, we're returning the directory name.
          return dirHandle.name
        } else {
          // Fallback for browsers that do not support the File System Access API
          alert('Directory selection is not supported in this browser.')
          return null
        }
      } catch (error) {
        console.error('Error selecting directory:', error)
        return null
      }
    }
  
    return {
      selectDirectory
    }
  }