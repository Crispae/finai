<template>
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="show" class="fixed inset-0 z-50" v-click-outside="onClose">

          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="onClose"></div>
          <div class="fixed inset-0 flex items-center justify-center">
            <div class="bg-white rounded-lg p-6 w-96 shadow-lg relative" @click.stop>
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-semibold">Create New Project</h2>
                <Button variant="ghost" size="icon" @click="onClose">
                  <X class="h-4 w-4" />
                </Button>
              </div>
  
              <form @submit.prevent="handleSubmit" class="space-y-4">
                <div class="space-y-2">
                  <Label for="projectName">Project Name</Label>
                  <Input
                    id="projectName"
                    v-model="projectName"
                    placeholder="Enter project name"
                    class="w-full"
                    :class="{ 'border-red-500': nameError }"
                    @focus="nameError = false"
                  />
                  <span v-if="nameError" class="text-red-500 text-sm">
                    Project name is required
                  </span>
                </div>
  
                <div class="space-y-2">
                  <Label for="projectDescription">Description (Optional)</Label>
                  <Textarea
                    id="projectDescription"
                    v-model="projectDescription"
                    placeholder="Enter project description"
                    rows="3"
                    class="w-full"
                  />
                </div>
  
                <div class="space-y-2">
                  <Label for="directoryPath">Directory Path</Label>
                  <Input
                    id="directoryPath"
                    v-model="directoryPath"
                    placeholder="C:\Projects\MyProject"
                    class="w-full"
                    :class="{ 'border-red-500': pathError }"
                    @focus="pathError = false"
                  />
                  <span v-if="pathError" class="text-red-500 text-sm">
                    Please enter a valid directory path
                  </span>
                </div>
  
                <div class="space-y-2">
                  <Label for="githubRepo">GitHub Repository URL (Optional)</Label>
                  <Input
                    id="githubRepo"
                    v-model="githubRepo"
                    placeholder="https://github.com/username/repository"
                    class="w-full"
                    :class="{ 'border-red-500': repoError }"
                    @focus="repoError = false"
                  />
                  <span v-if="repoError" class="text-red-500 text-sm">
                    Please enter a valid GitHub repository URL
                  </span>
                </div>
  
                <div class="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" @click="onClose">
                    Cancel
                  </Button>
                  <Button type="submit" :disabled="isSubmitting">
                    {{ isSubmitting ? 'Creating...' : 'Create Project' }}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { X } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'
  import { Input } from '@/components/ui/input'
  import { Textarea } from '@/components/ui/textarea'
  import { Label } from '@/components/ui/label'
  
  const props = defineProps<{
    show: boolean
    isSubmitting: boolean
  }>()
  
  const emit = defineEmits<{
    (e: 'close'): void
    (e: 'submit', name: string, description: string, path: string, githubUrl: string): void
  }>()
  
  const projectName = ref('')
  const projectDescription = ref('')
  const directoryPath = ref('')
  const githubRepo = ref('')
  const nameError = ref(false)
  const pathError = ref(false)
  const repoError = ref(false)
  
  const validatePath = (path: string): boolean => {
    const windowsPathRegex = /^[a-zA-Z]:\\(?:[^\\/:*?"<>|\r\n]+\\)*[^\\/:*?"<>|\r\n]*$/
    return windowsPathRegex.test(path)
  }
  
  const validateGithubUrl = (url: string): boolean => {
    if (!url) return true // Optional field
    const githubRegex = /^https:\/\/github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-._]+$/
    return githubRegex.test(url)
  }
  
  const onClose = () => {
    emit('close')
    projectName.value = ''
    projectDescription.value = ''
    directoryPath.value = ''
    githubRepo.value = ''
    nameError.value = false
    pathError.value = false
    repoError.value = false
  }
  
  const handleSubmit = () => {
    nameError.value = !projectName.value.trim()
    pathError.value = !validatePath(directoryPath.value)
    repoError.value = !validateGithubUrl(githubRepo.value)
  
    if (nameError.value || pathError.value || repoError.value) {
      return
    }
  
    emit('submit', projectName.value, projectDescription.value, directoryPath.value, githubRepo.value)
  }
  </script>