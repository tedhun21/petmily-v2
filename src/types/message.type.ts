import { CoreType } from './common.type';
import { User } from './user.type';

export interface ChatRoom extends Omit<CoreType, 'id'> {
  id: number | null;
  chatMembers: {
    me?: { id: number; unreadCount: number; user: ChatUser };
    others?: ChatUser[];
  };
}

export type ChatUser = Pick<User, 'id' | 'nickname' | 'photo' | 'role'>;

export interface Message extends CoreType {
  sender: User;
  content: string;
  chatRoom: ChatRoom;
}
