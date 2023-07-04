import React, {useEffect} from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomTabs from '../components/bottom-tabs';
import { PermissionsAndroid } from 'react-native';

function SmsRelay({ navigation }) {

    async function requestSMSPermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.SEND_SMS,
                {
                    title: 'Camera Permission',
                    message: 'App needs access to your camera.',
                    buttonPositive: 'OK',
                    buttonNegative: 'Cancel',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('Camera permission granted');
            } else {
                console.log('Camera permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    }

    async function requestStoragePermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: 'Camera Permission',
                    message: 'App needs access to your camera.',
                    buttonPositive: 'OK',
                    buttonNegative: 'Cancel',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('Camera permission granted');
            } else {
                console.log('Camera permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    }

    async function requestContactsPermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
                {
                    title: 'Camera Permission',
                    message: 'App needs access to your camera.',
                    buttonPositive: 'OK',
                    buttonNegative: 'Cancel',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('Camera permission granted');
            } else {
                console.log('Camera permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    }

    async function requestTelephonePermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CALL_PHONE,
                {
                    title: 'Camera Permission',
                    message: 'App needs access to your camera.',
                    buttonPositive: 'OK',
                    buttonNegative: 'Cancel',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('Camera permission granted');
            } else {
                console.log('Camera permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    }

    useEffect(() => {
        requestSMSPermission();
        requestStoragePermission();
        requestTelephonePermission();
        requestContactsPermission();
    },[])

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                    <TouchableOpacity
                        testID="left-navigator"
                        name="NavigationBar"
                        style={{ width: 70, height: 70 }}
                        onPress={() => navigation.openDrawer()}
                    >
                        <View>
                            <View style={[styles.line, { width: 25 }]} />
                            <View style={styles.line} />
                            <View style={[styles.line, { width: 20 }]} />
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
}

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
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 700,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#FFFFFF',
    },
});

export default SmsRelay;
