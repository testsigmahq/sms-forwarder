import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Switch, Image, TouchableOpacity, Modal } from 'react-native';
import { FontAwesome5 } from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native";

const Filters = ({}) => {
    const [toggleValue, setToggleValue] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleToggleChange = (value) => {
        setToggleValue(value);
    };

    const handleImagePress = () => {
        setShowModal(true);
    };

    const handleForwardSMS = () => {
        navigation.navigate('Wrapper');
        setShowModal(false);
    };
    const navigation = useNavigation();


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

            <TouchableOpacity onPress={handleImagePress}>
                <View style={styles.imageContainer}>
                    <Image source={require('../assets/plus.png')} style={styles.image} />
                </View>
            </TouchableOpacity>
            <Modal visible={showModal} animationType="slide" transparent={true}>
            <View style={styles.modalContainer}>
                <View style={[styles.modalContent]}>
                    <Text style={styles.modalTitle}>Add filter</Text>
                    <TouchableOpacity onPress={handleForwardSMS}>
                    <Text style={styles.modalText}>Forward SMS</Text>
                    </TouchableOpacity>
                    <Text style={styles.modalText}>Forward Notification</Text>
                </View>
            </View>
        </Modal>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'space-between',
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
        margin: 8,
    },
    cardText: {
        marginRight: 8,
        fontSize: 22,
        color: 'white',
        fontWeight: '800',
        letterSpacing: 2,
    },
    switchContainer: {
        flex: 1,
        alignItems: 'flex-end',
    },
    switch: {
        transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: 15,
    },
    image: {
        width: 45,
        height: 45,
    },
    modalContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderRadius:5,
        flexDirection: 'column',
        marginRight:20,
        padding:15,
        paddingRight:185,
    },
    modalText: {
        alignSelf: 'flex-start',
        textAlign: 'left',
        marginBottom:20,
        fontSize:16,
    },
    modalTitle: {
        alignSelf: 'flex-start',
        textAlign: 'left',
        marginBottom:20,
        fontWeight:500,
        fontSize:18,
    }

});

export default Filters;
