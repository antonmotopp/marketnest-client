import { formatDate } from '@/utils';
import type { IMessage } from '@/types';

interface Props {
  message: IMessage;
  isOwnMessage: boolean;
}

export const MessageBubble = ({ message, isOwnMessage }: Props) => {
  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isOwnMessage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'
        }`}
      >
        <p className="text-sm">{message.content}</p>
        <p className={`text-xs mt-1 ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'}`}>
          {formatDate(message.created_at).time}
        </p>
      </div>
    </div>
  );
};
