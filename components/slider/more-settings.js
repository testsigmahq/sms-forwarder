import React, { useEffect } from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MoreSettings = () => {
    const navigation = useNavigation();

    useEffect(() => {
        console.log('MoreSettings');
    }, []);

    const handleButtonPress = () => {
        console.log('Button pressed!');
    };

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 24, marginBottom: 20 }}>MoreSettings</Text>
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

export default MoreSettings;