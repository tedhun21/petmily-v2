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
  sender: ChatUser;
  chatRoom: ChatRoom;
}

export interface PendingMessage extends Omit<CoreType, 'id'> {
  id: string;
  tempId: string;
  content: string;
  sender: ChatUser;
  status: 'pending' | 'error';
}
