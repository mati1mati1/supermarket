import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import EditItemModal from './EditItemModal';

const Item = ({ name, price, quantity, id, imageUrl }) => {
    const [modalVisible, setModalVisible] = useState(false);

    const handleEdit = () => {
        setModalVisible(true);
    };

    const handleClose = () => {
        setModalVisible(false);
    };

    const handleSave = (editedName, editedId, editedPrice, editedQuantity) => {
        console.log('Save button pressed');
        console.log({ editedName, editedId, editedPrice, editedQuantity });
        // Add your API call or state update logic here
    };

    return (
        <>
            <View style={styles.card}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: imageUrl }} style={styles.image} />
                </View>
                <View style={styles.divider} />
                <View style={styles.data}>
                    <View style={styles.detailsContainer}>
                        <Text style={styles.name}>{name}</Text>
                        <Text style={styles.text}>Price: {price}$</Text>
                        <Text style={styles.text}>Quantity: {quantity}</Text>
                        <Text style={styles.text}>ID: {id}</Text>
                    </View>
                    <TouchableOpacity onPress={handleEdit}>
                        <FontAwesome name="edit" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleClose}
            >
                <EditItemModal 
                    name={name} 
                    id={id} 
                    price={price} 
                    quantity={quantity} 
                    onClose={handleClose} 
                    onSave={handleSave}
                />
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '70%',
        backgroundColor: '#fff',
        height: 350,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        marginHorizontal: 16,
        marginVertical: 8,
        overflow: 'hidden',
    },
    imageContainer: {
        height: '55%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '80%',
        height: '100%',
        resizeMode: 'cover',
    },
    divider: {
        height: 1,
        backgroundColor: '#ccc',
    },
    detailsContainer: {
        padding: 16,
    },
    data: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'end',
        flexDirection: 'row',
        padding: 12,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        margin: 4,
    },
    text: {
        fontSize: 16,
        margin: 4,
    },
});

export default Item;
