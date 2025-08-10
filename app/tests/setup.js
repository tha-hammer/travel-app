"use strict";
// Jest test setup file
// Add any global test configuration here
Object.defineProperty(exports, "__esModule", { value: true });
// Global test utilities
global.createTestTrip = (overrides = {}) => ({
    id: 'test-trip-id',
    status: 'active',
    startAt: Date.now(),
    startLat: 37.7749,
    startLon: -122.4194,
    distanceMeters: 0,
    totalFixes: 0,
    ...overrides
});
global.createTestTemplate = (overrides = {}) => ({
    id: 'test-template-id',
    title: 'Test Template',
    ...overrides
});
