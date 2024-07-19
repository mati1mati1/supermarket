// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
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
//           <Stack.Screen name="Welcome To SpeedyMarket" component={LoginScreen} />
//         ) : (
//           <Stack.Screen name="SpeedyMarket" component={AppNavigator} />
//         )}
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// const App: React.FC = () => {
//   return (
//     <UserProvider>
//       <MainNavigator />
//     </UserProvider>
//   );
// };

// export default App;
import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import LoginScreen from './screens/LoginScreen';
import { AppNavigator } from './navigation/AppNavigator';
import { UserProvider, useUser } from './context/UserContext';
import Toast from 'react-native-toast-message';

const Stack = createStackNavigator();

const linking = {
  prefixes: ['yourapp://', 'https://yourdomain.com'],
  config: {
    screens: {
      Login: 'SpeedyMarket/Login',
      App: 'SpeedyMarket/',
    },
  },
};

const MainNavigator: React.FC = () => {
  const { user } = useUser();

  return (
    <NavigationContainer linking={linking} theme={DefaultTheme}>
      <Toast />
      <Stack.Navigator>
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Welcome to SpeedyMarket' }} />
        ) : (
          <Stack.Screen name="App" component={AppNavigator} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App: React.FC = () => {
  return (
    <UserProvider>
      <DndProvider backend={HTML5Backend}>
        <MainNavigator />
      </DndProvider>
    </UserProvider>
  );
};

export default App;
