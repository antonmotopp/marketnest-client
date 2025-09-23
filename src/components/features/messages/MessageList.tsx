import type { IMessage } from '@/types';
import { MessageBubble } from './MessageBubble';

interface Props {
  messages: IMessage[];
  currentUserId: number;
}

export const MessagesList = ({ messages, currentUserId }: Props) => {
  if (!messages.length) {
    return (
      <div className="text-center text-gray-500 py-8">No messages yet. Start the conversation!</div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          isOwnMessage={message.sender_id === currentUserId}
        />
      ))}
    </div>
  );
};
