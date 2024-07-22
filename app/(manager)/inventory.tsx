import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, Modal, Alert } from 'react-native';
import { ShopInventory } from '../../src/models';
import { fetchShopInventory } from '../../src/dataFetchers/dataFetchers';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import BarcodeScannerComponent from '../../src/components/BarcodeScannerComponent';

export default function InventoryManagementScreen() {
  const [inventory, setInventory] = useState<ShopInventory[]>([]);
  const [currentItem, setCurrentItem] = useState<ShopInventory | null>(null);
  const [form, setForm] = useState({ ItemName: '', Quantity: '', Price: '', Discount: '', Location: '', Barcode: '' });
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isScannerVisible, setIsScannerVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(await AsyncStorage.getItem('user') || '{}');
        if (user && user.UserID) {
          const shopInventory = await fetchShopInventory(user.UserID);
          if (shopInventory) {
            setInventory(shopInventory);
          }
        }
        setIsDataFetched(true);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  const handleFormChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const validateForm = () => {
    const { ItemName, Quantity, Price, Discount, Location, Barcode } = form;
    if (!ItemName || !Quantity || !Price || !Discount || !Location || !Barcode) {
      Alert.alert('Validation Error', 'All fields are required');
      return false;
    }
    if (isNaN(parseInt(Quantity)) || isNaN(parseFloat(Price)) || isNaN(parseFloat(Discount))) {
      Alert.alert('Validation Error', 'Quantity, Price, and Discount must be numbers');
      return false;
    }
    return true;
  };

  const handleAddItem = () => {
    if (!validateForm()) return;
    const newItem: ShopInventory = {
      InventoryID: Math.random().toString(),
      ItemName: form.ItemName,
      Quantity: parseInt(form.Quantity),
      Price: parseFloat(form.Price),
      Discount: parseFloat(form.Discount),
      Location: form.Location,
      Barcode: form.Barcode,
      SupermarketID: '' // Assuming SupermarketID will be managed elsewhere
    };

    setInventory([...inventory, newItem]);
    AsyncStorage.setItem('ShopInventory', JSON.stringify([...inventory, newItem]));
    setForm({ ItemName: '', Quantity: '', Price: '', Discount: '', Location: '', Barcode: '' });
    setModalVisible(false);
  };

  const handleEditItem = () => {
    if (!validateForm()) return;
    if (currentItem) {
      const updatedInventory = inventory.map(item => 
        item.InventoryID === currentItem.InventoryID 
          ? { ...item, ...form, Quantity: parseInt(form.Quantity), Price: parseFloat(form.Price), Discount: parseFloat(form.Discount) } 
          : item
      );

      setInventory(updatedInventory);
      AsyncStorage.setItem('ShopInventory', JSON.stringify(updatedInventory));
      setCurrentItem(null);
      setForm({ ItemName: '', Quantity: '', Price: '', Discount: '', Location: '', Barcode: '' });
      setModalVisible(false);
    }
  };

  const handleEditClick = (item: ShopInventory) => {
    setCurrentItem(item);
    setForm({ 
      ItemName: item.ItemName, 
      Quantity: item.Quantity.toString(), 
      Price: item.Price.toString(), 
      Discount: item.Discount.toString(), 
      Location: item.Location, 
      Barcode: item.Barcode 
    });
    setIsEditing(true);
    setModalVisible(true);
  };

  const openAddItemModal = () => {
    setForm({ ItemName: '', Quantity: '', Price: '', Discount: '', Location: '', Barcode: '' });
    setIsEditing(false);
    setModalVisible(true);
  };

  const handleBarCodeScanned = (barcode: string) => {
    setForm((form) => ({ ...form, Barcode: barcode }));
    setIsScannerVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventory Management</Text>
      <Button title="Add Item" onPress={openAddItemModal} />

      <FlatList
        data={inventory}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.item}>
              {item.ItemName} - Quantity: {item.Quantity} - Price: {item.Price} - Discount: {item.Discount} - Location: {item.Location} - Barcode: {item.Barcode}
            </Text>
            <Button title="Edit" onPress={() => handleEditClick(item)} />
          </View>
        )}
        keyExtractor={(item) => item.InventoryID ? item.InventoryID.toString() : Math.random().toString()} // Use a fallback key if InventoryID is undefined
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <TextInput 
            placeholder="Item Name" 
            value={form.ItemName} 
            onChangeText={(value) => handleFormChange('ItemName', value)} 
            style={styles.input} 
          />
          <TextInput 
            placeholder="Quantity" 
            value={form.Quantity} 
            onChangeText={(value) => handleFormChange('Quantity', value)} 
            style={styles.input} 
            keyboardType="numeric" 
          />
          <TextInput 
            placeholder="Price" 
            value={form.Price} 
            onChangeText={(value) => handleFormChange('Price', value)} 
            style={styles.input} 
            keyboardType="numeric" 
          />
          <TextInput 
            placeholder="Discount" 
            value={form.Discount} 
            onChangeText={(value) => handleFormChange('Discount', value)} 
            style={styles.input} 
            keyboardType="numeric" 
          />
          <TextInput 
            placeholder="Location" 
            value={form.Location} 
            onChangeText={(value) => handleFormChange('Location', value)} 
            style={styles.input} 
          />
          <TextInput 
            placeholder="Barcode" 
            value={form.Barcode} 
            onChangeText={(value) => handleFormChange('Barcode', value)} 
            style={styles.input} 
          />
          <Button 
            title="Scan Barcode" 
            onPress={() => setIsScannerVisible(true)} 
          />
          <Button 
            title={isEditing ? "Update Item" : "Add Item"} 
            onPress={isEditing ? handleEditItem : handleAddItem} 
          />
          <Button
            title="Cancel"
            onPress={() => {
              setModalVisible(false);
              setCurrentItem(null);
            }}
          />
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isScannerVisible}
        onRequestClose={() => {
          setIsScannerVisible(false);
        }}
      >
        <View style={styles.scannerContainer}>
          <BarcodeScannerComponent
            onBarCodeScanned={handleBarCodeScanned}
          />
        </View>
      </Modal>
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
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  item: {
    padding: 10,
    fontSize: 18,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  scannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
