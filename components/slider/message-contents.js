import React, { useEffect } from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MessageContents = () => {
    const navigation = useNavigation();

    useEffect(() => {
        console.log('MessageContents');
    }, []);

    const handleButtonPress = () => {
        console.log('Button pressed!');
    };

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 24, marginBottom: 20 }}>MessageContents</Text>
            <Button title="Press Me" onPress={handleButtonPress} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    }
});

export default MessageContents;
