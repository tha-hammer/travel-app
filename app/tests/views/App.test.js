"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
describe('JSX TypeScript Configuration', () => {
    it('should compile and render JSX without TypeScript errors', () => {
        // This test verifies that JSX compilation works with TypeScript
        const TestComponent = () => (0, jsx_runtime_1.jsx)("div", { "data-testid": "jsx-test", children: "JSX works!" });
        // If this test passes, it means:
        // 1. TypeScript JSX configuration is correct
        // 2. React types are properly installed
        // 3. Jest can handle TSX files
        const element = (0, jsx_runtime_1.jsx)(TestComponent, {});
        expect(element).toBeDefined();
        expect(element.type).toBe(TestComponent);
    });
    it('should handle React component props with TypeScript', () => {
        const TypedComponent = ({ title, count }) => ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { children: title }), (0, jsx_runtime_1.jsxs)("p", { children: ["Count: ", count] })] }));
        const element = (0, jsx_runtime_1.jsx)(TypedComponent, { title: "Test", count: 42 });
        expect(element.props.title).toBe("Test");
        expect(element.props.count).toBe(42);
    });
});
