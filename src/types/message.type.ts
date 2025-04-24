import { CoreType } from './common.type';
import { User } from './user.type';

export type ChatUser = Pick<User, 'id' | 'nickname' | 'photo' | 'role'>;

export interface ChatRoom extends Omit<CoreType, 'id'> {
  id: number | null;
  chatMembers: {
    unreadCount: number;
    membersCount: number;
    me?: ChatUser;
    others?: ChatUser[];
  };
}

export interface Message extends CoreType {
  sender?: ChatUser;
  content: string;
  chatRoom: ChatRoom;
  readBy: number[];
}
