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
    e.preventDefault();
    if (window.confirm(`Delete conversation with ${username}? This action cannot be undone.`)) {
      deleteChatMutation.mutate(chatId);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-4">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
          </div>

          <div className="space-y-4 animate-pulse">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-white/80 rounded-2xl p-6 shadow-sm border border-white/20"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-32"></div>
                    <div className="h-3 bg-gray-300 rounded w-48"></div>
                  </div>
                  <div className="h-3 bg-gray-300 rounded w-16"></div>
                </div>
              </div>
            ))}
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Connection Error</h2>
          <p className="text-gray-600 mb-6">
            Unable to load your conversations. Please check your connection and try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 4v-4z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Messages</h1>
          <p className="text-lg text-gray-600">Stay connected with buyers and sellers</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">
                  {conversations?.length || 0} conversation{conversations?.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="h-4 w-px bg-gray-300"></div>
            </div>

            <Link
              to="/"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors flex items-center"
            >
              <span>Browse advertisement</span>
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>
        </div>

        {conversations?.length ? (
          <div className="space-y-4">
            {conversations.map((conversation: IConversation, index: number) => (
              <Link
                key={conversation.other_user_id}
                to={`/messages/${conversation.other_user_id}`}
                className="group block bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 p-6 animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-white font-semibold text-lg">
                          {conversation.other_username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {conversation.other_username}
                        </h3>
                        <div className="flex items-center space-x-3 text-xs text-gray-500">
                          <span>{formatDate(conversation.last_message_time).formatted}</span>
                          <span>{formatDate(conversation.last_message_time).time}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate pr-4 flex-1">
                          {conversation.last_message || 'No messages yet'}
                        </p>

                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) =>
                              handleDeleteChat(e, conversation.chat_id, conversation.other_username)
                            }
                            disabled={deleteChatMutation.isPending}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50"
                            title={`Delete conversation with ${conversation.other_username}`}
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>

                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg
                              className="w-3 h-3 text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mx-auto flex items-center justify-center shadow-inner">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 4v-4z"
                    />
                  </svg>
                </div>

                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                </div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-indigo-100 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3">No conversations yet</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Start connecting with other users by contacting sellers from advertisement pages.
                Your conversations will appear here.
              </p>

              <div className="space-y-4">
                <Link
                  to="/"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  Browse Advertisements
                </Link>

                <div className="text-sm text-gray-500">
                  <p>💡 Tip: Click "Contact Seller" on any listing to start a conversation</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
