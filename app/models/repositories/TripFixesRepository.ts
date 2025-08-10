import type { LocationFix } from '@services/location/LocationProvider';

export interface TripFixesRepository {
  appendFix(
    tripId: string,
    fix: LocationFix & { speedMps?: number | null; source?: string | null }
  ): Promise<void>;
  listByTrip(tripId: string): Promise<
    Array<{
      id?: number;
      tripId: string;
      ts: number;
      lat: number;
      lon: number;
      accuracy: number;
      speedMps?: number | null;
      source?: string | null;
    }>
  >;
}
