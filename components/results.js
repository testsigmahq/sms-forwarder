import React, {useState, useEffect, useCallback, useRef} from 'react';
import {View, Text, Alert, StyleSheet, Dimensions, ScrollView, PermissionsAndroid} from 'react-native';
import SmsAndroid from 'react-native-get-sms-android';
import { NativeModules } from 'react-native';
import Database from "../database";
import axios from 'axios';
import { encode } from 'base-64';
import {useDispatch, useSelector} from "react-redux";
import moment from "moment";
import RNSmtpMailer from "react-native-smtp-mailer";

const DirectSms = NativeModules.DirectSms;

import BackgroundService from 'react-native-background-actions';


const Result = () => {
    const [latestMessage, setLatestMessage] = useState("");
    const smsResultRef = useRef([]);
    const [smtp,setSMTP]=useState('')
    const accessTokenRef = useRef(null);


    useEffect(() => {
        requestReadSMSPermission();
    },[])
    const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));


    const options = {
        taskName: 'Example',
        taskTitle: 'ExampleTask title',
        taskDesc: 'ExampleTask description',
        taskIcon: {
            name: 'ic_launcher',
            type: 'mipmap',
        },
        color: '#ff00ff',
        linkingURI: 'yourSchemeHere://chat/jane', // See  Deep Linking for more info
        parameters: {
            delay: 10000,
        },
    };
    const veryIntensiveTask = async (taskDataArguments) => {
        const { delay } = taskDataArguments;
        await new Promise(async (resolve) => {
            for (let i = 0; BackgroundService.isRunning(); i++) {
               await fetchResult();
              await  fetchLatestMessage();
                await sleep(delay);
            }
        });
    };
    useEffect(() => {
        const startBackgroundTask = async () => {
            try {
                // Start the background service with the intensive task
                await BackgroundService.start(veryIntensiveTask, options);
                console.log('Background task started.');
            } catch (error) {
                console.error('Error starting background task:', error);
            }
        };

        const updateBackgroundNotification = async () => {
            try {
                if (BackgroundService.isRunning()) {
                    // Update the background task notification with a new description
                    await BackgroundService.updateNotification({ taskDesc: 'New ExampleTask description' });
                    console.log('Background notification updated.');
                }
            } catch (error) {
                console.error('Error updating background notification:', error);
            }
        };

        const stopBackgroundTask = async () => {
            try {
                // Stop the background task
                await BackgroundService.stop();
                console.log('Background task stopped.');
            } catch (error) {
                console.error('Error stopping background task:', error);
            }
        };

        // Start the background task and update the notification
        startBackgroundTask();
        updateBackgroundNotification();

    }, []);


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
                // console.log('Read SMS permission granted');
            } else {
                // console.log('  SMS permission  denied');
            }
        } catch (err) {
            // console.warn(err);
        }
    }

    const sendEmailSmtp = (receiver,message) => {
        const jsonStringMessage = JSON.stringify(message);
     if(smtp) {
         console.log("xsendEmailSmtp", smtp)
         console.log("ss", typeof smtp.port.toString());
         console.log("cc", typeof (smtp.host))
         RNSmtpMailer.sendMail({
             mailhost: smtp.host,
             port: smtp.port.toString(),
             ssl: true,
             username: smtp.loginId,
             password: smtp.password,
             from: smtp.emailAddress,
             recipients: receiver,
             subject: 'from STMP',
             htmlBody: `<h1>${jsonStringMessage}</h1>`,
         })
             .then((success) => {
                 console.log('Email sent successfully:', success)
                 Alert.alert("email sent",JSON.stringify(success));
                 console.log("receiver", receiver);
                 console.log("message", message);
                 console.log("typeof message", typeof message);
                 console.log("message as string", message.toString());

                 if (typeof message !== 'string') {
                     console.log("message is not a string");

                 }
             })
             .catch((error) => {
                 console.log('Error sending email:', error)
                 Alert.alert("error",JSON.stringify(error));
             });
     }
    };

    const fetchLatestMessage = useCallback(() => {
        let filter = {
            box: 'inbox',
            indexFrom: 0,
            maxCount: 1,
        };
        SmsAndroid.list(
            JSON.stringify(filter),
            (fail) => {
                // console.log('Failed with this error: ' , fail);
            },
            (count, smsList) => {
                // console.log('Count: ', count);
                // console.log('List: ', smsList);
                var arr = JSON.parse(smsList);

                if (arr.length > 0) {
                    const latestObject = arr[0];
                    // console.log('Latest Object: ', latestObject );
                    // console.log('--> ' , latestObject.addres s);
                    // console.log('--> ' , latestObject.body);
                    console.log("smsResult-=========>",smsResultRef.current)
                    console.log("latestObject._id====>",latestObject._id)
                    console.log("smsResult[smsResult.length - 1]?.date",smsResultRef.current[smsResultRef.current.length - 1]?.date);
                    if (latestObject._id > (smsResultRef.current[smsResultRef.current.length - 1]?.date || 0)) {
                        console.log("inside")
                        setLatestMessage(latestObject.body);
                        forwardMessage(latestObject);
                    }
                }
            }
        );
    }, []);


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
                    // console.log('SMS forwarded successfully:', response.data);
                })
                .catch(error => {
                    // console.error('Failed to forward SMS:', error);
                });
        } else if (method === 'get') {
            axios
                .get(url)
                .then(response => {
                    // console.log('SMS forwarded successfully:', response.data);
                })
                .catch(error => {
                    // console.error('Failed to forward SMS:', error);
                });
        }
    };

    async function canForwardMessage(id, latestObject){
        const rule = await  Database.fetchAllByRule(id);
        console.log("rules : ", rule);
        let booleanValue = false;
        const forwardCondition = await Database.fetchFilters(id)
        console.log("forwardCondition",forwardCondition.forward_all);
        if((rule.senderNumbers.length > 0 || rule.texts.length > 0)) {
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
                // console.log("inside text rule");
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
        // console.log("Change content : \t ", changeContent);
        if(changeContent.length > 0){
            // console.log("inside change content ");
            changeContent.forEach((content) => {
                if (newMessage.includes(content.oldWord)){
                    // console.log("inside content with oldWord :\t", content.oldWord);
                    newMessage = newMessage.replace(content.oldWord, content.newWord);
                }
            })
        }
        // newMessage = `From : ${latestObject?.address} \n` + newMessage;
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
                        console.log("latestObject?.body?.date_sent==>",latestObject?.body?.date_sent);
                        await Database.insertResults(newMessage, latestObject?.address, phoneNumber, formatDateTime(moment()), "Success",latestObject?._id);
                    }
                }
            }
            if (recipients?.urls) {
                if (messageCondition) {
                    recipients?.urls?.forEach((url) => {
                        forwardToURL(url.requestMethod, url.text, url.key, latestObject?.body);
                        Database.insertResults(newMessage, latestObject?.address, url.text, formatDateTime(moment()), "Success",latestObject?._id);
                    });
                }
            }
            if (recipients?.emails) {
                if (messageCondition) {
                    recipients.emails.forEach((email) => {
                        console.log("api.googleInfo.serverAuthCode========================>",api.googleInfo.serverAuthCode);
                        console.log(" accessTokenRef.current===========================================>",accessTokenRef.current);
                        if (api.googleInfo.serverAuthCode) {
                            if( accessTokenRef.current) {
                                sendEmail(email.text, latestObject?.address, newMessage)
                            }
                        }
                        else {
                            sendEmailSmtp(email.text, newMessage);
                        }
                        Database.insertResults(newMessage, latestObject?.address, email.text, formatDateTime(moment()), "Success",latestObject?._id);
                    })
                }
            }
        } catch (error) {
            console.error("Error occurred while fetching recipients:", error);
        }
    }

    async function fetchFilters(status, latestObject) {
        try {
            const filterArray = await Database.fetchFiltersByStatus(status);
            // console.log("filters : ", filterArray);
            filterArray.forEach((item) => {
                fetchRecipients(item.id, latestObject)
            })
        } catch (error) {
            // console.error("Error occurred while fetching filters:", error);
        }
    }

    const forwardMessage =  (latestObject) => {
        fetchFilters("active", latestObject).then(r => console.log("success"));
    };


    const fetchResult = async()=> {
        Database.readResults()
            .then((resultRows) => {
                if (resultRows) {
                    smsResultRef.current = resultRows;
                } else {
                    // console.log('No result rows found.');
                }
            })
            .catch((error) => {
                // console.log('Error occurred while fetching data:', error);
            });
    }

    const api = useSelector((state) => {return (state.google)});
    console.log("api",api.googleInfo.serverAuthCode)

    const sendEmail = async (to, from,text) => {
        console.log("is true", accessTokenRef.current)
        const config = {
            headers: {
                'Authorization': `Bearer ${accessTokenRef.current}`,
                'Content-Type': 'application/json',
            },
        };
        const email = {
            to: to,
            subject: ` From: ${from} - SMS Forwarder`,
            text: text,
        };
        try {
            const response = await axios.post('https://www.googleapis.com/gmail/v1/users/me/messages/send', {
                raw: createRawMessage(email),
            }, config);
            console.log('Email sent:', response.data);
            Alert.alert('Email sent:',JSON.stringify(response.data));
        } catch (error) {
            console.error('Error sending email:', error);
        }
    };

    const getAccessToken = async () => {
        console.log("api.googleInfo.serverAuthCode==========-----------====>",api.googleInfo.serverAuthCode);
        if(api.googleInfo.serverAuthCode) {
            try {
                const response = await axios.post('https://oauth2.googleapis.com/token', {
                    code: api.googleInfo.serverAuthCode,
                    client_id: '473722209735-7tcidkd4hji670ckn20g9r6eu2dlivit.apps.googleusercontent.com',
                    client_secret: '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',
                    redirect_uri: 'http://localhost:8080/login/oauth2/code/google',
                    grant_type: 'authorization_code',
                });
                const {access_token, refresh_token} = response.data;
                accessTokenRef.current = access_token;
                console.log('Access Token======================================================================================>>>>>>>>>>>>:', access_token);
                console.log('Refresh Token:', refresh_token);
            } catch (error) {
                console.error('Error retrieving access token  :', error);
            }
        }
    };

    const createRawMessage = (email) => {
        const message = [
            `From: ${email.from}`,
            `To: ${email.to}`,
            `Subject: ${email.subject}`,
            '',
            `${email.text}`,
        ].join('\r\n');

        const base64EncodedMessage = encode(message);

        return base64EncodedMessage;
    };

    useEffect(() => {
        getAccessToken();
        Database.fetchUserById(1).then(r => console.log(setSMTP(r)));
        console.log("got it");
    }, [api.googleInfo.serverAuthCode]);

    return (
        <View style={{ flex: 1}}>
            <ScrollView>
            {smsResultRef.current && smsResultRef.current.length > 0 && smsResultRef.current.map((result, index) => (
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
