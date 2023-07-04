import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Provider } from 'react-redux';
import store from './redux/store';
import MessageTemplate from "./screens/messageTemplate";
import Database from "./database";
import HomeStack from "./routes/homeStack";

const Stack = createStackNavigator();

export default function App() {
  React.useEffect(() => {
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
        Database.createFilterTable();
        Database.createEmailTable();
        Database.createPhoneNumberTable()
        Database.createUrlTable();
        Database.createSenderNumberTable();
        Database.createTextTable();
        Database.createChangeContentTable();
        Database.createResultTable();
    }, []);



  return (
      <View style={styles.container}>
          <Provider store={store}>
              <HomeStack />
          </Provider>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

});
