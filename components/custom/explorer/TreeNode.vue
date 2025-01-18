<template>
    <div class="tree-node" :style="{ paddingLeft: `${level * 12}px` }">
      <div 
        class="node-content hover:bg-gray-100 dark:hover:bg-gray-800 rounded px-2 py-1 cursor-pointer"
        @click="handleClick"
      >
        <div class="flex items-center">
          <!-- Expand/Collapse arrow for directories -->
          <ChevronRight
            v-if="item.type === 'directory'"
            class="h-4 w-4 transform transition-transform"
            :class="{ 'rotate-90': isExpanded }"
          />
          
          <!-- File/Directory icon -->
          <component 
            :is="getIcon"
            class="h-4 w-4 ml-1"
            :class="getIconColor"
          />
          
          <!-- Name -->
          <span class="ml-1 text-sm">{{ item.name }}</span>
        </div>
      </div>
  
      <!-- Children -->
      <div v-if="isExpanded && item.children">
        <TreeNode
          v-for="child in item.children"
          :key="child.path"
          :item="child"
          :level="level + 1"
          @file-click="(path) => $emit('file-click', path)"
          @folder-click="(path) => $emit('folder-click', path)"


        />
      </div>
    </div>
  </template>
  
<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
    ChevronRight, 
    File, 
    Folder,
    FileJson,
    FileText,
    Code2,
    FileCode,
    Coffee,
    FileType,
    Image,
    FileVideo,
    Music,
    Database,
    Terminal,
    Settings,
    Package,
    Lock,
    Globe,
    FileArchive,
} from 'lucide-vue-next'

interface Props {
    item: {
        name: string
        path: string
        type: 'file' | 'directory'
        children?: any[]
    }
    level: number
}

const props = defineProps<Props>()
const emit = defineEmits(['file-click', 'folder-click'])
const isExpanded = ref(false)

const handleClick = () => {
  if (props.item.type === 'directory') {
    isExpanded.value = !isExpanded.value
    emit('folder-click', props.item.path)
  } else {
    emit('file-click', props.item.path)
  }
}

// File extension mappings
const fileIcons = {
    // Web
    'html': { icon: Globe, color: 'text-orange-500' },
    'css': { icon: FileCode, color: 'text-blue-500' },
    'scss': { icon: FileCode, color: 'text-pink-500' },
    'less': { icon: FileCode, color: 'text-purple-500' },
    
    // JavaScript/TypeScript
    'js': { icon: FileCode, color: 'text-yellow-500' },
    'jsx': { icon: FileCode, color: 'text-blue-400' },
    'ts': { icon: FileCode, color: 'text-blue-600' },
    'tsx': { icon: FileCode, color: 'text-blue-500' },
    
    // Vue/React
    'vue': { icon: Code2, color: 'text-green-500' },
    'react': { icon: Code2, color: 'text-blue-400' },
    
    // Python
    'py': { icon: FileCode, color: 'text-blue-500' },
    'pyc': { icon: FileCode, color: 'text-blue-400' },
    
    // Java
    'java': { icon: Coffee, color: 'text-red-500' },
    'class': { icon: Coffee, color: 'text-red-400' },
    'jar': { icon: Coffee, color: 'text-red-600' },
    
    // Data
    'json': { icon: FileJson, color: 'text-yellow-600' },
    'xml': { icon: FileCode, color: 'text-orange-500' },
    'yaml': { icon: FileCode, color: 'text-purple-500' },
    'yml': { icon: FileCode, color: 'text-purple-500' },
    
    // Documentation
    'md': { icon: FileText, color: 'text-blue-500' },
    'txt': { icon: FileText, color: 'text-gray-500' },
    'pdf': { icon: FileText, color: 'text-red-500' },
    'doc': { icon: FileText, color: 'text-blue-600' },
    'docx': { icon: FileText, color: 'text-blue-600' },
    
    // Images
    'png': { icon: Image, color: 'text-purple-500' },
    'jpg': { icon: Image, color: 'text-purple-500' },
    'jpeg': { icon: Image, color: 'text-purple-500' },
    'gif': { icon: Image, color: 'text-purple-500' },
    'svg': { icon: Image, color: 'text-purple-500' },
    
    // Media
    'mp4': { icon: FileVideo, color: 'text-pink-500' },
    'mov': { icon: FileVideo, color: 'text-pink-500' },
    'mp3': { icon: Music, color: 'text-green-500' },
    'wav': { icon: Music, color: 'text-green-500' },
    
    // Database
    'sql': { icon: Database, color: 'text-blue-500' },
    'db': { icon: Database, color: 'text-blue-500' },
    'sqlite': { icon: Database, color: 'text-blue-500' },
    
    // Config files
    'env': { icon: Settings, color: 'text-gray-500' },
    'config': { icon: Settings, color: 'text-gray-500' },
    'ini': { icon: Settings, color: 'text-gray-500' },
    'lock': { icon: Lock, color: 'text-red-500' },
    
    // Package files
    'package.json': { icon: Package, color: 'text-red-500' },
    'composer.json': { icon: Package, color: 'text-red-500' },
    
    // Archives
    'zip': { icon: FileArchive, color: 'text-gray-500' },
    'rar': { icon: FileArchive, color: 'text-gray-500' },
    '7z': { icon: FileArchive, color: 'text-gray-500' },
    'tar': { icon: FileArchive, color: 'text-gray-500' },
    'gz': { icon: FileArchive, color: 'text-gray-500' },
    
    // Shell/Scripts
    'sh': { icon: Terminal, color: 'text-gray-500' },
    'bash': { icon: Terminal, color: 'text-gray-500' },
    'bat': { icon: Terminal, color: 'text-gray-500' },
    'ps1': { icon: Terminal, color: 'text-blue-500' },
}

// Special files (exact matches)
const specialFiles = {
    'package.json': { icon: Package, color: 'text-red-500' },
    'package-lock.json': { icon: Lock, color: 'text-red-500' },
    'yarn.lock': { icon: Lock, color: 'text-blue-500' },
    '.gitignore': { icon: Settings, color: 'text-gray-500' },
    '.env': { icon: Settings, color: 'text-yellow-500' },
    'dockerfile': { icon: FileCode, color: 'text-blue-500' },
    'docker-compose.yml': { icon: FileCode, color: 'text-blue-500' },
}

const getIcon = computed(() => {
    if (props.item.type === 'directory') return Folder

    // Check for special files first (exact match)
    const lowerName = props.item.name.toLowerCase() as keyof typeof specialFiles
    if (lowerName in specialFiles) {
        return specialFiles[lowerName].icon
    }

    // Check file extension
    const extension = props.item.name.split('.').pop()?.toLowerCase() as keyof typeof fileIcons
    if (extension && extension in fileIcons) {
        return fileIcons[extension].icon
    }

    return File
})

const getIconColor = computed(() => {
    if (props.item.type === 'directory') return 'text-yellow-500'

    // Check for special files first (exact match)
    const lowerName = props.item.name.toLowerCase() as keyof typeof specialFiles
    if (lowerName in specialFiles) {
        return specialFiles[lowerName].color
    }

    // Check file extension
    const extension = props.item.name.split('.').pop()?.toLowerCase() as keyof typeof fileIcons
    if (extension && extension in fileIcons) {
        return fileIcons[extension].color
    }

    return 'text-gray-500'
})
</script>