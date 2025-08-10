import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, TextInput, Switch, Text } from 'react-native-paper';

export interface TripDetailsProps {
  onSave(details: { title: string; notes?: string; saveAsRoutine: boolean }): void;
  initial?: { title?: string; notes?: string };
}

export function TripDetailsScreen({ onSave, initial }: TripDetailsProps) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [saveAsRoutine, setSaveAsRoutine] = useState(false);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput label="Title/Purpose" value={title} onChangeText={setTitle} style={{ marginBottom: 12 }} />
      <TextInput label="Notes" value={notes} onChangeText={setNotes} multiline numberOfLines={3} style={{ marginBottom: 12 }} />
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
        <Switch value={saveAsRoutine} onValueChange={setSaveAsRoutine} />
        <Text style={{ marginLeft: 8 }}>Save as routine</Text>
      </View>
      <Button mode="contained" onPress={() => onSave({ title, notes, saveAsRoutine })}>
        Save
      </Button>
    </View>
  );
}
