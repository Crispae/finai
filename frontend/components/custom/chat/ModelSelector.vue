<!-- components/ModelSelector.vue -->
<template>
  <div class="relative" v-click-outside="closeDropdown">
    <!-- Selected Model Button -->
    <button
      @click="toggleDropdown"
      class="flex items-center gap-2 p-1.5 px-2 rounded-md hover:bg-main-hover text-main-text border border-main-border text-sm min-w-[160px] justify-between"
    >
      <div class="flex items-center gap-2 truncate">
        <img 
          :src="currentProvider.logo" 
          :alt="currentProvider.name"
          class="w-4 h-4 object-contain flex-shrink-0" 
        />
        <span class="truncate">{{ currentModel.name }}</span>
      </div>
      <ChevronDown 
        class="w-3 h-3 transition-transform duration-200 flex-shrink-0" 
        :class="{ 'transform rotate-180': isDropdownOpen }" 
      />
    </button>

    <!-- Dropdown -->
    <div
      v-if="isDropdownOpen"
      class="absolute top-full left-0 mt-1 w-[320px] bg-main border border-main-border rounded-lg shadow-lg z-50"
    >
      <!-- Search -->
      <div class="p-1.5 border-b border-main-border">
        <div class="relative">
          <Search class="w-3 h-3 absolute left-2 top-1/2 transform -translate-y-1/2 text-main-muted" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search models..."
            class="w-full pl-7 p-1.5 rounded-md border border-main-border bg-main text-main-text placeholder-main-muted text-xs focus:ring-1 focus:ring-accent/30 focus:border-accent/60"
          />
        </div>
      </div>

      <!-- Models list -->
      <div class="max-h-[280px] overflow-y-auto py-1.5">
        <div v-for="provider in filteredProviders" :key="provider.id" class="mb-2 last:mb-0 px-1.5">
          <!-- Provider header -->
          <div class="flex items-center gap-2 mb-1 px-1">
            <img 
              :src="provider.logo" 
              :alt="provider.name"
              class="w-3.5 h-3.5 object-contain" 
            />
            <h3 class="text-[11px] font-medium text-main-text/80">{{ provider.name }}</h3>
          </div>

          <!-- Provider models horizontal scroll -->
          <div class="relative">
            <!-- Scrollable container -->
            <div 
              :ref="el => scrollContainers[provider.id] = el"
              class="flex gap-1 overflow-x-auto hide-scrollbar scroll-smooth"
            >
              <div 
                v-for="model in filteredModelsByProvider(provider.id)" 
                :key="model.id"
                @click="selectModel(model)"
                :class="[
                  'flex-shrink-0 w-[140px] cursor-pointer rounded-md border p-1.5 transition-all duration-200 hover:shadow-sm relative overflow-hidden',
                  currentModel.id === model.id 
                    ? 'border-accent/40 bg-accent/5 hover:bg-accent/10' 
                    : 'border-main-border hover:border-main-muted hover:bg-main-hover'
                ]"
              >
                <!-- Selection indicator -->
                <div 
                  v-if="currentModel.id === model.id"
                  class="absolute right-0 top-0 w-4 h-4 bg-accent/20 backdrop-blur-sm flex items-center justify-center"
                >
                  <Check class="w-2.5 h-2.5 text-accent" />
                </div>

                <div class="flex flex-col h-full">
                  <div class="font-medium text-main-text text-xs mb-0.5">{{ model.name }}</div>
                  <div class="text-[10px] text-main-muted/90 line-clamp-2 mb-1">{{ model.description }}</div>
                  <div class="flex items-center gap-1 text-[10px] text-main-muted mt-auto">
                    <Cpu class="w-2.5 h-2.5" />
                    <span>{{ formatTokens(model.maxTokens) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronDown, Check, Search, Cpu } from 'lucide-vue-next'
import { providers, models } from '~/config/llms'
import type { LLMModel } from '~/types/llm'

const props = defineProps<{
  modelId?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelId', value: string): void
  (e: 'change', model: LLMModel): void
}>()

// State
const isDropdownOpen = ref(false)
const searchQuery = ref('')
const currentModel = ref(
  models.find(m => m.id === props.modelId) || 
  models.find(m => m.isDefault) || 
  models[0]
)

const scrollContainers = ref<{ [key: string]: HTMLElement | null }>({})

// Computed
const currentProvider = computed(() => 
  providers.find(p => p.id === currentModel.value.providerId)!
)

const filteredProviders = computed(() => {
  if (!searchQuery.value) return providers
  
  const query = searchQuery.value.toLowerCase()
  return providers.filter(provider => {
    const providerModels = models.filter(m => m.providerId === provider.id)
    return provider.name.toLowerCase().includes(query) ||
           providerModels.some(model => 
             model.name.toLowerCase().includes(query) ||
             model.description.toLowerCase().includes(query)
           )
  })
})


console.log('filteredProviders', filteredProviders.value)

// Methods
const formatTokens = (tokens: number) => {
  return tokens >= 1000 
    ? `${(tokens / 1000).toFixed(0)}K` 
    : tokens.toString()
}

const filteredModelsByProvider = (providerId: string) => {
  const query = searchQuery.value.toLowerCase()
  return models
    .filter(model => model.providerId === providerId)
    .filter(model =>
      !query ||
      model.name.toLowerCase().includes(query) ||
      model.description.toLowerCase().includes(query)
    )
}

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

const selectModel = (model: LLMModel) => {
  currentModel.value = model
  isDropdownOpen.value = false
  emit('update:modelId', model.id)
  emit('change', model)
}
</script>


<style scoped>
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Glass effect for selected model */
.bg-accent\/5 {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* Smooth transitions */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>