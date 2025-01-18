<!-- components/GraphVisualization.vue -->
<template>
  <div class="flex flex-col h-full w-full">
    <!-- Header -->
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

    <!-- Graph Container -->
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

const viz = ref<any>(null)
const currentLayout = ref('hierarchical')

// Initialize visualization only on client side
let NeoVis: any = null

onMounted(async () => {
  try {
    // Dynamically import neovis.js only on client side
    NeoVis = (await import('neovis.js')).default

    const config = {
      container_id: 'graph-container',
      server_url: "bolt://localhost:7687", // Replace with your Neo4j connection
      server_user: "neo4j",
      server_password: "password",
      labels: {
        User: {
          caption: 'label',
          size: 'pagerank',
          community: 'community',
          title_properties: ['label', 'type'],
          color: '#4CAF50',
        },
        Product: {
          caption: 'label',
          size: 'pagerank',
          community: 'community',
          title_properties: ['label', 'type'],
          color: '#2196F3',
        },
        Category: {
          caption: 'label',
          size: 'pagerank',
          community: 'community',
          title_properties: ['label', 'type'],
          color: '#FFC107',
        },
      },
      relationships: {
        PURCHASED: {
          thickness: 2,
          caption: true,
          color: '#E91E63',
        },
        VIEWED: {
          thickness: 1,
          caption: true,
          color: '#9C27B0',
        },
        REVIEWED: {
          thickness: 1.5,
          caption: true,
          color: '#FF5722',
        },
        BELONGS_TO: {
          thickness: 1,
          caption: true,
          color: '#795548',
        },
      },
      initial_cypher: `
        MATCH (n)
        OPTIONAL MATCH (n)-[r]->(m)
        RETURN n, r, m
      `,
    }

    viz.value = new NeoVis(config)
    viz.value.render()

  } catch (error) {
    console.error('Error initializing graph:', error)
  }
})

// Clean up on component unmount
onBeforeUnmount(() => {
  if (viz.value) {
    viz.value = null
  }
})

const refreshGraph = () => {
  if (viz.value) {
    viz.value.reload()
  }
}

const toggleLayout = () => {
  if (!viz.value) return

  currentLayout.value = currentLayout.value === 'hierarchical' ? 'force' : 'hierarchical'
  
  const physics = currentLayout.value === 'hierarchical' 
    ? {
        solver: 'hierarchicalRepulsion',
        hierarchicalRepulsion: {
          centralGravity: 0.0,
          springLength: 100,
          springConstant: 0.01,
          nodeDistance: 120,
          damping: 0.09,
        },
      }
    : {
        solver: 'forceAtlas2Based',
        forceAtlas2Based: {
          gravitationalConstant: -50,
          centralGravity: 0.01,
          springLength: 100,
          springConstant: 0.08,
          damping: 0.4,
          avoidOverlap: 0.8,
        },
      }

  viz.value.updateWithPhysics(physics)
}
</script>

<style scoped>
:deep(.node) {
  stroke: #fff;
  stroke-width: 2px;
}

:deep(.relationship) {
  stroke-width: 1.5px;
}

:deep(.node:hover) {
  stroke: #000;
  stroke-width: 3px;
}

:deep(.relationship:hover) {
  stroke-width: 3px;
}

/* Ensure the component takes full height of its parent */
:deep(#graph-container) {
  height: 100%;
  width: 100%;
}
</style>