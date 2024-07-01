import React, {useEffect} from 'react';
import {Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import BottomTabs from '../components/bottom-tabs';
import { PermissionsAndroid } from 'react-native';
import Database from "../database";

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
                // console.log('Send SMS permission granted');
            } else {
                // console.log('Send SMS permission denied');
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
                // console.log('Storage permission granted');
            } else {
                // console.log('Storage permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    }
    async function requestReadSMSPermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_SMS,
                {
                    title: 'Camera Permission',
                    message: 'App needs access to your camera.',
                    buttonPositive: 'OK',
                    buttonNegative: 'Cancel',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                // console.log('Read SMS permission granted');
            } else {
                // console.log('Read SMS permission denied');
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
                // console.log('Contacts permission granted');
            } else {
                // console.log('Contacts permission denied');
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
                // console.log('Telephone permission granted');
            } else {
                // console.log('Telephone permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    }

    useEffect(() => {
        const requestPermissions = async () => {
            try {
                await Promise.all([
                    requestSMSPermission(),
                    requestStoragePermission(),
                    requestTelephonePermission(),
                    requestContactsPermission(),
                    requestReadSMSPermission(),
                ]);
            } catch (err) {
                console.warn(err);
            }
        };

        requestPermissions().then(r => console.log(r));
    }, []);

    async function handleDeleteAll(){
        await  Database.deleteResults();
    }


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
                    {/*<TouchableOpacity onPress={handleDeleteAll()} style={{flex:1, alignItems:"flex-end" }}>*/}
                    {/*   <Text> hi </Text>*/}
                    {/*</TouchableOpacity>*/}
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

const deviceWidth = Math.round(Dimensions.get('window').width);
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
