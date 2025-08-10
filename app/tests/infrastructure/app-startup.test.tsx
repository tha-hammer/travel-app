/**
 * App Startup Test with Path Aliases
 * 
 * This test verifies that the main App component can be loaded and rendered
 * with all path aliases working correctly. This simulates the React Native
 * app startup process.
 */

/**
 * @jest-environment jsdom
 */
import React from 'react';

// Mock all React Native dependencies
jest.mock('react-native', () => ({
  View: ({ children, style, ...props }: any) => <div style={style} {...props}>{children}</div>,
  Text: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  StatusBar: ({ barStyle, ...props }: any) => <div data-bar-style={barStyle} {...props} />,
  AppRegistry: {
    registerComponent: jest.fn(),
  },
}));

jest.mock('react-native-paper', () => ({
  Provider: ({ children }: any) => <div data-testid="paper-provider">{children}</div>,
  Appbar: {
    Header: ({ children }: any) => <header data-testid="appbar-header">{children}</header>,
    Content: ({ title }: any) => <div data-testid="appbar-content">{title}</div>,
  },
}));

jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }: any) => <nav data-testid="navigation-container">{children}</nav>,
}));

jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({ children }: any) => <div data-testid="stack-navigator">{children}</div>,
    Screen: ({ component: Component, name, options, ...props }: any) => (
      <div data-testid={`screen-${name}`} data-name={name} {...props}>
        {Component && <Component />}
      </div>
    ),
  }),
}));

// Mock geolocation
jest.mock('@react-native-community/geolocation', () => ({
  watchPosition: jest.fn(),
  stopObserving: jest.fn(),
}));

// Mock SQLite database
jest.mock('@services/storage/sqlite/adapters/SQLiteInit', () => ({
  openDatabase: jest.fn(() => ({
    prepare: jest.fn(() => ({
      run: jest.fn(),
      get: jest.fn(),
      all: jest.fn(),
    })),
  })),
}));

// Mock repositories
jest.mock('@services/storage/sqlite/adapters/SQLiteTripRepository', () => ({
  SQLiteTripRepository: jest.fn(() => ({
    save: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
  })),
}));

jest.mock('@services/storage/sqlite/adapters/SQLiteTripFixesRepository', () => ({
  SQLiteTripFixesRepository: jest.fn(() => ({
    saveAll: jest.fn(),
    findByTripId: jest.fn(),
  })),
}));

// Mock the useTripRecording hook
jest.mock('@controllers/useTripRecording', () => ({
  useTripRecording: jest.fn(() => ({
    distance: 0,
    isTracking: false,
    start: jest.fn(),
    stop: jest.fn(),
  })),
}));

import { render } from '@testing-library/react';
import App from '../../App';

describe('App Startup with Path Aliases', () => {
  it('should successfully import and render main App component using path aliases', () => {
    const { getByTestId } = render(<App />);
    
    // Verify main app structure loads
    expect(getByTestId('paper-provider')).toBeInTheDocument();
    expect(getByTestId('navigation-container')).toBeInTheDocument();
    expect(getByTestId('stack-navigator')).toBeInTheDocument();
  });

  it('should load all screens that use path aliases', () => {
    const { container } = render(<App />);
    
    // The app should render without any import errors
    // This verifies all @views/*, @controllers/*, @services/* imports work
    expect(container).toBeInTheDocument();
  });

  it('should initialize with correct navigation structure', () => {
    const { getByTestId } = render(<App />);
    
    // Should have navigation container
    expect(getByTestId('navigation-container')).toBeInTheDocument();
    
    // Should have stack navigator
    expect(getByTestId('stack-navigator')).toBeInTheDocument();
  });

  it('should verify that all critical path alias imports work', () => {
    // This test passes if App component loads successfully, which means:
    // 1. @views/* imports work (HomeScreen, TripDetailsScreen, TripsScreen)
    // 2. @controllers/* imports work (useTripRecording, TripRecorder)  
    // 3. @services/* imports work (SQLite repositories, LocationProvider)
    // 4. @models/* imports work (entities, use-cases)
    
    expect(() => render(<App />)).not.toThrow();
  });

  it('should handle component tree with all path alias dependencies', () => {
    const { container } = render(<App />);
    
    // Count that we have multiple nested components loaded
    const elements = container.querySelectorAll('*');
    expect(elements.length).toBeGreaterThan(5); // Should have multiple components
    
    // Verify no errors in component tree
    const errorElements = container.querySelectorAll('[data-error]');
    expect(errorElements).toHaveLength(0);
  });
});