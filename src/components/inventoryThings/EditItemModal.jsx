import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-toast-message';

const EditItemModal = ({ name, id, price, quantity, onClose, onSave }) => {
    const [editedName, setEditedName] = useState(name);
    const [editedId, setEditedId] = useState(id);
    const [editedPrice, setEditedPrice] = useState(price);
    const [editedQuantity, setEditedQuantity] = useState(quantity);
    const [title, setTitle] = useState('Save changes');
    const handleSave = () => {
        let response = onSave(editedName, editedId, editedPrice, editedQuantity);
        if (response){
            // Show success toast
            Toast.show({
                type: 'success',
                text1: 'Item updated!',
                autoHide: false,
            });
            setTitle('Saved');
        } else {
            // Show error toast
            Toast.show({
                type: 'error',
                text1: 'Item not updated',
                text2: 'Please try again',
                autoHide: false,
            });  
            setTitle('Error saving')    
        }
        setTimeout(() => {
            onClose();
            setTitle('Save changes');
        }, 2000);
    };

    return (
        <View style={styles.modalContainer}>
            <Toast />
            <View style={styles.modal}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <FontAwesome name="times" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Please make sure you selected the correct item</Text>
                </View>
                <View style={styles.formContainer}>
                    <View style={styles.formRow}>
                        <Text style={styles.label}>Name:</Text>
                        <TextInput 
                            style={styles.input} 
                            value={editedName} 
                            onChangeText={setEditedName} 
                            placeholder="Enter name"
                        />
                    </View>
                    <View style={styles.formRow}>
                        <Text style={styles.label}>ID:</Text>
                        <TextInput 
                            style={styles.input} 
                            value={editedId.toString()} 
                            onChangeText={setEditedId} 
                            placeholder="ID"
                            keyboardType="numeric"
                            editable={false}
                        />
                    </View>
                    <View style={styles.formRow}>
                        <Text style={styles.label}>Price:</Text>
                        <TextInput 
                            style={styles.input} 
                            value={editedPrice.toString()} 
                            onChangeText={setEditedPrice} 
                            placeholder="Enter price"
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.formRow}>
                        <Text style={styles.label}>Quantity:</Text>
                        <TextInput 
                            style={styles.input} 
                            value={editedQuantity.toString()} 
                            onChangeText={setEditedQuantity} 
                            placeholder="Enter quantity"
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.saveButton}>
                        <Button title={title} onPress={handleSave} />
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        width: '40%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    formContainer: {
        width: '100%',
    },
    formRow: {
        flexDirection: 'column',
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    saveButton: {
        marginTop: 20,
        width: '100%',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
});

export default EditItemModal;
