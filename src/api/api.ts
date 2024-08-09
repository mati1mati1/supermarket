import axios from 'axios';
import { User, BuyerOrder, ShoppingList, ShopInventory, Supermarket, ShoppingListItem } from '../models';

export const executeFunction = async <T>(token: string, functionName: string, params: Record<string, any>): Promise<T> => {
  try {
    const response = await axios.post<T>('http://localhost:7071/api/ExecuteSqlQuery', {
      functionName,
      params
    });
    return response.data;
  } catch (error) {
    console.error('Error executing function:', error);
    throw error;
  }
};

// Example usage
export const getUserById = async (token: string): Promise<User[]> => {
  return await executeFunction<User[]>(token, 'getUserById', {});
};

export const getUserByUserName = async (token: string, userName: string): Promise<User | null> => {
  return await executeFunction<User | null>(token, 'getUserByUserName', { userName });
};

export const getItemBySupermarketIdAndItemName = async (token: string, supermarketId: string, ItemName: string): Promise<ShopInventory[]> => {
  return await executeFunction<ShopInventory[]>(token, 'getItemBySupermarketIdAndItemName', { supermarketId, ItemName });
};

export const getItemBySupermarketIdAndBarcode = async (token: string, supermarketId: string, barcode: string): Promise<ShopInventory[]> => {
  return await executeFunction<ShopInventory[]>(token, 'getItemBySupermarketIdAndBarcode', { supermarketId, barcode });
};

export const getMapBySupermarketId = async (token: string, supermarketId: string): Promise<string[]> => {
  return await executeFunction<string[]>(token, 'getMapBySupermarketId', { supermarketId });
};

export const updateMap = async (token: string, supermarketId: string, BranchMap: string): Promise<string[]> => {
  return await executeFunction<string[]>(token, 'updateMap', { supermarketId, BranchMap });
};

export const getSupermarketByUserId = async (token: string): Promise<Supermarket[]> => {
  return await executeFunction<Supermarket[]>(token, 'getSupermarketByUserId', {});
};

export const getSupermarketBySupermarketId = async (token: string, supermarketId: string): Promise<Supermarket[]> => {
  return await executeFunction<Supermarket[]>(token, 'getSupermarketBySupermarketId', { supermarketId });
};

export const getSupermarketByBarcode = async (token: string, barcode: string): Promise<Supermarket[]> => {
  return await executeFunction<Supermarket[]>(token, 'getSupermarketByBarcode', { barcode });
};

export const deleteShoppingList = async (token: string, listId: string): Promise<void> => {
  return await executeFunction<void>(token, 'deleteShoppingList', { listId });
};

export const getShoppingListsByBuyerId = async (token: string): Promise<ShoppingList[]> => {
  return await executeFunction<ShoppingList[]>(token, 'getShoppingListsByBuyerId', {});
};

export const getShoppingListItemByCardId = async (token: string, listId: string): Promise<ShoppingListItem[]> => {
  return await executeFunction<ShoppingListItem[]>(token, 'getShoppingListItemsByListId', { listId });
};

export const getShopInventory = async (token: string): Promise<ShopInventory[]> => {
  return await executeFunction<ShopInventory[]>(token, 'getShopInventory', {});
};

export const updateShoppingListItems = async (token: string, listId: string, items: ShoppingListItem[]): Promise<void> => {
  return await executeFunction<void>(token, 'updateShoppingListItems', { listId, items });
};

export const getOrdersByBuyerId = async (token: string): Promise<BuyerOrder[]> => {
  return await executeFunction<BuyerOrder[]>(token, 'getOrdersByBuyerId', {});
};

export const getSupermarkets = async (token: string): Promise<Supermarket[]> => {
  return await executeFunction<Supermarket[]>(token, 'getSupermarkets', {});
};

export const createShoppingList = async (token: string, listName: string): Promise<ShoppingList[]> => {
  return await executeFunction<ShoppingList[]>(token, 'createShoppingList', { listName });
};

export const changeShoppingListName = async (token: string, listName: string, listId: string): Promise<ShoppingList[]> => {
  return await executeFunction<ShoppingList[]>(token, 'changeShoppingListName', { listName, listId });
};

export const addShopInventory = async (token: string, shopInventory: ShopInventory): Promise<string> => {
  return await executeFunction<string>(token, 'addShopInventory', { shopInventory });
};

export const updateShopInventory = async (token: string, shopInventory: ShopInventory): Promise<void> => {
  return await executeFunction<void>(token, 'updateShopInventory', { shopInventory });
};

export const deleteShopInventory = async (token: string, inventoryId: string): Promise<void> => {
  return await executeFunction<void>(token, 'deleteShopInventory', { inventoryId });
};
