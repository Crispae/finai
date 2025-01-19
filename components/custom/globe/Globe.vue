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

const companyHQ = {
  TSLA: { lat: 30.2246, lng: -97.6047, label: 'Tesla HQ - Austin, TX' },
  AAPL: { lat: 37.3346, lng: -122.0090, label: 'Apple HQ - Cupertino, CA' },
  MSFT: { lat: 47.6423, lng: -122.1391, label: 'Microsoft HQ - Redmond, WA' },
  INTC: { lat: 45.5155, lng: -122.9802, label: 'Intel HQ - Hillsboro, OR' }
}

let globe: any = null
let handleResize: () => void
let polygons: any[] = []
let eventHexagons: any[] = []

const fetchStockEvents = async () => {
  console.log('🔍 Fetching events for stock:', selectedStock.value)
  if (!selectedStock.value) return

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
    console.log('📊 Found raw events:', rawEvents.length)

    const locations = []
    const affectedCountries = new Set()

    for (const evt of rawEvents) {
      const label = evt.title || 'Untitled Event'
      const importance = calculateImportance(evt.content || '')
      let coords = null
      let country = null

      // Try extracting location and country
      const locationInfo = await extractLocationWithCountry(evt.title + ' ' + evt.content)
      
      if (locationInfo) {
        coords = locationInfo.coords
        country = locationInfo.country
        console.log(`📍 Found location: ${locationInfo.coords.label} in ${country}`)
        affectedCountries.add(country)
      } else if (companyHQ[selectedStock.value]) {
        coords = {
          lat: companyHQ[selectedStock.value].lat,
          lng: companyHQ[selectedStock.value].lng,
          label: companyHQ[selectedStock.value].label
        }
        country = 'United States'
        console.log(`🏢 Using HQ location: ${coords.label}`)
        affectedCountries.add(country)
      }

      if (coords) {
        locations.push({
          lat: coords.lat,
          lng: coords.lng,
          label: coords.label || label,
          country,
          news: {
            title: label,
            url: evt.url,
            importance
          }
        })
      }
    }

    console.log('🌍 Affected countries:', Array.from(affectedCountries))
    console.log('📌 Total locations mapped:', locations.length)

    highlightEventLocationsAndCountries(locations, Array.from(affectedCountries))
  } catch (error) {
    console.error('❌ Error fetching stock events:', error)
  }
}

const extractLocationWithCountry = async (text: string) => {
  // First try to find coordinates
  const coordMatches = text.match(/(-?\d+\.\d+)(?:,\s?)(-?\d+\.\d+)/)
  if (coordMatches) {
    const lat = parseFloat(coordMatches[1])
    const lng = parseFloat(coordMatches[2])
    
    // Try to get country name from coordinates using reverse geocoding
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      )
      const data = await response.json()
      return {
        coords: {
          lat,
          lng,
          label: data.display_name || 'Event Location'
        },
        country: data.address?.country || 'Unknown'
      }
    } catch (err) {
      console.error('Error reverse geocoding:', err)
    }
  }

  // Try to extract city and country names
  const cityCountryRegex = /in\s+([A-Z][a-zA-Z]+(?:[\s-][A-Z][a-zA-Z]+)*),?\s*([A-Z][a-zA-Z]+)/
  const match = text.match(cityCountryRegex)
  if (match) {
    const city = match[1]
    const country = match[2]
    try {
      const geocoded = await geocodeLocation(`${city}, ${country}`)
      if (geocoded) {
        return {
          coords: {
            lat: geocoded.lat,
            lng: geocoded.lng,
            label: `${city}, ${country}`
          },
          country
        }
      }
    } catch (err) {
      console.error('Error geocoding location:', err)
    }
  }

  // If no location found in text, return null
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
        return [
          `📍 ${location.label || 'Unknown Location'}`,
          '',
          location.news
            ? [
                `📰 ${location.news.title}`,
                '',
                `💡 Impact: ${location.news.importance}/5`,
                location.news.url ? `🔗 ${location.news.url}` : ''
              ].join('\n')
            : 'No news available'
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
        return [
          `📍 ${location.label || 'Unknown Location'}`,
          `🌍 ${location.country || 'Unknown Country'}`,
          '',
          location.news
            ? [
                `📰 ${location.news.title}`,
                '',
                `💡 Impact: ${location.news.importance}/5`,
                location.news.url ? `🔗 ${location.news.url}` : ''
              ].join('\n')
            : 'No news available'
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