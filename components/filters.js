import React, {useState} from 'react';
import {View, Text, Button, StyleSheet, Switch,Image} from 'react-native';
import {FontAwesome5} from "@expo/vector-icons";

const Filters = () => {
    const [toggleValue, setToggleValue] = useState(false);

    const handleToggleChange = (value) => {
        setToggleValue(value);
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.cardText}>Filters</Text>
                <View style={styles.switchContainer}>
                    <Switch
                        value={toggleValue}
                        onValueChange={handleToggleChange}
                        trackColor={{ false: '#767577', true: 'white' }}
                        thumbColor={toggleValue ? 'lightgreen' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        style={styles.switch}
                    />
                </View>
            </View>
            <View style={styles.imageContainer}>
                <Image source={require('../assets/plus.png')} style={styles.image} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        backgroundColor: '#03A973',
        borderRadius: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
        margin:8,
    },
    cardText: {
        marginRight: 8,
        fontSize: 22,
        color:'white',
        fontWeight:'800',
        letterSpacing:2
    },
    switchContainer: {
        flex: 1,
        alignItems: 'flex-end',
    },
    switch: {
        transform: [{ scaleX: 1.2}, { scaleY: 1.2 }],
    },
    imageContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        backgroundColor: 'transparent', // Set this to 'transparent' to hide the container background
    },
    image: {
        width: 45,
        height: 45,
        marginBottom: 15, // Adjust this value to add spacing between the image and the bottom
    },

});

export default Filters;
