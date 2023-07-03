import React, {useState} from 'react';
import {View, StyleSheet, Dimensions, TouchableOpacity, Text} from "react-native";
import {createDrawerNavigator} from "@react-navigation/drawer";

const Drawer = createDrawerNavigator();

const Setting = () => {

    return (
        <View>
            <Text>HI from setting</Text>
        </View>
    );
};

const styles = StyleSheet.create({

});

export default Setting;
