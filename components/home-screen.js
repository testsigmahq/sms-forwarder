import React, { useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, SafeAreaView } from 'react-native';
import GoogleSignupButton from './google-signup-button';

const HomeScreen = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleSignup = (userInfo) => {
        setIsLoading(true);
        console.log('Google user info:', userInfo);
        setTimeout(() => {
            setIsLoading(false);
            navigation.navigate('SmsRelay');
        }, 2000);
    };

    return (
        <SafeAreaView style={styles.container}>
            {isLoading ? (
                <ActivityIndicator size="large" color="green" />
            ) : (
                <>
                    <Text style={styles.text}>Welcome to RelayMate</Text>
                    <GoogleSignupButton onSignup={handleGoogleSignup} />
                </>
            )}
        </SafeAreaView>
    );
};

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
});

export default HomeScreen;
