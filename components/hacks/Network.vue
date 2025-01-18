<!-- components/GraphVisualization.vue -->
<template>
  <div class="flex flex-col h-full w-full">
    <div class="flex-shrink-0 p-4 border-b">
      <div class="flex items-center justify-between mb-2">
        <h2 class="text-lg font-semibold">Network Graph Visualization</h2>
        <div class="flex gap-2">
          <Button variant="outline" size="sm" @click="refreshGraph">
            <RefreshCcw class="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" @click="toggleLayout">
            <Layout class="h-4 w-4 mr-2" />
            {{ currentLayout }}
          </Button>
        </div>
      </div>
      <p class="text-sm text-muted-foreground">
        Visualization of relationships between entities
      </p>
    </div>

    <div 
      id="graph-container" 
      class="flex-grow w-full min-h-0 bg-[#fafafa]"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { RefreshCcw, Layout } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Network, DataSet } from 'vis-network/standalone'

const viz = ref<any>(null)
const currentLayout = ref('hierarchical')
const network = ref<any>(null)

// Mock data
const mockData = {
  nodes: [
    { id: 1, label: 'User 1', group: 'user' },
    { id: 2, label: 'User 2', group: 'user' },
    { id: 3, label: 'Product A', group: 'product' },
    { id: 4, label: 'Product B', group: 'product' },
    { id: 5, label: 'Category X', group: 'category' },
    { id: 6, label: 'Category Y', group: 'category' },
    { id: 7, label: 'User 3', group: 'user' },
    { id: 8, label: 'Product C', group: 'product' },
  ],
  edges: [
    { from: 1, to: 3, label: 'PURCHASED' },
    { from: 1, to: 4, label: 'VIEWED' },
    { from: 2, to: 3, label: 'REVIEWED' },
    { from: 3, to: 5, label: 'BELONGS_TO' },
    { from: 4, to: 6, label: 'BELONGS_TO' },
    { from: 7, to: 8, label: 'PURCHASED' },
    { from: 8, to: 5, label: 'BELONGS_TO' },
    { from: 2, to: 8, label: 'VIEWED' },
  ]
}

// Network options
const options = {
  nodes: {
    shape: 'dot',
    size: 16,
    font: {
      size: 12,
      face: 'Arial'
    },
    borderWidth: 2,
    shadow: true
  },
  edges: {
    width: 2,
    shadow: true,
    arrows: {
      to: { enabled: true, scaleFactor: 0.5 }
    },
    font: {
      size: 8,
      align: 'middle'
    }
  },
  groups: {
    user: {
      color: { background: '#4CAF50', border: '#2E7D32' },
      shape: 'dot'
    },
    product: {
      color: { background: '#2196F3', border: '#1565C0' },
      shape: 'square'
    },
    category: {
      color: { background: '#FFC107', border: '#FFA000' },
      shape: 'diamond'
    }
  },
  physics: {
    enabled: true,
    hierarchicalRepulsion: {
      centralGravity: 0.0,
      springLength: 100,
      springConstant: 0.01,
      nodeDistance: 120,
      damping: 0.09
    },
    solver: 'hierarchicalRepulsion'
  },
  layout: {
    hierarchical: {
      enabled: true,
      direction: 'UD',
      sortMethod: 'directed'
    }
  }
}

onMounted(() => {
  try {
    // Create a network
    const container = document.getElementById('graph-container')
    const data = {
      nodes: new DataSet(mockData.nodes),
      edges: new DataSet(mockData.edges)
    }
    
    network.value = new Network(container, data, options)

    // Add event listeners
    network.value.on('click', function(params: any) {
      if (params.nodes.length > 0) {
        console.log('Clicked node:', params.nodes[0])
      } else if (params.edges.length > 0) {
        console.log('Clicked edge:', params.edges[0])
      }
    })

  } catch (error) {
    console.error('Error initializing graph:', error)
  }
})

onBeforeUnmount(() => {
  if (network.value) {
    network.value.destroy()
    network.value = null
  }
})

const refreshGraph = () => {
  if (network.value) {
    network.value.setData({
      nodes: new DataSet(mockData.nodes),
      edges: new DataSet(mockData.edges)
    })
  }
}

const toggleLayout = () => {
  if (!network.value) return

  currentLayout.value = currentLayout.value === 'hierarchical' ? 'force' : 'hierarchical'
  
  const newOptions = {
    physics: currentLayout.value === 'hierarchical' 
      ? {
          enabled: true,
          hierarchicalRepulsion: {
            centralGravity: 0.0,
            springLength: 100,
            springConstant: 0.01,
            nodeDistance: 120,
            damping: 0.09
          },
          solver: 'hierarchicalRepulsion'
        }
      : {
          enabled: true,
          forceAtlas2Based: {
            gravitationalConstant: -50,
            centralGravity: 0.01,
            springLength: 100,
            springConstant: 0.08,
            damping: 0.4,
            avoidOverlap: 0.8
          },
          solver: 'forceAtlas2Based'
        },
    layout: {
      hierarchical: {
        enabled: currentLayout.value === 'hierarchical',
        direction: 'UD',
        sortMethod: 'directed'
      }
    }
  }

  network.value.setOptions(newOptions)
}
</script>

<style scoped>
#graph-container {
  background-color: var(--background);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
}

/* Optional: Add some hover effects */
:deep(.vis-network:hover) {
  cursor: grab;
}

:deep(.vis-network:active) {
  cursor: grabbing;
}

/* Optional: Add some hover effects */
:deep(.vis-network:hover) {
  cursor: grab;
}

:deep(.vis-network:active) {
  cursor: grabbing;
}



</style>


