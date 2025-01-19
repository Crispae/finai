<template>
  <div class="globe-container">
    <div class="search-container absolute top-4 left-4 z-10 flex flex-col gap-3">
      <div class="flex gap-2">
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

      <div class="flex gap-2">
        <input
          v-model="customQuery"
          type="text"
          placeholder="Ask about stock impact (e.g., 'How does Texas gun violence affect Tesla?')"
          class="w-[400px] h-10 rounded-md bg-white/10 backdrop-blur-md px-3 py-2 text-white placeholder:text-white/50 border border-white/20"
          @keyup.enter="fetchCustomEvents"
        />
        <button
          @click="fetchCustomEvents"
          :disabled="!selectedStock || loading"
          class="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 disabled:cursor-not-allowed text-white rounded-md transition-colors"
        >
          Ask
        </button>
      </div>
    </div>
    <div ref="globeContainer" class="h-full w-full"></div>
    
    <!-- Loading Overlay -->
    <div v-if="loading" class="absolute inset-0 flex items-center justify-center z-50">
      <!-- Blue gradient background -->
      <div class="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-blue-700/30 backdrop-blur-sm"></div>
      
      <!-- Loading Content -->
      <div class="relative z-10 bg-white/10 backdrop-blur-md rounded-xl p-8 flex flex-col items-center gap-4 shadow-2xl border border-white/20">
        <!-- Spinning loader -->
        <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        
        <!-- Loading text -->
        <div class="text-white text-xl font-medium text-center">
          <div>Fetching recent events for</div>
          <div class="text-blue-300 mt-1">
            {{ stocks.find(s => s.symbol === selectedStock)?.name }}
          </div>
        </div>
        
        <!-- Subtext -->
        <div class="text-blue-200/80 text-sm mt-2">
          Analyzing global impact and locations...
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import * as d3 from 'd3-geo'
import SpriteText from 'three-spritetext'

const globeContainer = ref<HTMLElement | null>(null)
const selectedCountry = ref('')
const selectedStock = ref('')
const countries = ref<string[]>([])
const stocks = ref([
  { symbol: 'TSLA', name: 'Tesla, Inc.' },
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'P911', name: 'Porsche AG' },
  { symbol: 'BMW', name: 'BMW Group' },
  { symbol: 'VOW3', name: 'Volkswagen AG' },
  { symbol: 'SAP', name: 'SAP SE' },
  { symbol: 'ASML', name: 'ASML Holding' },
  { symbol: 'LVMH', name: 'LVMH Moët Hennessy' },
  { symbol: 'SONY', name: 'Sony Group' },
  { symbol: 'SAMSUNG', name: 'Samsung Electronics' },
  { symbol: 'SIEMENS', name: 'Siemens AG' },
  { symbol: 'BAYN', name: 'Bayer AG' }
])

const companyHQ = {
  TSLA: { lat: 30.2246, lng: -97.6047, label: 'Tesla HQ - Austin, TX' },
  AAPL: { lat: 37.3346, lng: -122.0090, label: 'Apple HQ - Cupertino, CA' },
  P911: { lat: 48.8344, lng: 9.1516, label: 'Porsche HQ - Stuttgart, Germany' },
  BMW: { lat: 48.1770, lng: 11.5650, label: 'BMW HQ - Munich, Germany' },
  VOW3: { lat: 52.4322, lng: 10.7862, label: 'Volkswagen HQ - Wolfsburg, Germany' },
  SAP: { lat: 49.2934, lng: 8.6417, label: 'SAP HQ - Walldorf, Germany' },
  ASML: { lat: 51.4197, lng: 5.4663, label: 'ASML HQ - Veldhoven, Netherlands' },
  LVMH: { lat: 48.8666, lng: 2.3057, label: 'LVMH HQ - Paris, France' },
  SONY: { lat: 35.6580, lng: 139.7394, label: 'Sony HQ - Tokyo, Japan' },
  SAMSUNG: { lat: 37.5685, lng: 127.0016, label: 'Samsung HQ - Seoul, South Korea' },
  SIEMENS: { lat: 48.1374, lng: 11.5755, label: 'Siemens HQ - Munich, Germany' },
  BAYN: { lat: 51.0177, lng: 6.9780, label: 'Bayer HQ - Leverkusen, Germany' }
}

let globe: any = null
let handleResize: () => void
let polygons: any[] = []
let eventHexagons: any[] = []
let loadingSprite: any = null

