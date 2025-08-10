import React from 'react';
import { View } from 'react-native';
import { Button, Text, Card } from 'react-native-paper';
import { TripRecordingController } from '@controllers/useTripRecording';

export function HomeScreen({ controller }: { controller: TripRecordingController }) {
  const miles = controller.distanceMeters / 1609.34;
  return (
    <View style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
      <Card mode="elevated" style={{ padding: 24, alignItems: 'center' }}>
        <Text variant="headlineMedium">Distance</Text>
        <Text variant="displaySmall">{miles.toFixed(2)} mi</Text>
        {controller.isTracking ? (
          <Button mode="contained" buttonColor="#d32f2f" onPress={controller.stop} style={{ marginTop: 24 }}>
            STOP
          </Button>
        ) : (
          <Button mode="contained" onPress={controller.start} style={{ marginTop: 24 }}>
            GO
          </Button>
        )}
      </Card>
    </View>
  );
}
