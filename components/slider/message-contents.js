import React, { useEffect } from 'react';
import {View, Text, Button, StyleSheet, SafeAreaView} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomHeader from "../custom-header";

const MessageContents = () => {
    const navigation = useNavigation();

    useEffect(() => {
        console.log('MessageContents');
    }, []);

    const handleButtonPress = () => {
        console.log('Button pressed!');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ marginBottom: 4 }}>
                <CustomHeader
                    title="Add filter"
                    onPressBackButton={() => navigation.goBack()} />
            </View>
            <View style={styles.contentContainer}>
                <Text style={styles.title}>Set up recipients</Text>
                <Text style={styles.subtitle}>
                    You can choose to add the phone number of the intial sender of the message, a specific word ,etc.., to the message that you wish to forward ,or change  certain words within the body of the message
                </Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    contentContainer: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 20,
        marginBottom: 10,
        fontWeight: '500',
        letterSpacing: 0.2,
    },
    subtitle: {
        fontSize: 18,
        lineHeight: 26
    },
});

export default MessageContents;
