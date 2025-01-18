<!-- components/GraphVisualizationWrapper.vue -->
<template>
    <ClientOnly>
      <Network />
      <template #fallback>
        <Card class="w-full h-[600px]">
          <CardContent class="flex items-center justify-center h-full">
            <div class="animate-pulse">Loading visualization...</div>
          </CardContent>
        </Card>
      </template>
    </ClientOnly>
  </template>
  
  <script setup lang="ts">
  import { Card, CardContent } from '@/components/ui/card'
  import Network from './Network.vue';
  </script>