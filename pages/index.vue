<template>
  <div class="flex flex-col h-screen">

    <div class="flex flex-1">
      <!-- Sidebar Component -->
      <Sidebar 
        v-model="isSidebarCollapsed"
        @workspace-change="handleWorkspaceChange"
      />

      <!-- Main Content -->
      <component :is="currentWorkSpaceView" />

    </div>
    
  </div>
</template>

<script setup lang="ts">
import { ref,computed } from 'vue'
import Sidebar from '~/components/custom/sidebar/Sidebar.vue'
import RequirementView from '~/components/custom/viewarea/requirements/RequirementView.vue'
import DevelopmentView from '~/components/custom/viewarea/development/DevelopmentView.vue'
import SystemDesignView from '~/components/custom/viewarea/systemdesign/SystemDesignView.vue'
import TestingView from '~/components/custom/viewarea/testing/TestingView.vue'



type WorkspaceType = 'requirements' | 'development' | 'design' | 'testing' | 'deployment' | 'release'

const isSidebarCollapsed = ref(true)
const currentWorkspace = ref<WorkspaceType>('requirements')


const currentWorkSpaceView = computed(() =>{

switch(currentWorkspace.value){
  case 'requirements':
    return RequirementView
  case 'development':
    return DevelopmentView
  case 'design':
    return SystemDesignView
  case 'testing':
    return TestingView
  default:
    return DevelopmentView
}
})

const handleWorkspaceChange = (workspace: WorkspaceType) => {
  currentWorkspace.value = workspace
  console.log('Workspace changed:', workspace)
}
</script>