/**
 * @jest-environment jsdom
 */
import React from 'react';

describe('JSX TypeScript Configuration', () => {
  it('should compile and render JSX without TypeScript errors', () => {
    // This test verifies that JSX compilation works with TypeScript
    const TestComponent = () => <div data-testid="jsx-test">JSX works!</div>;
    
    // If this test passes, it means:
    // 1. TypeScript JSX configuration is correct
    // 2. React types are properly installed
    // 3. Jest can handle TSX files
    const element = <TestComponent />;
    expect(element).toBeDefined();
    expect(element.type).toBe(TestComponent);
  });

  it('should handle React component props with TypeScript', () => {
    interface TestProps {
      title: string;
      count: number;
    }
    
    const TypedComponent: React.FC<TestProps> = ({ title, count }) => (
      <div>
        <h1>{title}</h1>
        <p>Count: {count}</p>
      </div>
    );
    
    const element = <TypedComponent title="Test" count={42} />;
    expect(element.props.title).toBe("Test");
    expect(element.props.count).toBe(42);
  });
});