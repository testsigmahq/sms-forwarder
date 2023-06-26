import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomTabs from '../components/bottom-tabs';

const SmsRelay = () => {
    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                    <TouchableOpacity
                        testID={"left-navigator"}
                        name={"NavigationBar"}
                        style = {{width: 70, height: 70}}
                        // onPress = {() => navigation.openDrawer()}
                    >
                        <View>
                            <View style = {[styles.line, {width: 25}]} />
                            <View style = {styles.line} />
                            <View style = {[styles.line, {width: 20}]} />
                        </View>
                    </TouchableOpacity>
                    <View style={styles.content}>
                        {/* Your main content goes here */}
                    </View>
                </View>
                <View style={styles.bottomTabsContainer}>
                    <BottomTabs />
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    safeArea: {
        flex: 1,
    },
    content: {
        flex: 1,
        backgroundColor: '#FFFFFF', // Replace with your desired background color
        paddingHorizontal: 20, // Adjust as needed
        paddingTop: 20, // Adjust as needed
    },
    line: {
        borderBottomWidth: 2,
        borderBottomColor: '#03A973',
        width: 30,
        marginTop: 7,
        left: 15,
        top: 15,
    },
    bottomTabsContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 700,
        backgroundColor: '#FFFFFF', // Replace with your desired background color
        borderTopWidth: 1,
        borderTopColor: '#FFFFFF', // Replace with your desired border color
    },
});

export default SmsRelay;
