/**
 * @jest-environment jsdom
 */
import React from 'react';

// Mock React Native components
jest.mock('react-native', () => ({
  View: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('react-native-paper', () => ({
  Button: ({ children, onPress }: any) => <button onClick={onPress}>{children}</button>,
  Text: ({ children }: any) => <span>{children}</span>,
  Card: ({ children }: any) => <div>{children}</div>,
}));

import { render } from '@testing-library/react';
import { HomeScreen } from '../../views/HomeScreen';
import { TripRecordingController } from '@controllers/useTripRecording';

describe('HomeScreen', () => {
  it('should render GO button when not recording', () => {
    const mockController: TripRecordingController = {
      distanceMeters: 0,
      isTracking: false,
      start: jest.fn(),
      stop: jest.fn(),
    };
    
    const { getByText } = render(<HomeScreen controller={mockController} />);
    expect(getByText('GO')).toBeInTheDocument();
  });

  it('should render STOP button when recording', () => {
    const mockController: TripRecordingController = {
      distanceMeters: 1000,
      isTracking: true,
      start: jest.fn(),
      stop: jest.fn(),
    };
    
    const { getByText } = render(<HomeScreen controller={mockController} />);
    expect(getByText('STOP')).toBeInTheDocument();
  });
});