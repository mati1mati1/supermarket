import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator, Modal, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { createShoppingList, getShoppingListsByBuyerId, deleteShoppingList } from '../../../src/api/api';
import { ShoppingList } from '../../../src/models';
import { useAuth } from 'src/context/AuthContext';

const ShoppingCartListScreen = () => {
  const router = useRouter();
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [selectedCartId, setSelectedCartId] = useState('');
  const { authState } = useAuth();
  const token = authState.token;

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        console.error('Token not found');
        return;
      }
      try {
        debugger
        const storedShoppingLists = await getShoppingListsByBuyerId(token);
        if (storedShoppingLists) {
          setShoppingLists(storedShoppingLists);
        }
      } catch (error) {
        console.error('Error fetching shopping lists:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleAddCart = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setNewListName('');
  };

  const handleAdd = async () => {
    if (shoppingLists.some(list => list.ListName === newListName)) {
      alert('A shopping list with this name already exists.');
      return;
    }
    setIsModalVisible(false);
    try {
      const response = await createShoppingList(newListName, token || '');
      setShoppingLists(prevLists => [...prevLists, response[0]]);
      setNewListName('');
      router.push({
        pathname: '/shoppingList/[edit-list]',
        params: { cardId: response[0].ListID, ListName: newListName }
      });
    } catch (error) {
      console.error('Error creating shopping list:', error);
    }
  };

  const handleEditCart = (cartId: string, listName: string) => {
    router.push({
      pathname: '/shoppingList/[edit-list]',
      params: { cardId: cartId, ListName: listName }
    });
  };

  const confirmDeleteCart = (cartId: string) => {
    setSelectedCartId(cartId);
    setIsConfirmModalVisible(true);
  };

  const handleDeleteCart = async () => {
    setIsConfirmModalVisible(false);
    try {
      await deleteShoppingList(selectedCartId, token || '');
      setShoppingLists(prevLists => prevLists.filter(list => list.ListID !== selectedCartId));
    } catch (error) {
      console.error('Error deleting shopping list:', error);
    }
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
      <FlatList
        data={shoppingLists}
        keyExtractor={(item) => item.ListID}
        renderItem={({ item }) => (
          <View style={styles.listItemContainer}>
            <Pressable
              style={styles.item}
              onPress={() => handleEditCart(item.ListID, item.ListName)}
            >
              <Text>{item.ListName}</Text>
            </Pressable>
            <Pressable style={styles.deleteButton} onPress={() => confirmDeleteCart(item.ListID)}>
              <Text style={styles.buttonText}>Delete</Text>
            </Pressable>
          </View>
        )}
      />
      <Pressable style={styles.button} onPress={handleAddCart}>
        <Text style={styles.buttonText}>Add Shopping Cart</Text>
      </Pressable>

      <Modal
        visible={isModalVisible}
        transparent={true}
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add Shopping List</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter list name"
              value={newListName}
              onChangeText={setNewListName}
            />
            <View style={styles.modalButtons}>
              <Pressable style={[styles.modalButton, styles.addButton]} onPress={handleAdd}>
                <Text style={styles.buttonText}>Add</Text>
              </Pressable>
              <Pressable style={[styles.modalButton, styles.cancelButton]} onPress={handleCancel}>
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isConfirmModalVisible}
        transparent={true}
        onRequestClose={() => setIsConfirmModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirm Delete</Text>
            <Text>Are you sure you want to delete this shopping list?</Text>
            <View style={styles.modalButtons}>
              <Pressable style={[styles.modalButton, styles.deleteButton]} onPress={handleDeleteCart}>
                <Text style={styles.buttonText}>Delete</Text>
              </Pressable>
              <Pressable style={[styles.modalButton, styles.cancelButton]} onPress={() => setIsConfirmModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  listItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  item: {
    flex: 1,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: '#007bff',
    marginRight: 5,
  },
  cancelButton: {
    backgroundColor: '#ccc',
    marginLeft: 5,
  },
});

export default ShoppingCartListScreen;
