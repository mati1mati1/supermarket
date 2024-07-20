import { User } from '../models';
import { getUserByUserName, getShoppingListsByBuyerId, getOrdersByBuyerId, getSupermarketById, getShopInventory, getSupermarketByUserId } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

interface LoginResponse {
  success: boolean;
  user: {
    role: 'customer' | 'manager';
    username: string;
  };
}

// פונקציה פשוטה לאימות משתמש
export async function login(username: string, password: string): Promise<LoginResponse> {
  const user = await getUserByUserName(username);

  if (user) {
    const role = user.UserType === 'Seller' ? 'manager' : 'customer';
    AsyncStorage.setItem('user', JSON.stringify(user));
    debugger
    if (role === 'manager') {
      const supermarket = await getSupermarketByUserId(user.UserID);
      console.log(supermarket);
      await AsyncStorage.setItem('supermarket', JSON.stringify(supermarket[0]));
      const shopInventory = await getShopInventory(supermarket[0].SupermarketID);
      console.log('ShopInventory: ' + JSON.stringify(supermarket[0]));
      await AsyncStorage.setItem('ShopInventory', JSON.stringify(shopInventory));
    } else if (role === 'customer') {
      const shoppingLists = await getShoppingListsByBuyerId(user.UserID);
      console.log(shoppingLists);
      await AsyncStorage.setItem('ShoppingLists', JSON.stringify(shoppingLists));
      const buyerOrders = await getOrdersByBuyerId(user.UserID);
      console.log(buyerOrders);
      await AsyncStorage.setItem('BuyerOrder', JSON.stringify(buyerOrders)); 
    }

    return {
      success: true,
      user: {
        role,
        username: user.UserName,
      },
    };
  } else {
    return {
      success: false,
      user: { role: 'customer', username: '' }, // Return empty user on failure
    };
  }
}

// דוגמה לפונקציה המבוססת על fetch (כרגע בתגובה להערות)
// export async function login(username: string, password: string): Promise<LoginResponse> {
//   const response = await fetch('https://example.com/api/login', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ username, password }),
//   });
//   return response.json();
// }
