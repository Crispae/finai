// composables/useChat.ts
import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { conversationApi } from '~/services/conversationAPI'
import { useToast } from '~/components/ui/toast'

interface Message {
  id: number
  conversationId: string // Reference to conversation UUID
  role: 'assistant' | 'user'
  content: string
  files?: File[]
  timestamp?: Date
}

interface Conversation {
  id: string // UUID for conversation
  title: string
  createdAt: Date
}

export function useChat() {
  const currentConversationId = ref<string | null>(null)
  const messages = ref<Message[]>([])
  const conversations = ref<Conversation[]>([])
  const { toast } = useToast()
  
  const currentMessages = computed(() => 
    messages.value.filter(msg => msg.conversationId === currentConversationId.value)
  )

  const startNewChat = async () => {
    
    const newConversationId = uuidv4()
    
    conversations.value.push({
      id: newConversationId,
      title: 'New Conversation', // Title should be based on conversestion
      createdAt: new Date()
    })

    currentConversationId.value = newConversationId
    messages.value = messages.value.filter(m => m.conversationId !== newConversationId)
    
    //return newConversationId
  }

  const selectChat = async (conversationId: string) => {
    currentConversationId.value = conversationId
    
    try {
        const conversation = await conversationApi.getConversation(conversationId)
        
        if (conversation && conversation.messages) 
        {

          // Convert backend messages to frontend format
            messages.value = conversation.messages.map((msg: any, index: number) => ({
            id: index + 1,
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.content,
            conversationId: conversation.thread_id,
            timestamp: new Date(msg.timestamp)
          }))
        }
        } catch (error) {
            console.error('Error loading conversation:', error)
        }
  }

  // Saving messages to the database
  const saveMessages = async (newMessages: any[]) => {
    if (currentConversationId.value) {
      try {
        // Find the first user message to use as title
        const firstUserMessage = newMessages.find(msg => msg.role === 'user')
        const title = firstUserMessage 
          ? firstUserMessage.content.slice(0, 50) + (firstUserMessage.content.length > 50 ? '...' : '')
          : 'New Conversation'
  
        // Convert frontend messages to backend format
        const messagesToSave = newMessages.map(msg => ({
          content: msg.content,
          type: msg.role === 'user' ? 'user' : 'assistant',
          timestamp: new Date().toISOString(),
          thread_id: currentConversationId.value
        }))
        
        // Update local conversation title
        const conversationIndex = conversations.value.findIndex(
          conv => conv.id === currentConversationId.value
        )
        if (conversationIndex !== -1) {
          conversations.value[conversationIndex].title = title
        }
  
        // Save to backend with title
        await conversationApi.saveMessages(
          messagesToSave, 
          currentConversationId.value,
          title
        )
      } catch (error) {
        console.error('Error saving messages:', error)
      }
    }
  }

  // Loading conversations from the datbase
  const loadConversations = async () => {
    try {
      const convList = await conversationApi.getAllConversations();
      conversations.value = convList.map(conv => ({
        id: conv.thread_id,
        title: conv.title,
        createdAt: new Date(conv.updated_at),
      }));
    } catch (error:any) {
        toast({
            variant: "destructive",
            title: "Error",
            description: `Failed to load conversations: ${error.message}`,
          })
    }
  }

 
  return {
    currentConversationId, // persistant in database
    messages,
    conversations,
    currentMessages,
    startNewChat,
    selectChat,
    saveMessages,
    loadConversations
  }
}