"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TripRecorder_1 = require("@controllers/TripRecorder");
const InMemoryTripRepository_1 = require("@tests/fakes/InMemoryTripRepository");
const FakeLocationProvider_1 = require("@tests/fakes/FakeLocationProvider");
const InMemoryTripFixesRepository_1 = require("@tests/fakes/InMemoryTripFixesRepository");
describe('TripRecorder', () => {
    it('starts on first valid fix, accumulates, and stops', async () => {
        const trips = new InMemoryTripRepository_1.InMemoryTripRepository();
        const fixes = new InMemoryTripFixesRepository_1.InMemoryTripFixesRepository();
        const location = new FakeLocationProvider_1.FakeLocationProvider();
        const recorder = new TripRecorder_1.TripRecorder({ trips, fixes, location, now: () => 123 });
        await recorder.start();
        expect(recorder.getState().kind).toBe('arming');
        const p1 = { lat: 0, lon: 0, accuracy: 5, timestamp: 1 };
        location.emit(p1);
        // Allow async processing to complete
        await new Promise(resolve => setTimeout(resolve, 10));
        // After first valid fix, trip should be active
        const s1 = recorder.getState();
        expect(s1.kind === 'tracking' && s1.distanceMeters === 0).toBe(true);
        const p2 = { lat: 0, lon: 0.001, accuracy: 5, timestamp: 10000 }; // 10 seconds for realistic speed
        location.emit(p2);
        // Allow async processing to complete
        await new Promise(resolve => setTimeout(resolve, 10));
        const s2 = recorder.getState();
        expect(s2.kind === 'tracking' && s2.distanceMeters).toBeTruthy();
        await recorder.stop();
        const active = await trips.getActive();
        expect(active).toBeNull();
        const list = await trips.list();
        expect(list.length).toBe(1);
        expect(list[0].status).toBe('completed');
        expect(list[0].distanceMeters).toBeGreaterThan(0);
    });
});
