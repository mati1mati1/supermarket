import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function OrderManagementScreen() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'myOrders', title: 'My Orders' },
    { key: 'ordersFromCustomers', title: 'Orders from Customers' },
  ]);

  const [myOrdersList, setMyOrdersList] = useState([]);
  const [customersOrdersList, setCustomersOrdersList] = useState([]);

  useEffect(() => {
    // Simulate fetching orders from API
    const myOrders = [
      {
        id: 1,
        status: 'Pending',
        orders: [
          { id: 1, product: 'Banana', quantity: 10, price: 5 },
          { id: 2, product: 'Flour', quantity: 5, price: 10 },
          { id: 3, product: 'Milk', quantity: 20, price: 3 },
          { id: 4, product: 'Eggs', quantity: 15, price: 4 },
        ]
      },
      {
        id: 2,
        status: 'Canceled',
        orders: [
          { id: 5, product: 'Apples', quantity: 12, price: 3 },
          { id: 6, product: 'Cheese', quantity: 8, price: 7 },
        ]
      },
    ];

    const customersOrders = [
      {
        id: 1,
        status: 'Delivered',
        orders: [
          { id: 1, product: 'Orange', quantity: 15, price: 6 },
          { id: 2, product: 'Bread', quantity: 4, price: 2 },
        ]
      },
      {
        id: 2,
        status: 'Pending',
        orders: [
          { id: 3, product: 'Butter', quantity: 3, price: 5 },
          { id: 4, product: 'Juice', quantity: 6, price: 4 },
        ]
      },
    ];

    setMyOrdersList(myOrders);
    setCustomersOrdersList(customersOrders);
  }, []);

  const calculateTotal = (item) => {
    return item.quantity * item.price;
  };

  const getColorIcon = (status) => {
    switch (status) {
      case 'Pending':
        return 'orange';
      case 'Delivered':
        return 'blue';
      case 'Canceled':
        return 'red';
      default:
        return 'black';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return 'spinner';
      case 'Delivered':
        return 'check-circle';
      case 'Canceled':
        return 'times-circle';
      default:
        return 'question-circle';
    }
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderContainer}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderHeaderText}>Order #{item.id}</Text>
        <FontAwesome name={getStatusIcon(item.status)} size={32} color={getColorIcon(item.status)} style={styles.icon} />
      </View>
      <Text style={styles.orderStatus}>Status: {item.status}</Text>
      <FlatList
        data={item.orders}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.itemHeader}>
              <Text style={styles.productName}>{item.product}</Text>
            </View>
            <View style={styles.itemDetails}>
              <Text>Quantity: {item.quantity}</Text>
              <Text>Price: ${item.price}</Text>
              <Text>Total: ${calculateTotal(item)}</Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'myOrders':
        return (
          <FlatList
            data={myOrdersList}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id.toString()}
          />
        );
      case 'ordersFromCustomers':
        return (
          <FlatList
            data={customersOrdersList}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id.toString()}
          />
        );
      default:
        return null;
    }
  };

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={styles.indicatorStyle}
      style={styles.tabBar}
      renderLabel={({ route, focused }) => (
        <View style={[styles.tabLabelContainer, focused && styles.tabLabelContainerFocused]}>
          <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>
            {route.title}
          </Text>
        </View>
      )}
    />
  );

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: Dimensions.get('window').width }}
      renderTabBar={renderTabBar}
    />
  );
}

const styles = StyleSheet.create({
  orderContainer: {
    flex: 1,
    padding: 20,
    marginVertical: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    width: '80%',
    alignSelf: 'center',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  orderHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  orderStatus: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemDetails: {
    marginBottom: 5,
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  icon: {
    marginLeft: 10,
  },
  tabBar: {
    backgroundColor: 'white',
    elevation: 0,
    shadowOpacity: 0,
  },
  indicatorStyle: {
    backgroundColor: 'transparent',
  },
  tabLabelContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  tabLabelContainerFocused: {
    backgroundColor: 'blue',
  },
  tabLabel: {
    color: 'black',
    fontSize: 16,
  },
  tabLabelFocused: {
    color: 'white',
  },
});
