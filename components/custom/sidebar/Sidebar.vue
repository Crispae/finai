<template>
  <aside 
    class="border-r transition-all duration-300 ease-in-out flex flex-col h-screen"
    :class="[modelValue ? 'w-[72px]' : 'w-[260px]']"
  >
    <!-- Header -->
    <SidebarHeader
      class="flex-shrink-0" 
      :collapsed="modelValue"
      @update:collapsed="$emit('update:modelValue', $event)"
    />
    
  
    
    <!-- Footer: Will stick to bottom -->
    <SidebarFooter
      class="flex-shrink-0 mt-auto border-t" 
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

<style scoped>
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #888888 #f1f1f1;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #888888;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #555555;
}
</style>