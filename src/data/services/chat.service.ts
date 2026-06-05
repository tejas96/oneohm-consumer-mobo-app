import { api, API_ENDPOINTS } from '@/core/api';
import type { ChatMessage } from '../types/chat.types';

async function getChatMessages(projectId: string): Promise<ChatMessage[]> {
  return api.get<ChatMessage[]>(API_ENDPOINTS.PROJECTS.CHAT(projectId));
}

async function sendChatMessage(
  projectId: string,
  messageText: string,
): Promise<ChatMessage> {
  return api.post<ChatMessage>(API_ENDPOINTS.PROJECTS.CHAT(projectId), {
    messageText,
  });
}

export const ChatService = {
  getChatMessages,
  sendChatMessage,
};
