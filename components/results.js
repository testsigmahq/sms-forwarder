import React, { useState } from 'react';
import {Button, View, Text, Alert, SafeAreaView, StyleSheet, Dimensions, Platform, Linking} from 'react-native';
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
    const handleListenSMS = () => {
        let filter = {
            box: 'inbox', // 'inbox' (default), 'sent', 'draft', 'outbox', 'failed', 'queued', and '' for all
            address: '+918148683700', // sender's phone number
            indexFrom: 0, // start from index 0
            maxCount: 1, // count of SMS to return each time
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

                arr.forEach(function (object) {
                    console.log('Object: ' + object);
                    console.log('-->' + object.date);
                    console.log('-->' + object.body);
                    setLatestMessage(object.body);
                    Alert.alert('Received SMS', object.body);
                });
            },
        );
    };

    function handleSendSMS() {
        DirectSms.sendDirectSms('8110037728', 'This is a direct message');
    }


    return (
        <>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ marginBottom: 16 }}>
                Latest Received SMS: {latestMessage}
            </Text>
            <Button title="Listen SMS" onPress={handleListenSMS} />
            <Button title="Send SMS" onPress={handleSendSMS} />

        </View>

        <SafeAreaView style={styles.container}>
            {content.map((item, index) => (
                <React.Fragment key={index}>
                    <View style={styles.line}></View>
                    <View>
                    <Text style={styles.resultText}>From: {item.from}</Text>
                    <Text style={styles.resultText}>To: {item.to}</Text>
                    <Text style={styles.resultText}>SIM In : SIM 1</Text>
                    <View style={styles.line}></View>
                    </View>
                </React.Fragment>
            ))}
        </SafeAreaView>
            </>

        );
};

const deviceWidth = Math.round(Dimensions.get('window').width);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 16,
    },
    line:{
        borderBottomColor: 'rgba(0, 0, 0, 0.6)',
        borderBottomWidth: StyleSheet.hairlineWidth,
        width: deviceWidth *0.9,
        margin:10,
    },
    resultText:{
        fontSize:15,
        fontWeight:500,
    }

})

export default Result;
