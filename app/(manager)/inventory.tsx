import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, Alert, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Table, TableWrapper, Row, Rows } from 'react-native-table-component';
import { ShopInventory } from '../../src/models';
import { addShopInventory, getShopInventory, getSupermarketByUserId, updateShopInventory, deleteShopInventory } from '../../src/api/api';
import { v4 as uuidv4 } from 'uuid'; // Ensure uuid is installed
import ScanItem from '../../src/components/Scanner';
import { useAuth } from '../../src/context/AuthContext';

export default function InventoryManagementScreen() {
  const [inventory, setInventory] = useState<ShopInventory[]>([]);
  const [supermarketID, setSupermarketID] = useState<string>('');
  const [currentItem, setCurrentItem] = useState<ShopInventory | null>(null);
  const [form, setForm] = useState({ ItemName: '', Quantity: '', Price: '', Discount: '', Location: '', Barcode: '' });
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isScannedDataOpen, setScannedDataModalOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ShopInventory | null>(null);
  const { authState } = useAuth();
  const token = authState.token;
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      try {
        const shopInventory = await getShopInventory(token);
        if (shopInventory) {
          setInventory(shopInventory);
        }
        setIsDataFetched(true);
        const supermarket = await getSupermarketByUserId(token);
        if (supermarket) {
          setSupermarketID(supermarket[0].SupermarketID);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, [token]);

  const handleFormChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const validateForm = () => {
    const { ItemName, Quantity, Price, Discount, Location, Barcode } = form;
    if (!ItemName || !Quantity || !Price || !Discount || !Location || !Barcode) {
      alert('All fields are required');
      return false;
    }
    if (isNaN(parseInt(Quantity)) || isNaN(parseFloat(Price)) || isNaN(parseFloat(Discount))) {
      alert('Quantity, Price, and Discount must be numbers');
      return false;
    }
    if (inventory.some(item => item.ItemName === ItemName && (!isEditing || (isEditing && currentItem && item.InventoryID !== currentItem.InventoryID)))) {
      alert('An item with this name already exists');
      return false;
    }
    return true;
  };

  const toggleIsScannedDataOpen = () => {
    setScannedDataModalOpen(!isScannedDataOpen);
  };

  const handleScannedBarcode = async (data: string) => {
    setForm({ ...form, Barcode: data });
    setScannedDataModalOpen(false);
  };

  const handleAddItem = async () => {
    if (!validateForm()) return;
    const newItem: ShopInventory = {
      InventoryID: uuidv4(),
      ItemName: form.ItemName,
      Quantity: parseInt(form.Quantity),
      Price: parseFloat(form.Price),
      Discount: parseFloat(form.Discount),
      Location: form.Location,
      Barcode: form.Barcode,
      SupermarketID: supermarketID
    };
    const response = await addShopInventory(token || '', newItem);
    newItem.InventoryID = response[0];
    setInventory([...inventory, newItem]);
    setForm({ ItemName: '', Quantity: '', Price: '', Discount: '', Location: '', Barcode: '' });
    setModalVisible(false);
  };

  const handleEditItem = async () => {
    if (!validateForm()) return;
    if (currentItem) {
      const updatedItem = {
        ...currentItem,
        ItemName: form.ItemName,
        Quantity: parseInt(form.Quantity),
        Price: parseFloat(form.Price),
        Discount: parseFloat(form.Discount),
        Location: form.Location,
        Barcode: form.Barcode
      };

      await updateShopInventory(token || '', updatedItem);

      const updatedInventory = inventory.map(item =>
        item.InventoryID === currentItem.InventoryID
          ? updatedItem
          : item
      );

      setInventory(updatedInventory);
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

  const handleDeleteItem = async (item: ShopInventory) => {
    setItemToDelete(item);
    setDeleteModalVisible(true);
  };

  const confirmDeleteItem = async () => {
    if (itemToDelete) {
      await deleteShopInventory(token || '',itemToDelete.InventoryID);
      setInventory(inventory.filter(i => i.InventoryID !== itemToDelete.InventoryID));
      setDeleteModalVisible(false);
      setItemToDelete(null);
    }
  };

  const openAddItemModal = () => {
    setForm({ ItemName: '', Quantity: '', Price: '', Discount: '', Location: '', Barcode: '' });
    setIsEditing(false);
    setModalVisible(true);
  };

  const renderEditButton = (data: any, index: number) => (
    <View style={styles.buttonGroup}>
      <Button title="Edit" onPress={() => handleEditClick(inventory[index])} />
      <Button title="Delete" onPress={() => handleDeleteItem(inventory[index])} color="red" />
    </View>
  );

  const filteredInventory = inventory.filter(item =>
    item.ItemName.toLowerCase().includes(filter.toLowerCase()) ||
    item.Barcode.includes(filter)
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Filter items"
        style={styles.input}
        value={filter}
        onChangeText={setFilter}
      />
      <Button title="Add Item" onPress={openAddItemModal} />

      <ScrollView horizontal>
        <ScrollView>
          <View style={styles.tableContainer}>
            <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
              <Row
                data={['Item Name', 'Quantity', 'Price', 'Discount', 'Location', 'Barcode', 'Actions']}
                style={styles.head}
                textStyle={styles.text}
                widthArr={[screenWidth / 7, screenWidth / 7, screenWidth / 7, screenWidth / 7, screenWidth / 7, screenWidth / 7, screenWidth / 7]}
              />
              <TableWrapper style={styles.wrapper}>
                <Rows
                  data={filteredInventory.map(item => [
                    item.ItemName,
                    item.Quantity,
                    item.Price,
                    item.Discount,
                    item.Location,
                    item.Barcode,
                    renderEditButton(null, inventory.indexOf(item))
                  ])}
                  textStyle={styles.text}
                  widthArr={[screenWidth / 7, screenWidth / 7, screenWidth / 7, screenWidth / 7, screenWidth / 7, screenWidth / 7, screenWidth / 7]}
                />
              </TableWrapper>
            </Table>
          </View>
        </ScrollView>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            {['Item Name', 'Quantity', 'Price', 'Discount', 'Location', 'Barcode'].map((placeholder, index) => (
              <View style={styles.inputContainer} key={index}>
                <Text style={styles.label}>{placeholder}</Text>
                <TextInput
                  placeholder={placeholder}
                  value={form[placeholder.replace(' ', '')]}
                  onChangeText={(value) => handleFormChange(placeholder.replace(' ', ''), value)}
                  style={styles.input}
                  keyboardType={placeholder === 'Quantity' || placeholder === 'Price' || placeholder === 'Discount' ? 'numeric' : 'default'}
                />
              </View>
            ))}

            <View style={styles.buttonRow}>
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
              <Button
                title="Scan Barcode"
                onPress={toggleIsScannedDataOpen}
              />
              <Modal visible={isScannedDataOpen} transparent={true} onRequestClose={toggleIsScannedDataOpen}>
                <TouchableOpacity style={styles.modalOverlay} onPress={toggleIsScannedDataOpen}>
                  <View style={styles.modal} onStartShouldSetResponder={() => true}>
                    <ScanItem handleData={handleScannedBarcode} />
                  </View>
                </TouchableOpacity>
              </Modal>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => {
          setDeleteModalVisible(!deleteModalVisible);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Are you sure you want to delete this item?</Text>
            <View style={styles.buttonRow}>
              <Button
                title="Delete"
                onPress={confirmDeleteItem}
                color="red"
              />
              <Button
                title="Cancel"
                onPress={() => setDeleteModalVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  tableContainer: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
    backgroundColor: '#fff',
  },
  head: {
    height: 50,
    backgroundColor: '#f1f8ff',
  },
  wrapper: {
    flexDirection: 'row',
  },
  text: {
    margin: 6,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  label: {
    width: '30%',
    textAlign: 'right',
    paddingRight: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    width: '70%',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  buttonGroup: {
    flexDirection: 'row',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
