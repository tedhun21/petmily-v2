import type { CoreType } from './common.type';
import type { User } from './user.type';

export type ChatUser = Pick<User, 'id' | 'nickname' | 'photo' | 'role'>;

export interface ChatMember extends CoreType {
  user: ChatUser;
  unreadCount: number | null;
  lastReadMessage: Message | null;
}

export interface ChatRoom extends CoreType {
  lastMessage: Message | null;
  chatMembers: {
    meMember: ChatMember;
    otherMembers: ChatMember[];
  };
}

export interface Message extends CoreType {
  content: string;
  chatRoom: ChatRoom;
  sender: ChatUser;
}

export interface PendingMessage extends Omit<Message, 'id'> {
  id: string;
  tempId: string;
  status: 'pending' | 'sent' | 'error';
}

export type ChatMessage = Message | PendingMessage;
