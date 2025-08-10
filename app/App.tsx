import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider, Appbar, ActivityIndicator } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
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

function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default function App() {
  const [recorder, setRecorder] = React.useState<TripRecorder | null>(null);

  React.useEffect(() => {
    async function initializeDatabase() {
      try {
        const db = await openDatabase();
        const trips = new SQLiteTripRepository(db);
        const fixes = new SQLiteTripFixesRepository(db);
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
        setRecorder(new TripRecorder({ trips, fixes, location }));
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    }
    
    initializeDatabase();
  }, []);

  const controller = useTripRecording(recorder);

  if (!recorder) {
    return (
      <PaperProvider>
        <LoadingScreen />
      </PaperProvider>
    );
  }

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
