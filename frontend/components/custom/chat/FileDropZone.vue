<template>
    <div 
      v-if="modelValue.length > 0 || isDragging"
      class="mb-4 border-2 border-dashed border-main-border rounded-lg p-4"
      @dragenter.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @dragover.prevent
      @drop.prevent="handleDrop"
    >
      <div v-if="modelValue.length === 0" class="text-center text-main-muted">
        Drop files here
      </div>
      <div v-else class="flex flex-wrap gap-2">
        <div 
          v-for="file in modelValue" 
          :key="file.name"
          class="bg-main-hover px-3 py-1 rounded-md text-sm flex items-center gap-2"
        >
          <FileText class="w-4 h-4" />
          <span>{{ file.name }}</span>
          <button @click="removeFile(file)" class="text-main-muted hover:text-main-text">
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { FileText, X } from 'lucide-vue-next'
  
  const props = defineProps<{
    modelValue: File[]
  }>()
  
  const emit = defineEmits(['update:modelValue'])
  
  const isDragging = ref(false)
  
  const handleDrop = (event: DragEvent) => {
    isDragging.value = false
    if (event.dataTransfer) {
      const newFiles = Array.from(event.dataTransfer.files)
      emit('update:modelValue', [...props.modelValue, ...newFiles])
    }
  }
  
  const removeFile = (fileToRemove: File) => {
    emit('update:modelValue', props.modelValue.filter(file => file !== fileToRemove))
  }
  </script>