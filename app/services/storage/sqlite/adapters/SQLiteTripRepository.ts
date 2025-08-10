import { Trip } from '@models/entities/Trip';
import { TripRepository } from '@models/repositories/TripRepository';
import { SQLiteDatabase } from '../SQLiteDatabase';

export class SQLiteTripRepository implements TripRepository {
  constructor(private readonly db: SQLiteDatabase) {}

  async create(trip: Trip): Promise<Trip> {
    await this.db.executeSql(`INSERT INTO trips (
      id, status, startAt, startLat, startLon, endAt, endLat, endLon, distanceMeters, title, notes, appliedRoutineId, lastFixAt, totalFixes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
      trip.id,
      trip.status,
      trip.startAt,
      trip.startLat,
      trip.startLon,
      trip.endAt ?? null,
      trip.endLat ?? null,
      trip.endLon ?? null,
      trip.distanceMeters,
      trip.title ?? null,
      trip.notes ?? null,
      trip.appliedRoutineId ?? null,
      trip.lastFixAt ?? null,
      trip.totalFixes ?? 0,
    ]);
    return { ...trip };
  }

  async update(trip: Trip): Promise<Trip> {
    await this.db.executeSql(`UPDATE trips SET
      status=?, startAt=?, startLat=?, startLon=?, endAt=?, endLat=?, endLon=?, distanceMeters=?, title=?, notes=?, appliedRoutineId=?, lastFixAt=?, totalFixes=?
      WHERE id=?`, [
      trip.status,
      trip.startAt,
      trip.startLat,
      trip.startLon,
      trip.endAt ?? null,
      trip.endLat ?? null,
      trip.endLon ?? null,
      trip.distanceMeters,
      trip.title ?? null,
      trip.notes ?? null,
      trip.appliedRoutineId ?? null,
      trip.lastFixAt ?? null,
      trip.totalFixes ?? 0,
      trip.id,
    ]);
    return { ...trip };
  }

  async findById(id: string): Promise<Trip | null> {
    const rows = await this.db.executeSql(`SELECT * FROM trips WHERE id = ?`, [id]);
    return rows.length > 0 ? this.mapRowToTrip(rows[0]) : null;
  }

  async getActive(): Promise<Trip | null> {
    const rows = await this.db.executeSql(`SELECT * FROM trips WHERE status = 'active' LIMIT 1`);
    return rows.length > 0 ? this.mapRowToTrip(rows[0]) : null;
  }

  async list(params?: { limit?: number; offset?: number; from?: number; to?: number }): Promise<Trip[]> {
    const conditions: string[] = [];
    const values: unknown[] = [];
    
    if (params?.from) {
      conditions.push('startAt >= ?');
      values.push(params.from);
    }
    if (params?.to) {
      conditions.push('startAt <= ?');
      values.push(params.to);
    }
    
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    let sql = `SELECT * FROM trips ${where} ORDER BY startAt DESC`;
    
    // Handle LIMIT and OFFSET - OFFSET requires LIMIT in SQLite
    if (params?.limit || params?.offset) {
      const limit = params?.limit || 999999999; // Very large number if no limit specified but offset is used
      sql += ` LIMIT ${limit}`;
      
      if (params?.offset) {
        sql += ` OFFSET ${params.offset}`;
      }
    }
    
    const rows = await this.db.executeSql(sql, values);
    return rows.map(row => this.mapRowToTrip(row));
  }

  private mapRowToTrip(row: any): Trip {
    const trip: Trip = {
      id: row.id,
      status: row.status,
      startAt: row.startAt,
      startLat: row.startLat,
      startLon: row.startLon,
      distanceMeters: row.distanceMeters
    };
    
    // Only add optional fields if they exist and are not null/undefined
    if (row.endAt !== null && row.endAt !== undefined) trip.endAt = row.endAt;
    if (row.endLat !== null && row.endLat !== undefined) trip.endLat = row.endLat;
    if (row.endLon !== null && row.endLon !== undefined) trip.endLon = row.endLon;
    if (row.title !== null && row.title !== undefined) trip.title = row.title;
    if (row.notes !== null && row.notes !== undefined) trip.notes = row.notes;
    if (row.appliedRoutineId !== null && row.appliedRoutineId !== undefined) trip.appliedRoutineId = row.appliedRoutineId;
    if (row.lastFixAt !== null && row.lastFixAt !== undefined) trip.lastFixAt = row.lastFixAt;
    if (row.totalFixes !== null && row.totalFixes !== undefined) trip.totalFixes = row.totalFixes;
    
    return trip;
  }
}
