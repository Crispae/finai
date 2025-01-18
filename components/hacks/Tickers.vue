<template>
    <div class="flex flex-col gap-3 p-4">
      <Card v-for="stock in stocks" :key="stock.symbol" class="hover:shadow-md transition-shadow">
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <div class="flex flex-col space-y-1.5">
            <CardTitle class="text-xl">{{ stock.name }}</CardTitle>
            <CardDescription class="text-sm text-muted-foreground">
              {{ stock.symbol }}
            </CardDescription>
          </div>
          <div class="h-12 w-12">
            <img :src="stock.logo" :alt="stock.name" class="object-contain h-full w-full" />
          </div>
        </CardHeader>
        <CardContent>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-2xl font-bold">${{ stock.price.toFixed(2) }}</span>
              <Badge :variant="stock.change >= 0 ? 'success' : 'destructive'" class="ml-2">
                <span v-if="stock.change >= 0">↑</span>
                <span v-else>↓</span>
                {{ Math.abs(stock.change) }}%
              </Badge>
            </div>
            <div class="flex flex-col items-end text-sm text-muted-foreground">
              <span>Volume: {{ formatNumber(stock.volume) }}</span>
              <span>Market Cap: ${{ formatNumber(stock.marketCap) }}B</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
  import { Badge } from '@/components/ui/badge'
  
  interface Stock {
    symbol: string
    name: string
    logo: string
    price: number
    change: number
    volume: number
    marketCap: number
  }
  
  const stocks = ref<Stock[]>([
    {
      symbol: 'TSLA',
      name: 'Tesla, Inc.',
      logo: '/company-logos/tesla.svg', // Add your logo paths
      price: 238.45,
      change: 2.5,
      volume: 23456789,
      marketCap: 756.4
    },
    {
      symbol: 'INTC',
      name: 'Intel Corporation',
      logo: '/company-logos/intel.svg',
      price: 44.32,
      change: -1.2,
      volume: 15678901,
      marketCap: 186.2
    },
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      logo: '/company-logos/apple.svg',
      price: 189.71,
      change: 1.8,
      volume: 45678912,
      marketCap: 2950.8
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      logo: '/company-logos/microsoft.svg',
      price: 378.85,
      change: 0.5,
      volume: 34567890,
      marketCap: 2820.3
    },
  ])
  
  // Utility function to format large numbers
  const formatNumber = (num: number): string => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + 'B'
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }
  </script>
  
  <style scoped>
  .success {
    @apply bg-green-100 text-green-800 hover:bg-green-200/80;
  }
  
  .destructive {
    @apply bg-red-100 text-red-800 hover:bg-red-200/80;
  }
  </style>