// services/api.ts

const API_BASE_URL = 'http://127.0.0.1:8001/api/v1/conv';

interface ConversationPreview {
    thread_id: string;
    title: string;
    updated_at: string;
    message_count: number;
  }

export const conversationApi = {

  async saveMessages(messages: any[], threadId: string,title: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages,
          thread_id: threadId,
          title: title
        }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error saving messages:', error);
      throw error;
    }
  },

  async getConversation(threadId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/conversations/${threadId}`);
      if (!response.ok) {
        throw new Error('Conversation not found');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching conversation:', error);
      throw error;
    }
  },

  async getAllConversations(): Promise<ConversationPreview[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/conversations`);
      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  },



};