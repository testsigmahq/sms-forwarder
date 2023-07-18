import React, { useState, useEffect } from 'react';
import {View, Text, Alert, StyleSheet, Dimensions, ScrollView, PermissionsAndroid} from 'react-native';
import SmsAndroid from 'react-native-get-sms-android';
import { NativeModules } from 'react-native';
import Database from "../database";
import axios from 'axios';
import { encode } from 'base-64';
import {useSelector} from "react-redux";
import moment from "moment";
import RNSmtpMailer from "react-native-smtp-mailer";

const DirectSms = NativeModules.DirectSms;

const Result = () => {
    const [latestMessage, setLatestMessage] = useState("");
    const [smsResult, setSmsResult] = useState([]);
    const [accessToken,setAccessToken]=useState('')
    const [smtp,setSMTP]=useState('')

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
                // console.log('Read SMS permission granted');
            } else {
                // console.log('Read SMS permission denied');
            }
        } catch (err) {
            // console.warn(err);
        }
    }

    const sendEmailSmtp = (receiver,message) => {
        const jsonStringMessage = JSON.stringify(message);

        console.log("xsendEmailSmtp",smtp)
        console.log("ss",typeof smtp.port.toString());
        console.log("cc",typeof(smtp.host))
        RNSmtpMailer.sendMail({
            mailhost:smtp.host,
            port: smtp.port.toString(),
            ssl: true,
            username:smtp.loginId,
            password:smtp.password,
            from: smtp.emailAddress,
            recipients: receiver,
            subject: 'from STMP',
            htmlBody: `<h1>${jsonStringMessage}</h1>`,
        })
            .then((success) => {
                console.log('Email sent successfully:', success)
                // Alert.alert("email sended to smtp",success)
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
                // Alert.alert("error",error);
            });
    };

    const fetchLatestMessage = () => {
        let filter = {
            box: 'inbox',
            indexFrom: 0,
            maxCount: 1,
        };
        SmsAndroid.list(
            JSON.stringify(filter),
            (fail) => {
                // console.log('Failed with this error: ', fail);
            },
            (count, smsList) => {
                // console.log('Count: ', count);
                // console.log('List: ', smsList);
                var arr = JSON.parse(smsList);

                if (arr.length > 0) {
                    const latestObject = arr[0];
                    // console.log('Latest Object: ', latestObject);
                    // console.log('--> ' , latestObject.address);
                    // console.log('--> ' , latestObject.body);
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
            if (recipients?.emails) {
                if (messageCondition) {
                    recipients.emails.forEach((email) => {
                        console.log("api check \n\n",api.googleInfo.isEmpty)
                        if (api.googleInfo.serverAuthCode) {
                            console.log("api indidce \n\n")
                            sendEmail(email.text,latestObject?.address, newMessage)
                        }else {
                            sendEmailSmtp(email.text, newMessage);
                        }
                        Database.insertResults(newMessage, latestObject?.address, email.text, formatDateTime(moment()), "Success");
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
        fetchFilters("active", latestObject);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            fetchLatestMessage();
            Database.readResults()
                .then((resultRows) => {
                    // console.log('Fetched result rows:', resultRows);
                    if (resultRows) {
                        setSmsResult(resultRows);
                    } else {
                        // console.log('No result rows found.');
                    }
                })
                .catch((error) => {
                    // console.log('Error occurred while fetching data:', error);
                });
        }, 5000);
        return () => clearInterval(timer);
    }, [latestMessage]);

    const api = useSelector((state) => {return (state.google)});
    console.log("api",api.googleInfo.serverAuthCode)

    const sendEmail = async (to, from,text) => {
        console.log("is true")
        const config = {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
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
        } catch (error) {
            console.error('Error sending email:', error);
        }
    };

    const getAccessToken = async () => {
        try {
            const response = await axios.post('https://oauth2.googleapis.com/token', {
                code: api.googleInfo.serverAuthCode,
                client_id: '473722209735-7tcidkd4hji670ckn20g9r6eu2dlivit.apps.googleusercontent.com',
                client_secret: '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',
                redirect_uri: 'http://localhost:8080/login/oauth2/code/google',
                grant_type: 'authorization_code',
            });
            const { access_token, refresh_token } = response.data;
            setAccessToken(access_token);
            console.log('Access Token:', access_token);
            console.log('Refresh Token:', refresh_token);
        } catch (error) {
            console.error('Error retrieving access token  :', error);
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

    useEffect(()=>{
        getAccessToken();
        Database.fetchUserById(1).then(r => console.log(setSMTP(r)));
    }, [])


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
