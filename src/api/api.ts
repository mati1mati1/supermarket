import axios from 'axios';
import { Query, getUserByUserNameQuery, getUserByIdQuery, getMapBySupermarketIdQuery, updateMapQuery, getItemBySupermarketIdAndItemNumberQuery, getItemBySupermarketIdAndBarcodeQuery, getSupermarketByIdQuery, getShoppingListsByBuyerIdQuery, addOrUpdateShoppingListByBuyerIdQuery, getOrdersByBuyerIdQuery, getSupermarketsQuery, getShopInventoryQuery, getSupermarketByUserIdQuery } from '../queries';
import { User, BuyerOrder, ShoppingList, ShopInventory, Supermarket } from '../models';

const API_URL = 'http://localhost:7071/api/ExecuteSqlQuery';

export const executeSqlQuery = async <T>(queryObject: Query): Promise<T[]> => {
  try {
    const response = await axios.post(`${API_URL}`, {
      query: queryObject.query,
      params: queryObject.params
    });
    return response.data;
  } catch (error) {
    console.error('Error executing SQL query:', error);
    throw error;
  }
};

// API call functions
export const getUserById = async (userId: string): Promise<User[]> => {
  const queryObject = getUserByIdQuery(userId);
  return await executeSqlQuery<User>(queryObject);
};

export const getUserByUserName = async (userName: string): Promise<User | null> => {
  const queryObject = getUserByUserNameQuery(userName);
  const users = await executeSqlQuery<User>(queryObject);

  if (users.length > 0) {
    return users[0];
  } else {
    return null;
  }
};

export const getItemBySupermarketIdAndItemNumber = async (supermarketId: string, itemNumber: string): Promise<ShopInventory[]> => {
  const queryObject = getItemBySupermarketIdAndItemNumberQuery(supermarketId, itemNumber);
  return await executeSqlQuery<ShopInventory>(queryObject);
};

export const getItemBySupermarketIdAndBarcode = async (supermarketId: string, barcode: string): Promise<ShopInventory[]> => {
  const queryObject = getItemBySupermarketIdAndBarcodeQuery(supermarketId, barcode);
  return await executeSqlQuery<ShopInventory>(queryObject);
};

export const getMapBySupermarketId = async (supermarketId: string): Promise<string[]> => {
  const queryObject = getMapBySupermarketIdQuery(supermarketId);
  return await executeSqlQuery<string>(queryObject);
};

export const updateMap = async (supermarketId: string, BranchMap: string): Promise<string[]> => {
  const queryObject = updateMapQuery(supermarketId, BranchMap);
  return await executeSqlQuery<string>(queryObject);
};

export const getSupermarketById = async (supermarketId: string): Promise<Supermarket[]> => {
  const queryObject = getSupermarketByIdQuery(supermarketId);
  return await executeSqlQuery<Supermarket>(queryObject);
};
export const getSupermarketByUserId = async (userId: string): Promise<Supermarket[]> => {
  const queryObject = getSupermarketByUserIdQuery(userId);
  return await executeSqlQuery<Supermarket>(queryObject);
};

export const getShoppingListsByBuyerId = async (buyerId: string): Promise<ShoppingList[]> => {
  const queryObject = getShoppingListsByBuyerIdQuery(buyerId);
  return await executeSqlQuery<ShoppingList>(queryObject);
};

export const getShopInventory = async (supermarketId: string): Promise<ShopInventory[]> => {
  const queryObject = getShopInventoryQuery(supermarketId);
  return await executeSqlQuery<ShopInventory>(queryObject);
};

export const addOrUpdateShoppingListByBuyerId = async (listId: string, buyerId: string, items: string): Promise<void> => {
  const queryObject = addOrUpdateShoppingListByBuyerIdQuery(listId, buyerId, items);
  await executeSqlQuery<void>(queryObject);
};

export const getOrdersByBuyerId = async (buyerId: string): Promise<BuyerOrder[]> => {
  const queryObject = getOrdersByBuyerIdQuery(buyerId);
  return await executeSqlQuery<BuyerOrder>(queryObject);
};
