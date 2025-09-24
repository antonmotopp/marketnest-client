import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messagesApi } from '@/api';
import { useAuthStore } from '@/stores';
import { ChatHeader, MessageInput, MessagesList } from '@/components/features/messages';
import { useEffect } from 'react';
import type { IMessage } from '@/types';
import { useUser } from '@/hooks';

type Params = {
  userId: string;
};

export const Chat = () => {
  const { userId } = useParams<Params>();
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const { data: otherUser } = useUser(userId);

  const {
    data: messages,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['conversation', userId],
    queryFn: () => messagesApi.getConversation(Number(userId!)),
    enabled: !!userId,
  });

  useEffect(() => {
    if (!currentUser) return;

    const wsUrl = `wss://marketnest-gfmk.onrender.com/chat/ws/${currentUser.id}`;
    console.log('Connecting to WebSocket:', wsUrl);

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      console.log('WebSocket message received:', event.data);
      const data = JSON.parse(event.data);
      if (data.type === 'new_message') {
        console.log('New message data:', data.message);
        queryClient.setQueryData(['conversation', userId], (oldData: IMessage[]) => {
          console.log('Old data:', oldData);
          const newData = [...(oldData || []), data.message];
          console.log('New data:', newData);
          return newData;
        });
      }
    };

    ws.onclose = (event) => {
      console.log('WebSocket closed:', event.code, event.reason);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      console.log('Closing WebSocket');
      ws.close();
    };
  }, [currentUser, userId, queryClient]);

  // useEffect(() => {
  //   if (!currentUser) return;
  //   const ws = new WebSocket(`wss://marketnest-gfmk.onrender.com/chat/ws/${currentUser.id}`);
  //
  //   ws.onmessage = (event) => {
  //     const data = JSON.parse(event.data);
  //     if (data.type === 'new_message') {
  //       queryClient.setQueryData(['conversation', userId], (oldData: IMessage[]) => [
  //         ...oldData,
  //         data.message,
  //       ]);
  //     }
  //   };
  //
  //   return () => ws.close();
  // }, [currentUser, currentUser?.id, queryClient, userId]);

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
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex flex-col">
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4">
          <div className="max-w-4xl mx-auto flex items-center">
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse mr-3"></div>
            <div className="space-y-2">
              <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-20 h-3 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Loading Messages */}
        <div className="flex-1 max-w-4xl mx-auto w-full p-4">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className={`flex ${item % 2 === 0 ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs ${item % 2 === 0 ? 'bg-blue-100' : 'bg-gray-100'} rounded-2xl p-3 animate-pulse`}
                >
                  <div className="w-32 h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="w-20 h-3 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="w-full h-12 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-3xl shadow-xl p-12 max-w-md mx-4 border border-red-100">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Conversation Not Found</h2>
          <p className="text-gray-600 mb-6">
            This conversation doesn't exist or you don't have permission to view it.
          </p>
          <div className="space-y-3">
            <button
              onClick={handleBack}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
            >
              Back to Messages
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Browse Listings
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!userId || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-white rounded-3xl shadow-xl p-12 max-w-md mx-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please log in to access your conversations.</p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/login')}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="backdrop-blur-sm  border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          {otherUser && <ChatHeader otherUser={otherUser} onBack={handleBack} />}
        </div>
      </div>

      <div className="flex-1 overflow-scroll max-h-96 max-w-4xl m-auto min-w-[896px]">
        <div className=" mx-auto h-full">
          <MessagesList messages={messages || []} currentUserId={currentUser.id} />
        </div>
      </div>

      <div className="">
        <div className="max-w-4xl mx-auto">
          <MessageInput
            onSendMessage={handleSendMessage}
            isLoading={sendMessageMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
};
