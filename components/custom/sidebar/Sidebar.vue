<template>
  <aside 
    class="border-r transition-all duration-300 ease-in-out flex flex-col h-screen"
    :class="[modelValue ? 'w-[72px]' : 'w-[260px]']"
  >
  <SidebarHeader
      class="flex-shrink-0" 
      :collapsed="modelValue"
      @update:collapsed="$emit('update:modelValue', $event)"
    />
    
    
    <SidebarWorkflow
      class="flex-1 overflow-y-auto" 
      :collapsed="modelValue"
      :active-workspace="activeWorkspace"
      @workspace-change="handleWorkspaceChange"
    />
    
    <!-- Footer: Fixed height -->
    <SidebarFooter
      class="flex-shrink-0" 
      :collapsed="modelValue"
    />
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SidebarHeader from './sections/Header/SidebarHeader.vue'
import SidebarWorkflow from './sections/Middle/SidebarWorkflow.vue'
import SidebarFooter from './sections/Bottom/SidebarFooter.vue'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'workspaceChange', workspace: string): void
}>()

const activeWorkspace = ref('requirements')

const handleWorkspaceChange = (workspace: string) => {
  activeWorkspace.value = workspace
  emit('workspaceChange', workspace)
}
</script>