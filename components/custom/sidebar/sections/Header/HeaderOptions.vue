<template>
    <nav class="space-y-2">
      <Button
        variant="ghost"
        class="w-full justify-start shrink-0"
        @click="$emit('create-project')"
        :title="collapsed ? 'Create New Project' : ''"
      >
        <Plus class="h-4 w-4" :class="{ 'mr-2': !collapsed }" />
        <span :class="{ 'hidden': collapsed }">Create Project</span>
      </Button>
  
      <Button
        variant="ghost"
        class="w-full justify-start shrink-0"
        @click="$emit('toggle-projects')"
        :title="collapsed ? 'View Projects' : ''"
      >
        <Briefcase class="h-4 w-4" :class="{ 'mr-2': !collapsed }" />
        <span :class="{ 'hidden': collapsed }">Projects</span>
      </Button>
  
      <ProjectsList
        v-if="showProjects && !collapsed"
        :projects="projects"
        @select-project="(project) => $emit('select-project', project)"
      />
    </nav>
  </template>
  
  <script setup lang="ts">
  import { Plus, Briefcase } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'
  import ProjectsList from './ProjectsList.vue'
  import type { Project } from '@/types/project'
  
  defineProps<{
    collapsed: boolean
    showProjects: boolean
    projects: Project[]
  }>()
  
  defineEmits<{
    (e: 'create-project'): void
    (e: 'toggle-projects'): void
    (e: 'select-project', project: Project): void
  }>()
  </script>