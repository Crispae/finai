<template>

  <div class="sticky top-0 bg-background z-10 flex flex-col">
    
    <HeaderTop 
      :collapsed="collapsed"
      @toggle-collapse="$emit('update:collapsed', !collapsed)"
    />
    
    <div class="px-3 py-4 pb-3 flex-1 flex flex-col overflow-scroll border-b">

      <!-- Options to create projects and see projects-->
      <HeaderOptions
        :collapsed="collapsed"
        :show-projects="showProjects"
        :projects="projects"
        @create-project="openCreateProject"
        @toggle-projects="toggleProjects"
        @select-project="selectProject"
      />
    </div>

    <!-- Overlay to create a new project -->
    <ProjectCreationOverlay
      :show="showCreateProject"
      :is-submitting="isSubmitting"
      @close="closeCreateProject"
      @submit="createNewProject"
    />
  </div>


</template>

<script setup lang="ts">
import { ref } from 'vue'
import HeaderTop from './HeaderTop.vue'
import HeaderOptions from './HeaderOptions.vue'
import ProjectCreationOverlay from './ProjectCreationOverlay.vue'
import type { Project } from '@/types/project'

const props = defineProps<{
  collapsed: boolean
}>()

const emit = defineEmits<{
  (e: 'update:collapsed', value: boolean): void
  (e: 'projectSelected', project: Project): void
}>()

// State
const showProjects = ref(false)
const showCreateProject = ref(false)
const isSubmitting = ref(false)
const projects = ref<Project[]>([])

// Methods
const toggleProjects = () => {
  showProjects.value = !showProjects.value
}

const openCreateProject = () => {
  showCreateProject.value = true
  document.body.style.overflow = 'hidden'
}

const closeCreateProject = () => {
  showCreateProject.value = false
  document.body.style.overflow = ''
}

const createNewProject = async (name: string, description: string) => {
  isSubmitting.value = true

  try {
    await new Promise(resolve => setTimeout(resolve, 1000))

    const newProject: Project = {
      id: projects.value.length + 1,
      name: name.trim(),
      description: description.trim(),
      createdAt: new Date()
    }

    projects.value.push(newProject)
    closeCreateProject()
  } catch (error) {
    console.error('Failed to create project:', error)
  } finally {
    isSubmitting.value = false
  }
}

const selectProject = (project: Project) => {
  emit('projectSelected', project)
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-from .bg-white,
.fade-leave-to .bg-white {
  transform: translateY(-20px);
}
</style>