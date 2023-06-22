import React from 'react';
import {GoogleSignin,GoogleSigninButton} from "react-native-google-signin";
import {Button, View} from "react-native";

const GoogleSignupButton = ({ onSignup }) => {
    const handleGoogleSignup = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            onSignup(userInfo);
        } catch (error) {
            console.log('Google sign-up error:', error);
        }
    };
    const handleGoogleSignout = async () => {
        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
        } catch (error) {
            console.log('Google sign-out error:', error);
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
    <Button title="Sign Out" onPress={handleGoogleSignout} />
        </View>

);
};

export default GoogleSignupButton;
