import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider, Appbar, ActivityIndicator, Text } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HomeScreen } from '@views/HomeScreen';
import { TripDetailsScreen } from '@views/TripDetailsScreen';
import { TripsScreen } from '@views/TripsScreen';
import { useTripRecording } from '@controllers/useTripRecording';
import { TripRecorder } from '@controllers/TripRecorder';
import Geolocation from '@react-native-community/geolocation';
import { LocationProvider } from '@services/location/LocationProvider';
import { InMemoryTripRepository, InMemoryTripFixesRepository } from './tests/fakes';

const Stack = createNativeStackNavigator();

function Header({ title }: { title: string }) {
  return <Appbar.Header><Appbar.Content title={title} /></Appbar.Header>;
}

function LoadingScreen({ error }: { error?: string | null }) {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" />
      <Text variant="bodyMedium" style={{ marginTop: 16, textAlign: 'center' }}>
        {error ? `Error: ${error}\nUsing fallback mode...` : 'Initializing app...'}
      </Text>
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
  const [initError, setInitError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    
    async function initializeDatabase() {
      try {
        console.log('Initializing database...');
        
        // Add timeout to prevent infinite loading
        const timeoutPromise = new Promise<never>((_, reject) => {
          timeoutId = setTimeout(() => reject(new Error('Database initialization timeout')), 10000);
        });
        
        const initPromise = (async () => {
          // Skip SQLite for now and use in-memory storage
          console.log('Using in-memory storage for now...');
          
          const trips = new InMemoryTripRepository();
          const fixes = new InMemoryTripFixesRepository();
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
          
          console.log('Creating TripRecorder...');
          const tripRecorder = new TripRecorder({ trips, fixes, location });
          console.log('TripRecorder created, setting recorder state');
          return tripRecorder;
        })();
        
        const tripRecorder = await Promise.race([initPromise, timeoutPromise]);
        clearTimeout(timeoutId);
        setRecorder(tripRecorder);
        console.log('App initialization complete');
      } catch (error) {
        console.error('Failed to initialize database:', error);
        setInitError(error instanceof Error ? error.message : 'Unknown initialization error');
        clearTimeout(timeoutId);
        
        // Create fallback recorder with in-memory storage
        console.log('Creating fallback recorder...');
        
        const trips = new InMemoryTripRepository();
        const fixes = new InMemoryTripFixesRepository();
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
        console.log('Fallback recorder created');
      }
    }
    
    initializeDatabase();
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const controller = useTripRecording(recorder);

  if (!recorder) {
    return (
      <SafeAreaProvider>
        <PaperProvider>
          <LoadingScreen error={initError} />
        </PaperProvider>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
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
  </SafeAreaProvider>
  );
}
