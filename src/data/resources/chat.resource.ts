import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuthStore } from '@/core/auth';
import { ChatService } from '../services';
import type { QueryOptions } from '../types';

export function useChatMessages(projectId: string, options?: QueryOptions) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return useQuery({
    queryKey: ['project', projectId, 'chat'],
    queryFn: () => ChatService.getChatMessages(projectId),
    enabled: (options?.enabled ?? true) && isAuthenticated && !!projectId,
    refetchInterval: 5000, // Poll every 5 seconds
    meta: options?.meta,
  });
}

export function useSendChatMessage(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageText: string) =>
      ChatService.sendChatMessage(projectId, messageText),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['project', projectId, 'chat'],
      });
    },
  });
}
