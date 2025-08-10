import { Trip } from '@models/entities/Trip';
import { TripRepository } from '@models/repositories/TripRepository';
import { TripFixesRepository } from '@models/repositories/TripFixesRepository';
import { LocationFix, LocationProvider } from '@services/location/LocationProvider';
import { computeDistanceMeters } from '@models/use-cases/ComputeDistance';
import { filterFixes } from '@models/use-cases/FilterLocationFixes';

export type TripRecorderState =
  | { kind: 'idle' }
  | { kind: 'arming' }
  | { kind: 'tracking'; tripId: string; distanceMeters: number }
  | { kind: 'signal_lost'; tripId: string; distanceMeters: number }
  | { kind: 'stopping'; tripId: string; distanceMeters: number };

export interface TripRecorderDeps {
  trips: TripRepository;
  fixes: TripFixesRepository;
  location: LocationProvider;
  now?: () => number; // ms epoch for testability
}

export class TripRecorder {
  private state: TripRecorderState = { kind: 'idle' };
  private fixBuffer: LocationFix[] = [];
  private activeTripId: string | null = null;
  private readonly now: () => number;

  constructor(private readonly deps: TripRecorderDeps) {
    this.now = deps.now ?? (() => Date.now());
  }

  getState(): TripRecorderState {
    return this.state;
  }

  async start(): Promise<void> {
    if (this.state.kind !== 'idle') return;
    this.state = { kind: 'arming' };

    // We will mark start once first valid fix arrives
    this.fixBuffer = [];
    this.deps.location.start(this.onFix);
  }

  private onFix = async (fix: LocationFix) => {
    // Build up buffer, ensure first valid fix creates the trip
    this.fixBuffer.push(fix);
    const filtered = filterFixes(this.fixBuffer);
    if (!this.activeTripId && filtered.length >= 1) {
      const first = filtered[0];
      const trip: Trip = {
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

    if (!this.activeTripId) return; // still waiting for first valid

    // Persist fix
    await this.deps.fixes.appendFix(this.activeTripId, fix);

    // Update distance incrementally by recomputing over filtered fixes
    const distance = computeDistanceMeters(filtered);
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

  async stop(): Promise<void> {
    if (this.state.kind !== 'tracking' && this.state.kind !== 'signal_lost') return;
    this.state = { kind: 'stopping', tripId: this.activeTripId!, distanceMeters: this.state.distanceMeters };
    this.deps.location.stop();

    if (!this.activeTripId) {
      this.state = { kind: 'idle' };
      return;
    }

    const trip = await this.deps.trips.findById(this.activeTripId);
    const filtered = filterFixes(this.fixBuffer);
    const last = filtered[filtered.length - 1];
    const distance = computeDistanceMeters(filtered);

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
