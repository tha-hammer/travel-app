import { LocationFix } from '@services/location/LocationProvider';

// Haversine distance in meters between two WGS84 points
function haversineMeters(a: LocationFix, b: LocationFix): number {
  const R = 6371000; // meters
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);
  const aa = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon;
  const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));
  return R * c;
}

export interface ComputeDistanceOptions {
  // Ignore segments with accuracy worse than this (meters)
  maxHorizontalAccuracyMeters?: number; // default 50
  // Ignore segments implying speed above this (m/s), guards GPS jumps (~216 km/h default)
  maxReasonableSpeedMps?: number; // default 60
  // Ignore very small segments at low speed to reduce jitter
  minSegmentMetersAtLowSpeed?: number; // default 5
  lowSpeedThresholdMps?: number; // default 1
}

export function computeDistanceMeters(
  points: ReadonlyArray<LocationFix>,
  opts: ComputeDistanceOptions = {}
): number {
  const maxAcc = opts.maxHorizontalAccuracyMeters ?? 50;
  const maxSpeed = opts.maxReasonableSpeedMps ?? 60;
  const minSegLow = opts.minSegmentMetersAtLowSpeed ?? 5;
  const lowSpeed = opts.lowSpeedThresholdMps ?? 1;

  if (points.length < 2) return 0;

  let total = 0;
  let prev: LocationFix | undefined;
  for (const p of points) {
    if (p.accuracy > maxAcc) continue;
    if (!prev) {
      prev = p;
      continue;
    }
    const dt = (p.timestamp - prev.timestamp) / 1000; // seconds
    if (dt <= 0) {
      // Non-monotonic timestamp or duplicate
      prev = p;
      continue;
    }
    const d = haversineMeters(prev, p);
    const speed = d / dt;
    if (speed > maxSpeed) {
      // Unrealistic jump, drop this segment
      prev = p;
      continue;
    }
    if (speed < lowSpeed && d < minSegLow) {
      // jitter suppression at low speed
      prev = p;
      continue;
    }
    total += d;
    prev = p;
  }
  return total;
}
