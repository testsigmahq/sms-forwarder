import React, { useState } from 'react';
import {Button, View, Text, Alert, SafeAreaView, StyleSheet, TouchableOpacity, Image, Dimensions} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import CustomHeader from "../components/custom-header";
import {Input} from "react-native-elements";

const MessageTemplate = () => {

    const navigation = useNavigation();
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    const inputContainerStyle = [
        styles.inputContainer,
        isFocused && styles.inputContainerFocused,
    ];
    return (
        <SafeAreaView style={styles.container}>
            <View style={{ marginBottom: 4 }}>
                <CustomHeader
                    title="Message Template"
                    onPressBackButton={() => navigation.goBack()} />
            </View>
            <View style={styles.previewCard}>
                <Text>Preview</Text>
            </View>
            <Input
                containerStyle={inputContainerStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
            />

        </SafeAreaView>
    );
};

const deviceWidth = Math.round(Dimensions.get('window').width)
const deviceHeight = Math.round(Dimensions.get('window').height);



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    previewCard: {
        backgroundColor: 'white',
        borderColor: 'green',
        borderWidth: 0.5,
        borderRadius: 4,
        width: deviceWidth*0.9,
        height:deviceHeight*0.8-550,
        alignSelf:"center",
        margin: 10,
        marginTop: 18,
    },
    inputContainer: {
        borderWidth: 2,
        borderColor: 'gray',
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingTop: 4,
        paddingBottom: 8,
    },
    inputContainerFocused: {
        borderColor: 'green',
    },
});

export default MessageTemplate;
