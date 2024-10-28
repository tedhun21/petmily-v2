import { CoreType } from './common.type';
import { User } from './user.type';

export interface ChatRoom extends CoreType {
  client: User;
  petsitter: User;
  messages: Message[];
}

export interface Message extends CoreType {
  sender: User;
  content: string;
  chatRoom: ChatRoom;
}
