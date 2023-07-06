import React, {useState} from 'react';
import {View, StyleSheet, Dimensions, TouchableOpacity, Text} from "react-native";
import {createDrawerNavigator} from "@react-navigation/drawer";
import CustomHeader from "../components/custom-header";
import {useNavigation} from "@react-navigation/native";

const Drawer = createDrawerNavigator();

const Setting = () => {
    const navigation = useNavigation();
    const [activate,setActivate] = useState(false);
    const [showNotification,setShowNotification] = useState(false);
    const [results,setResults] = useState(false);
    return (
        <View>
            <View style={{margin:10, marginHorizontal:15}}>
                <CustomHeader
                    title="Settings"
                    onPressBackButton={() => navigation.goBack()} />
            </View>

            <View style={{margin:10}}>
                <Text style={styles.heading}>
                    App Settings
                </Text>
                <TouchableOpacity style={styles.optionContainer} onPress={() => setActivate(!activate)}>
                    <Text style={{ fontSize: 16 }}>Activate</Text>
                    <View style={[styles.toggleButton, activate && styles.toggleButtonActive]}>
                        <View style={[styles.toggleKnob, activate && styles.toggleKnobActive]} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionContainer} onPress={() => setShowNotification(!showNotification)}>
                    <Text style={{ fontSize: 16 }}>Show result Notification</Text>
                    <View style={[styles.toggleButton, showNotification && styles.toggleButtonActive]}>
                        <View style={[styles.toggleKnob, showNotification && styles.toggleKnobActive]} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionContainer} onPress={() => setResults(!results)}>
                    <Text style={{ fontSize: 16 }}>Save Results</Text>
                    <View style={[styles.toggleButton, results && styles.toggleButtonActive]}>
                        <View style={[styles.toggleKnob, results && styles.toggleKnobActive]} />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    heading :{
        color: "green",
        marginVertical:10,
        fontSize:18,
    },
    content :{
        flexDirection:"row",
        marginVertical:10,
    },
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    toggleButton: {
        width: 33,
        height: 17,
        borderRadius: 8,
        backgroundColor: '#ccc',
        justifyContent: 'center',
    },
    toggleButtonActive: {
        backgroundColor: '#B1D8B7',
    },
    toggleKnob: {
        width: 18,
        height: 18,
        borderRadius: 7,
        alignSelf: 'flex-start',
        backgroundColor: '#fff',
    },
    toggleKnobActive: {
        alignSelf: 'flex-end',
        backgroundColor: 'green',
    },
});

export default Setting;
