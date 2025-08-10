export interface LocationFix {
  lat: number;
  lon: number;
  accuracy: number; // meters
  timestamp: number; // ms epoch
}

export interface LocationProvider {
  requestWhenInUse(): Promise<'granted' | 'denied' | 'prompt'>;
  requestAlways(): Promise<'granted' | 'denied' | 'prompt'>;
  start(onFix: (fix: LocationFix) => void): void;
  stop(): void;
}
