export interface User {
  UserID: string;
  UserName: string;
  FirstName: string;
  LastName: string;
  Email: string;
  PhoneNumber: string;
  Role: string; // Buyer or Seller
}
export enum Role{
  Buyer = "Buyer",
  Seller = "Seller",
}
export interface BuyerOrder {
  OrderID: string;
  BuyerID: string;
  TotalAmount: number;
  CreationDate: string;
  SupermarketID: string;
}

export interface BuyerOrderItem {
  OrderItemID: string;
  OrderID: string;
  ItemID: string;
  ItemName: string;
  Quantity: number;
  Price: number;
}

export interface ShoppingList {
  ListID: string;
  ListName: string;
  BuyerID: string;
}

export interface ShoppingListItem {
  ListItemID: string;
  ListID: string;
  ItemID: string;
  ItemName: string;
  Quantity: number;
}

export interface ShopInventory {
  InventoryID: string;
  SupermarketID: string;
  ItemName: string;
  Quantity: number;
  Price: number;
  Discount: number;
  Location: string;
  Barcode: string; 
}

export interface Supermarket {
  SupermarketID: string;
  UserID: string;
  BranchName: string;
  BranchAddress: string;
  BranchMap: string;
  Location: string;
  WiFiPassword : string;
  WiFiSSID : string;
}

export interface Location {
  x: number;
  y: number;
}

export interface ESP32Info {
  Esp32Id: string;
  Ssid: string;
  Location: Location;
}