import { computeDistanceMeters } from '@models/use-cases/ComputeDistance';
import { LocationFix } from '@services/location/LocationProvider';

describe('computeDistanceMeters', () => {
  const base: LocationFix = { lat: 0, lon: 0, accuracy: 5, timestamp: 0 };

  it('returns 0 for <2 points', () => {
    expect(computeDistanceMeters([])).toBe(0);
    expect(computeDistanceMeters([base])).toBe(0);
  });

  it('computes simple eastward movement', () => {
    const p1 = base;
    const p2: LocationFix = { lat: 0, lon: 0.001, accuracy: 5, timestamp: 1000 };
    const d = computeDistanceMeters([p1, p2]);
    expect(d).toBeGreaterThan(100); // ~111m per 0.001 lon at equator
  });

  it('ignores unrealistic jumps by speed', () => {
    const p1 = base;
    const p2: LocationFix = { lat: 0, lon: 1, accuracy: 5, timestamp: 1000 }; // ~111km in 1s
    const d = computeDistanceMeters([p1, p2], { maxReasonableSpeedMps: 60 });
    expect(d).toBe(0);
  });

  it('suppresses jitter at low speed', () => {
    const p1 = base;
    const p2: LocationFix = { lat: 0, lon: 0.00001, accuracy: 5, timestamp: 1000 }; // ~1.11m
    const d = computeDistanceMeters([p1, p2], { lowSpeedThresholdMps: 1, minSegmentMetersAtLowSpeed: 5 });
    expect(d).toBe(0);
  });
});
