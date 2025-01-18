<template>
    <div class="p-6 space-y-6">
      <div class="space-y-2">
        <Label class="text-sm font-medium">Theme</Label>
        <Select v-model="modelValue.theme">
          <SelectTrigger class="w-full">
            <SelectValue placeholder="Select theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="theme in THEMES" :key="theme.value" :value="theme.value">
              <div class="flex items-center">
                <component :is="theme.icon" class="h-4 w-4 mr-2" />
                {{ theme.label }}
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  
  import { watch } from 'vue';
  import { THEMES } from './constants';
  import type { Settings } from './types';
  
  const props = defineProps<{
    modelValue: Settings;
  }>();
  
  const emit = defineEmits<{
    (e: 'update:modelValue', value: Settings): void;
  }>();
  
  const applyTheme = (theme: Settings['theme']) => {
    const root = document.documentElement;
    const isDark = theme === 'dark' || 
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
    root.classList.toggle('dark', isDark);
  };
  
  // Watch for theme changes
  watch(
    () => props.modelValue.theme,
    (newTheme) => {
      applyTheme(newTheme);
    },
    { immediate: true }
  );
  
  // Listen for system theme changes when in system mode
  if (typeof window !== 'undefined') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (props.modelValue.theme === 'system') {
        applyTheme('system');
      }
    });
  }
  </script>