import React, { useState, useEffect } from 'react';
import {View, Text, Alert, StyleSheet, Dimensions, ScrollView, PermissionsAndroid} from 'react-native';
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

    useEffect(() => {
        requestReadSMSPermission()
    },[])

    async function requestReadSMSPermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_SMS,
                {
                    title: 'SMS Read Permission',
                    message: 'App needs access to read SMS.',
                    buttonPositive: 'OK',
                    buttonNegative: 'Cancel',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('Read SMS permission granted');
            } else {
                console.log('Read SMS permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    }

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

    async function canForwardMessage(id, latestObject){
        const rule = await  Database.fetchAllByRule(id);
        console.log("rules : ", rule);
        let booleanValue = false;
        if(rule.senderNumbers.length > 0 || rule.texts.length > 0) {
            if (rule.senderNumbers.length > 0) {
                console.log("inside sender rule");
                rule.senderNumbers.forEach((number) => {
                    console.log("\n\n each number : \t", number.sender, "\n\n slicing : \t,",latestObject.address.slice(3), "\n\n status \t", number.sendStatus);
                    if (number.sender === latestObject.address.slice(3) && number.sendStatus === "1") {
                        console.log("inside sender number status 1");
                        booleanValue = true;
                    }
                })
            }
            if (rule.texts.length > 0) {
                console.log("inside text rule");
                for (const text of rule.texts) {
                    if (text.sendStatus === "1" && !latestObject?.body.includes(text.messageText)) {
                        booleanValue = false;
                        console.log("before return 1 statement , ", text.messageText, booleanValue);
                        return;
                    }
                    if (text.sendStatus === "0" && latestObject?.body.includes(text.messageText)) {
                        booleanValue = false;
                        console.log("before return 0 statement , ", text.messageText, booleanValue);
                        return;
                    }
                    booleanValue = true;
                    console.log("before else , ", text.messageText, booleanValue);
                }
            }
        }
        else {
            console.log("inside else no text and sender rule");
            booleanValue = true;
        }
        console.log("before booleanValue return : \t ", booleanValue)
        return booleanValue;
    }

    async  function changeMessageText(id,latestObject){
        let newMessage = latestObject?.body;
        const changeContent = await Database.fetchChangeContents(id);
        console.log("Change content : \t ", changeContent);
        if(changeContent.length > 0){
            console.log("inside change content ");
            changeContent.forEach((content) => {
                if (newMessage.includes(content.oldWord)){
                    console.log("inside content with oldWord :\t", content.oldWord);
                    newMessage = newMessage.replace(content.oldWord, content.newWord);
                }
            })
        }
        newMessage = `From : ${latestObject?.address} \n` + newMessage;
        console.log("before returning newMessage : ", newMessage);
        return newMessage;
    }
    async function fetchRecipients(id, latestObject) {
        try {
            const recipients = await Database.fetchAllRecords(id);
            console.log("recipients : ", recipients);
            let messageCondition = await canForwardMessage(id, latestObject);
            let newMessage = await changeMessageText(id,latestObject);
            if (recipients?.phoneNumbers) {
                const phoneNumbersRecipient = recipients?.phoneNumbers?.map(item => item.text);
                if (messageCondition) {
                    DirectSms.sendDirectSms(phoneNumbersRecipient, newMessage);
                    for (const phoneNumber of phoneNumbersRecipient) {
                        await Database.insertResults(newMessage, latestObject?.address, phoneNumber, formatDateTime(moment()), "Success");
                    }
                }
            }
            if (recipients?.urls) {
                if (messageCondition) {
                    recipients?.urls?.forEach((url) => {
                        forwardToURL(url.requestMethod, url.text, url.key, latestObject?.body);
                        Database.insertResults(newMessage, latestObject?.address, url.text, formatDateTime(moment()), "Success");
                    });
                }
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

    const forwardMessage =  (latestObject) => {
        fetchFilters("active", latestObject);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            fetchLatestMessage();
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
        }, 5000);
        return () => clearInterval(timer);
    }, [latestMessage]);

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
