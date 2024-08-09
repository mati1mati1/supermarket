import AsyncStorage from "@react-native-async-storage/async-storage";
import { ShoppingListItem,ShopInventory } from "src/models";

export interface SectionType {
    id: number;
    name: string;
    left: number;
    top: number;
    rotation: number;
    width: number;
    height: number;
  }

  export interface EntranceType {
    left: number;
    top: number;
  }
  interface Section {
    id: number;
    name: string;
    left: number;
    top: number;
    rotation: number;
    width: number;
    height: number;
  }
  
  interface Entrance {
    left: number;
    top: number;
  }
  
  interface MapData {
    sections: Section[];
    entrance: Entrance;
    mapWidth: number;
    mapHeight: number;
  }
  export interface Location{
    x: number;
    y: number;
  }
  export interface ItemWithLocation  {
    ListItemID: string;
    ListID: string;
    ItemName: string;
    Quantity: number;
    location: Location;
    shelf: string;
  }
  
  interface Data {
    map: MapData;
    path: number[][];
    missingItems: ShoppingListItem[];
    itemsWithLocations: ItemWithLocation[];
    entry: Entrance;
  }
  
  

  export const loadMapAndPath = async (supermarketId: string, listId: string): Promise<Data> => {
    const token = await AsyncStorage.getItem('token'); 
    // const response = await fetch('https://speedymarketbackend1.azurewebsites.net/api/CalculatePath?', {
    const response = await fetch('http://localhost:7071/api/CalculatePath?', {

      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ supermarketId, listId })
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error('Error loading map and path');
    }
  };