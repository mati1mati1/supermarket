const sql = require('mssql');
const jwt = require('jsonwebtoken');
const queries = require('./queries'); 
const axios = require('axios');
const crypto = require('crypto');


const config = {
    user: 'SA',
    password: 'Aa123456',
    server: 'localhost',
    port: 1433,
    database: 'MySuperMarketDb',
    options: {
        encrypt: false 
    }
};


const getQueryByName = async (functionName, params) => {
    console.log("this is the params in the index of the function: " + JSON.stringify(params));
    switch (functionName) {
        case 'getUserById':
            return queries.getUserByIdQuery(params.userId);
        case 'getUserByUserName':
            return queries.getUserByUserNameQuery(params.userName);
        case 'getItemBySupermarketIdAndItemName':
            return queries.getItemBySupermarketIdAndItemNameQuery(params.supermarketId, params.ItemName);
        case 'getItemBySupermarketIdAndBarcode':
            return queries.getItemBySupermarketIdAndBarcodeQuery(params.supermarketId, params.barcode);
        case 'getMapBySupermarketId':
            return queries.getMapBySupermarketIdQuery(params.supermarketId);
        case 'updateMap':
            return queries.updateMapQuery(params.supermarketId, params.BranchMap);
        case 'getSupermarketByUserId':
            return queries.getSupermarketByUserIdQuery(params.userId);
        case 'getSupermarketBySupermarketId':
            return queries.getSupermarketByIdQuery(params.supermarketId);
        case 'getSupermarketByBarcode':
            return queries.getSupermarketBybarcodeQuery(params.barcode);
        case 'deleteShoppingList':
            return queries.deleteShoppingListQuery(params.listId);
        case 'getShoppingListsByBuyerId':
            return queries.getShoppingListsByBuyerIdQuery(params.userId);
        case 'getShoppingListItemsByListId':
            return queries.getShoppingListItemsByListIdQuery(params.listId);
        case 'getShopInventory':
            return queries.getShopInventoryQuery(params.userId);
        case 'updateShoppingListItems':
            return queries.updateShoppingListItemsQuery(params.listId, params.items);
        case 'getOrdersByBuyerId':
            return queries.getOrdersByBuyerIdQuery(params.userId);
        case 'getSupermarkets':
            return queries.getSupermarketsQuery();
        case 'createShoppingList':
            return queries.createShoppingListQuery(params.listName, params.userId);
        case 'changeShoppingListName':
            return queries.changeShoppingListQuery(params.listName, params.listId);
        case 'getShopInventoryByItemName':
            return queries.getShopInventoryByItemName(params.userId, params.itemName);
        case 'addShopInventory':
            return queries.addShopInventoryQuery(params.shopInventory);
        case 'updateShopInventory':
            return queries.updateShopInventoryQuery(params.shopInventory);
        case 'updateShopInventoryQuantityQuery':
            return queries.updateShopInventoryQuantityQuery(params.shopInventory);
        case 'deleteShopInventory':
            return queries.deleteShopInventoryQuery(params.inventoryId);
        case 'updateSupermarketDetailsQuery':
            const address = `${params.Street?.name}, ${params.City?.name}, ${params.Country?.name}`;
            const coordinates = await getCoordinatesFromAzureMaps(address);
            params.Latitude = coordinates.latitude;
            params.Longitude = coordinates.longitude;
            return queries.updateSupermarketDetailsQuery(params);
        case 'createPurchaseQuery':
            return queries.createPurchaseQuery(params.buyerId, params.supermarketId, params.totalAmount, params.items, params.sessionId);
        case 'getOrderDetailsById':
            return queries.getOrderDetailsByIdQuery(params.orderId);
        case 'getOrderByBuyerIdAndOrderId':
            return queries.getOrderByBuyerIdAndOrderIdQuery(params.buyerId,params.orderId);
        case 'getOrderDetailsByOrderId':
            return queries.getOrderDetailsByOrderIdQuery(params.orderId);
        case 'getOrdersBySupplierId':
            return queries.getOrdersByBuyerIdQuery(params.buyerId);
        case 'getOrdersBySupermarketIdAndUserTypeSupplierQuery':
            return queries.getOrdersBySupermarketIdAndUserTypeSupplierQuery(params.supermarketId);
        case 'updateUserInfo':
            return queries.updateUserInfoQuery(params.userId, params.name,params.lastName, params.email, params.phone);
        case 'updateOrderStatus':
            return queries.updateOrderStatusQuery(params.orderId, params.orderStatus);
        case 'getAllSuppliers':
            return queries.getAllSuppliersQuery();
        case 'getSupplierInventory':
            return queries.getSupplierInventoryBySupplierIdQuery(params.supplierId);
        case 'createSuperMarketOrder':
            return queries.createSuperMarketOrderQuery(params.supplierId, params.supermarketId, params.totalAmount, params.orderStatus, params.items);
        case 'registerUser':
            const inputHash = crypto.createHash('sha256').update(params.password).digest('hex');
            return queries.registerUserQuery(params.name, params.lastName, params.userName, inputHash, params.email, params.phone);
        default:
            throw new Error('Invalid function name');
    }
};

  
async function getCoordinatesFromAzureMaps(address) {
    const response = await axios.get(`https://atlas.microsoft.com/search/address/json`, {
      params: {
        'api-version': '1.0',
        'subscription-key': 'BO42TKpTwoUXPHMelZ8m922mkYOAUGKOPknUSMbdJiczaocLoB8GJQQJ99AHAC5RqLJPSPD9AAAgAZMPBGJy',
        'query': address,
        'limit': '1',
      },
    });
    console.log(response.data);
    if (response.data.results.length > 0) {
      const location = response.data.results[0].position;
      console.log(location);
      return {
        latitude: location.lat,
        longitude: location.lon,
      };
    } else {
      throw new Error('No results found');
    }
  }

  async function sendSignalR(context, params) {
    console.log("Sending SignalR with params: " + JSON.stringify(params));
    let newItemOutOfStock = [];

    try {
        await sql.connect(config);

        const request = new sql.Request();

        const queryObject = queries.getShopInventoryBySuperMarketIdQuery(params.supermarketId);

        request.input('supermarketID', sql.UniqueIdentifier, params.supermarketId);

        const result = await request.query(queryObject.query);

        for (const element of result.recordset) {
            if (element['Quantity'] == 0) {
                if (params.items.find(item => item.ItemName === element["ItemName"])) {
                    newItemOutOfStock.push({
                        itemName: element["ItemName"],
                    });
                }
            }
        }

        if (newItemOutOfStock.length > 0) {
            context.bindings.itemOutOfStockHub = [{
                target: params.supermarketId,  
                arguments: [newItemOutOfStock]  
            }];
            console.log('SignalR message sent:', newItemOutOfStock);
        } else {
            console.log('No out-of-stock items to notify.');
        }

    } catch (error) {
        console.error('Error in sendSignalR function:', error);
    }
}