const loading = ref(false)
const customQuery = ref('')

const generateImpactAnalysis = (title: string, stockSymbol: string): string => {
  const stock = stocks.value.find(s => s.symbol === stockSymbol)?.name || stockSymbol
  const sentiment = analyzeSentiment(title)
  const terms = title.toLowerCase()
  
  // Common impact patterns
  if (terms.includes('acquisition') || terms.includes('merger')) {
    return `${stock} is involved in corporate restructuring activities. This could reshape their market position and competitive dynamics in this region.`
  }
  if (terms.includes('earnings')) {
    return `Financial results announcement for ${stock}. This directly influences investor confidence and stock valuation in this market.`
  }
  if (terms.includes('expansion') || terms.includes('investment')) {
    return `${stock} is pursuing growth initiatives in this region. This strategic move could enhance their market presence and future revenue streams.`
  }
  if (terms.includes('regulation') || terms.includes('policy')) {
    return `Regulatory developments affecting ${stock}'s operations. This could impact compliance requirements and operational costs in this jurisdiction.`
  }
  if (terms.includes('partnership') || terms.includes('deal')) {
    return `${stock} is forming strategic alliances in this region. This could strengthen their market position and technological capabilities.`
  }
  
  // Default analysis with more context
  return sentiment === 'positive' 
    ? `${stock} is experiencing favorable developments in this region. Market indicators suggest potential positive impact on stock value, based on supportive news coverage and regional dynamics.`
    : sentiment === 'negative'
    ? `${stock} faces challenges in this market. Current developments suggest possible headwinds for stock performance, based on concerning factors in regional operations.`
    : `${stock}'s activities in this region show mixed signals. Market impact requires careful monitoring due to complex regional factors and unclear directional indicators.`
}

const fetchStockEvents = async () => {
  if (!selectedStock.value) return
  
  loading.value = true
  try {
    // Clear existing data
    if (globe) {
      globe.hexPolygonsData([])
      globe.polygonsData([])
    }

    const response = await fetch('/api/tavily-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `List recent significant events for ${selectedStock.value} that might impact the stock price. Include location information and country names where these events occurred.`,
        search_depth: 'advanced',
        include_domains: ['reuters.com', 'bloomberg.com', 'wsj.com', 'wikipedia.org', 'companiesmarketcap.com'],
        max_results: 8,
        include_answer: true,
        geography: true
      })
    })

    const data = await response.json()
    const rawEvents = data.results || []
    console.log(`%c📊 Found ${rawEvents.length} relevant events`, 'color: #6366f1; font-weight: 500;')

    const locations = []
    const affectedCountries = new Set()

    console.log('\n%c📍 Processing Locations...', 'color: #dc2626; font-weight: 500;')
    for (const evt of rawEvents) {
      const label = evt.title || 'Untitled Event'
      const importance = calculateImportance(evt.content || '')
      
      // Try extracting location and country
      const locationInfo = await extractLocationWithCountry(evt.title + ' ' + evt.content)
      
      if (locationInfo) {
        locations.push({
          lat: locationInfo.coords.lat,
          lng: locationInfo.coords.lng,
          label: locationInfo.coords.label,
          country: locationInfo.country,
          news: {
            title: label,
            url: evt.url,
            importance
          }
        })
        affectedCountries.add(locationInfo.country)
      }
    }

    // If we have less than 3 locations, add company HQ location for remaining events
    if (locations.length < 3 && companyHQ[selectedStock.value]) {
      const remainingEvents = rawEvents.slice(locations.length)
      const hq = companyHQ[selectedStock.value]
      
      for (let i = 0; i < Math.min(3 - locations.length, remainingEvents.length); i++) {
        const evt = remainingEvents[i]
        locations.push({
          lat: hq.lat,
          lng: hq.lng,
          label: hq.label,
          country: hq.label.split(', ').pop()!, // Extract country from HQ label
          news: {
            title: evt.title || 'Company Update',
            url: evt.url,
            importance: calculateImportance(evt.content || '')
          }
        })
        affectedCountries.add(hq.label.split(', ').pop()!)
      }
    }

    console.log('\n%c📈 Analysis Summary', 'color: #0284c7; font-weight: bold;')
    console.log(`  %c→ Countries Affected: ${Array.from(affectedCountries).join(', ')}`, 'color: #0284c7')
    console.log(`  %c→ Total Locations: ${locations.length}`, 'color: #0284c7')
    console.log('\n')

    highlightEventLocationsAndCountries(locations, Array.from(affectedCountries))
  } catch (error) {
    console.error('%c❌ Error fetching stock events:', 'color: #dc2626; font-weight: bold;', error)
  } finally {
    loading.value = false
  }
}

