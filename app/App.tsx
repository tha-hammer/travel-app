import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider, Appbar } from 'react-native-paper';
import { HomeScreen } from '@views/HomeScreen';
import { TripDetailsScreen } from '@views/TripDetailsScreen';
import { TripsScreen } from '@views/TripsScreen';
import { useTripRecording } from '@controllers/useTripRecording';
import { TripRecorder } from '@controllers/TripRecorder';
import { SQLiteTripRepository } from '@services/storage/sqlite/adapters/SQLiteTripRepository';
import { SQLiteTripFixesRepository } from '@services/storage/sqlite/adapters/SQLiteTripFixesRepository';
import { openDatabase } from '@services/storage/sqlite/adapters/SQLiteInit';
import Geolocation from '@react-native-community/geolocation';
import { LocationProvider } from '@services/location/LocationProvider';

const Stack = createNativeStackNavigator();

function Header({ title }: { title: string }) {
  return <Appbar.Header><Appbar.Content title={title} /></Appbar.Header>;
}

export default function App() {
  // Real adapters
  const recorder = React.useMemo(() => {
    const db = openDatabase();
    const trips = new SQLiteTripRepository(db as any);
    const fixes = new SQLiteTripFixesRepository(db as any);
    const location: LocationProvider = {
      requestWhenInUse: async () => 'prompt',
      requestAlways: async () => 'prompt',
      start: (onFix) => {
        Geolocation.watchPosition(
          (pos) => {
            const { latitude, longitude, accuracy } = pos.coords;
            onFix({ lat: latitude, lon: longitude, accuracy: accuracy ?? 50, timestamp: Date.now() });
          },
          () => {},
          { enableHighAccuracy: true, distanceFilter: 10 }
        );
      },
      stop: () => Geolocation.stopObserving(),
    };
    return new TripRecorder({ trips, fixes, location });
  }, []);
  const controller = useTripRecording(recorder);

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" options={{ header: () => <Header title="Travel App" /> }}>
            {({ navigation }) => (
              <HomeScreen
                controller={controller}
                onStop={() => navigation.navigate('TripDetails' as never)}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="TripDetails" options={{ header: () => <Header title="Trip Details" /> }}>
            {({ navigation }) => (
              <TripDetailsScreen onSave={() => navigation.navigate('Home' as never)} />
            )}
          </Stack.Screen>
          <Stack.Screen name="Trips" options={{ header: () => <Header title="Trips" /> }}>
            {() => <TripsScreen trips={[]} onOpen={() => {}} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
