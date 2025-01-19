<template>




<ResizablePanelGroup direction="vertical" class="min-h-screen flex-1">

<!-- Top section -->
<ResizablePanel :default-size="70">
  <ResizablePanelGroup direction="horizontal" class="h-full">
    
    <!-- Left panel with Directory Tree -->
    <ResizablePanel :default-size="15">
      <Tickers />
      <!--<DirectoryTree />-->
    </ResizablePanel>
    <ResizableHandle  />

    <ResizablePanel :default-size="5">
        <ChatInterface />
    </ResizablePanel>
    <ResizableHandle  />


    <ResizablePanel :default-size="5">
      <ClientOnly>
        <Network />
      </ClientOnly>
    </ResizablePanel>
    <ResizableHandle  />

    <ResizablePanel :default-size="75">
      <ClientOnly>
        <Globe />
      </ClientOnly>
      
    </ResizablePanel>
    <ResizableHandle  />
  </ResizablePanelGroup>


    
    
    
    
</ResizablePanel>
<ResizableHandle />

</ResizablePanelGroup>

<div class="attribution">
  © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors
</div>




















</template>

<script setup>
import DirectoryTree from '~/components/custom/explorer/DirectoryTree.vue'
import ChatInterface from '~/components/custom/chat/ChatInterface.vue'
import Tickers from '~/components/hacks/Tickers.vue';
import Network from '~/components/hacks/Network.vue';
import GraphWrapper from '~/components/hacks/GraphWrapper.vue';
import Globe from '~/components/custom/globe/Globe.vue'
</script>

<style scoped>
.attribution {
  position: absolute;
  bottom: 5px;
  right: 5px;
  font-size: 0.7rem;
  opacity: 0.7;
  z-index: 1;
}
</style>