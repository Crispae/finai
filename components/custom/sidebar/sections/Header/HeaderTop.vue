<template>
    <div class="flex items-center p-4 border-b">
      <img
        src="/assets/images/logo.svg"
        alt="Logo"
        class="h-8 w-8"
      />
      
      <span class="ml-2 font-semibold text-xl" :class="{ 'hidden': collapsed }">
        AutoByteus
      </span>
  
      <Button
        variant="ghost"
        size="icon"
        @click="$emit('toggle-collapse')"
        class="ml-auto"
      >
        <ChevronLeft v-if="!collapsed" class="h-4 w-4" />
        <ChevronRight v-else class="h-4 w-4" />
      </Button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'
  
  defineProps<{
    collapsed: boolean
  }>()
  
  defineEmits<{
    (e: 'toggle-collapse'): void
  }>()
  </script>