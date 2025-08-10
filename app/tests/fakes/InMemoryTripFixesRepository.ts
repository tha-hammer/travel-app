import { TripFixesRepository } from '@models/repositories/TripFixesRepository';
import { LocationFix } from '@services/location/LocationProvider';

export class InMemoryTripFixesRepository implements TripFixesRepository {
  private rows: Array<{
    id?: number;
    tripId: string;
    ts: number;
    lat: number;
    lon: number;
    accuracy: number;
    speedMps?: number | null;
    source?: string | null;
  }> = [];

  async appendFix(tripId: string, fix: LocationFix & { speedMps?: number | null; source?: string | null; }): Promise<void> {
    this.rows.push({
      tripId,
      ts: fix.timestamp,
      lat: fix.lat,
      lon: fix.lon,
      accuracy: fix.accuracy,
      speedMps: fix.speedMps ?? null,
      source: fix.source ?? 'gps',
    });
  }

  async listByTrip(tripId: string) {
    return this.rows.filter(r => r.tripId === tripId).sort((a, b) => a.ts - b.ts);
  }
}