const fetchCustomEvents = async () => {
  if (!customQuery.value || !selectedStock.value) return
  
  loading.value = true
  try {
    // Clear existing data
    if (globe) {
      globe.hexPolygonsData([])
      globe.polygonsData([])
    }

    const response = await fetch('/api/tavily-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `Analyze how "${customQuery.value}" might impact ${selectedStock.value} stock price. Focus on specific locations and provide a clear analysis of potential positive or negative impact on stock value. Include city and country names where these events occurred.`,
        search_depth: 'advanced',
        include_domains: ['reuters.com', 'bloomberg.com', 'wsj.com', 'wikipedia.org', 'companiesmarketcap.com'],
        max_results: 8,
        include_answer: true,
        geography: true
      })
    })

    const data = await response.json()
    const rawEvents = data.results || []
    
    const locations = []
    const affectedCountries = new Set()
    
    for (const evt of rawEvents) {
      const label = evt.title || 'Untitled Event'
      const importance = calculateImportance(evt.content || '')
      
      // Try extracting location and country
      const locationInfo = await extractLocationWithCountry(evt.title + ' ' + evt.content)
      
      if (locationInfo) {
        locations.push({
          lat: locationInfo.coords.lat,
          lng: locationInfo.coords.lng,
          label: locationInfo.coords.label,
          country: locationInfo.country,
          news: {
            title: label,
            url: evt.url,
            importance
          }
        })
        affectedCountries.add(locationInfo.country)
      }
    }

    // If we have less than 3 locations, add company HQ location for remaining events
    if (locations.length < 3 && companyHQ[selectedStock.value]) {
      const remainingEvents = rawEvents.slice(locations.length)
      const hq = companyHQ[selectedStock.value]
      
      for (let i = 0; i < Math.min(3 - locations.length, remainingEvents.length); i++) {
        const evt = remainingEvents[i]
        locations.push({
          lat: hq.lat,
          lng: hq.lng,
          label: hq.label,
          country: hq.label.split(', ').pop()!, // Extract country from HQ label
          news: {
            title: evt.title || 'Company Update',
            url: evt.url,
            importance: calculateImportance(evt.content || '')
          }
        })
        affectedCountries.add(hq.label.split(', ').pop()!)
      }
    }

    highlightEventLocationsAndCountries(locations, Array.from(affectedCountries))
  } catch (error) {
    console.error('%c❌ Error analyzing custom query:', 'color: #dc2626; font-weight: bold;', error)
  } finally {
    loading.value = false
    customQuery.value = '' // Clear the input after processing
  }
}

const extractLocationWithCountry = async (text: string) => {
  // First try to find explicit city/country mentions using a more robust regex
  const cityCountryPatterns = [
    /in\s+([A-Z][a-zA-Z\s-]+),\s*([A-Z][a-zA-Z\s]+)/i,  // "in Amsterdam, Netherlands"
    /from\s+([A-Z][a-zA-Z\s-]+),\s*([A-Z][a-zA-Z\s]+)/i, // "from Berlin, Germany"
    /at\s+([A-Z][a-zA-Z\s-]+),\s*([A-Z][a-zA-Z\s]+)/i,   // "at Paris, France"
    /([A-Z][a-zA-Z\s-]+)\s*,\s*([A-Z][a-zA-Z\s]+)-based/i // "Amsterdam, Netherlands-based"
  ]

  for (const pattern of cityCountryPatterns) {
    const match = text.match(pattern)
    if (match) {
      const city = match[1].trim()
      const country = match[2].trim()
      
      try {
        // Use structured geocoding query
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?` + 
          `city=${encodeURIComponent(city)}&` +
          `country=${encodeURIComponent(country)}&` +
          `format=json&limit=1`
        )
        const data = await response.json()

        if (data?.[0]) {
          // Verify the returned country matches our expected country
          const verifyResponse = await fetch(
            `https://nominatim.openstreetmap.org/reverse?` +
            `format=json&lat=${data[0].lat}&lon=${data[0].lon}`
          )
          const verifyData = await verifyResponse.json()
          
          if (verifyData.address?.country?.toLowerCase() === country.toLowerCase()) {
            return {
              coords: {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon),
                label: `${city}, ${country}`
              },
              country
            }
          }
        }
      } catch (err) {
        console.error('Error geocoding location:', err)
      }
    }
  }

  // Fallback to coordinate extraction if present
  const coordMatches = text.match(/(-?\d+\.\d+)(?:,\s?)(-?\d+\.\d+)/)
  if (coordMatches) {
    const lat = parseFloat(coordMatches[1])
    const lng = parseFloat(coordMatches[2])
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      )
      const data = await response.json()
      if (data.address?.country) {
        return {
          coords: {
            lat,
            lng,
            label: data.display_name || 'Event Location'
          },
          country: data.address.country
        }
      }
    } catch (err) {
      console.error('Error reverse geocoding:', err)
    }
  }

  return null
}

