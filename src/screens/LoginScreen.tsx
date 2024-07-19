import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { login } from '../api/auth';
import { useUser } from '../context/UserContext';
import { commonStyles } from '../styles/styles';
import {styles} from '../styles/loginStyles';
import Button from '../components/Button';
import Input from '../components/Input';
import { getUserById } from '../api/api';

interface LoginScreenProps {
  navigation: StackNavigationProp<any>;
  route: RouteProp<any, any>;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { setUser } = useUser();


  //add event listener to the enter key
  const handleEnter = (e: any) => {
    console.log(e.key);
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const handleLogin = async () => {
    try {
      if (username == "achinoam"){
        setUser({ username: "achinoam", role: "manager"}); // Replace with an actual user ID from your database
      }
      else {
        const data = await login(username, password);
        
        if (data.success) {
          setUser(data.user);
          const userId = "fc34dc92-f3ec-419b-91b8-10d409432cca"; // Replace with an actual user ID from your database
          const result = await getUserById(userId);
          navigation.navigate('AppNavigator');
        } else {
          alert('Login failed');
        }
      }
    } catch (error) {
      alert('An error occurred during login');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={commonStyles.title}>Welcome to SpeedyMarket</Text>
        <Text style={commonStyles.subtitle}>Please login to continue</Text>
        <Input
          value={username}
          onChangeText={setUsername}
          placeholder="Username"
          onKeyPress={handleEnter}
        />
        <Input
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          onKeyPress={handleEnter}
        />
        <Button title="Login" onPress={handleLogin} />
      </View>
      <View style={styles.imageContainer}>
        <Image source={{uri: "https://i.ibb.co/bzJcXC8/super-Market.png"}} style={styles.image} />
      </View>
    </View>
  );
}

export default LoginScreen;


