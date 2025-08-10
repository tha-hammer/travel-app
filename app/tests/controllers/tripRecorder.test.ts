import { TripRecorder } from '@controllers/TripRecorder';
import { InMemoryTripRepository } from '@tests/fakes/InMemoryTripRepository';
import { FakeLocationProvider } from '@tests/fakes/FakeLocationProvider';
import { InMemoryTripFixesRepository } from '@tests/fakes/InMemoryTripFixesRepository';
import { LocationFix } from '@services/location/LocationProvider';

describe('TripRecorder', () => {
  it('starts on first valid fix, accumulates, and stops', async () => {
    const trips = new InMemoryTripRepository();
    const fixes = new InMemoryTripFixesRepository();
    const location = new FakeLocationProvider();
    const recorder = new TripRecorder({ trips, fixes, location, now: () => 123 });

    await recorder.start();
    expect(recorder.getState().kind).toBe('arming');

    const p1: LocationFix = { lat: 0, lon: 0, accuracy: 5, timestamp: 1 };
    location.emit(p1);

    // After first valid fix, trip should be active
    const s1 = recorder.getState();
    expect(s1.kind === 'tracking' && s1.distanceMeters === 0).toBe(true);

    const p2: LocationFix = { lat: 0, lon: 0.001, accuracy: 5, timestamp: 2 };
    location.emit(p2);

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
