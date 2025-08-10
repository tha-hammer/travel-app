"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeScreen = HomeScreen;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const react_native_paper_1 = require("react-native-paper");
function HomeScreen({ controller, onStop }) {
    const miles = controller.distanceMeters / 1609.34;
    return (<react_native_1.View style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
      <react_native_paper_1.Card mode="elevated" style={{ padding: 24, alignItems: 'center' }}>
        <react_native_paper_1.Text variant="headlineMedium">Distance</react_native_paper_1.Text>
        <react_native_paper_1.Text variant="displaySmall">{miles.toFixed(2)} mi</react_native_paper_1.Text>
        {controller.isTracking ? (<react_native_paper_1.Button mode="contained" buttonColor="#d32f2f" onPress={async () => { await controller.stop(); onStop?.(); }} style={{ marginTop: 24 }}>
            STOP
          </react_native_paper_1.Button>) : (<react_native_paper_1.Button mode="contained" onPress={controller.start} style={{ marginTop: 24 }}>
            GO
          </react_native_paper_1.Button>)}
      </react_native_paper_1.Card>
    </react_native_1.View>);
}
