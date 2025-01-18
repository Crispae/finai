<template>




<ResizablePanelGroup direction="vertical" class="min-h-screen flex-1">

<!-- Top section -->
<ResizablePanel :default-size="70">
  <ResizablePanelGroup direction="horizontal" class="h-full">
    
    <!-- Left panel with Directory Tree -->
    <ResizablePanel :default-size="25">
      <Tickers />
      <!--<DirectoryTree />-->
    </ResizablePanel>
    <ResizableHandle  />

    <ResizablePanel :default-size="100">
        <ChatInterface />
    </ResizablePanel>
    <ResizableHandle  />


    <ResizablePanel :default-size="50">
      <ClientOnly>
        <Network />
      </ClientOnly>
      
    </ResizablePanel>
    <ResizableHandle  />
  </ResizablePanelGroup>


    
    
    
    
</ResizablePanel>
<ResizableHandle />

</ResizablePanelGroup>




















</template>

<script setup>
import DirectoryTree from '~/components/custom/explorer/DirectoryTree.vue'
import ChatInterface from '~/components/custom/chat/ChatInterface.vue'
import Tickers from '~/components/hacks/Tickers.vue';
import Network from '~/components/hacks/Network.vue';

</script>