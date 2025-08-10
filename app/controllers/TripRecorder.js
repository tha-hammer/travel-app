"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripRecorder = void 0;
const ComputeDistance_1 = require("@models/use-cases/ComputeDistance");
const FilterLocationFixes_1 = require("@models/use-cases/FilterLocationFixes");
class TripRecorder {
    constructor(deps) {
        this.deps = deps;
        this.state = { kind: 'idle' };
        this.fixBuffer = [];
        this.activeTripId = null;
        this.onFix = async (fix) => {
            // Build up buffer, ensure first valid fix creates the trip
            this.fixBuffer.push(fix);
            const filtered = (0, FilterLocationFixes_1.filterFixes)(this.fixBuffer);
            if (!this.activeTripId && filtered.length >= 1) {
                const first = filtered[0];
                const trip = {
                    id: crypto.randomUUID(),
                    status: 'active',
                    startAt: first.timestamp,
                    startLat: first.lat,
                    startLon: first.lon,
                    distanceMeters: 0,
                    lastFixAt: first.timestamp,
                    totalFixes: 0,
                };
                await this.deps.trips.create(trip);
                this.activeTripId = trip.id;
                this.state = { kind: 'tracking', tripId: trip.id, distanceMeters: 0 };
            }
            if (!this.activeTripId)
                return; // still waiting for first valid
            // Persist fix
            await this.deps.fixes.appendFix(this.activeTripId, fix);
            // Update distance incrementally by recomputing over filtered fixes
            const distance = (0, ComputeDistance_1.computeDistanceMeters)(filtered);
            const last = filtered[filtered.length - 1];
            const current = await this.deps.trips.findById(this.activeTripId);
            if (current) {
                await this.deps.trips.update({
                    ...current,
                    endAt: last.timestamp,
                    endLat: last.lat,
                    endLon: last.lon,
                    distanceMeters: distance,
                    lastFixAt: last.timestamp,
                    totalFixes: (current.totalFixes ?? 0) + 1,
                });
            }
            // Update in-memory state
            if (this.state.kind === 'tracking' || this.state.kind === 'signal_lost') {
                this.state = { kind: 'tracking', tripId: this.activeTripId, distanceMeters: distance };
            }
        };
        this.now = deps.now ?? (() => Date.now());
    }
    getState() {
        return this.state;
    }
    async start() {
        if (this.state.kind !== 'idle')
            return;
        this.state = { kind: 'arming' };
        // We will mark start once first valid fix arrives
        this.fixBuffer = [];
        this.deps.location.start(this.onFix);
    }
    async stop() {
        if (this.state.kind !== 'tracking' && this.state.kind !== 'signal_lost')
            return;
        this.state = { kind: 'stopping', tripId: this.activeTripId, distanceMeters: this.state.distanceMeters };
        this.deps.location.stop();
        if (!this.activeTripId) {
            this.state = { kind: 'idle' };
            return;
        }
        const trip = await this.deps.trips.findById(this.activeTripId);
        const filtered = (0, FilterLocationFixes_1.filterFixes)(this.fixBuffer);
        const last = filtered[filtered.length - 1];
        const distance = (0, ComputeDistance_1.computeDistanceMeters)(filtered);
        if (trip) {
            await this.deps.trips.update({
                ...trip,
                status: 'completed',
                endAt: last?.timestamp ?? this.now(),
                endLat: last?.lat ?? trip.startLat,
                endLon: last?.lon ?? trip.startLon,
                distanceMeters: distance,
            });
        }
        this.activeTripId = null;
        this.fixBuffer = [];
        this.state = { kind: 'idle' };
    }
}
exports.TripRecorder = TripRecorder;
