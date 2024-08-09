const sql = require('mssql');
const jwt = require('jsonwebtoken');
const queries = require('./queries'); // Import your queries module

const getQueryByName = (functionName, params) => {
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
        case 'addShopInventory':
            return queries.addShopInventoryQuery(params.shopInventory);
        case 'updateShopInventory':
            return queries.updateShopInventoryQuery(params.shopInventory);
        case 'deleteShopInventory':
            return queries.deleteShopInventoryQuery(params.inventoryId);
        default:
            throw new Error('Invalid function name');
    }
};

module.exports = async function (context, req) {
    const token = req.headers.authorization?.split(' ')[1];
    const functionName = req.body.functionName;
    const params = req.body.params;

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
        console.log("userID" + decoded.userId);
        const queryObject = getQueryByName(functionName, params);
        console.log(queryObject.query);
        for (const param of queryObject.params) {
            if(param.name === 'userId' || param.name === 'buyerId' || param.name === 'sellerId'){
                request.input(param.name, sql[param.type], decoded.userId);
            }
            else if(param.name === 'userName'){
                request.input(param.name, sql[param.type], decoded.userName);
            }
            else{
                request.input(param.name, sql[param.type], param.value);
            }
        }
        context.log('SQL Query:', queryObject.query);
        context.log('SQL Query Parameters:', queryObject.params);
        const result = await request.query(queryObject.query);

        context.log('SQL Query Result:', result.recordset);

        context.res = {
            status: 200,
            body: result.recordset
        };
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            context.log('JWT Error:', err);

            context.res = {
                status: 401,
                body: `JWT Error: ${err.message}`
            };
        } else {
            context.log('Error executing SQL query:', err);

            context.res = {
                status: 500,
                body: `Error: ${err.message}`
            };
        }
    } finally {
        sql.close();
    }
};
