"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryTripFixesRepository = void 0;
class InMemoryTripFixesRepository {
    constructor() {
        this.rows = [];
    }
    async appendFix(tripId, fix) {
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
    async listByTrip(tripId) {
        return this.rows.filter(r => r.tripId === tripId).sort((a, b) => a.ts - b.ts);
    }
}
exports.InMemoryTripFixesRepository = InMemoryTripFixesRepository;
