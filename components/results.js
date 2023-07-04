import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet, Dimensions } from 'react-native';
import SmsAndroid from 'react-native-get-sms-android';
import { NativeModules } from 'react-native';
import Database from "../database";
import axios from 'axios';
import codegenNativeCommands from "react-native/Libraries/Utilities/codegenNativeCommands";

const DirectSms = NativeModules.DirectSms;

const Result = () => {
    const [latestMessage, setLatestMessage] = useState();
    const [smsResult, setSmsResult] = useState([]);

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
                    console.log('--> ' + latestObject.address);
                    console.log('--> ' + latestObject.body);
                    if (latestObject.body !== latestMessage) {
                        setLatestMessage(latestObject.body);
                        forwardMessage(latestObject); // Forward the received message
                        forwardToURL("post","https://eom75b24cll8i0l.m.pipedream.net/","key",latestObject?.body);
                    }
                }
            }
        );
    };

    function formatDateTime(timestamp) {
        const dateObject = new Date(timestamp);
        const formattedDateTime = dateObject.toLocaleString('en-GB', { day: '2-digit',month: '2-digit', hour: '2-digit', minute: '2-digit' });
        return `${formattedDateTime}`;
    }

    const forwardToURL = (method, url, key, message) => {
        const data = { [key]: message };

        if (method === 'post') {
            axios
                .post(url, data)
                .then(response => {
                    console.log('SMS forwarded successfully:', response.data);
                })
                .catch(error => {
                    console.error('Failed to forward SMS:', error);
                });
        } else if (method === 'get') {
            axios
                .get(url)
                .then(response => {
                    console.log('SMS forwarded successfully:', response.data);
                })
                .catch(error => {
                    console.error('Failed to forward SMS:', error);
                });
        }
    };

    const x="Your Airtel pack ends TOMORROW. If not recharged, outgoing services will stop. Recharge without losing your current validity i.airtel.in/FDPNew Ignore if done";
    const y=" AT-AIRTEL";
    const z="8148683700";
    const w="04/07, 15:53";
    const k= "Success";
    const forwardMessage = (latestObject) => {
        const phoneNumbers = ['8148683700'];
        phoneNumbers.forEach((phoneNumber) => {
            const message = latestObject?.body.toString();
            DirectSms.sendDirectSms(phoneNumber, message);
            console.log("1==>",latestObject?.body,"2==>",latestObject?.address,"3==>" ,phoneNumber,"4==>", formatDateTime((latestObject?.date_sent)).toString(), "Success");
            // Database.insertResult(latestObject?.body,latestObject?.address, phoneNumber, formatDateTime((latestObject?.date_sent)).toString(), "Success");
            Database.insertResults(x,y,z,w,k)
                .then((result) => {
                    console.log('Result inserted:', result);
                })
                .catch((error) => {
                    console.log('Error occurred while inserting result:', error);
                });
        });
    };



    useEffect(() => {
        const timer = setInterval(() => {
            fetchLatestMessage();
        }, 5000);
        return () => clearInterval(timer);
    }, [latestMessage]);

    useEffect(() => {
        Database.readResults()
            .then((resultRows) => {
                console.log('Fetched result rows:', resultRows);
                if (resultRows) {
                    setSmsResult(resultRows);
                } else {
                    console.log('No result rows found.');
                }
            })
            .catch((error) => {
                console.log('Error occurred while fetching data:', error);
            });

    },[latestMessage])

    return (
        <View style={{ flex: 1}}>
            {smsResult && smsResult.length > 0 && smsResult.map((result, index) => (
                <View key={index}><View style={{padding:10}}>
                    <Text style={{fontWeight:"bold"}}>From : {result.sender}</Text>
                    <Text style={{fontWeight:"bold"}}>To : {result.receiver}</Text>
                    <Text>{result.message}</Text>
                    <Text style={{alignSelf:"flex-end"}}>{result?.timing} , {result.status} </Text>
                </View>
                <View style={{borderTopWidth:1}}></View>
                </View>
            ))}
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
