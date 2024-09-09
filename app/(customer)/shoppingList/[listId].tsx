import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ShoppingListItem } from '../../../src/models';
import { updateShoppingListItems, getShoppingListItemByCardId } from '../../../src/api/api';
import { useAuth } from '../../../src/context/AuthContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-toast-message';
import { launchImageLibrary } from 'react-native-image-picker';
import { Image } from 'react-native';
import {uploadGroceryListImage, uploadRecipeUrl } from '../../../src/api/api';
import { Alert } from 'react-native';

export default function EditListScreen() {
  let { listId, ListName } = useLocalSearchParams<{ listId: string; ListName?: string }>();
  const { authState } = useAuth();
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [newItem, setNewItem] = useState('');
  const [newQuantity, setNewQuantity] = useState('1');
  const [loading, setLoading] = useState(true);
  const [listName, setListName] = useState('');
  const [image, setImage] = useState<{ uri: string } | null>(null);
  const [recipeUrl, setRecipeUrl] = useState<string>('');
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (listId! && listId !== '0' && listId !== '') {
          const fetchedItems = await getShoppingListItemByCardId(listId || '');
          setItems(fetchedItems);
        }
        if (ListName !== '') {
          setListName(ListName || '');
        }
      } catch (error) {
        console.error('Error fetching shopping list items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [listId, ListName]);

  const handleUploadImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
        Toast.show({
          type: 'info',
          text1: 'Cancelled',
        });
        //for mobile:
        Alert.alert('Cancelled', 'User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
        Toast.show({
          type: 'error',
          text1: 'Please try again with a different image',
        });
        Alert.alert('Error', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const source = { uri: response.assets[0].uri as string };
        setImage(source);
        try {
          const res = await uploadGroceryListImage(source.uri);
          if (res.success) {
            const itemsList = res.list;
            const parsedItems = itemsList.filter(item => {
              const [quantity, ...nameParts] = item.split(' ');
              const itemName = nameParts.join(' ').trim();
              return itemName && itemName.toLowerCase() !== 'nan';
            }).map(item => {
              const [quantity, ...nameParts] = item.split(' ');
              const itemName = nameParts.join(' ');
              return {
                ItemID: Date.now().toString() + Math.random().toString(36).substr(2, 9), // unique ID
                ItemName: itemName.trim(),
                Quantity: parseInt(quantity),
                ListItemID: '',
                ListID: ''
              };
            });
            setItems(prevItems => [...prevItems, ...parsedItems]);
          } else {
            Toast.show({
              type: 'error',
              text1: 'Please try again with a different image',
            });
            Alert.alert('Error', 'Please try again with a different image');
          }
        } catch (error) {
          Toast.show({
            type: 'error',
            text1: 'Please try again later, we had a problem',
          });
          Alert.alert('Error', 'Please try again later, we had a problem');
        }
      }
    });
  };

  const handleRecipe = async () => {
    const res = await uploadRecipeUrl(recipeUrl);
    if (res.success) {
        // Parse the returned items and set quantity to 1
      const parsedItems = res.list.map(item => ({
        ItemID: Date.now().toString() + Math.random().toString(36).substr(2, 9), // unique ID
        ItemName: item.trim(),
        Quantity: 1,
        ListItemID: '',
        ListID: ''
      }));
      // Add parsed items to the existing items in the list
      setItems(prevItems => [...prevItems, ...parsedItems]);
    } else {
      Toast.show({
        type: 'error',
        text1: 'Please try again with a different URL',
      });
      Alert.alert('Error', 'Please try again with a different URL');
    }
    setRecipeUrl('');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }
  const addItem = () => {
    if (newItem.trim() !== '') {
      setItems([...items, {
        ItemID: Date.now().toString(), ItemName: newItem, Quantity: parseInt(newQuantity),
        ListItemID: '',
        ListID: ''
      }]);
      setNewItem('');
      setNewQuantity('1');
    }
  };

  const removeItem = (itemId: string) => {
    setItems(items.filter(item => item.ItemID !== itemId));
  };

  const saveList = async () => {
    if (items.length > 0) {
      await updateShoppingListItems(listId || '', items);
    } else {
      alert('A shopping list must have at least one item.');
      return;
    }
    router.push("/shoppingList/shoppingCartList");
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Toast position='bottom' bottomOffset={60}/>

      <View style={styles.header}>
        <Text style={styles.title}>Add Items to List: {listName}</Text>
      </View>
      <Pressable style={styles.button} onPress={handleUploadImage}>
        <Text style={styles.buttonText}>Add a List From Image</Text>
      </Pressable>
      <View style={styles.modalButtons}>
        <TextInput
          style={[styles.input, {width: '55%'}, {marginRight: 20}] }
          placeholder="Enter Recipe URL"
          value={recipeUrl}
          onChangeText={setRecipeUrl}
        />
        <Pressable style={[styles.button, {width: '45%'}]} onPress={handleRecipe}>
          <Text style={styles.buttonText}>Get Ingredients</Text>
        </Pressable>
      </View>
      {image && <Image source={image} />}
      <TextInput
        style={styles.input}
        value={newItem}
        onChangeText={setNewItem}
        placeholder="Enter item"
      />
      <TextInput
        style={styles.input}
        value={newQuantity}
        onChangeText={setNewQuantity}
        placeholder="Enter quantity"
        keyboardType="numeric"
      />
      <Pressable style={styles.button} onPress={addItem}>
        <Text style={styles.buttonText}>Add Item</Text>
      </Pressable>
      <View style={styles.borderBottom}></View>
      <FlatList
        data={items}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={styles.itemDetails}>
              <Text style={styles.item}>{item.ItemName}</Text>
              <Text style={styles.quantity}>Qty: {item.Quantity}</Text>
            </View>
            <Pressable style={styles.deleteButton} onPress={() => removeItem(item.ItemID)}>
              <Icon name="trash" size={24} color="#FF6347" />
            </Pressable>
          </View>
        )}
        keyExtractor={(item) => item.ItemID}
        contentContainerStyle={styles.listContent}
      />
      <Pressable style={styles.topButton} onPress={saveList}>
      <View style={styles.iconTextContainer}>
        <Icon name="save" size={20} color="#fff" />
        <Text style={[styles.topButtonText, {marginLeft:15}]}>Save List</Text>
      </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  topButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignItems: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
  },
  topButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  listName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  borderBottom : {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  button: {
    height: 50,
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemDetails: {
    flex: 1,
    marginRight: 10,
  },
  item: {
    fontSize: 18,
    fontWeight: '600',
  },
  quantity: {
    fontSize: 16,
    color: '#888',
  },
  deleteButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 14,
    // fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 20,
  },
});
