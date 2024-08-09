const getUserByIdQuery = (userId) => ({
    query: 'SELECT * FROM [User] WHERE UserID = @userId',
    params: [
      { name: 'userId', type: 'UniqueIdentifier', value: userId }
    ]
  });
  
  const getUserByUserNameQuery = (userName) => ({
    query: 'SELECT * FROM [User] WHERE UserName = @userName',
    params: [
      { name: 'userName', type: 'NVarChar', value: userName }
    ]
  });
  
  const getShopInventoryQuery = (userId) => ({
    query: `
      SELECT si.* 
      FROM ShopInventory si
      JOIN Supermarket sm ON si.SupermarketID = sm.SupermarketID
      WHERE sm.UserID = @userId
    `,
    params: [
      { name: 'userId', type: 'UniqueIdentifier', value: userId }
    ]
  });
  
  const getItemBySupermarketIdAndItemNameQuery = (supermarketId, ItemName) => ({
    query: 'SELECT * FROM ShopInventory WHERE SupermarketID = @supermarketId AND ItemName = @ItemName',
    params: [
      { name: 'supermarketId', type: 'UniqueIdentifier', value: supermarketId },
      { name: 'ItemName', type: 'NVarChar', value: ItemName }
    ]
  });
  
  const getItemBySupermarketIdAndBarcodeQuery = (supermarketId, barcode) => ({
    query: 'SELECT * FROM ShopInventory WHERE SupermarketID = @supermarketId AND Barcode = @barcode',
    params: [
      { name: 'supermarketId', type: 'UniqueIdentifier', value: supermarketId },
      { name: 'barcode', type: 'NVarChar', value: barcode }
    ]
  });
  
  const getMapBySupermarketIdQuery = (supermarketId) => ({
    query: 'SELECT * FROM Supermarket WHERE SupermarketID = @supermarketId',
    params: [
      { name: 'supermarketId', type: 'UniqueIdentifier', value: supermarketId }
    ]
  });
  
  const updateMapQuery = (supermarketId, BranchMap) => ({
    query: 'UPDATE Supermarket SET BranchMap = @BranchMap WHERE SupermarketID = @supermarketId',
    params: [
      { name: 'supermarketId', type: 'UniqueIdentifier', value: supermarketId },
      { name: 'BranchMap', type: 'NVarChar', value: BranchMap }
    ]
  });
  
  const getSupermarketByUserIdQuery = (userId) => ({
    query: `
      SELECT sm.*
      FROM Supermarket sm
      WHERE sm.UserID = @userId
    `,
    params: [
      { name: 'userId', type: 'UniqueIdentifier', value: userId }
    ]
  });
  
  const getSupermarketBybarcodeQuery = (barcode) => ({
    query: `
      SELECT sm.*
      FROM Supermarket sm
      WHERE sm.Barcode = @barcode
    `,
    params: [
      { name: 'barcode', type: 'NVarChar', value: barcode }
    ]
  });
  
  const deleteShoppingListQuery = (listId) => ({
    query: 'DELETE FROM ShoppingList WHERE ListID = @listId',
    params: [
      { name: 'listId', type: 'UniqueIdentifier', value: listId }
    ]
  });
  
  const getShoppingListsByBuyerIdQuery = (buyerId) => ({
    query: 'SELECT * FROM ShoppingList WHERE BuyerID = @buyerId',
    params: [
      { name: 'buyerId', type: 'UniqueIdentifier', value: buyerId }
    ]
  });
  
  const getShoppingListItemsByListIdQuery = (listId) => ({
    query: 'SELECT * FROM ShoppingListItem WHERE ListID = @listId',
    params: [
      { name: 'listId', type: 'UniqueIdentifier', value: listId }
    ]
  });
  
  const updateShoppingListItemsQuery = (listId, items) => ({
    query: `BEGIN TRANSACTION;
              DELETE FROM ShoppingListItem WHERE ListID = @listId;
  
              INSERT INTO ShoppingListItem (ItemID, ListID, ItemName, Quantity)
              VALUES ${items.map((_, index) => `(NEWID(), @listId, @itemName${index}, @quantity${index})`).join(", ")};
  
              COMMIT;`,
    params: [
      { name: 'listId', type: 'UniqueIdentifier', value: listId },
      ...items.flatMap((item, index) => [
        { name: `itemName${index}`, type: 'NVarChar', value: item.ItemName },
        { name: `quantity${index}`, type: 'Int', value: item.Quantity },
      ]),
    ],
  });
  
  const getOrdersByBuyerIdQuery = (buyerId) => ({
    query: 'SELECT * FROM BuyerOrder WHERE BuyerID = @buyerId',
    params: [
      { name: 'buyerId', type: 'UniqueIdentifier', value: buyerId }
    ]
  });
  
  const getSupermarketsQuery = () => ({
    query: 'SELECT * FROM Supermarket',
    params: []
  });
  
  const createShoppingListQuery = (listName, userId) => ({
    query: `INSERT INTO ShoppingList (ListName, BuyerID) 
            OUTPUT inserted.ListID 
            VALUES (@listName, @userId)`,
    params: [
      { name: 'listName', type: 'NVarChar', value: listName },
      { name: 'userId', type: 'UniqueIdentifier', value: userId },
    ]
  });
  
  const changeShoppingListQuery = (listName, listId) => ({
    query: `UPDATE ShoppingList
            SET ListName = @listName
            WHERE ListID = @listId`,
    params: [
      { name: 'listName', type: 'NVarChar', value: listName },
      { name: 'listId', type: 'UniqueIdentifier', value: listId },
    ]
  });
  
  const addShopInventoryQuery = (inventory) => ({
    query: `
      INSERT INTO ShopInventory (SupermarketID, ItemName, Quantity, Price, Discount, Location, Barcode)
      OUTPUT inserted.InventoryID
      VALUES (@supermarketId, @ItemName, @quantity, @price, @discount, @location, @barcode)
    `,
    params: [
      { name: 'supermarketId', type: 'UniqueIdentifier', value: inventory.SupermarketID },
      { name: 'ItemName', type: 'NVarChar', value: inventory.ItemName },
      { name: 'quantity', type: 'Int', value: inventory.Quantity },
      { name: 'price', type: 'Decimal', value: inventory.Price },
      { name: 'discount', type: 'Decimal', value: inventory.Discount },
      { name: 'location', type: 'NVarChar', value: inventory.Location },
      { name: 'barcode', type: 'NVarChar', value: inventory.Barcode }
    ]
  });
  
  const updateShopInventoryQuery = (inventory) => ({
    query: `IF EXISTS (SELECT * FROM ShopInventory WHERE InventoryID = @inventoryId)
              UPDATE ShopInventory
              SET SupermarketID = @supermarketId, ItemName = @ItemName, Quantity = @quantity, Price = @price, Discount = @discount, Location = @location, Barcode = @barcode
              WHERE InventoryID = @inventoryId`,
    params: [
      { name: 'inventoryId', type: 'UniqueIdentifier', value: inventory.InventoryID },
      { name: 'supermarketId', type: 'UniqueIdentifier', value: inventory.SupermarketID },
      { name: 'ItemName', type: 'NVarChar', value: inventory.ItemName },
      { name: 'quantity', type: 'Int', value: inventory.Quantity },
      { name: 'price', type: 'Decimal', value: inventory.Price },
      { name: 'discount', type: 'Decimal', value: inventory.Discount },
      { name: 'location', type: 'Int', value: inventory.Location },
      { name: 'barcode', type: 'NVarChar', value: inventory.Barcode }
    ]
  });
  
  const deleteShopInventoryQuery = (inventoryId) => ({
    query: `DELETE FROM ShopInventory WHERE InventoryID = @inventoryId`,
    params: [
      { name: 'inventoryId', type: 'UniqueIdentifier', value: inventoryId }
    ]
  });
  
  module.exports = {
    getUserByIdQuery,
    getUserByUserNameQuery,
    getShopInventoryQuery,
    getItemBySupermarketIdAndItemNameQuery,
    getItemBySupermarketIdAndBarcodeQuery,
    getMapBySupermarketIdQuery,
    updateMapQuery,
    getSupermarketByUserIdQuery,
    getSupermarketBybarcodeQuery,
    deleteShoppingListQuery,
    getShoppingListsByBuyerIdQuery,
    getShoppingListItemsByListIdQuery,
    updateShoppingListItemsQuery,
    getOrdersByBuyerIdQuery,
    getSupermarketsQuery,
    createShoppingListQuery,
    changeShoppingListQuery,
    addShopInventoryQuery,
    updateShopInventoryQuery,
    deleteShopInventoryQuery
  };
  