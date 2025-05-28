import { CoreType } from './common.type';
import { User } from './user.type';

export enum NotificationType {
  RESERVATION_UPDATE = 'reservation_update',
}

interface NotificationReads {
  isRead: boolean;
  readAt: Date | null;
}

export interface Notification extends CoreType {
  sender: User;
  type: NotificationType;
  readStatus: NotificationReads[];
  metadata: Record<string, any>;
}
