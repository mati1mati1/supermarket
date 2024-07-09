import { User, BuyerOrder, ShoppingList, FullTable, Seller } from './models';

export interface QueryParam {
  name: string;
  type: string;
  value: any;
}

export interface Query {
  query: string;
  params: QueryParam[];
}

export const getUserByIdQuery = (userId: string): Query => ({
  query: 'SELECT * FROM Users WHERE UserID = @userId',
  params: [
    { name: 'userId', type: 'UniqueIdentifier', value: userId }
  ]
});

export const getItemBySellerIdAndItemNumberQuery = (sellerId: string, itemNumber: string): Query => ({
  query: 'SELECT * FROM FullTable WHERE SellerID = @sellerId AND ItemNumber = @itemNumber',
  params: [
    { name: 'sellerId', type: 'UniqueIdentifier', value: sellerId },
    { name: 'itemNumber', type: 'NVarChar', value: itemNumber }
  ]
});

export const getSellerByIdQuery = (sellerId: string): Query => ({
  query: 'SELECT * FROM Sellers WHERE SellerID = @sellerId',
  params: [
    { name: 'sellerId', type: 'UniqueIdentifier', value: sellerId }
  ]
});

export const getShoppingListByBuyerIdQuery = (buyerId: string): Query => ({
  query: 'SELECT * FROM ShoppingList WHERE BuyerID = @buyerId',
  params: [
    { name: 'buyerId', type: 'UniqueIdentifier', value: buyerId }
  ]
});

export const addOrUpdateShoppingListByBuyerIdQuery = (listId: string, buyerId: string, items: string): Query => ({
  query: `IF EXISTS (SELECT * FROM ShoppingList WHERE ListID = @listId)
            UPDATE ShoppingList SET Items = @items WHERE ListID = @listId
          ELSE
            INSERT INTO ShoppingList (ListID, BuyerID, Items) VALUES (@listId, @buyerId, @items)`,
  params: [
    { name: 'listId', type: 'UniqueIdentifier', value: listId },
    { name: 'buyerId', type: 'UniqueIdentifier', value: buyerId },
    { name: 'items', type: 'NVarChar', value: items }
  ]
});

export const getOrdersByBuyerIdQuery = (buyerId: string): Query => ({
  query: 'SELECT * FROM BuyerOrders WHERE BuyerID = @buyerId',
  params: [
    { name: 'buyerId', type: 'UniqueIdentifier', value: buyerId }
  ]
});
