import React from 'react';
import {GoogleSignin, GoogleSigninButton, statusCodes} from '@react-native-google-signin/google-signin';
import { Dimensions, View} from "react-native";
import {googleInfo} from '../redux/actions/setUpRecipients';
import {useDispatch} from "react-redux";

const GoogleSignupButton = ({ onSignup }) => {
    const dispatch = useDispatch();
    const handleGoogleSignup = async () => {
        try {
            // Log out the user before signing in
            await GoogleSignin.signOut();

            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            onSignup(userInfo);
            console.log('userInfo', userInfo);
            if (userInfo) {
                dispatch(googleInfo(userInfo));
            }
            const { serverAuthCode } = await GoogleSignin.getTokens();
            // console.log('Authorization Code:', serverAuthCode);
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // console.log('Sign-in cancelled');
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // console.log('Sign-in in progress');
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // console.log('Play services not available');
            } else {
                // console.log('Error signing in:', error);
            }
        }
    };


    return (
        <View>
        <GoogleSigninButton
            style={{ width: deviceWidth*0.6, height: 45,alignSelf:'center',borderRadius:8}}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Light}
            onPress={handleGoogleSignup}
        />
        </View>

);
};
const deviceWidth = Math.round(Dimensions.get('window').width);

export default GoogleSignupButton;
