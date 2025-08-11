/**
 * @format
 */

import React from 'react';
import { AppRegistry, View } from 'react-native';
import { Provider as PaperProvider, Text, Button } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { name as appName } from './app.json';

function TravelApp() {
  console.log('TravelApp rendering with React Native Paper');
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text variant="headlineLarge" style={{ marginBottom: 32 }}>Travel App</Text>
          <Text variant="bodyLarge" style={{ marginBottom: 24 }}>0.00 mi</Text>
          <Button 
            mode="contained" 
            onPress={() => console.log('GO button pressed!')}
            style={{ paddingHorizontal: 32 }}
          >
            GO
          </Button>
        </View>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

AppRegistry.registerComponent(appName, () => TravelApp);
