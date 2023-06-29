import React, { useState } from 'react';
import {StyleSheet, Text, View, SafeAreaView, Dimensions} from 'react-native';
import LottieView from 'lottie-react-native';
import GoogleSignupButton from './google-signup-button';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [load,isLoad]=useState(true)
    const navigation = useNavigation();

    const handleGoogleSignup = (userInfo) => {
        setIsLoading(true);
        isLoad(false)
        console.log('Google user info:', userInfo);
        setTimeout(() => {
            setIsLoading(false);
            navigation.navigate('SmsRelay');
        }, 4500);
    };

    return (
        <SafeAreaView style={styles.container}>
            {isLoading ? (
                <LottieView
                    source={require('../assets/msg.json')}
                    autoPlay
                    loop
                    style={styles.animation}
                />
            ) : (
                <>
                    {!isLoading && load && (
                        <>
                    <Text style={styles.text}>Welcome to RelayMate</Text>

                        <GoogleSignupButton onSignup={handleGoogleSignup} />
                            </>
                    )}
                </>
            )}
        </SafeAreaView>
    );
};
const deviceWidth = Math.round(Dimensions.get('window').width);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    text: {
        marginBottom: 10,
    },
    animation: {
        width: 200,
        height: 200,
    }
});

export default HomeScreen;
