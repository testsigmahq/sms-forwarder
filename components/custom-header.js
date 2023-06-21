import React from 'react';

import {Image, StyleSheet, Text, View, TouchableOpacity, Dimensions} from 'react-native';

const CustomHeader = props => {
    return (
        <View style={styles.container}>
            <TouchableOpacity testID={"go-back"} name={"navigate-back"} onPress={props.onPressBackButton}>
                <Image
                    source={require('../../assets/arrow-back.png')}
                    style={styles.arrowLeft}
                />
            </TouchableOpacity>
            <Text style={styles.title}>{props.title}</Text>
            <View style={styles.positioning}>
                <TouchableOpacity testID={"skip"} name={"skip"} onPress={props.onPressSkip}>
                    <Text style={styles.skip}>{props.skip}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const deviceWidth = Math.round(Dimensions.get('window').width)
const styles = StyleSheet.create({
    container: {
        color: 'black',
        flexDirection: 'row',
        height: 60,
        alignItems: 'center',
    },
    arrowLeft: {
        width: 20,
        height: 20,
        left: 17,
        resizeMode: 'contain',
    },
    title: {
        left: 30,
        height: 22,
        fontFamily: 'Lato',
        fontStyle: 'normal',
        // fontWeight: '700',
        fontSize: 20,
        lineHeight: 22,
        //alignItems: 'center',
        letterSpacing: 1,
        color: '#000000',
    },
    skip: {
        color:'#6648D8',
        fontFamily: 'Lato',
        fontSize: 14,
    },
    positioning:{
        position:'absolute',
        left: deviceWidth-50,
    },
    emailInput: {
        height: 40,
        width: 295,
        left: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: '#00000033',
        padding: 10,

        fontFamily: 'Lato',
        fontStyle: 'normal',
        // fontWeight: '400',
        fontSize: 16,
        // lineHeight: 22,
        /* identical to box height, or 138% */
        letterSpacing: 0.5,
        color: 'black',
    },
});

export default CustomHeader;
