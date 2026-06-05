export interface ChatMessage {
  id: string;
  projectId: string;
  senderId: string;
  messageText: string;
  sender: {
    id: string;
    firstName: string;
    lastName?: string;
    roleType?: 'customer' | 'team';
  };
  createdAt: string;
}
