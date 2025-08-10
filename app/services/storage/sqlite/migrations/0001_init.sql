-- trips
+BEGIN;
+CREATE TABLE IF NOT EXISTS trips (
+  id TEXT PRIMARY KEY,
+  status TEXT NOT NULL,
+  startAt INTEGER NOT NULL,
+  startLat REAL NOT NULL,
+  startLon REAL NOT NULL,
+  endAt INTEGER,
+  endLat REAL,
+  endLon REAL,
+  distanceMeters REAL NOT NULL DEFAULT 0,
+  title TEXT,
+  notes TEXT,
+  appliedRoutineId TEXT,
+  lastFixAt INTEGER,
+  totalFixes INTEGER NOT NULL DEFAULT 0
+);
+
+CREATE TABLE IF NOT EXISTS trip_fixes (
+  id INTEGER PRIMARY KEY AUTOINCREMENT,
+  tripId TEXT NOT NULL,
+  ts INTEGER NOT NULL,
+  lat REAL NOT NULL,
+  lon REAL NOT NULL,
+  accuracy REAL NOT NULL,
+  speedMps REAL,
+  source TEXT,
+  FOREIGN KEY(tripId) REFERENCES trips(id)
+);
+
+CREATE TABLE IF NOT EXISTS templates (
+  id TEXT PRIMARY KEY,
+  title TEXT NOT NULL,
+  notes TEXT,
+  category TEXT
+);
+
+CREATE INDEX IF NOT EXISTS idx_trip_fixes_trip_ts ON trip_fixes(tripId, ts);
+CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);
+COMMIT;
