import React from 'react';
import {GoogleSignin,GoogleSigninButton} from "react-native-google-signin";

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

    return (
        <GoogleSigninButton
            style={{ width: 192, height: 48 }}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Light}
            onPress={handleGoogleSignup}
        />
    );
};

export default GoogleSignupButton;
