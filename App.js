import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {GoogleSignin} from "react-native-google-signin";
import GoogleSignupButton from "./components/GoogleSignupButton";

export default function App() {

  const handleGoogleSignup = (userInfo) => {
    // Handle user signup with the received userInfo from Google
    console.log('Google user info:', userInfo);
  };

  React.useEffect(() => {
    // Initialize GoogleSignin
    GoogleSignin.configure({
      androidClientId: '473722209735-6i2vv66nd68n49th14dgpaepbbvd0cka.apps.googleusercontent.com',
    });
  }, []);
  return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Welcome to My App</Text>
        {/* Other components */}
        <GoogleSignupButton onSignup={handleGoogleSignup} />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
