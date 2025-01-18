<template>
    <div class="terminal-wrapper">
      <div ref="terminalRef" class="terminal-container"></div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount } from 'vue'
  
  const terminalRef = ref<HTMLElement | null>(null)
  let terminal: any = null
  let fitAddon: any = null
  
  onMounted(async () => {
    if (!terminalRef.value) return
  
    // Dynamically import xterm modules only on the client side
    const { Terminal: XTerm } = await import('xterm')
    const { FitAddon } = await import('xterm-addon-fit')
    const { WebLinksAddon } = await import('xterm-addon-web-links')
    await import('xterm/css/xterm.css')
  
    // Initialize terminal
    terminal = new XTerm({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, Consolas, monospace',
      theme: {
        background: '#1a1b26',
        foreground: '#a9b1d6',
        cursor: '#f7768e'
      },
      convertEol: true,
      scrollback: 1000,
    })
  
    // Initialize addons
    fitAddon = new FitAddon()
    terminal.loadAddon(fitAddon)
    terminal.loadAddon(new WebLinksAddon())
  
    // Open terminal
    terminal.open(terminalRef.value)
    fitAddon.fit()
  
    // Welcome message
    terminal.writeln('Welcome to AutoByteUs Terminal')
    terminal.write('\r\n$ ')
  
    // Handle input
    terminal.onData((data: string) => {
      terminal.write(data)
    })
  
    // Handle resize
    window.addEventListener('resize', handleResize)
  })
  
  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
    terminal?.dispose()
  })
  
  const handleResize = () => {
    fitAddon?.fit()
  }
  </script>
  
  <style scoped>
  .terminal-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.terminal-container {
  flex: 1;
  padding: 8px;
  background-color: #1a1b26;
  min-height: 300px;
  max-width: 100%;
  overflow: hidden;
}
  </style>