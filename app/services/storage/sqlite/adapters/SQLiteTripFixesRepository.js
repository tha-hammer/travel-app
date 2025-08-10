"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SQLiteTripFixesRepository = void 0;
class SQLiteTripFixesRepository {
    constructor(db) {
        this.db = db;
    }
    async appendFix(tripId, fix) {
        const stmt = this.db.prepare(`INSERT INTO trip_fixes (tripId, ts, lat, lon, accuracy, speedMps, source) VALUES (?, ?, ?, ?, ?, ?, ?)`);
        stmt.run(tripId, fix.timestamp, fix.lat, fix.lon, fix.accuracy, fix.speedMps ?? null, fix.source ?? 'gps');
    }
    async listByTrip(tripId) {
        const stmt = this.db.prepare(`SELECT * FROM trip_fixes WHERE tripId = ? ORDER BY ts ASC`);
        const rows = stmt.all(tripId);
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
exports.SQLiteTripFixesRepository = SQLiteTripFixesRepository;
