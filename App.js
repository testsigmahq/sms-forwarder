import React, { useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GoogleSignin } from 'react-native-google-signin';
import SmsRelay from './screens/smsRelay';
import Wrapper from './screens/wrapper';
import HomeScreen from './components/home-screen';

const Stack = createStackNavigator();

export default function App() {
  React.useEffect(() => {
    // Initialize GoogleSignin
    GoogleSignin.configure({
      androidClientId: '473722209735-6i2vv66nd68n49th14dgpaepbbvd0cka.apps.googleusercontent.com',
    });
  }, []);

  return (
      <View style={styles.container}>
        <NavigationContainer style={{ backgroundColor: '#fff',
          cardStyle: { backgroundColor: '#fff' },
        }}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="SmsRelay" component={SmsRelay} />
            <Stack.Screen name="Wrapper" component={Wrapper} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
