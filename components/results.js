import React, { useState, useEffect } from 'react';
import {View, Text, Alert, StyleSheet, Dimensions, ScrollView} from 'react-native';
import SmsAndroid from 'react-native-get-sms-android';
import { NativeModules } from 'react-native';
import Database from "../database";
import axios from 'axios';
import codegenNativeCommands from "react-native/Libraries/Utilities/codegenNativeCommands";
import moment from "moment";

const DirectSms = NativeModules.DirectSms;

const Result = () => {
    const [latestMessage, setLatestMessage] = useState("");
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
                console.log('Failed with this error: ', fail);
            },
            (count, smsList) => {
                console.log('Count: ', count);
                console.log('List: ', smsList);
                var arr = JSON.parse(smsList);

                if (arr.length > 0) {
                    const latestObject = arr[0];
                    console.log('Latest Object: ', latestObject);
                    console.log('--> ' , latestObject.address);
                    console.log('--> ' , latestObject.body);
                    if (latestObject.body !== latestMessage) {
                        setLatestMessage(latestObject.body);
                        forwardMessage(latestObject); // Forward the received message
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

    async function fetchRecipients(id, latestObject) {
        try {
            const recipients = await Database.fetchAllRecords(id);
            console.log("recipients : ", recipients);
            if (recipients?.phoneNumbers) {
                const phoneNumbersRecipient = recipients?.phoneNumbers?.map(item => item.text);
                DirectSms.sendDirectSms(phoneNumbersRecipient, latestObject.body);
                for (const phoneNumber of phoneNumbersRecipient) {
                    await Database.insertResults(latestObject?.body, latestObject?.address, phoneNumber, formatDateTime(moment()), "Success");
                }
            }
            if (recipients?.urls) {
              recipients?.urls?.forEach( (url) => {
                    forwardToURL(url.requestMethod, url.text, url.key, latestObject?.body);
                    Database.insertResults(latestObject?.body, latestObject?.address, url.text, formatDateTime(moment()), "Success");
                });
            }
        } catch (error) {
            console.error("Error occurred while fetching recipients:", error);
        }
    }

    async function fetchFilters(status, latestObject) {
        try {
            const filterArray = await Database.fetchFiltersByStatus(status);
            console.log("filters : ", filterArray);
            filterArray.forEach((item) => {
                fetchRecipients(item.id, latestObject)
            })
        } catch (error) {
            console.error("Error occurred while fetching filters:", error);
        }
    }

    async function fetchRules(id) {
        try {
            const rule = await  Database.fetchAllByRule(id);
            console.log("rules : ", rule);
            setRules(rule);
        } catch (error) {
            console.error("Error occurred while fetching filters:", error);
        }
    }

    const forwardMessage =  (latestObject) => {
        fetchFilters("active", latestObject);
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
            <ScrollView>
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
            </ScrollView>
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
