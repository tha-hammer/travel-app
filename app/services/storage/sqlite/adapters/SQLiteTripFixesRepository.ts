import type { SQLiteDatabase } from './SQLiteTripRepository';
import type { LocationFix } from '../../../services/location/LocationProvider';

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

export class SQLiteTripFixesRepository {
  constructor(private readonly db: SQLiteDatabase) {}

  async appendFix(tripId: string, fix: LocationFix & { speedMps?: number | null; source?: string | null }): Promise<void> {
    const sql = `INSERT INTO trip_fixes (tripId, ts, lat, lon, accuracy, speedMps, source) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    await this.db.execAsync(sql, [
      tripId,
      fix.timestamp,
      fix.lat,
      fix.lon,
      fix.accuracy,
      fix.speedMps ?? null,
      fix.source ?? 'gps',
    ]);
  }

  async listByTrip(tripId: string): Promise<TripFix[]> {
    const { rows } = await this.db.queryAsync<TripFix>(`SELECT * FROM trip_fixes WHERE tripId=? ORDER BY ts ASC`, [tripId]);
    return rows;
  }
}
