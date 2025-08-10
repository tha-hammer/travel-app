export type PermissionStatus = 'granted' | 'denied' | 'prompt';

export interface PermissionsService {
  requestWhenInUse(): Promise<PermissionStatus>;
  requestAlways(): Promise<PermissionStatus>;
}
