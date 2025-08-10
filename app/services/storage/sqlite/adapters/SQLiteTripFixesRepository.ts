import { SQLiteDatabase } from '../SQLiteDatabase';
import { LocationFix } from '@services/location/LocationProvider';
import { TripFixesRepository } from '@models/repositories/TripFixesRepository';

export interface TripFix {
  id?: number;
  tripId: string;
  ts: number;
  lat: number;
  lon: number;
  accuracy: number;
  speedMps?: number | null;
  source?: string | null;
}

export class SQLiteTripFixesRepository implements TripFixesRepository {
  constructor(private readonly db: SQLiteDatabase) {}

  async appendFix(tripId: string, fix: LocationFix & { speedMps?: number | null; source?: string | null }): Promise<void> {
    const stmt = this.db.prepare(`INSERT INTO trip_fixes (tripId, ts, lat, lon, accuracy, speedMps, source) VALUES (?, ?, ?, ?, ?, ?, ?)`);
    
    stmt.run(
      tripId,
      fix.timestamp,
      fix.lat,
      fix.lon,
      fix.accuracy,
      fix.speedMps ?? null,
      fix.source ?? 'gps',
    );
  }

  async listByTrip(tripId: string): Promise<TripFix[]> {
    const stmt = this.db.prepare(`SELECT * FROM trip_fixes WHERE tripId = ? ORDER BY ts ASC`);
    const rows = stmt.all(tripId) as any[];
    
    return rows.map(row => ({
      id: row.id,
      tripId: row.tripId,
      ts: row.ts,
      lat: row.lat,
      lon: row.lon,
      accuracy: row.accuracy,
      speedMps: row.speedMps || undefined,
      source: row.source || undefined
    }));
  }
}
