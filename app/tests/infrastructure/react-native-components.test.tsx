/**
 * React Native Component Tests with Path Aliases
 * 
 * This test verifies that React Native components using path aliases can be
 * properly tested in Jest with appropriate mocking.
 */

/**
 * @jest-environment jsdom
 */
import React from 'react';

// Mock React Native components first
jest.mock('react-native', () => ({
  View: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Text: ({ children, ...props }: any) => <span {...props}>{children}</span>,
}));

jest.mock('react-native-paper', () => ({
  Button: ({ children, onPress, mode, buttonColor, ...props }: any) => 
    <button onClick={onPress} className={mode} data-color={buttonColor} data-testid="paper-button" {...props}>{children}</button>,
  Text: ({ children, variant, ...props }: any) => 
    <span className={variant} data-testid="paper-text" {...props}>{children}</span>,
  Card: ({ children, mode, ...props }: any) => 
    <div className={`card ${mode}`} data-testid="paper-card" {...props}>{children}</div>,
}));

// Mock the controller hook since it depends on TripRecorder
jest.mock('@controllers/useTripRecording', () => ({
  useTripRecording: jest.fn(() => ({
    distanceMeters: 1609.34, // 1 mile in meters
    isTracking: false,
    start: jest.fn(),
    stop: jest.fn(),
  })),
}));

import { render } from '@testing-library/react';
import { HomeScreen } from '@views/HomeScreen';
import type { TripRecordingController } from '@controllers/useTripRecording';

describe('React Native Components with Path Aliases', () => {
  const mockController: TripRecordingController = {
    distanceMeters: 1609.34, // 1 mile
    isTracking: false,
    start: jest.fn(),
    stop: jest.fn(),
  };

  it('should render HomeScreen using @views path alias', () => {
    const { getByText } = render(<HomeScreen controller={mockController} />);
    
    // Should show the distance in miles
    expect(getByText('Distance')).toBeInTheDocument();
    expect(getByText('1.00 mi')).toBeInTheDocument(); // 1609.34 meters = 1 mile
    
    // Should show GO button when not tracking
    expect(getByText('GO')).toBeInTheDocument();
  });

  it('should render HomeScreen in tracking state', () => {
    const trackingController: TripRecordingController = {
      ...mockController,
      isTracking: true,
      distanceMeters: 3218.68, // 2 miles
    };
    
    const { getByText } = render(<HomeScreen controller={trackingController} />);
    
    // Should show the distance in miles
    expect(getByText('Distance')).toBeInTheDocument();
    expect(getByText('2.00 mi')).toBeInTheDocument(); // 2 miles
    
    // Should show STOP button when tracking
    expect(getByText('STOP')).toBeInTheDocument();
  });

  it('should verify that path aliases work in component imports', () => {
    // This test passes if the component can be imported using path aliases
    expect(HomeScreen).toBeDefined();
    expect(typeof HomeScreen).toBe('function');
  });

  it('should handle controller interactions', () => {
    const mockStart = jest.fn();
    const mockStop = jest.fn();
    
    const interactiveController: TripRecordingController = {
      distanceMeters: 0,
      isTracking: false,
      start: mockStart,
      stop: mockStop,
    };
    
    const { getByText } = render(<HomeScreen controller={interactiveController} />);
    
    // Click the GO button
    const goButton = getByText('GO');
    goButton.click();
    
    expect(mockStart).toHaveBeenCalled();
  });
});