import { LocationFix } from '../../services/location/LocationProvider';

export class FakeLocationProvider {
  private handler?: (fix: LocationFix) => void;
  start(onFix: (fix: LocationFix) => void) {
    this.handler = onFix;
  }
  stop() {
    this.handler = undefined;
  }
  emit(fix: LocationFix) {
    this.handler?.(fix);
  }
}
