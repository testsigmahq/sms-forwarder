import React, { useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import SmsRelay from './screens/smsRelay';
import Wrapper from './screens/wrapper';
import HomeScreen from './components/home-screen';
import { Provider } from 'react-redux';
import store from './redux/store';
import MessageTemplate from "./screens/messageTemplate";

const Stack = createStackNavigator();

export default function App() {
  React.useEffect(() => {
    // Initialize GoogleSignin
    GoogleSignin.configure({
        webClientId: '473722209735-7tcidkd4hji670ckn20g9r6eu2dlivit.apps.googleusercontent.com',
        scopes: ['email', 'profile'],
        include_granted_scopes : true,
        response_type : 'code',
        access_type:'offline'

    });
  }, []);

  return (
      <View style={styles.container}>
          <Provider store={store}>
          <NavigationContainer style={{ backgroundColor: '#fff',
          cardStyle: { backgroundColor: '#fff' },
        }}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="MessageTemplate" component={MessageTemplate} />
              <Stack.Screen name="SmsRelay" component={SmsRelay} />
            <Stack.Screen name="Wrapper" component={Wrapper} />

          </Stack.Navigator>
        </NavigationContainer>
          </Provider>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

});

