/**
 * Path Alias Resolution Test
 * 
 * This test verifies that our path aliases work correctly in both Jest and Metro
 * by testing imports that don't depend on React Native modules.
 */

// Test imports using path aliases for non-React Native modules
import type { Trip } from '@models/entities/Trip';
import { TripRecorder } from '@controllers/TripRecorder';
import { computeDistanceMeters } from '@models/use-cases/ComputeDistance';
import type { LocationFix } from '@services/location/LocationProvider';

describe('Path Alias Resolution', () => {
  it('should resolve @models path alias correctly', () => {
    // Test that Trip type can be used (TypeScript compilation success)
    const trip: Trip = {
      id: 'test-id',
      status: 'active',
      startAt: Date.now(),
      startLat: 37.7749,
      startLon: -122.4194,
      distanceMeters: 100,
      totalFixes: 5
    };
    
    expect(trip.id).toBe('test-id');
    expect(trip.status).toBe('active');
  });

  it('should resolve @controllers path alias correctly', () => {
    // Test that TripRecorder class can be imported
    expect(TripRecorder).toBeDefined();
    expect(typeof TripRecorder).toBe('function');
    expect(TripRecorder.name).toBe('TripRecorder');
  });

  it('should resolve @models use-cases path alias correctly', () => {
    // Test that use-case functions can be imported and used
    expect(computeDistanceMeters).toBeDefined();
    expect(typeof computeDistanceMeters).toBe('function');
    
    // Test the function works with mock data (coordinates 1km apart)
    const fixes: LocationFix[] = [
      { lat: 37.7749, lon: -122.4194, accuracy: 5, timestamp: 1000 },
      { lat: 37.7849, lon: -122.4094, accuracy: 5, timestamp: 10000 } // 9 seconds later
    ];
    
    const distance = computeDistanceMeters(fixes);
    expect(typeof distance).toBe('number');
    // Just verify it's not throwing errors and returns a number
    expect(distance).toBeGreaterThanOrEqual(0);
  });

  it('should resolve @services types correctly', () => {
    // Test that we can use LocationFix type from @services
    const fix: LocationFix = {
      lat: 37.7749,
      lon: -122.4194,
      accuracy: 5,
      timestamp: Date.now()
    };
    
    expect(fix.lat).toBe(37.7749);
    expect(fix.lon).toBe(-122.4194);
    expect(typeof fix.timestamp).toBe('number');
  });

  it('should validate that imports actually come from expected paths', () => {
    // This test verifies the modules we're importing are the correct ones
    
    // TripRecorder should have expected methods
    const mockDeps = {
      trips: {} as any,
      fixes: {} as any,
      location: {} as any
    };
    
    // Should be able to construct a TripRecorder
    const recorder = new TripRecorder(mockDeps);
    expect(recorder).toBeDefined();
    expect(typeof recorder.getState).toBe('function');
  });
});