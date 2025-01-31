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
  Supplier = "Supplier"
}
export interface BuyerOrder {
  OrderID: string;
  BuyerID: string;
  TotalAmount: number;
  CreationDate: string;
  SupermarketID: string;
  SupermarketName: string;
}

export interface SupplierOrder {
  OrderID: string;
  SupplierID: string;
  SupermarketID: string;
  TotalAmount: number;
  CreationDate: string;
  OrderStatus: string;
}

export interface ProductsList {
  ItemID: string;
  ItemName: string;
  Quantity: number;
  Price: number;
}

export interface OrderItem {
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
  BranchMap: string;
  StreetNumber: number;
  Street: Street | null;
  City: City | null;
  Country: Country | null;
  WiFiPassword: string;
  WiFiSSID: string;
  OperatingHours: dailyHours[];
  Latitude: number;
  Longitude: number;
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

export interface Country{
  id : number;
  name: string;
  iso2: string;
}
export interface  Street{
  id : number;
  name: string;
}

export interface City{
  id : number;
  name: string;
}

export interface  dailyHours{
  day: string;
  openHour: string;
  closeHour: string;
  
}

export interface SupplierInventory {
  InventoryID: string;
  UserID: string;
  ItemName: string;
  Price: number;
}