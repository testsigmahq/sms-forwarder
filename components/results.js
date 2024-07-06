import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    Alert,
    Dimensions,
    Modal,
    NativeModules,
    PermissionsAndroid,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import SmsAndroid from 'react-native-get-sms-android';
import Database from "../repository/database";
import axios from 'axios';
import {encode} from 'base-64';
import {useSelector} from "react-redux";
import moment from "moment";
import RNSmtpMailer from "react-native-smtp-mailer";
import BackgroundService from 'react-native-background-actions';

const DirectSms = NativeModules.DirectSms;


const Result = () => {
    const [latestMessage, setLatestMessage] = useState("");
    const smsResultRef = useRef([]);
    const [results, setResults] = useState([]);

    // const [smtp,setSMTP]=useState('')
    const accessTokenRef = useRef(null);
    const smtpRef = useRef([]);
    const gmailActive = useRef();
    const smtpActive = useRef();
    const currentResult = useRef();
    const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));
    const [model, setModel] = useState(false)
    const [modelResult, setModelResult] = useState([]);
    const options = {
        taskName: 'Example',
        taskTitle: 'ExampleTask title',
        taskDesc: 'ExampleTask description',
        taskIcon: {
            name: 'ic_launcher',
            type: 'mipmap',
        },
        color: '#ff00ff',
        linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
        parameters: {
            delay: 5000,
        },
    };

    const veryIntensiveTask = async (taskDataArguments) => {
        const {delay} = taskDataArguments;
        while (BackgroundService.isRunning()) {
            console.log('Running task');
            await fetchResult();
            await fetchLatestMessage();
            await sleep(delay);
        }
    };

    const requestSMSPermissions = async () => {
        try {
            const permissions = [
                PermissionsAndroid.PERMISSIONS.READ_SMS,
                PermissionsAndroid.PERMISSIONS.SEND_SMS,
            ];

            const granted = await PermissionsAndroid.requestMultiple(permissions, {
                title: 'SMS Permissions',
                message: 'App needs access to read and send SMS.',
                buttonPositive: 'OK',
                buttonNegative: 'Cancel',
            });

            if (
                granted[PermissionsAndroid.PERMISSIONS.READ_SMS] === PermissionsAndroid.RESULTS.GRANTED &&
                granted[PermissionsAndroid.PERMISSIONS.SEND_SMS] === PermissionsAndroid.RESULTS.GRANTED
            ) {
                if (!BackgroundService.isRunning()) {
                    startBackgroundTask();
                    updateBackgroundNotification();
                }
                console.log('SMS permissions granted');
            } else {
                console.log('SMS permissions denied. Requesting again');
                await requestSMSPermissions();
            }
        } catch (err) {
            console.warn('Error while requesting permissions:', err);
        }
    };

    const startBackgroundTask = async () => {
        try {
            await BackgroundService.start(veryIntensiveTask, options);
            console.log('Background task started.');
        } catch (error) {
            console.error('Error starting background task:', error);
        }
    };

    const updateBackgroundNotification = async () => {
        try {
            if (BackgroundService.isRunning()) {
                await BackgroundService.updateNotification({taskDesc: 'New ExampleTask description'});
                console.log('Background notification updated.');
            }
        } catch (error) {
            console.error('Error updating background notification:', error);
        }
    };

    const stopBackgroundTask = async () => {
        try {
            await BackgroundService.stop();
            console.log('Background task stopped.');
        } catch (error) {
            console.error('Error stopping background task:', error);
        }
    };


    const sendEmailSmtp = (receiver, message) => {
        const jsonStringMessage = JSON.stringify(message);
        console.log("xsendEmailSmtp", smtpRef.current)

        if (smtpRef.current) {
            console.log("xsendEmailSmtp", smtpRef.current)
            console.log("1", smtpRef.current.port.toString());
            console.log("2", smtpRef.current.loginId)
            console.log("3", smtpRef.current.host)
            console.log("4", smtpRef.current.password)
            console.log("5", smtpRef.current.emailAddress)

            RNSmtpMailer.sendMail({
                mailhost: smtpRef.current.host,
                port: smtpRef.current.port.toString(),
                ssl: true,
                username: smtpRef.current.loginId,
                password: smtpRef.current.password,
                from: smtpRef.current.emailAddress,
                recipients: receiver,
                subject: 'from STMP',
                htmlBody: `<h1>${jsonStringMessage}</h1>`,
            }).then((success) => {
                console.log('Email sent successfully:', success)
                Alert.alert("email sent", JSON.stringify(success));
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
                    Alert.alert("error", JSON.stringify(error));
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
                    if (latestObject._id > (smsResultRef.current[smsResultRef.current.length - 1]?.date || 0)) {
                        console.log("inside")
                        setLatestMessage(latestObject.body);
                        currentResult.current = latestObject.bottom
                        forwardMessage(latestObject);
                    }
                }
            }
        );
    }, []);

    function formatDateTime(timestamp) {
        const dateObject = new Date(timestamp);
        const formattedDateTime = dateObject.toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
        return `${formattedDateTime}`;
    }

    const forwardToURL = (method, url, key, message) => {
        const data = {[key]: message};
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

    async function canForwardMessage(id, latestObject) {
        const rule = await Database.fetchAllByRule(id);
        console.log("rules : ", rule);
        let booleanValue = false;
        const forwardCondition = await Database.fetchFilters(id)
        console.log("forwardCondition", forwardCondition.forward_all);
        if ((rule.senderNumbers.length > 0 || rule.texts.length > 0)) {
            if (rule.senderNumbers.length > 0) {
                console.log("inside sender rule");
                rule.senderNumbers.forEach((number) => {
                    console.log("\n\n each number : \t", number.sender, "\n\n slicing : \t,", latestObject.address.slice(3), "\n\n status \t", number.sendStatus);
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
        } else {
            console.log("inside else no text and sender rule");
            booleanValue = true;
        }
        console.log("before booleanValue return : \t ", booleanValue)
        return booleanValue;
    }

    async function changeMessageText(id, latestObject) {
        let newMessage = latestObject?.body;
        const changeContent = await Database.fetchChangeContents(id);
        // console.log("Change content : \t ", changeContent);
        if (changeContent.length > 0) {
            // console.log("inside change content ");
            changeContent.forEach((content) => {
                if (newMessage.includes(content.oldWord)) {
                    // console.log("inside content with oldWord :\t", content.oldWord);
                    newMessage = newMessage.replace(content.oldWord, content.newWord);
                }
            })
        }
        // newMessage = `From : ${latestObject?.address} \n` + newMessage;
        console.log("NewMessage :: ", newMessage);
        return newMessage;
    }

    async function fetchRecipients(id, latestObject) {
        try {
            const recipients = await Database.fetchAllRecords(id);
            console.log("Recipients :: ", recipients);
            let messageCondition = await canForwardMessage(id, latestObject);
            let newMessage = await changeMessageText(id, latestObject);
            console.log("New message return :: ", newMessage)

            if (recipients?.phoneNumbers) {
                const phoneNumbersRecipient = recipients?.phoneNumbers?.map(item => item.text);
                if (messageCondition) {
                    DirectSms.sendDirectSms(phoneNumbersRecipient, newMessage);
                    for (const phoneNumber of phoneNumbersRecipient) {
                        await Database.insertResults(newMessage, latestObject?.address, phoneNumber, formatDateTime(moment()), "Success", latestObject?._id);
                    }
                }
            }

            if (recipients?.urls) {
                if (messageCondition) {
                    recipients?.urls?.forEach((url) => {
                        forwardToURL(url.requestMethod, url.text, url.key, latestObject?.body);
                        Database.insertResults(newMessage, latestObject?.address, url.text, formatDateTime(moment()), "Success", latestObject?._id);
                    });
                }
            }

            if (recipients?.emails) {
                if (messageCondition) {
                    recipients.emails.forEach((email) => {
                        if (gmailActive.current) {
                            if (accessTokenRef.current) {
                                sendEmail(email.text, latestObject?.address, newMessage)
                                Database.insertResults(newMessage, latestObject?.address, email.text, formatDateTime(moment()), "Success", latestObject?._id);

                            }
                        }
                        console.log("smtpActive.current", smtpActive.current)
                        if (smtpActive.current) {
                            if (smtpRef.current) {
                                sendEmailSmtp(email.text, newMessage);
                                Database.insertResults(newMessage, latestObject?.address, email.text, formatDateTime(moment()), "Success", latestObject?._id);
                            }
                        }
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
            filterArray.forEach((item) => {
                fetchRecipients(item.id, latestObject)
            })
        } catch (error) {
            console.error("Error occurred while fetching filters ::", error);
        }
    }

    const forwardMessage = (latestObject) => {
        fetchFilters("active", latestObject).then(r => console.log("success"));
    };


    const fetchResult = async () => {
        Database.readResults()
            .then((resultRows) => {
                if (resultRows) {
                    smsResultRef.current = resultRows;
                    setResults(resultRows);
                }
            })
            .catch((error) => {
                console.log('Error occurred while fetching data:', error);
            });
    }

    const api = useSelector((state) => {
        return (state.google)
    });

    const op = useSelector((state) => {
        return (state.smtp)
    });

    const sendEmail = async (to, from, text) => {
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
            Alert.alert('Email sent:', JSON.stringify(response.data));
        } catch (error) {
            console.error('Error sending email:', error);
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

        return encode(message);
    };

    useEffect(() => {

        const fetchData = async () => {

            if (op.smtp === "gmail") {
                console.log("insdie gmail acccc")
                if (!!api.googleInfo.serverAuthCode) {
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
                        Database.insertAccessToken(access_token);
                        console.log('Access Token:', access_token);
                        console.log('Refresh Token:', refresh_token);
                    } catch (error) {
                        console.error('Error retrieving access token:', error);
                    }
                }
            }

            if (op.smtp === "gmail") {
                Database.fetchAuthSettings((authSettings) => {
                    if (authSettings) {
                        gmailActive.current = true;
                        smtpActive.current = false;
                        console.log("none", authSettings.none);
                        console.log("smtp", authSettings.smtp);
                        console.log("gmail=====>", authSettings.gmail);
                    } else {
                        console.log('AuthSettings not found or error occurred.');
                    }
                });
            }
        };

        fetchData();
    }, [op.smtp]);


    useEffect(() => {

        Database.fetchAuthSettings((authSettings) => {
            if (authSettings) {
                smtpActive.current = authSettings.smtp;
                gmailActive.current = false;
            } else {
                console.log('AuthSettings not found or error occurred.');
            }
        });

        if (op.smtp) {
            Database.fetchUserById(1)
                .then((e) => {
                    if (e) {
                        smtpRef.current = e;
                    } else {
                        console.log('User data not found for ID 1.');
                    }
                })
                .catch((error) => {
                    console.log('Error fetching user data:', error);
                });
        }

    }, [op.smtp]);


    useEffect(() => {
        Database.readResults()
            .then((resultRows) => {
                if (resultRows) {
                    smsResultRef.current = resultRows;
                    setResults(resultRows);
                }
            })
            .catch((error) => {
                console.log('Error occurred while fetching data:', error);
            });
    }, [currentResult.current])

    useEffect(() => {
        Database.readResults()
            .then((resultRows) => {
                if (resultRows) {
                    smsResultRef.current = resultRows;
                    setResults(resultRows);
                }
            })
            .catch((error) => {
                console.log('Error occurred while fetching data:', error);
            });
    }, [model])

    useEffect(() => {
        requestSMSPermissions();
    }, []);

    async function deleteById(id) {
        try {
            await Database.deleteResultById(id);
            setModel(false);

            // Update smsResultRef to remove the deleted result
            smsResultRef.current = smsResultRef.current.filter(result => result.id !== id);
        } catch (error) {
            console.error('Error deleting result:', error);
        }
    }

    return (
        <View style={{flex: 1}}>
            <ScrollView>
                {results.length > 0 && results.map((result, index) => (
                    <TouchableOpacity key={index} onPress={() => {
                        setModel(true)
                        setModelResult(result);
                    }}>
                        <View key={index}><View style={{padding: 10}}>
                            <Text style={{fontWeight: "bold"}}>From : {result.sender}</Text>
                            <Text style={{fontWeight: "bold"}}>To : {result.receiver}</Text>
                            <Text>{result.message}</Text>
                            <Text style={{alignSelf: "flex-end"}}>{result?.timing} , {result.status} </Text>
                        </View>
                            <View style={{borderTopWidth: 1}}></View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <Modal visible={model} animationType="slide-up" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={{padding: 10}}>
                            <Text style={{fontWeight: "bold", fontSize: 15}}>From : {modelResult?.sender}</Text>
                            <Text style={{fontWeight: "bold", fontSize: 15}}>To : {modelResult?.receiver}</Text>
                            <Text style={{fontSize: 17}}>{modelResult?.message}</Text>
                        </View>
                        <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
                            <TouchableOpacity onPress={() => setModel(false)}>
                                <Text style={styles.bottom}>CANCEL</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => deleteById(modelResult.id)}>
                                <Text style={styles.bottom}>DELETE</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
    modalContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderRadius: 3,
        padding: 15,
        width: deviceWidth * 0.9,
    },
    bottom: {
        letterSpacing: 3,
        fontWeight: 500,
        fontSize: 18,
        color: 'green',
        margin: 10,
    },
});

export default Result;
