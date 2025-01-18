<template>
  <ResizablePanel :default-size="30">
    <div class="h-full w-full">
      <ClientOnly>
        <Terminal />
      </ClientOnly>
    </div>
  </ResizablePanel>
</template>

<script setup lang="ts">
import { 
  ResizablePanel 
} from '~/components/ui/resizable'
import Terminal from '~/components/custom/terminal/Terminal.vue'
</script>