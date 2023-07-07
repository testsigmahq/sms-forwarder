import React, {useEffect} from 'react';
import { StyleSheet, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Provider } from 'react-redux';
import store from './redux/store';
import Database from "./database";
import HomeStack from "./routes/homeStack";

const Stack = createStackNavigator();

export default function App() {
  React.useEffect(() => {
    GoogleSignin.configure({
        androidClientId: '473722209735-7tcidkd4hji670ckn20g9r6eu2dlivit.apps.googleusercontent.com',
        webClientId:"473722209735-7tcidkd4hji670ckn20g9r6eu2dlivit.apps.googleusercontent.com",
        scopes: ['email', 'profile','https://www.googleapis.com/auth/gmail.send'],
        include_granted_scopes : true,
        response_type : 'code',
        access_type:'offline',
        offlineAccess: true,
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
        Database.createSettings();
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
