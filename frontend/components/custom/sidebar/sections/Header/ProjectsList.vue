<template>
    <div class="pl-6 space-y-2 overflow-y-auto max-h-[calc(100vh-200px)]">
      <div class="space-y-1">
        <Button
          v-for="project in projects"
          :key="project.id"
          variant="ghost"
          class="w-full justify-start text-sm"
          @click="$emit('select-project', project)"
        >
          <Folder class="h-4 w-4 mr-2 shrink-0" />
          <span class="truncate">{{ project.name }}</span>
        </Button>
  
        <div v-if="projects.length === 0" class="text-sm text-gray-500 px-2 py-1">
          No projects yet
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { Folder } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'
  import type { Project } from '@/types/project'
  
  defineProps<{
    projects: Project[]
  }>()
  
  defineEmits<{
    (e: 'select-project', project: Project): void
  }>()
  </script>