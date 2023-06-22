import React, { useEffect } from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ContactPicker from "../contact-picker";

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
            <ContactPicker/>
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
