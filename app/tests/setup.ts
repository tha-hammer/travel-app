// Jest test setup file
// Add any global test configuration here

// Setup for React component testing
import '@testing-library/jest-dom';

// Global test utilities
global.createTestTrip = (overrides: Partial<import('@models/entities/Trip').Trip> = {}) => ({
  id: 'test-trip-id',
  status: 'active' as const,
  startAt: Date.now(),
  startLat: 37.7749,
  startLon: -122.4194,
  distanceMeters: 0,
  totalFixes: 0,
  ...overrides
});

global.createTestTemplate = (overrides: Partial<import('@models/entities/RoutineTripTemplate').RoutineTripTemplate> = {}) => ({
  id: 'test-template-id',
  title: 'Test Template',
  ...overrides
});

declare global {
  var createTestTrip: (overrides?: Partial<import('@models/entities/Trip').Trip>) => import('@models/entities/Trip').Trip;
  var createTestTemplate: (overrides?: Partial<import('@models/entities/RoutineTripTemplate').RoutineTripTemplate>) => import('@models/entities/RoutineTripTemplate').RoutineTripTemplate;
}

export {};