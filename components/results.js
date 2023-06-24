import React, { useState } from 'react';
import { Button, View, Text, Alert } from 'react-native';
import SmsAndroid from 'react-native-get-sms-android';

const Result = () => {
    const [latestMessage, setLatestMessage] = useState('');

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

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ marginBottom: 16 }}>
                Latest Received SMS: {latestMessage}
            </Text>
            <Button title="Listen SMS" onPress={handleListenSMS} />
        </View>
    );
};

export default Result;
