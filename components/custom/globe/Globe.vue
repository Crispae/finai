<template>
  <div class="globe-container">
    <div class="search-container absolute top-4 left-4 z-10 flex gap-2">
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

      <Select 
        v-model="selectedStock"
        @update:modelValue="fetchStockEvents"
      >
        <SelectTrigger class="w-[200px]">
          <SelectValue placeholder="Select a stock" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Stocks</SelectLabel>
            <SelectItem 
              v-for="stock in stocks" 
              :key="stock.symbol" 
              :value="stock.symbol"
            >
              {{ stock.name }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
    <div ref="globeContainer" class="h-full w-full"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import * as d3 from 'd3-geo'

const globeContainer = ref<HTMLElement | null>(null)
const selectedCountry = ref('')
const selectedStock = ref('')
const countries = ref<string[]>([])
const stocks = ref([
  { symbol: 'TSLA', name: 'Tesla, Inc.' },
  { symbol: 'AAPL', name: 'Apple Inc.' },
  // Add more stocks as needed
])

let globe: any = null
let handleResize: () => void
let polygons: any[] = []
let eventHexagons: any[] = []

const fetchStockEvents = async () => {
  console.log('Fetching events for stock:', selectedStock.value)
  if (!selectedStock.value) {
    console.log('No stock selected')
    return
  }

  try {
    // Clear existing hexagons first
    if (globe) {
      globe.hexPolygonsData([])
    }

    const locations = processEventsToLocations([]) // Get predefined locations first
    
    // Fetch news for each location
    for (const location of locations) {
      const response = await fetch('/api/tavily-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `${selectedStock.value} news events ${location.label} factory production manufacturing`,
          search_depth: 'advanced',
          include_domains: ['reuters.com', 'bloomberg.com', 'wsj.com']
        })
      })

      const data = await response.json()
      console.log(`News for ${location.label}:`, data)
      location.news = data.results?.slice(0, 3) || []
    }

    console.log('Locations with news:', locations)
    highlightEventLocations(locations)
  } catch (error) {
    console.error('Error fetching stock events:', error)
  }
}

const processEventsToLocations = (events: any[]) => {
  console.log('Processing events:', events)
  
  // Predefined important locations for Tesla as fallback/supplement
  const knownLocations = {
    'TSLA': [
      { lat: 30.2240, lng: -97.6208, label: 'Tesla HQ - Austin, TX' },
      { lat: 52.3558, lng: 13.4892, label: 'Gigafactory Berlin' },
      { lat: 31.0449, lng: 121.2079, label: 'Gigafactory Shanghai' },
      { lat: 39.5396, lng: -119.4401, label: 'Gigafactory Nevada' },
      { lat: 29.7974, lng: -95.4626, label: 'Tesla Service Center Houston' }
    ]
  }

  console.log('Selected stock:', selectedStock.value)
  
  if (selectedStock.value in knownLocations) {
    console.log('Using known locations for', selectedStock.value)
    return knownLocations[selectedStock.value]
  }

  // If we have events data, try to extract locations
  if (events && events.length > 0) {
    console.log('Attempting to extract locations from events')
    // Process events logic here if needed
  }

  console.log('No locations found, returning empty array')
  return []
}

const highlightEventLocations = (locations: any[]) => {
  console.log('Highlighting locations:', locations)
  if (!globe) {
    console.error('Globe not initialized')
    return
  }

  try {
    // Convert locations to points for hexbin
    const points = locations.map(loc => ({
      lat: loc.lat,
      lng: loc.lng,
      weight: 1,
      news: loc.news,
      label: loc.label
    }))

    console.log('Created points data:', points)

    globe
      .hexBinPointsData(points)
      .hexLabel(d => {
        const point = d.points[0] // Get the first point in the hexbin
        const newsItems = point.news
          .map((item: any) => `• ${item.title}`)
          .join('\n')
        return `${point.label}\n\nRecent News:\n${newsItems}`
      })

    // Center the view on the first location
    if (locations.length > 0) {
      console.log('Centering view on:', locations[0])
      globe.pointOfView({
        lat: locations[0].lat,
        lng: locations[0].lng,
        altitude: 1.5
      }, 1000)
    }
  } catch (error) {
    console.error('Error highlighting locations:', error)
  }
}

onMounted(async () => {
  if (process.client) {
    try {
      const Globe = (await import('globe.gl')).default
      const { feature } = await import('topojson-client')
      const topology = await fetch('https://unpkg.com/world-atlas/countries-110m.json').then(res => res.json())
      
      polygons = feature(topology, topology.objects.countries).features
      
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
        // Initialize hexagon layer
        .hexBinPointsData([])
        .hexBinPointWeight(1)
        .hexBinResolution(4)
        .hexMargin(0.2)
        .hexTopColor(d => 'rgba(255,0,0,0.8)')
        .hexSideColor(d => 'rgba(255,0,0,0.5)')
        .hexAltitude(d => d.sumWeight * 0.01)

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
    globe.hexPolygonsData([matchingPolygon])
    
    // Calculate center using d3-geo centroid
    const coordinates = matchingPolygon.geometry.coordinates
    let center
    
    if (matchingPolygon.geometry.type === 'Polygon') {
      center = d3.geoCentroid(matchingPolygon)
    } else if (matchingPolygon.geometry.type === 'MultiPolygon') {
      // For MultiPolygon, take the centroid of the largest polygon
      const areas = coordinates.map(poly => {
        const feature = {
          type: 'Feature',
          geometry: { type: 'Polygon', coordinates: poly }
        }
        return { poly, area: d3.geoArea(feature) }
      })
      const largestPoly = areas.reduce((a, b) => a.area > b.area ? a : b)
      center = d3.geoCentroid({
        type: 'Feature',
        geometry: { type: 'Polygon', coordinates: largestPoly.poly }
      })
    }

    if (center) {
      globe.pointOfView({
        lat: center[1],
        lng: center[0],
        altitude: 1.5
      }, 1000)
    }
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