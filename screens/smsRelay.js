import React from 'react';
import {Dimensions, SafeAreaView, StyleSheet, TouchableOpacity, View} from 'react-native';
import BottomTabs from '../components/bottom-tabs';

function SmsRelay({ navigation }) {

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={{ flexDirection: 'row', flex: 1, width:"100%" }}>
                    <TouchableOpacity
                        testID="left-navigator"
                        name="NavigationBar"
                        style={{ width: "15%", height: "100%",}}
                        onPress={() => navigation.openDrawer()}
                    >
                        <View>
                            <View style={[styles.line, { width: 25 }]} />
                            <View style={styles.line} />
                            <View style={[styles.line, { width: 20 }]} />
                        </View>
                    </TouchableOpacity>

                </View>

                <View style={styles.bottomTabsContainer}>
                    <BottomTabs />
                </View>
            </SafeAreaView>
        </View>
    );
}

const deviceHeight = Math.round(Dimensions.get('window').height);

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
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingTop: 20,
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
        position: 'relative',
        left: 0,
        right: 0,
        bottom: 0,
        height: deviceHeight*0.92,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#FFFFFF',
    },
});

export default SmsRelay;