module.exports = async function (context, req) {
    const token = req.headers.authorization?.split(' ')[1];
    const functionName = req.body.functionName;
    const params = req.body.params;
    if (functionName === 'registerUser'){
        try {
            const config = {
                user: 'SA',
                password: 'Aa123456',
                server: 'localhost',
                port: 1433,
                database: 'MySuperMarketDb',
                options: {
                    encrypt: false 
                }
            };

            await sql.connect(config);
            const request = new sql.Request();
            const queryObject = await getQueryByName(functionName, params);
            request.input('name', sql.NVarChar, params.name);
            request.input('lastName', sql.NVarChar, params.lastName);
            request.input('userName', sql.NVarChar, params.userName);
            request.input('email', sql.NVarChar, params.email);
            request.input('phone', sql.NVarChar, params.phone);
            let inputHash = crypto.createHash('sha256').update(params.password).digest('hex');
            request.input('password', sql.NVarChar, inputHash);
            const result = await request.query(queryObject.query);
            context.res = {
                status: 200,
                body: result.recordset
            };
        } catch (err) {
            context.log('Error executing SQL query:', err);

            context.res = {
                status: 500,
                body: `Error: ${err.message}`
            };
            
        } finally {
            sql.close();
            return;
        }
    } else {
    if (!token) {
        context.res = {
            status: 401,
            body: "Authorization token is required"
        };
        return;
    }

    if (!functionName || !params) {
        context.res = {
            status: 400,
            body: "Please pass a function name and its parameters in the request body"
        };
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        await sql.connect(config);
        const request = new sql.Request();
        const queryObject = await getQueryByName(functionName, params);
        for (const param of queryObject.params) {
            if (param.name === 'userId' || param.name === 'buyerId' || param.name === 'sellerId') {
                request.input(param.name, sql[param.type], decoded.userId);
            } else if (param.name === 'userName') {
                request.input(param.name, sql[param.type], decoded.userName);
            } else {
                request.input(param.name, sql[param.type], param.value);
            }
        }

        const result = await request.query(queryObject.query);

        if (functionName === 'createPurchaseQuery') {
            await sendSignalR(context, params);  // Reuse the existing connection
        }

        context.res = {
            status: 200,
            body: result.recordset
        };
    } catch (err) {
        context.res = {
            status: 500,
            body: `Error: ${err.message}`
        };
    } finally {
        sql.close();
    }
    
}
};
