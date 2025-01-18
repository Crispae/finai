<template>
    <div 
      class="workflow-card relative mb-4 group"
      :class="[collapsed ? 'collapsed' : 'expanded']"
    >
      <div 
        v-if="!isLast" 
        class="absolute left-4 bottom-[-24px] h-6 w-0.5 bg-gray-200 dark:bg-gray-700 z-0"
      />
  
      <div 
        class="relative workflow-card-content rounded-lg border bg-card p-4 shadow-sm transition-all duration-200 hover:shadow-md"
        :class="{ 
          'active-card': isActive,
          'cursor-pointer': true,
          'is-expanded': isExpanded && !collapsed
        }"
        @click="handleCardClick"
      >
        <!-- Header Section - Always Visible -->
        <div class="flex items-start justify-between mb-2">
          <div class="flex items-center">
            <component 
              :is="icon" 
              :class="[
                'h-6 w-6',
                `text-${color}-500`
              ]"
            />
            <div class="ml-3" :class="{ 'hidden': collapsed }">
              <h3 class="font-medium text-sm">{{ title }}</h3>
              <p class="text-xs text-muted-foreground">{{ description }}</p>
            </div>
          </div>
          
          <Badge 
            v-if="status"
            :variant="statusVariant"
            class="ml-2"
            :class="{ 'hidden': collapsed }"
          >
            {{ status }}
          </Badge>
        </div>
  
        <!-- Expandable Content -->
        <div 
          v-if="!collapsed"
          class="expandable-content"
          :class="{ 'hidden': !isExpanded }"
        >
          <!-- Actions -->
          <div class="mt-4 flex flex-wrap gap-2">
            <Button
              v-for="action in actions"
              :key="action.label"
              variant="outline"
              size="sm"
              class="flex items-center"
              @click.stop="action.onClick"
            >
              <component 
                :is="action.icon" 
                class="h-3 w-3 mr-1"
              />
              {{ action.label }}
            </Button>
          </div>
  
          <!-- Progress Bar -->
          <div 
            v-if="progress !== undefined" 
            class="mt-4"
          >
            <div class="flex justify-between text-xs mb-1">
              <span>Progress</span>
              <span>{{ progress }}%</span>
            </div>
            <div class="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                class="h-full rounded-full transition-all duration-300"
                :class="`bg-${color}-500`"
                :style="{ width: `${progress}%` }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { Badge } from '@/components/ui/badge'
  import { Button } from '@/components/ui/button'
  
  interface Action {
    label: string
    icon: any
    onClick: () => void
  }
  
  interface Props {
    collapsed: boolean
    title: string
    description?: string
    icon: any
    color: string
    status?: string
    statusVariant?: 'default' | 'secondary' | 'destructive' | 'outline'
    actions?: Action[]
    progress?: number
    isActive?: boolean
    isLast?: boolean
  }
  
  const props = withDefaults(defineProps<Props>(), {
    description: '',
    status: '',
    statusVariant: 'default',
    actions: () => [],
    progress: undefined,
    isActive: false,
    isLast: false
  })
  
  const emit = defineEmits<{
    (e: 'click'): void
  }>()
  
  const isExpanded = ref(false)
  
  const handleCardClick = () => {
    if (!props.collapsed) {
      isExpanded.value = !isExpanded.value
    }
    emit('click')
  }
  </script>
  
  <style scoped>
  .workflow-card {
    transition: all 0.3s ease;
  }
  
  .workflow-card.collapsed .workflow-card-content {
    padding: 0.75rem;
  }
  
  .active-card {
    border-color: rgb(var(--primary));
    background-color: rgba(var(--primary), 0.05);
  }
  
  .workflow-card-content:hover {
    transform: translateY(-1px);
  }
  
  .collapsed .workflow-card-content {
    width: 48px;
    height: 48px;
  }
  
  .expanded .workflow-card-content {
    width: 100%;
  }
  
  .expandable-content {
    overflow: hidden;
    transition: all 0.3s ease;
  }
  
  .is-expanded {
    background-color: rgba(var(--primary), 0.02);
  }
  
  .hidden {
    display: none;
  }
  
  /* Animation for expandable content */
  .expandable-content {
    max-height: 0;
    opacity: 0;
    transition: max-height 0.3s ease, opacity 0.3s ease;
  }
  
  .is-expanded .expandable-content {
    max-height: 500px; /* Adjust based on your content */
    opacity: 1;
  }
  </style>