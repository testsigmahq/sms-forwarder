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
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    }
});

export default MessageContents;
