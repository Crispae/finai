<template>
    <div class="p-6 space-y-6">
      <h3 class="text-lg font-medium">LLM Configuration</h3>
      
      <div class="space-y-2">
        <Label class="text-sm font-medium">Active Model</Label>
        <Select v-model="modelValue.selectedModel" @update:modelValue="handleModelChange">
          <SelectTrigger class="w-full">
            <SelectValue placeholder="Select LLM Model" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup v-for="group in MODEL_GROUPS" :key="group.label">
              <SelectLabel>{{ group.label }}</SelectLabel>
              <SelectItem v-for="model in group.models" :key="model.id" :value="model.id">
                <div class="flex items-center justify-between w-full pr-4">
                  <span>{{ model.name }}</span>
                  <Badge :variant="model.status === 'stable' ? 'default' : 'secondary'" class="ml-2">
                    {{ model.status }}
                  </Badge>
                </div>
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
  
      <template v-if="modelValue.selectedModel">
        <div class="space-y-6 pt-4 border-t">
          <!-- API Key -->
          <div class="space-y-2">
            <Label class="text-sm font-medium">API Key</Label>
            <div class="flex space-x-2">
              <Input
                :type="hideApiKey ? 'password' : 'text'"
                v-model="modelValue.apiKey"
                placeholder="Enter API key"
                class="flex-1"
              />
              <Button variant="outline" size="icon" @click="hideApiKey = !hideApiKey">
                <component :is="hideApiKey ? Eye : EyeOff" class="h-4 w-4" />
              </Button>
            </div>
          </div>
  
          <!-- Temperature -->
          <div class="space-y-2">
            <div class="flex justify-between">
              <Label class="text-sm font-medium">Temperature</Label>
              <span class="text-sm text-muted-foreground">
                {{ modelValue.temperature.toFixed(1) }}
              </span>
            </div>
            <Slider
              v-model="modelValue.temperature"
              :min="0"
              :max="2"
              :step="0.1"
              class="w-full"
            />
            <p class="text-xs text-muted-foreground">
              Controls randomness: Lower values are more focused, higher values more creative
            </p>
          </div>
  
          <!-- Max Tokens -->
          <div class="space-y-2">
            <Label class="text-sm font-medium">Max Tokens</Label>
            <Input 
              type="number"
              v-model="modelValue.maxTokens"
              :min="1"
              :max="maxTokensLimit"
            />
            <p class="text-xs text-muted-foreground">
              Maximum: {{ maxTokensLimit.toLocaleString() }} tokens
            </p>
          </div>
  
          <!-- Top P -->
          <div class="space-y-2">
            <div class="flex justify-between">
              <Label class="text-sm font-medium">Top P</Label>
              <span class="text-sm text-muted-foreground">
                {{ modelValue.topP.toFixed(1) }}
              </span>
            </div>
            <Slider
              v-model="modelValue.topP"
              :min="0"
              :max="1"
              :step="0.1"
              class="w-full"
            />
            <p class="text-xs text-muted-foreground">
              Controls output diversity: Lower values are more focused
            </p>
          </div>
  
          <Button 
            class="w-full mt-6" 
            :disabled="!isValid"
            @click="$emit('save')"
          >
            Save Configuration
          </Button>
        </div>
      </template>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  import { Eye, EyeOff } from 'lucide-vue-next';
  import { MODEL_GROUPS } from './constants';
  import type { Settings } from './types';
  
  const props = defineProps<{
    modelValue: Settings;
  }>();
  
  const emit = defineEmits<{
    (e: 'update:modelValue', value: Settings): void;
    (e: 'save'): void;
  }>();
  
  const hideApiKey = ref(true);
  
  const maxTokensLimit = computed(() => {
    return MODEL_GROUPS
      .flatMap(group => group.models)
      .find(model => model.id === props.modelValue.selectedModel)?.maxTokens ?? 0;
  });
  
  const isValid = computed(() => {
    return props.modelValue.selectedModel && 
      props.modelValue.apiKey && 
      props.modelValue.maxTokens > 0 && 
      props.modelValue.maxTokens <= maxTokensLimit.value;
  });
  
  const handleModelChange = (modelId: string) => {
    const model = MODEL_GROUPS
      .flatMap(group => group.models)
      .find(model => model.id === modelId);
    
    if (model) {
      emit('update:modelValue', {
        ...props.modelValue,
        selectedModel: modelId,
        maxTokens: Math.min(props.modelValue.maxTokens, model.maxTokens),
      });
    }
  };
  </script>