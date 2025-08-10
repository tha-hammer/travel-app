import type { Trip } from '../../../models/entities/Trip';
import type { TripRepository } from '../../../models/repositories/TripRepository';

// Replace with your SQLite bridge import (expo-sqlite or react-native-sqlite-storage)
export interface SQLiteDatabase {
  execAsync(sql: string, params?: unknown[]): Promise<{ rowsAffected?: number; insertId?: number } | void>;
  queryAsync<T = any>(sql: string, params?: unknown[]): Promise<{ rows: T[] }>;
}

export class SQLiteTripRepository implements TripRepository {
  constructor(private readonly db: SQLiteDatabase) {}

  async create(trip: Trip): Promise<Trip> {
    const sql = `INSERT INTO trips (
      id, status, startAt, startLat, startLon, endAt, endLat, endLon, distanceMeters, title, notes, appliedRoutineId, lastFixAt, totalFixes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    await this.db.execAsync(sql, [
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
    return trip;
  }

  async update(trip: Trip): Promise<Trip> {
    const sql = `UPDATE trips SET
      status=?, startAt=?, startLat=?, startLon=?, endAt=?, endLat=?, endLon=?, distanceMeters=?, title=?, notes=?, appliedRoutineId=?, lastFixAt=?, totalFixes=?
      WHERE id=?`;
    await this.db.execAsync(sql, [
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
    return trip;
  }

  async findById(id: string): Promise<Trip | null> {
    const { rows } = await this.db.queryAsync<Trip>(`SELECT * FROM trips WHERE id=?`, [id]);
    return rows[0] ?? null;
  }

  async getActive(): Promise<Trip | null> {
    const { rows } = await this.db.queryAsync<Trip>(`SELECT * FROM trips WHERE status='active' LIMIT 1`);
    return rows[0] ?? null;
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
    const limit = params?.limit ? ` LIMIT ${params.limit}` : '';
    const offset = params?.offset ? ` OFFSET ${params.offset}` : '';
    const sql = `SELECT * FROM trips ${where} ORDER BY startAt DESC${limit}${offset}`;
    const { rows } = await this.db.queryAsync<Trip>(sql, values);
    return rows;
  }
}
