import { filterFixes } from '@models/use-cases/FilterLocationFixes';
import { LocationFix } from '@services/location/LocationProvider';

describe('filterFixes', () => {
  const p = (lon: number, ts: number, accuracy = 5): LocationFix => ({ lat: 0, lon, timestamp: ts, accuracy });

  it('drops bad accuracy', () => {
    const r = filterFixes([p(0, 0), p(0.001, 1000, 200)]);
    expect(r.length).toBe(1);
  });

  it('drops non-monotonic timestamps', () => {
    const r = filterFixes([p(0, 1000), p(0.001, 900)]);
    expect(r.length).toBe(1);
  });

  it('drops unrealistic speed segments', () => {
    const r = filterFixes([p(0, 0), p(1, 1000)]);
    expect(r.length).toBe(1);
  });
});
