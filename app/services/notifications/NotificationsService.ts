export interface NotificationsService {
  notify(title: string, body: string, actions?: Array<{ id: string; title: string }>): Promise<void>;
}
