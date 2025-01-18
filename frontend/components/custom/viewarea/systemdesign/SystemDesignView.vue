<template>
    <ResizablePanelGroup direction="vertical" class="min-h-screen flex-1">
      <!-- Top section -->
      <ResizablePanel :default-size="70">
        <ResizablePanelGroup direction="horizontal" class="h-full">
          <ResizablePanel :default-size="25">
            <DirectoryTree />
          </ResizablePanel>
          <ResizableHandle />
          
          <ResizablePanel :default-size="50">
            <ChatInterface />
          </ResizablePanel>
          <ResizableHandle />
          
          <ResizablePanel :default-size="25">
            <!---<DiagramBoard /> -->
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  </template>
  
  <script setup>
  //import DiagramBoard from '~/components/custom/diagramming/DiagramBoard.vue'
  import DirectoryTree from '~/components/custom/explorer/DirectoryTree.vue'
  import ChatInterface from '../../chat/ChatInterface.vue';
  </script>