<template>

<ResizablePanelGroup direction="vertical" class="min-h-screen flex-1">


<!-- Top section -->
<ResizablePanel >
  <ResizablePanelGroup direction="horizontal" class="h-full">
    <ResizablePanel :default-size="25">
      <DirectoryTree />
    </ResizablePanel>
    <ResizableHandle  />
    
    <ResizablePanel :default-size="50" >
      <ChatInterface />
    </ResizablePanel>
    <ResizableHandle />
    
    <ResizablePanel :default-size="25">
      
      <Editor />
    </ResizablePanel>
  </ResizablePanelGroup>
</ResizablePanel>
<ResizableHandle />

<!-- Bottom section -->
<BottomPanel />
</ResizablePanelGroup>

<RequirementView />





</template>

<script setup lang="ts">
import Editor from '~/components/custom/panels/toppanel/EditorPanel/Editor.vue'
import BottomPanel from '~/components/custom/panels/bottompanel/BottomPanel.vue'
import DirectoryTree from '~/components/custom/explorer/DirectoryTree.vue'
import ChatInterface from '~/components/custom/chat/ChatInterface.vue'
</script>