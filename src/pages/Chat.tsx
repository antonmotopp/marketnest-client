import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messagesApi } from '@/api';
import { useAuthStore } from '@/stores';
import { ChatHeader, MessageInput, MessagesList } from '@/components/features/messages';
import { useEffect } from 'react';
import type { IMessage } from '@/types';

type Params = {
  userId: string;
};

export const Chat = () => {
  const { userId } = useParams<Params>();
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery({
    queryKey: ['conversation', userId],
    queryFn: () => messagesApi.getConversation(Number(userId!)),
    enabled: !!userId,
  });

  useEffect(() => {
    if (!currentUser) return;
    const ws = new WebSocket(`ws://localhost:8000/chat/ws/${currentUser.id}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'new_message') {
        queryClient.setQueryData(['conversation', userId], (oldData: IMessage[]) => [
          ...oldData,
          data.message,
        ]);
      }
    };

    return () => ws.close();
  }, [currentUser, currentUser?.id, queryClient, userId]);

  const sendMessageMutation = useMutation({
    mutationFn: messagesApi.sendMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversation', userId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });

  const handleSendMessage = (content: string) => {
    if (!userId) return;

    sendMessageMutation.mutate({
      receiver_id: Number(userId),
      content,
    });
  };

  const handleBack = () => {
    navigate('/messages');
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading conversation...</div>;
  }

  if (!userId || !currentUser) {
    return <div className="flex justify-center p-8">Invalid conversation</div>;
  }

  return (
    <div className="flex flex-col mx-auto w-full">
      <ChatHeader otherUserId={userId} onBack={handleBack} />

      <MessagesList messages={messages || []} currentUserId={currentUser.id} />

      <MessageInput onSendMessage={handleSendMessage} isLoading={sendMessageMutation.isPending} />
    </div>
  );
};
