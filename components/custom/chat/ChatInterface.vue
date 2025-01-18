<template>
  
    <div class="chat-interface flex flex-col h-full">
    
      <div class="flex flex-1 min-h-0">

        <ChatSidebar
          :conversations="conversations"
          :currentConversationId="currentConversationId"
          :sidebarOpen="sidebarOpen"
          @new-chat="startNewChat"
          @select-chat="selectChat"
        />
        
        <div class="flex-1 flex flex-col bg-main min-w-0">
          
          <ChatHeader
            :sidebarOpen="sidebarOpen"
            :currentModelId="currentModelId"
            @toggle-sidebar="toggleSidebar"
            @change-model="handleModelChange"
          />
          

          <ChatMessages
            :messages="currentMessages"
            :isLoading="isLoading"
            ref="chatContainer"
          />
          

          <ChatInput
            v-model="messageInput"
            :isLoading="isLoading"
            @send="sendMessage"
          />


        </div>

      </div>

    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'
  
  // hooks
  import { useChat } from '~/composables/useChat'
  import { useFiles } from '~/composables/useFiles'
  import { useStreamingResponse } from '~/composables/useStreamingResponse'
  import { useToast } from '@/components/ui/toast/use-toast'
  import { Toaster } from '@/components/ui/toast'


  
  // Components
  import ChatSidebar from './ChatSidebar.vue'
  import ChatHeader from './ChatHeader.vue'
  import ChatMessages from './ChatMessages.vue'
  import ChatInput from './ChatInput.vue'
  
  const { toast } = useToast()
  const messageInput = ref('')
  const sidebarOpen = ref(true)
  const currentModelId = ref('')
  const chatContainer = ref<HTMLElement | null>(null)
  
  const { currentConversationId,
          messages,
          conversations,
          currentMessages,
          startNewChat,
          selectChat,
          saveMessages,
          loadConversations
        } = useChat()
  
  const {
    files,
    isDragging,
    handleFileDrop,
    removeFile
  } = useFiles()
  
  const { isLoading, handleStreamingResponse } = useStreamingResponse()
  
  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
  }
  
  const handleModelChange = (model: any) => {
    currentModelId.value = model.id
    emit('change-model', model)
  }
  
  // Send messages to the backend 
  const sendMessage = async () => {
  if (messageInput.value.trim() && !isLoading.value && currentConversationId.value) {
    isLoading.value = true
    
    // Add user message
    const newMessage = {
      id: messages.value.length + 1,
      conversationId: currentConversationId.value,
      role: 'user' as const,
      content: messageInput.value,
      files: [...files.value],
      timestamp: new Date()
    }

    messages.value.push(newMessage)
    
    messageInput.value = ''
    files.value = []
    
    try {
      const response = await fetch('http://127.0.0.1:8001/api/v1/agent/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify({
          user_input: newMessage.content,
          current_state:  'research',
          thread_id: currentConversationId.value // Using conversation UUID here
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          errorData.error?.message || 
          `HTTP error! status: ${response.status}`
        )
      }

      // Add assistant message placeholder
      const assistantMessage = {
        id: messages.value.length + 1,
        conversationId: currentConversationId.value,
        role: 'assistant' as const,
        content: '',
        timestamp: new Date()
      }

      messages.value.push(assistantMessage)

      await handleStreamingResponse(
        response,
        (content) => {
          assistantMessage.content += content
          messages.value = [...messages.value]
        },
        (error) => {
          const errorMessage = `Error: ${error}`
          assistantMessage.content = errorMessage
          messages.value = [...messages.value]
          messages.value = [...messages.value]


          toast({
            variant: "destructive",
            title: "Error",
            description: errorMessage,
          })



        }
      )

      // Save both messages in the backend
      await saveMessages([newMessage, assistantMessage])




    } catch (error:any) {
      console.error('Error in sendMessage:', error)

      let errorMessage = 'Sorry, there was an error processing your request.'
      if (error.message) {
        errorMessage = error.message
      }
      
      // Show error in toast
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      })


      // Add error message to chat
      messages.value.push({
        id: messages.value.length + 1,
        conversationId: currentConversationId.value,
        role: 'assistant' as const,
        content: errorMessage,
        timestamp: new Date()
      })
    } finally {
      isLoading.value = false
    }
  }
}
  
  const emit = defineEmits(['change-model'])
  
  // Initialize first conversation if none exists
  onMounted(async () => {
  await loadConversations(); // Load conversesation will be linked to workspace
  if (conversations.value.length === 0) {
    await startNewChat()
  } else if (currentConversationId.value){
    await selectChat(currentConversationId.value)
  }else{

    await startNewChat()

  }

})

  // Scroll to latest chat
  onMounted(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
  
  //
  onUnmounted(() => {
    isLoading.value = false
  })

  </script>

<style scoped>
/* Styles remain the same */
.chat-interface {
  display: flex;
  flex-direction: column;
}

.prose {
  font-size: 1rem;
  line-height: 1.5;
}

textarea {
  min-height: 44px;
  max-height: 200px;
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.7);
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>