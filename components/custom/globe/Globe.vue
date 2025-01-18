<template>
  <div class="globe-container">
    <div class="search-container absolute top-4 left-4 z-10">
      <Select 
        v-model="selectedCountry"
        @update:modelValue="highlightCountry"
      >
        <SelectTrigger class="w-[200px]">
          <SelectValue placeholder="Select a country" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Countries</SelectLabel>
            <SelectItem 
              v-for="country in countries" 
              :key="country" 
              :value="country"
            >
              {{ country }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
    <div ref="globeContainer" class="h-full w-full"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'

const globeContainer = ref<HTMLElement | null>(null)
const selectedCountry = ref('')
const countries = ref<string[]>([])
let globe: any = null
let handleResize: () => void
let polygons: any[] = []

onMounted(async () => {
  if (process.client) {
    try {
      const Globe = (await import('globe.gl')).default
      const { feature } = await import('topojson-client')
      const topology = await fetch('https://unpkg.com/world-atlas/countries-110m.json').then(res => res.json())
      
      // Convert TopoJSON to GeoJSON
      polygons = feature(topology, topology.objects.countries).features
      
      // Extract country names and sort alphabetically
      countries.value = polygons
        .map(polygon => polygon.properties.name)
        .sort((a, b) => a.localeCompare(b))

      globe = Globe()
        .globeImageUrl(null)
        .globeTileEngineUrl((x: number, y: number, l: number) => 
          `https://tile.openstreetmap.org/${l}/${x}/${y}.png`
        )
        .backgroundColor('rgba(0,0,0,0)')
        .width(globeContainer.value?.clientWidth)
        .height(globeContainer.value?.clientHeight)
        .atmosphereColor('rgba(127, 127, 255, 0.2)')
        .atmosphereAltitude(0.1)
        .polygonsData([])
        .polygonCapColor(() => 'rgba(200, 0, 0, 0.3)')
        .polygonSideColor(() => 'rgba(200, 0, 0, 0.3)')
        .polygonStrokeColor(() => '#111')
        .polygonAltitude(0.01)

      globe(globeContainer.value)

      handleResize = () => {
        globe
          .width(globeContainer.value?.clientWidth)
          .height(globeContainer.value?.clientHeight)
      }
      window.addEventListener('resize', handleResize)
    } catch (error) {
      console.error('Error initializing Globe:', error)
    }
  }
})

const highlightCountry = () => {
  if (!selectedCountry.value || !globe) return
  
  const matchingPolygon = polygons.find(polygon => 
    polygon.properties.name === selectedCountry.value
  )

  if (matchingPolygon) {
    globe.polygonsData([matchingPolygon])
    
    const center = matchingPolygon.properties.center || 
      globe.polygonGeoJsonGeometry(matchingPolygon).center
    
    globe.pointOfView({
      lat: center[1],
      lng: center[0],
      altitude: 1.5
    }, 1000)
  }
}

onUnmounted(() => {
  if (globe && globeContainer.value) {
    globeContainer.value.innerHTML = ''
    window.removeEventListener('resize', handleResize)
  }
})
</script>

<style scoped>
.globe-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.search-container {
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.1);
  padding: 8px;
  border-radius: 8px;
}
</style>