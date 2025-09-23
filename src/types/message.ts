export interface IMessage {
  id: number;
  sender_id: number;
  receiver_id: number;
  advertisement_id?: number;
  content: string;
  created_at: string;
}

export interface IConversation {
  chat_id: number;
  other_user_id: number;
  other_username: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
  user_id: number;
  username: string;
}
