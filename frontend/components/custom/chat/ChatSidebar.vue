<template>

  <div :class="['border-r transition-all duration-300 flex flex-col h-full', 
    'bg-sidebar text-sidebar-text border-sidebar-border',
    sidebarOpen ? 'w-64' : 'w-0 overflow-hidden']">
    
    <button 
      @click="$emit('new-chat')"
      class="m-3 p-3 border rounded-md flex items-center gap-2 border-sidebar-border hover:bg-sidebar-hover shrink-0" 
    >
      <PlusCircle class="w-5 h-5" />
      New Conversation
    </button>

    <div class="flex flex-col flex-grow overflow-hidden"> 

        <div class="px-3 py-2 text-sm text-sidebar-muted shrink-0">Recent conversations</div>
          <div class="overflow-y-auto"> 
                <div v-for="conversation in conversations" :key="conversation.id"
                @click="$emit('select-chat', conversation.id)"
                :class="[
                  'px-3 py-2 cursor-pointer flex items-center gap-2',
                  currentConversationId === conversation.id ? 'bg-sidebar-active' : 'hover:bg-sidebar-hover'
                ]">

                <MessageSquare class="w-4 h-4 shrink-0" />
                <span class="break-words">{{ conversation.title }}</span>
            </div>
          </div>
        </div>


    </div>

</template>

<script setup lang="ts">
import { PlusCircle, MessageSquare } from 'lucide-vue-next'

type Conversation = {
  id: string
  title: string
  createdAt: Date
}

defineProps<{
  conversations: Array<Conversation>
  currentConversationId: string | null
  sidebarOpen: boolean
}>()

defineEmits(['new-chat', 'select-chat'])
</script>