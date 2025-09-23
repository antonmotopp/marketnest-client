import { api } from '@/lib';
import type { IConversation, IMessage } from '@/types';

export const messagesApi = {
  getConversations: async (): Promise<IConversation[]> => {
    const response = await api.get('/messages/conversations');
    return response.data;
  },

  getConversation: async (userId: number): Promise<IMessage[]> => {
    const response = await api.get(`/messages/conversation/${userId}`);
    return response.data;
  },

  sendMessage: async (data: {
    receiver_id: number;
    content: string;
    advertisement_id?: number;
  }): Promise<IMessage> => {
    const response = await api.post('/messages/', data);
    return response.data;
  },

  deleteChat: async (chatId: number): Promise<void> => {
    await api.delete(`/messages/chat/${chatId}`);
  },
};
