<!-- DiagramBoard.vue -->
<template>
    <div class="diagram-board h-full">
      <ClientOnly>
        <div ref="canvasContainer" class="canvas-container h-full"></div>
      </ClientOnly>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  
  const canvasContainer = ref(null);
  let excalidrawInstance = null;
  
  onMounted(async () => {
    if (process.client) {
      try {
        const { Excalidraw } = await import('@excalidraw/excalidraw');
        const React = await import('react');
        const ReactDOM = await import('react-dom');
  
        const App = React.createElement(Excalidraw, {
          initialData: {
            elements: [],
            appState: {
                theme: 'dark',
            },
          },
        });
  
        ReactDOM.render(App, canvasContainer.value);
      } catch (error) {
        console.error('Error loading Excalidraw:', error);
      }
    }
  });
  
  onUnmounted(() => {
    if (process.client && canvasContainer.value) {
      const ReactDOM = require('react-dom');
      ReactDOM.unmountComponentAtNode(canvasContainer.value);
    }
  });
  
  const clearCanvas = () => {
    if (excalidrawInstance) {
      excalidrawInstance.resetScene();
    }
  };
  
  const saveCanvas = () => {
    if (excalidrawInstance) {
      // Implement save functionality
    }
  };
  </script>
  
  <style scoped>
  .diagram-board {
    background: white;
  }
  
  .canvas-container {
    position: relative;
  }
  </style>