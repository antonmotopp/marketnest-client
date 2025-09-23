import { useMutation, useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { messagesApi } from '@/api';
import { formatDate } from '@/utils';
import type { IConversation } from '@/types';
import { queryClient } from '@/lib';

export const Messages = () => {
  const {
    data: conversations,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['conversations'],
    queryFn: messagesApi.getConversations,
  });

  const deleteChatMutation = useMutation({
    mutationFn: messagesApi.deleteChat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });

  const handleDeleteChat = (e: React.MouseEvent, chatId: number, username: string) => {
    e.preventDefault(); // Не переходити на чат
    if (window.confirm(`Delete conversation with ${username}? This action cannot be undone.`)) {
      deleteChatMutation.mutate(chatId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg">Loading conversations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        Error loading conversations. Please try again later.
      </div>
    );
  }

  return (
    <div className="max-w-4xl w-full mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Messages</h1>
        <div className="text-sm text-gray-500">
          {conversations?.length || 0} conversation{conversations?.length !== 1 ? 's' : ''}
        </div>
      </div>

      {conversations?.length ? (
        <div className="space-y-3">
          {conversations.map((conversation: IConversation) => (
            <Link
              key={conversation.other_user_id}
              to={`/messages/${conversation.other_user_id}`}
              className="group block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {conversation.other_username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-medium text-gray-900">{conversation.other_username}</h3>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">
                    {formatDate(conversation.last_message_time).formatted}{' '}
                    {formatDate(conversation.last_message_time).time}
                  </span>

                  <button
                    onClick={(e) =>
                      handleDeleteChat(e, conversation.chat_id, conversation.other_username)
                    }
                    disabled={deleteChatMutation.isPending}
                    className="p-1 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                    title={`Delete conversation with ${conversation.other_username}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-600 truncate pl-13">{conversation.last_message}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <div className="max-w-sm mx-auto">
            <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.456l-3.463 1.227a1 1 0 01-1.228-1.228l1.227-3.463A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"
                />
              </svg>
            </div>

            <h3 className="text-xl font-medium text-gray-900 mb-2">No conversations yet</h3>

            <p className="text-gray-500 mb-6">
              Start messaging other users by contacting sellers from advertisement pages.
            </p>

            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Advertisements
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
