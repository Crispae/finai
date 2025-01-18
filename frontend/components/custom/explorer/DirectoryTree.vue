<template>
  <div class="directory-tree">
    <!-- Search bar -->
    <div class="search-container px-3 py-2 border-b">
      <div class="relative">
        <Search class="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search files..." 
          class="w-full pl-8 pr-3 py-1.5 text-sm rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          v-model="searchQuery"
        >
      </div>
    </div>

    <!-- Directory structure -->
    <div class="p-2 overflow-auto">
      <TreeNode 
        v-for="item in filteredTree" 
        :key="item.path"
        :item="item"
        :level="0"
        @file-click="handleFileClick"
        @folder-click="handleFolderClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'  // Added onMounted import
import { Search } from 'lucide-vue-next'
import TreeNode from './TreeNode.vue'

// Define types
interface FileItem {
  name: string
  path: string
  type: 'file' | 'directory'
  children?: FileItem[]
}

// Initialize treeData with empty array
const treeData = ref<FileItem[]>([])

const onClickOnFile = (path: string) => {
  console.log('File clicked:', path)
}



// query to parse the workspace directory from the backend
const parseWorkspace = async (workspacePath: string) => {
  try {
    // Normalize the path by replacing backslashes with forward slashes
    const normalizedPath = workspacePath.replace(/\\/g, '/');
    
    const response = await fetch("http://localhost:8001/api/v1/explorer/directory-tree", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        path: normalizedPath
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch directory tree');
    }
    
    const data = await response.json();
    treeData.value = data;
  } catch (error) {
    console.error("Error fetching directory tree:", error);
    // Handle error in UI
  }
};

const searchQuery = ref('')

const filteredTree = computed(() => {
  if (!searchQuery.value) return treeData.value
  
  // Implement search logic here
  return filterItems(treeData.value, searchQuery.value.toLowerCase())
})



const handleFileClick = (path: string) => {
  console.log('File clicked:', path)
  // Add your file click logic here
  // For example, you might want to open the file in an editor
}

const handleFolderClick = (path: string) => {
  console.log('Folder clicked:', path)
  // Add your folder click logic here
  // For example, you might want to load additional metadata about the folder
}

function filterItems(items: FileItem[], query: string): FileItem[] {
  return items.filter(item => {
    const matches = item.name.toLowerCase().includes(query)
    if (item.children) {
      const filteredChildren = filterItems(item.children, query)
      item.children = filteredChildren
      return filteredChildren.length > 0 || matches
    }
    return matches
  })
}

// Modified onMounted to just call parseWorkspace
onMounted(() => {
  parseWorkspace("C:/Users/saurav/OneDrive - URV/Escritorio/Hackathon2/autobyteus-server")
  
})

</script>

<style scoped>
.directory-tree {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--background);
  color: var(--foreground);
}
</style>