const calculateImportance = (content: string): number => {
  const impactTerms = {
    high: ['acquisition', 'merger', 'bankruptcy', 'major layoff', 'CEO', 'earnings beat', 'earnings miss'],
    medium: ['expansion', 'new product', 'partnership', 'contract', 'investment'],
    low: ['minor update', 'small change', 'routine maintenance']
  }

  let score = 1

  for (const term of impactTerms.high) {
    if (content.toLowerCase().includes(term)) score += 2
  }
  for (const term of impactTerms.medium) {
    if (content.toLowerCase().includes(term)) score += 1
  }
  for (const term of impactTerms.low) {
    if (content.toLowerCase().includes(term)) score += 0.5
  }

  return Math.min(Math.max(score, 1), 5)
}

const geocodeLocation = async (locationName: string) => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}`)
    const data = await response.json()

    if (data?.[0]) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      }
    }
  } catch (error) {
    console.error('Geocoding error:', error)
  }
  return null
}

const highlightEventLocations = (locations: any[]) => {
  if (!globe) return

  try {
    const points = locations.map(location => ({
      lat: location.lat,
      lng: location.lng,
      weight: location.news?.importance || 1,
      location
    }))

    globe
      .hexBinPointsData(points)
      .hexLabel(d => {
        const location = d.points[0].location
        const sentiment = analyzeSentiment(location.news?.title || '')
        const impact = location.news?.importance || 1
        
        let impactText = 'Potential Impact: '
        if (sentiment === 'positive') {
          impactText += `Likely positive (${impact}/5) - `
        } else if (sentiment === 'negative') {
          impactText += `Likely negative (${impact}/5) - `
        } else {
          impactText += `Neutral (${impact}/5) - `
        }

        return [
          `📍 ${location.label || 'Unknown Location'}`,
          `🌍 ${location.country || 'Unknown Country'}`,
          '',
          impactText,
          generateImpactAnalysis(location.news?.title || '', selectedStock.value)
        ]
          .filter(Boolean)
          .join('\n')
      })
      .hexTopColor(d => {
        const location = d.points[0].location
        if (!location.news) return 'rgba(128,128,128,0.5)'

        const sentiment = analyzeSentiment(location.news.title)
        return getSentimentColor(sentiment, location.news.importance || 1)
      })
      .hexAltitude(d => d.sumWeight * 0.05)

    if (locations.length > 0) {
      globe.pointOfView(
        {
          lat: locations[0].lat,
          lng: locations[0].lng,
          altitude: 2.5
        },
        1000
      )
    }
  } catch (error) {
    console.error('Error highlighting locations:', error)
  }
}

const analyzeSentiment = (text: string): 'positive' | 'negative' | 'neutral' => {
  const positiveTerms = ['rise', 'gain', 'up', 'growth', 'profit', 'success', 'positive']
  const negativeTerms = ['fall', 'drop', 'down', 'loss', 'decline', 'negative', 'concern']

  const textLower = text.toLowerCase()
  const positiveCount = positiveTerms.filter(term => textLower.includes(term)).length
  const negativeCount = negativeTerms.filter(term => textLower.includes(term)).length

  if (positiveCount > negativeCount) return 'positive'
  if (negativeCount > positiveCount) return 'negative'
  return 'neutral'
}

const getSentimentColor = (sentiment: string, weight: number): string => {
  const alpha = 0.4 + weight * 0.12
  switch (sentiment) {
    case 'positive':
      return `rgba(0,${128 + weight * 25},0,${alpha})`
    case 'negative':
      return `rgba(${128 + weight * 25},0,0,${alpha})`
    default:
      return `rgba(${128 + weight * 25},${128 + weight * 25},0,${alpha})`
  }
}

// Example of more specialized processing (optional)
const processNewsEvents = async (results: any[]): Promise<NewsEvent[]> => {
  const events: NewsEvent[] = []

  for (const result of results) {
    try {
      // Extract location from the formatted result
      const locationMatch = result.content.match(/Location:\s*([^|]+)/)
      if (!locationMatch) continue

      const locationText = locationMatch[1].trim()
      const [city, country] = locationText.split(',').map(s => s.trim())

      if (!city || !country) continue

      const coords = await geocodeLocation(`${city}, ${country}`)
      if (!coords || !isValidCoordinate(coords.lat, coords.lng)) continue

      events.push({
        title: result.title,
        url: result.url,
        date: result.published_date || new Date().toISOString(),
        snippet: result.snippet || '',
        importance: calculateImportance(result.title + ' ' + result.snippet),
        location: {
          city,
          country,
          coordinates: coords
        }
      })
    } catch (error) {
      console.error('Error processing event:', error)
    }
  }

  return events
}

const isValidCoordinate = (lat: number, lng: number): boolean => {
  return (
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  )
}

onMounted(async () => {
  if (process.client) {
    try {
      const Globe = (await import('globe.gl')).default
      const { feature } = await import('topojson-client')
      const topology = await fetch(
        'https://unpkg.com/world-atlas/countries-110m.json'
      ).then(res => res.json())

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

  const matchingPolygon = polygons.find(
    polygon => polygon.properties.name === selectedCountry.value
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
      const largestPoly = areas.reduce((a, b) => (a.area > b.area ? a : b))
      center = d3.geoCentroid({
        type: 'Feature',
        geometry: { type: 'Polygon', coordinates: largestPoly.poly }
      })
    }

    if (center) {
      globe.pointOfView(
        {
          lat: center[1],
          lng: center[0],
          altitude: 1.5
        },
        1000
      )
    }
  }
}

const highlightEventLocationsAndCountries = (locations: any[], countries: string[]) => {
  if (!globe) return

  try {
    // Highlight specific locations with hexbins
    const points = locations.map(location => ({
      lat: location.lat,
      lng: location.lng,
      weight: location.news?.importance || 1,
      location
    }))

    // Find matching country polygons
    const countryPolygons = countries
      .map(country => polygons.find(
        polygon => polygon.properties.name === country
      ))
      .filter(Boolean)

    // Set hexbin data for specific locations
    globe
      .hexBinPointsData(points)
      .hexLabel(d => {
        const location = d.points[0].location
        const sentiment = analyzeSentiment(location.news?.title || '')
        const impact = location.news?.importance || 1
        
        let impactText = 'Potential Impact: '
        if (sentiment === 'positive') {
          impactText += `Likely positive (${impact}/5) - `
        } else if (sentiment === 'negative') {
          impactText += `Likely negative (${impact}/5) - `
        } else {
          impactText += `Neutral (${impact}/5) - `
        }

        return [
          `📍 ${location.label || 'Unknown Location'}`,
          `🌍 ${location.country || 'Unknown Country'}`,
          '',
          impactText,
          generateImpactAnalysis(location.news?.title || '', selectedStock.value)
        ]
          .filter(Boolean)
          .join('\n')
      })
      .hexTopColor(d => {
        const location = d.points[0].location
        if (!location.news) return 'rgba(128,128,128,0.5)'
        const sentiment = analyzeSentiment(location.news.title)
        return getSentimentColor(sentiment, location.news.importance || 1)
      })
      .hexAltitude(d => d.sumWeight * 0.05)
      // Add country polygons with same styling as highlightCountry
      .polygonsData(countryPolygons)
      .polygonAltitude(0.01)
      .polygonCapColor(() => 'rgba(200, 200, 200, 0.2)')
      .polygonSideColor(() => 'rgba(0, 100, 200, 0.05)')
      .polygonStrokeColor(() => '#111')

    // If we have locations, adjust view to first one
    if (locations.length > 0) {
      globe.pointOfView(
        {
          lat: locations[0].lat,
          lng: locations[0].lng,
          altitude: 2.5
        },
        1000
      )
    }
  } catch (error) {
    console.error('Error highlighting locations and countries:', error)
  }
}

onUnmounted(() => {
  if (globe && globeContainer.value) {
    if (loadingSprite) {
      globe.scene().remove(loadingSprite)
    }
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
  width: 600px;
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.1);
  padding: 12px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

@keyframes pulse {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 0.4; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>