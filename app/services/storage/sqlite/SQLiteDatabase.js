"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SQLiteDatabase = void 0;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
class SQLiteDatabase {
    constructor(config) {
        const options = {};
        if (config.readonly !== undefined) {
            options.readonly = config.readonly;
        }
        if (config.fileMustExist !== undefined) {
            options.fileMustExist = config.fileMustExist;
        }
        this.db = new better_sqlite3_1.default(config.filename, options);
        // Enable foreign keys
        this.db.pragma('foreign_keys = ON');
    }
    get database() {
        return this.db;
    }
    close() {
        this.db.close();
    }
    // Utility methods for common operations
    prepare(sql) {
        return this.db.prepare(sql);
    }
    transaction(fn) {
        return this.db.transaction(fn)();
    }
    exec(sql) {
        this.db.exec(sql);
    }
    // Simple migration runner using GPT-5's inline approach
    runMigrations() {
        const migration = `
BEGIN;
CREATE TABLE IF NOT EXISTS trips (
  id TEXT PRIMARY KEY,
  status TEXT NOT NULL,
  startAt INTEGER NOT NULL,
  startLat REAL NOT NULL,
  startLon REAL NOT NULL,
  endAt INTEGER,
  endLat REAL,
  endLon REAL,
  distanceMeters REAL NOT NULL DEFAULT 0,
  title TEXT,
  notes TEXT,
  appliedRoutineId TEXT,
  lastFixAt INTEGER,
  totalFixes INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS trip_fixes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tripId TEXT NOT NULL,
  ts INTEGER NOT NULL,
  lat REAL NOT NULL,
  lon REAL NOT NULL,
  accuracy REAL NOT NULL,
  speedMps REAL,
  source TEXT,
  FOREIGN KEY(tripId) REFERENCES trips(id)
);
CREATE TABLE IF NOT EXISTS templates (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  notes TEXT,
  category TEXT
);
CREATE INDEX IF NOT EXISTS idx_trip_fixes_trip_ts ON trip_fixes(tripId, ts);
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);
COMMIT;`;
        this.db.exec(migration);
    }
}
exports.SQLiteDatabase = SQLiteDatabase;
