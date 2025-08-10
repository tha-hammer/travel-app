"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
// Mock React Native components
jest.mock('react-native', () => ({
    View: ({ children }) => (0, jsx_runtime_1.jsx)("div", { children: children }),
}));
jest.mock('react-native-paper', () => ({
    Button: ({ children, onPress }) => (0, jsx_runtime_1.jsx)("button", { onClick: onPress, children: children }),
    Text: ({ children }) => (0, jsx_runtime_1.jsx)("span", { children: children }),
    Card: ({ children }) => (0, jsx_runtime_1.jsx)("div", { children: children }),
}));
const react_1 = require("@testing-library/react");
const HomeScreen_1 = require("../../views/HomeScreen");
describe('HomeScreen', () => {
    it('should render GO button when not recording', () => {
        const mockController = {
            distanceMeters: 0,
            isTracking: false,
            start: jest.fn(),
            stop: jest.fn(),
        };
        const { getByText } = (0, react_1.render)((0, jsx_runtime_1.jsx)(HomeScreen_1.HomeScreen, { controller: mockController }));
        expect(getByText('GO')).toBeInTheDocument();
    });
    it('should render STOP button when recording', () => {
        const mockController = {
            distanceMeters: 1000,
            isTracking: true,
            start: jest.fn(),
            stop: jest.fn(),
        };
        const { getByText } = (0, react_1.render)((0, jsx_runtime_1.jsx)(HomeScreen_1.HomeScreen, { controller: mockController }));
        expect(getByText('STOP')).toBeInTheDocument();
    });
});
