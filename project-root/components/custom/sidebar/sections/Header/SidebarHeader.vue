
<template>
  <div class="sticky top-0 bg-background z-10 h/screen flex flex-col">
    <!-- Header -->
    <div class="flex items-center p-4 border-b">
      <!-- Logo -->
      <img
        src="/assets/images/logo.svg"
        alt="Logo"
        class="h-8 w-8"
      />
      <span class="ml-2 font-semibold text-xl" :class="{ 'hidden': collapsed }">
        AutoByteus
      </span>
      <!-- Collapse Button -->
      <Button
        variant="ghost"
        size="icon"
        @click="toggleCollapse"
        class="ml-auto"
      >
        <ChevronLeft v-if="!collapsed" class="h-4 w-4" />
        <ChevronRight v-else class="h-4 w-4" />
      </Button>
    </div>
    <!-- Navigation -->
    <div class="px-3 py-4 flex-1 flex flex-col overflow-hidden">
      <nav class="space-y-2">
        <!-- Create Project Button -->
        <Button
          variant="ghost"
          class="w-full justify-start shrink-0"
          @click="openOverlay"
          :title="collapsed ? 'Create New Project' : ''"
        >
          <Plus class="h-4 w-4" :class="{ 'mr-2': !collapsed }" />
          <span :class="{ 'hidden': collapsed }">Create Project</span>
        </Button>
        <!-- Projects Button -->
        <Button
          variant="ghost"
          class="w-full justify-start shrink-0"
          @click="toggleProjectsList"
          :title="collapsed ? 'View Projects' : ''"
        >
          <Briefcase class="h-4 w-4" :class="{ 'mr-2': !collapsed }" />
          <span :class="{ 'hidden': collapsed }">Projects</span>
        </Button>
        <!-- Projects List Container -->
        <div
          v-if="showProjects && !collapsed"
          class="pl-6 space-y-2 overflow-y-auto max-h-[calc(100vh-200px)] md:max-h-[calc(100vh-150px)] lg:max-h-[calc(100vh-100px)]"
        >
          <!-- Projects List -->
          <div class="space-y-1">
            <Button
              v-for="project in projects"
              :key="project.id"
              variant="ghost"
              class="w-full justify-start text-sm"
              @click="selectProject(project)"
            >
              <Folder class="h-4 w-4 mr-2 shrink-0" />
              <span class="truncate">{{ project.name }}</span>
            </Button>
            <!-- Empty state message -->
            <div v-if="projects.length === 0" class="text-sm text-gray-500 px-2 py-1">
              No projects yet
            </div>
          </div>
        </div>
      </nav>
    </div>
  </div>
  <!-- Project Creation Overlay -->
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="showOverlay"
        class="fixed inset-0 z-50"
        v-click-outside="closeOverlay"
      >
        <!-- Overlay Background -->
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
        ></div>
        <!-- Modal Content -->
        <div class="fixed inset-0 flex items-center justify-center">
          <div
            class="bg-white rounded-lg p-6 w-96 shadow-lg relative"
            @click.stop
          >
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-semibold">Create New Project</h2>
              <Button
                variant="ghost"
                size="icon"
                @click="closeOverlay"
              >
                <X class="h-4 w-4" />
              </Button>
            </div>
            <form @submit.prevent="createNewProject" class="space-y-4">
              <div class="space-y-2">
                <Label for="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  v-model="newProjectName"
                  placeholder="Enter project name"
                  class="w-full"
                  :class="{ 'border-red-500': nameError }"
                  @focus="nameError = false"
                />
                <span v-if="nameError" class="text-red-500 text-sm">
                  Project name is required
                </span>
              </div>
              <div class="space-y-2">
                <Label for="projectDescription">Description (Optional)</Label>
                <Textarea
                  id="projectDescription"
                  v-model="newProjectDescription"
                  placeholder="Enter project description"
                  rows="3"
                  class="w-full"
                />
              </div>
              <div class="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  @click="closeOverlay"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  :disabled="isSubmitting"
                >
                  {{ isSubmitting ? 'Creating...' : 'Create Project' }}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import {
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Plus,
  Folder,
  X
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { clickOutside } from '@/plugins/directives' // Import the click-outside directive

interface Project {
  id: number
  name: string
  description: string
  createdAt: Date
}

const props = defineProps<{
  collapsed: boolean
}>()

const emit = defineEmits<{
  (e: 'update:collapsed', value: boolean): void
  (e: 'projectSelected', project: Project): void
}>()

// Register the click-outside directive
clickOutside

// State
const showProjects = ref(false)
const showOverlay = ref(false)
const newProjectName = ref('')
const newProjectDescription = ref('')
const nameError = ref(false)
const isSubmitting = ref(false)
const projects = ref<Project[]>([
  {
    id: 1,
    name: 'E-commerce Platform',
    description: 'Online shopping platform',
    createdAt: new Date()
  },
  {
    id: 2,
    name: 'Task Manager',
    description: 'Project management tool',
    createdAt: new Date()
  },
  {
    id: 3,
    name: 'Social Media App',
    description: 'Social networking platform',
    createdAt: new Date()
  },
  {
    id: 4,
    name: 'Blog System',
    description: 'Content management system',
    createdAt: new Date()
  },
  {
    id: 5,
    name: 'Analytics Dashboard',
    description: 'Data visualization platform',
    createdAt: new Date()
  },
  {
    id: 6,
    name: 'Inventory Management',
    description: 'Stock tracking system',
    createdAt: new Date()
  },
  {
    id: 7,
    name: 'Customer CRM',
    description: 'Customer relationship management',
    createdAt: new Date()
  },
  {
    id: 8,
    name: 'Payment Gateway',
    description: 'Payment processing system',
    createdAt: new Date()
  }
])

// Methods
const toggleCollapse = () => {
  emit('update:collapsed', !props.collapsed)
}

const toggleProjectsList = () => {
  showProjects.value = !showProjects.value
}

const openOverlay = () => {
  showOverlay.value = true
  // Prevent body scrolling when overlay is open
  document.body.style.overflow = 'hidden'
}

const closeOverlay = () => {
  showOverlay.value = false
  newProjectName.value = ''
  newProjectDescription.value = ''
  nameError.value = false
  // Restore body scrolling
  document.body.style.overflow = ''
}

const createNewProject = async () => {
  if (!newProjectName.value.trim()) {
    nameError.value = true
    return
  }

  isSubmitting.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    const newProject: Project = {
      id: projects.value.length + 1,
      name: newProjectName.value.trim(),
      description: newProjectDescription.value.trim(),
      createdAt: new Date()
    }

    projects.value.push(newProject)
    closeOverlay()
  } catch (error) {
    console.error('Failed to create project:', error)
    // Handle error (show error message to user)
  } finally {
    isSubmitting.value = false
  }
}

const selectProject = (project: Project) => {
  emit('projectSelected', project)
}

// Handle escape key press
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && showOverlay.value) {
    closeOverlay()
  }
}

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  // Ensure body scroll is restored when component is unmounted
  document.body.style.overflow = ''
})
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

[title]:hover::after {
  content: attr(title);
  position: absolute;
  left: 100%;
  margin-left: 0.5rem;
  padding: 0.25rem 0.5rem;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  z-index: 1000;
}

/* Add custom scrollbar styles */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.3);
}

/* Ensure project names don't break layout */
.truncate {
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Responsive styles */
@media (max-width: 768px) {
  .max-h-[calc(100vh-200px)] {
    max-height: calc(100vh - 150px);
  }
}

@media (max-width: 1024px) {
  .max-h-[calc(100vh-200px)] {
    max-height: calc(100vh - 100px);
  }
}
</style>
