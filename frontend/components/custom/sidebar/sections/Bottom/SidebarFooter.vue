<template>
    <div class="sticky bottom-0 bg-background border-t p-4">
      <Button 
        variant="ghost" 
        class="w-full justify-start mb-4"
        @click="openSettings"
      >
        <Settings class="h-4 w-4 mr-2" />
        <span :class="{ 'hidden': collapsed }">Settings</span>
      </Button>
  
      <div class="flex items-center">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div 
          class="ml-3"
          :class="{ 'hidden': collapsed }"
        >
          <p class="text-sm font-medium">John Doe</p>
          <p class="text-xs text-gray-500">john@example.com</p>
        </div>
      </div>
  
      <SettingsDialog v-model:isSettingsOpen="isSettingsOpen" />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { Settings } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'
  import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
  import SettingsDialog from '../../../settings/SettingsDialog.vue'
  
  defineProps<{
    collapsed: boolean
  }>()
  
  const isSettingsOpen = ref(false)
  
  const openSettings = () => {
    isSettingsOpen.value = true
  }
  </script>