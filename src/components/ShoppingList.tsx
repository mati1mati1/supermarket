import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Pressable } from 'react-native';

export default function ShoppingList() {
  const [items, setItemAsyncs] = useState<string[]>([]);
  const [newItem, setNewItem] = useState('');

  const addItem = () => {
    setItemAsyncs([...items, newItem]);
    setNewItem('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shopping List</Text>
      <TextInput
        style={styles.input}
        value={newItem}
        onChangeText={setNewItem}
        placeholder="Enter item"
      />
      <Pressable onPress={addItem}>Add</Pressable>
      <FlatList
        data={items}
        renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});
