import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider, Appbar } from 'react-native-paper';
import { HomeScreen } from '@views/HomeScreen';
import { TripDetailsScreen } from '@views/TripDetailsScreen';
import { TripsScreen } from '@views/TripsScreen';
import { useTripRecording } from '@controllers/useTripRecording';
import { TripRecorder } from '@controllers/TripRecorder';
import { InMemoryTripRepository } from '@tests/fakes/InMemoryTripRepository';
import { InMemoryTripFixesRepository } from '@tests/fakes/InMemoryTripFixesRepository';
import { FakeLocationProvider } from '@tests/fakes/FakeLocationProvider';

const Stack = createNativeStackNavigator();

function Header({ title }: { title: string }) {
  return <Appbar.Header><Appbar.Content title={title} /></Appbar.Header>;
}

export default function App() {
  // For scaffolding/demo, wire fakes. Replace with real adapters during integration.
  const recorder = React.useMemo(() => {
    return new TripRecorder({
      trips: new InMemoryTripRepository(),
      fixes: new InMemoryTripFixesRepository(),
      location: new FakeLocationProvider() as any,
    });
  }, []);
  const controller = useTripRecording(recorder);

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" options={{ header: () => <Header title="Travel App" /> }}>
            {() => <HomeScreen controller={controller} />}
          </Stack.Screen>
          <Stack.Screen name="TripDetails" options={{ header: () => <Header title="Trip Details" /> }}>
            {() => (
              <TripDetailsScreen onSave={() => {}} />
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
