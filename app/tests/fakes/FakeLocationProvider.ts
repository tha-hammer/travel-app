import { LocationFix, LocationProvider } from '@services/location/LocationProvider';

export class FakeLocationProvider implements LocationProvider {
  private handler?: (fix: LocationFix) => void;
  
  async requestWhenInUse(): Promise<'granted' | 'denied' | 'prompt'> {
    return 'granted';
  }
  
  async requestAlways(): Promise<'granted' | 'denied' | 'prompt'> {
    return 'granted';
  }
  
  start(onFix: (fix: LocationFix) => void): void {
    this.handler = onFix;
  }
  
  stop(): void {
    this.handler = undefined;
  }
  
  emit(fix: LocationFix): void {
    this.handler?.(fix);
  }
}
