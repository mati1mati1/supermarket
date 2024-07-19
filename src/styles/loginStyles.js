import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    formContainer: {
      flex: 1,
      padding: 20,
      justifyContent: 'center',
    },
    imageContainer: {
      flex: 2,
      alignItems: 'center',
      justifyContent: 'center',
      height: "100%",
      width: "100%",
    },
    image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // Ensure the image covers the entire container
    },
  });
  