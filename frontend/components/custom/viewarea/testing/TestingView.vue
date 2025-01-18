<template>

    <ResizablePanelGroup direction="vertical" class="min-h-screen flex-1">
    
    <!-- Top section -->
    <ResizablePanel :default-size="70">
      <ResizablePanelGroup direction="horizontal" class="h-full">
        <ResizablePanel :default-size="25">
            <DirectoryTree />
        </ResizablePanel>
        <ResizableHandle withHandle />
        
        <ResizablePanel :default-size="50">
          <div class="p-4 h-full border">Run test cases</div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        
        <ResizablePanel :default-size="25">
            <ChatInterface />
        </ResizablePanel>
    
      </ResizablePanelGroup>
    </ResizablePanel>
    
    </ResizablePanelGroup>
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    </template>

<script setup>
import DirectoryTree from '~/components/custom/explorer/DirectoryTree.vue'
import ChatInterface from '~/components/custom/chat/ChatInterface.vue'



</script>;