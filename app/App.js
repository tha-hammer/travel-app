"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
const React = __importStar(require("react"));
const native_1 = require("@react-navigation/native");
const native_stack_1 = require("@react-navigation/native-stack");
const react_native_paper_1 = require("react-native-paper");
const HomeScreen_1 = require("@views/HomeScreen");
const TripDetailsScreen_1 = require("@views/TripDetailsScreen");
const TripsScreen_1 = require("@views/TripsScreen");
const useTripRecording_1 = require("@controllers/useTripRecording");
const TripRecorder_1 = require("@controllers/TripRecorder");
const SQLiteTripRepository_1 = require("@services/storage/sqlite/adapters/SQLiteTripRepository");
const SQLiteTripFixesRepository_1 = require("@services/storage/sqlite/adapters/SQLiteTripFixesRepository");
const SQLiteInit_1 = require("@services/storage/sqlite/adapters/SQLiteInit");
const geolocation_1 = __importDefault(require("@react-native-community/geolocation"));
const Stack = (0, native_stack_1.createNativeStackNavigator)();
function Header({ title }) {
    return <react_native_paper_1.Appbar.Header><react_native_paper_1.Appbar.Content title={title}/></react_native_paper_1.Appbar.Header>;
}
function App() {
    // Real adapters
    const recorder = React.useMemo(() => {
        const db = (0, SQLiteInit_1.openDatabase)();
        const trips = new SQLiteTripRepository_1.SQLiteTripRepository(db);
        const fixes = new SQLiteTripFixesRepository_1.SQLiteTripFixesRepository(db);
        const location = {
            requestWhenInUse: async () => 'prompt',
            requestAlways: async () => 'prompt',
            start: (onFix) => {
                geolocation_1.default.watchPosition((pos) => {
                    const { latitude, longitude, accuracy } = pos.coords;
                    onFix({ lat: latitude, lon: longitude, accuracy: accuracy ?? 50, timestamp: Date.now() });
                }, () => { }, { enableHighAccuracy: true, distanceFilter: 10 });
            },
            stop: () => geolocation_1.default.stopObserving(),
        };
        return new TripRecorder_1.TripRecorder({ trips, fixes, location });
    }, []);
    const controller = (0, useTripRecording_1.useTripRecording)(recorder);
    return (<react_native_paper_1.Provider>
      <native_1.NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" options={{ header: () => <Header title="Travel App"/> }}>
            {({ navigation }) => (<HomeScreen_1.HomeScreen controller={controller} onStop={() => navigation.navigate('TripDetails')}/>)}
          </Stack.Screen>
          <Stack.Screen name="TripDetails" options={{ header: () => <Header title="Trip Details"/> }}>
            {({ navigation }) => (<TripDetailsScreen_1.TripDetailsScreen onSave={() => navigation.navigate('Home')}/>)}
          </Stack.Screen>
          <Stack.Screen name="Trips" options={{ header: () => <Header title="Trips"/> }}>
            {() => <TripsScreen_1.TripsScreen trips={[]} onOpen={() => { }}/>}
          </Stack.Screen>
        </Stack.Navigator>
      </native_1.NavigationContainer>
    </react_native_paper_1.Provider>);
}
