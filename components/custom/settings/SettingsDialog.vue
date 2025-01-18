<template>

    <Dialog :open="isSettingsOpen"
    @update:open = "$emit('update:isSettingsOpen', $event)">
      
      
      <DialogContent class="sm:max-w-[900px] h-[80vh] p-0">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 h-12 border-b">
          <DialogTitle class="text-lg font-semibold">Settings</DialogTitle>
          <DialogClose class="rounded-sm opacity-70 hover:opacity-100 focus:ring-2" />
        </div>
  
        <!-- Main Content -->
        <div class="grid grid-cols-[220px_1fr] h-[calc(80vh-3rem)]">
          <!-- Left Sidebar -->
          <nav class="border-r bg-muted/10">
            <div class="space-y-0.5 p-2">
              <Button
                v-for="tab in TABS"
                :key="tab.id"
                variant="ghost"
                class="w-full justify-start relative"
                :class="{
                  'bg-muted': activeTab === tab.id,
                  'hover:bg-muted/50': activeTab !== tab.id
                }"
                @click="activeTab = tab.id"
              >
                <component :is="tab.icon" class="h-4 w-4 mr-3" />
                {{ tab.label }}
                <div 
                  v-if="activeTab === tab.id" 
                  class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r"
                />
              </Button>
            </div>
          </nav>
  
          <!-- Right Content -->
          <div class="overflow-y-auto">
            <KeepAlive>
              <component 
                :is="activeTab === 'general' ? SettingsGeneral : SettingsModels"
                v-model="settings"
                @save="saveSettings"
              />
            </KeepAlive>
          </div>
        </div>
      </DialogContent>


    </Dialog>
  </template>
  
  <script setup lang="ts">
  
  import { ref } from 'vue';
  import defineProps from 'vue';
  import { Settings } from 'lucide-vue-next';
  import { TABS } from './constants';
  import type { Settings as SettingsType } from './types';
  import SettingsGeneral from './SettingsGeneral.vue';
  import SettingsModels from './SettingsModels.vue';
  
  const isOpen = ref(false);
  const activeTab = ref<'general' | 'models'>('general');
  
  const props = defineProps({
    isSettingsOpen: Boolean,
    required: true,

  })

  defineEmits(['update:isSettingsOpen']);
  
  const settings = ref<SettingsType>({
    theme: 'system',
    selectedModel: '',
    apiKey: '',
    temperature: 0.7,
    maxTokens: 2048,
    topP: 1,
  });
  
  const saveSettings = () => {
    // Implement your save logic here
    console.log('Saving settings:', settings.value);
    isOpen.value = false;
  };
  </script>