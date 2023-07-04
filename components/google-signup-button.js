import React from 'react';
import {GoogleSignin, GoogleSigninButton, statusCodes} from '@react-native-google-signin/google-signin';
import {Button, View} from "react-native";


const GoogleSignupButton = ({ onSignup }) => {
    const handleGoogleSignup = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            onSignup(userInfo);
            const { serverAuthCode } = await GoogleSignin.getTokens();
            console.log('Authorization Code:', serverAuthCode);
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                console.log('Sign-in cancelled');
            } else if (error.code === statusCodes.IN_PROGRESS) {
                console.log('Sign-in in progress');
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                console.log('Play services not available');
            } else {
                console.log('Error signing in:', error);
            }
        }
    };


    return (
        <View>
        <GoogleSigninButton
            style={{ width: 192, height: 48 }}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Light}
            onPress={handleGoogleSignup}
        />
        </View>

);
};

export default GoogleSignupButton;
