import React from 'react';
import { FlatList } from 'react-native';
import { List } from 'react-native-paper';
import { Trip } from '@models/entities/Trip';

export function TripsScreen({ trips, onOpen }: { trips: Trip[]; onOpen: (trip: Trip) => void }) {
  return (
    <FlatList
      data={trips}
      keyExtractor={(t) => t.id}
      renderItem={({ item }) => (
        <List.Item
          title={`${new Date(item.startAt).toLocaleDateString()} — ${(item.distanceMeters / 1609.34).toFixed(2)} mi`}
          description={item.title || item.notes}
          onPress={() => onOpen(item)}
        />
      )}
    />
  );
}
