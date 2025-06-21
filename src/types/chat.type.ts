import { CoreType } from './common.type';
import { User } from './user.type';

export type ChatUser = Pick<User, 'id' | 'nickname' | 'photo' | 'role'>;

export interface ChatRoom extends Omit<CoreType, 'id'> {
  id: number | null;
  lastMessage: Message | null;
  chatMembers: {
    me: ChatMember;
    others: ChatMember[];
  };
}

export interface ChatMember extends CoreType {
  user: ChatUser;
  unreadCount: number | null;
  lastReadMessage: Message | null;
}

export interface Message extends CoreType {
  sender?: ChatUser;
  content: string;
  chatRoom: ChatRoom;
}
