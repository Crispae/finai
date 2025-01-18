<template>
    <div class="flex items-center justify-center overflow-y-auto px-3 py-4">
      <div class="mb-2">
        <p class="text-xs font-semibold text-gray-500 mb-4" :class="{ 'hidden': collapsed }">
          WORKFLOW
        </p>
        
        <div class="space-y-2">
          <WorkflowCard
            v-for="(workflow, index) in workflows"
            :key="workflow.title"
            :collapsed="collapsed"
            v-bind="workflow"
            :is-active="activeWorkspace === workflow.id"
            @click="setActiveWorkspace(workflow.id)"
          />
        </div>
        
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import {
    FileText,
    Layout,
    Code2,
    TestTube,
    ArrowUpToLine,
    Plus,
    Box,
    Play,
    Download,
    GitBranch,
    GitPullRequest
  } from 'lucide-vue-next'
  import WorkflowCard from '../../workflow/WorkflowCard.vue'
  
  const props = defineProps<{
    collapsed: boolean
    activeWorkspace: string
  }>()
  
  const emit = defineEmits<{
    (e: 'workspaceChange', workspace: string): void
  }>()
  
  const workflows = computed(() => [

    {
      id: 'requirements',
      title: 'Requirements',
      description: 'Manage project requirements and user stories',
      icon: FileText,
      color: 'blue',
      status: 'In Progress',
      progress: 75,
      actions: [
        {
          label: 'Push to Jira',
          icon: ArrowUpToLine,
          onClick: () => handleAction('push-jira')
        },
        {
          label: 'Create Epic',
          icon: Plus,
          onClick: () => handleAction('create-epic')
        }
      ]
    },
    {
      id: 'design',
      title: 'System Design',
      description: 'Create system architecture and design diagrams',
      icon: Layout,
      color: 'purple',
      status: 'Not Started',
      actions: [
        {
          label: 'Create Diagram',
          icon: Plus,
          onClick: () => handleAction('create-diagram')
        }
      ]
    },
    {
      id: 'development',
      title: 'Development',
      description: 'Write code and implement features',
      icon: Code2,
      color: 'green',
      status: 'In Progress',
      progress: 50,
      actions: [
        {
          label: 'Run Tests',
          icon: TestTube,
          onClick: () => handleAction('run-tests')
        }
      ]
    },
    {
      id: 'testing',
      title: 'Testing',
      description: 'Test the application and fix bugs',
      icon: Box,
      color: 'yellow',
      status: 'Not Started',
      actions: [
        {
          label: 'Run Tests',
          icon: TestTube,
          onClick: () => handleAction('run-tests')
        }
      ]
    },
    {
      id: 'deployment',
      title: 'Deployment',
      description: 'Deploy the application to production',
      icon: Play,
      color: 'red',
      status: 'Not Started',
      actions: [
        {
          label: 'Download Release',
          icon: Download,
          onClick: () => handleAction('download-release')
        }
      ]
    },
    {
      id: 'release',
      title: 'Release',
      description: 'Create a release branch and merge changes',
      icon: GitBranch,
      color: 'orange',
      status: 'Not Started',
      actions: [
        {
          label: 'Create Pull Request',
          icon: GitPullRequest,
          onClick: () => handleAction('create-pr')
        }
      ]
    }

    





    // Add other workflows similarly...
  ])
  
  const handleAction = (action: string) => {
    console.log('Action triggered:', action)
  }
  
  const setActiveWorkspace = (workspace: string) => {
    emit('workspaceChange', workspace)
  }
  </script>
  
<style scoped>
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(155, 155, 155, 0.5) transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(155, 155, 155, 0.5);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: rgba(155, 155, 155, 0.7);
}
</style>