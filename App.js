import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GoogleSignin } from 'react-native-google-signin';
import GoogleSignupButton from './components/google-signup-button';
import SmsRelay  from './screens/smsRelay';
const Stack = createStackNavigator();

const HomeScreen = ({ navigation }) => {
  const handleGoogleSignup = (userInfo) => {
    console.log('Google user info:', userInfo);
      navigation.navigate('SmsRelay');

  };

  return (
      <View style={styles.container}>
        <Text style={{bottom:10}}>Welcome to RelayMate</Text>
        <GoogleSignupButton onSignup={handleGoogleSignup} />
      </View>
  );
};


export default function App() {
  React.useEffect(() => {
    // Initialize GoogleSignin
    GoogleSignin.configure({
      androidClientId: '473722209735-6i2vv66nd68n49th14dgpaepbbvd0cka.apps.googleusercontent.com',
    });
  }, []);

  return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          {/*<Stack.Screen name="Home" component={HomeScreen} />*/}
          <Stack.Screen name="SmsRelay" component={SmsRelay} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
