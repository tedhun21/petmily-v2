import { CoreType } from './common.type';
import { User } from './user.type';

enum NotificationType {
  RESERVATION_UPDATE = 'reservation_update',
}

interface NotificationReads {
  user: User;
  isRead: boolean;
}

export interface Notification extends CoreType {
  message: string;
  type: NotificationType;
  senderId: number;
  readStatus: NotificationReads[];
}
