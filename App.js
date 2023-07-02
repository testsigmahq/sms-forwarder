import React, {useEffect, useState} from 'react';
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
import Database from "./database";

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

    useEffect(() => {
        Database.initDB();
        Database.createTable();

        const data = {
            email: ['selva@Hhh', 'wwddddd'],
            phoneNumber: ['9682827222', '8228281882811'],
            url: [{ requestMethod: 'POST', url: 'www.gooogle.com', key: 'hshs' }],
        };

        // Insert data
        Database.insertData(data.email, data.phoneNumber, data.url);

        // Update data
        const updatedData = {
            id: 1, // ID of the data to update
            email: 'updatedemail@example.com',
            phoneNumber: '1234567890',
            url: [{ requestMethod: 'GET', url: 'www.example.com', key: 'abc123' }],
        };

        Database.updateData(updatedData.id, updatedData.email, updatedData.phoneNumber, updatedData.url);

        // Get all data
        Database.getAllData((data) => {
            console.log(JSON.stringify(data, null, 2));
        });
    }, []);



  return (
      <View style={styles.container}>
          <Provider store={store}>
          <NavigationContainer style={{ backgroundColor: '#fff',
          cardStyle: { backgroundColor: '#fff' },
        }}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/*<Stack.Screen name="Home" component={HomeScreen} />*/}
              <Stack.Screen name="SmsRelay" component={SmsRelay} />
              <Stack.Screen name="Wrapper" component={Wrapper} />
              <Stack.Screen name="MessageTemplate" component={MessageTemplate} />

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

