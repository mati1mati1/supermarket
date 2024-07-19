// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import { DndProvider } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import LoginScreen from './screens/LoginScreen';
// import { AppNavigator } from './navigation/AppNavigator';
// import { UserProvider, useUser } from './context/UserContext';

// const Stack = createStackNavigator();

// const MainNavigator: React.FC = () => {
//   const { user } = useUser();

//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         {!user ? (
//           <Stack.Screen name="Login" component={LoginScreen} />
//         ) : (
//           <Stack.Screen name="AppNavigator" component={AppNavigator} />
//         )}
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// const App: React.FC = () => {
//   return (
//     <UserProvider>
//       <DndProvider backend={HTML5Backend}>
//         <MainNavigator />
//       </DndProvider>
//     </UserProvider>
//   );
// };

// export default App;
