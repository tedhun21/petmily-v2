import { CoreType } from './common.type';

enum NotificationType {
  RESERVATION_UPDATE = 'reservation_update',
}

interface NotificationReads {
  isRead: boolean;
  readAt: Date | null;
}

export interface Notification extends CoreType {
  message: string;
  type: NotificationType;
  senderId: number;
  readStatus: NotificationReads[];
}
