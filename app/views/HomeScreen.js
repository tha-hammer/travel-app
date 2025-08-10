"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeScreen = HomeScreen;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_native_1 = require("react-native");
const react_native_paper_1 = require("react-native-paper");
function HomeScreen({ controller, onStop }) {
    const miles = controller.distanceMeters / 1609.34;
    return ((0, jsx_runtime_1.jsx)(react_native_1.View, { style: { flex: 1, padding: 16, justifyContent: 'center' }, children: (0, jsx_runtime_1.jsxs)(react_native_paper_1.Card, { mode: "elevated", style: { padding: 24, alignItems: 'center' }, children: [(0, jsx_runtime_1.jsx)(react_native_paper_1.Text, { variant: "headlineMedium", children: "Distance" }), (0, jsx_runtime_1.jsxs)(react_native_paper_1.Text, { variant: "displaySmall", children: [miles.toFixed(2), " mi"] }), controller.isTracking ? ((0, jsx_runtime_1.jsx)(react_native_paper_1.Button, { mode: "contained", buttonColor: "#d32f2f", onPress: async () => { await controller.stop(); onStop?.(); }, style: { marginTop: 24 }, children: "STOP" })) : ((0, jsx_runtime_1.jsx)(react_native_paper_1.Button, { mode: "contained", onPress: controller.start, style: { marginTop: 24 }, children: "GO" }))] }) }));
}
