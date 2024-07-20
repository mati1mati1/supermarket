import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Modal, Pressable } from 'react-native';
import { getShoppingListsByBuyerId } from '../api/api';
import { ShoppingList } from '../models';
import AsyncStorage from '@react-native-async-storage/async-storage'; 


interface SelectListModalProps {
  visible: boolean;
  closeModal: () => void;
}

const SelectListModal: React.FC<SelectListModalProps> = ({ visible, closeModal }) => {
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [selectedList, setSelectedList] = useState<ShoppingList | null>(null);
  const [isDataFetched, setIsDataFetched] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(await AsyncStorage.getItem('user') || '{}');
        if (user && user.UserID) {
          const fetchedShoppingLists = await getShoppingListsByBuyerId(user.UserID);
          if (fetchedShoppingLists) {
            setShoppingLists(fetchedShoppingLists);
            AsyncStorage.setItem('ShoppingLists', JSON.stringify(fetchedShoppingLists));
          }
        }
        setIsDataFetched(true);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSelectList = (list: ShoppingList) => {
    setSelectedList(list);
  };

  const handleConfirmSelection = () => {
    if (selectedList) {
      closeModal(); // Close the modal
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={closeModal}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Select Shopping List</Text>
          <FlatList
            data={shoppingLists}
            keyExtractor={(item) => item.ListID}
            renderItem={({ item }) => (
              <Pressable
                style={styles.item}
                onPress={() => handleSelectList(item)}
              >
                <Text style={selectedList?.ListID === item.ListID ? styles.selectedItem : styles.itemText}>
                  {item.ListName}
                </Text>
              </Pressable>
            )}
          />
          <Pressable onPress={handleConfirmSelection} disabled={!selectedList}>
            <Text style={styles.buttonText}>Select List</Text>
          </Pressable>
          <Pressable onPress={closeModal}>
            <Text style={styles.buttonText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  item: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  itemText: {
    fontSize: 18,
  },
  selectedItem: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'blue',
  },
  buttonText: {
    fontSize: 18,
  },
});

export default SelectListModal;
