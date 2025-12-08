import type { CoreType } from './common.type';
import type { User } from './user.type';

const NotificationType = {
  RESERVATION_UPDATE: 'reservation_update',
} as const;
export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];

interface NotificationReads {
  isRead: boolean;
  readAt: Date | null;
}

export interface Notification extends CoreType {
  sender: User;
  type: NotificationType;
  readStatus: NotificationReads[];
  metadata: Record<string, unknown>;
}
