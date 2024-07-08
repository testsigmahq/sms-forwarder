import React, {useEffect, useRef, useState} from 'react';
import {
    Alert,
    Dimensions,
    Modal, NativeModules,
    PermissionsAndroid,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Database from "../repository/database";
import BackgroundService from 'react-native-background-actions';
import SmsAndroid from "react-native-get-sms-android";
import axios from "axios";
import {changeMessageText, formatDateTime} from "../utils/message-format.util";
import moment from "moment";
import {encode} from "base-64";
import RNSmtpMailer from "react-native-smtp-mailer";
import {useSelector} from "react-redux";
import {GoogleSignin} from "@react-native-google-signin/google-signin";
import {getCurrentTime} from "../utils/date";

const DirectSms = NativeModules.DirectSms;

const Result = () => {
    const smsResultRef = useRef([]);
    const [results, setResults] = useState([]);
    const [model, setModel] = useState(false)
    const [modelResult, setModelResult] = useState([]);
    const [isBackgroundServiceRunning, setIsBackgroundServiceRunning] = useState(BackgroundService.isRunning());

    // TODO : Remove this ref and use method from redux --------------------------------------------------------------
    const smtpRef = useRef([]);

    const api = useSelector((state) => {
        return (state.google)
    });

    const op = useSelector((state) => {
        return (state.smtp)
    });

    // -------------- < End of To Do > -------------------------------------------------------------------------------

    // -------------- < Background service > -------------------------------------------------------------------------
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
        linkingURI: 'yourSchemeHere://chat/jane',
        parameters: {
            delay: 5000,
        },
    };

    const veryIntensiveTask = async (taskDataArguments) => {
        const {delay} = taskDataArguments;
        while (BackgroundService.isRunning()) {
            console.log(getCurrentTime("INFO") + 'Running task');
            await fetchLatestMessage();
            setIsBackgroundServiceRunning(BackgroundService.isRunning());
            await sleep(delay);
        }
    };

    const signInSilently = async (retries = 3) => {
        try {
            const user = await GoogleSignin.signInSilently();
            console.log(getCurrentTime("INFO") + 'Silent sign-in successful, user::', user);
            return user;
        } catch (error) {
            console.error(getCurrentTime("ERROR") + 'Silent sign-in failed, Error::', error);
            if (retries > 0) {
                setTimeout(() => signInSilently(retries - 1), 1000); // Retry after 1 second
            } else {
                return await signInInteractively();
            }
        }
    };

    const signInInteractively = async () => {
        try {
            const user = await GoogleSignin.signIn();
            console.log(getCurrentTime("INFO") + 'Silent sign-in signInInteractively successful user::', user);
            return user;
        } catch (error) {
            console.error(getCurrentTime("ERROR") + 'Interactive sign-in failed, Error::', error);
        }
    };

    const startBackgroundTask = async () => {
        try {
            await BackgroundService.start(veryIntensiveTask, {...options});
            console.log(getCurrentTime("INFO") + 'Background task started.');
        } catch (error) {
            console.error(getCurrentTime("ERROR") + 'Error starting background task, Error::', error);
        }
    };

    const updateBackgroundNotification = async () => {
        try {
            if (BackgroundService.isRunning()) {
                await BackgroundService.updateNotification({taskDesc: 'New ExampleTask description'});
                console.log(getCurrentTime("INFO") + 'Background notification updated.');
            }
        } catch (error) {
            console.error(getCurrentTime("ERROR") + 'Error updating background notification, Error::', error);
        }
    };

    const stopBackgroundTask = async () => {
        try {
            await BackgroundService.stop();
            console.log(getCurrentTime("INFO") + 'Background task stopped.');
        } catch (error) {
            console.error(getCurrentTime("ERROR") + 'Error stopping background task, Error::', error);
        }
    };


    // ---------------------------------------------------------------------------------------------------------------


    // -------------- < Message forwarder service > ------------------------------------------------------------------


    const fetchLatestMessage = () => {
        let filter = {
            box: 'inbox',
            indexFrom: 0,
            maxCount: 1,
        };
        SmsAndroid.list(
            JSON.stringify(filter),
            (fail) => {
                console.log(getCurrentTime("ERROR") + 'Failed to fetch SMS list, Error::', fail);
            },
            (count, smsList) => {
                let arr = JSON.parse(smsList);

                if (arr.length > 0) {
                    const latestObject = arr[0];
                    if (latestObject._id > (smsResultRef.current[smsResultRef.current.length - 1]?.date || 0)) {
                        forwardMessage(latestObject);
                        fetchResult(setResults, smsResultRef).then(() => console.log(getCurrentTime("INFO") + "Fetched result"));
                    }
                }
            }
        );
    }

    const fetchResult = async (setResults, smsResultRef) => {
        Database.readResults()
            .then((resultRows) => {
                if (resultRows) {
                    smsResultRef.current = resultRows;
                    setResults(resultRows);
                }
            })
            .catch((error) => {
                console.log(getCurrentTime("ERROR") + 'Error occurred while fetching data, Error::', error);
            });
    }

    const forwardMessage = (latestObject) => {
        // TODO: Need to handle call back
        fetchFilters("active", latestObject).then(() => console.log(getCurrentTime("INFO") + "success"));
    };

    async function fetchFilters(status, latestObject) {
        try {
            const filterArray = await Database.fetchFiltersByStatus(status);
            filterArray.forEach((item) => {
                fetchRecipients(item.id, latestObject)
            })
        } catch (error) {
            console.error(getCurrentTime("ERROR") + "Error occurred while fetching filters, Error::", error);
        }
    }

    // Function to fetch auth settings and return mail method
    const fetchAuthSettingsPromise = () => {
        return new Promise((resolve, reject) => {
            Database.fetchAuthSettings((authSettings) => {
                if (authSettings) {
                    resolve(authSettings);
                } else {
                    reject('AuthSettings not found or error occurred.');
                }
            });
        });
    };

    const getMailMethod = async () => {
        try {
            const authSettings = await fetchAuthSettingsPromise();
            let mailMethod;

            if (authSettings) {
                if (authSettings.none) {
                    mailMethod = "None";
                } else if (authSettings.smtp) {
                    mailMethod = "Via SMTP";
                } else {
                    mailMethod = "Via Gmail API";
                }
            } else {
                console.log(getCurrentTime("INFO") + 'AuthSettings not found or error occurred.');
                mailMethod = undefined;
            }

            return mailMethod;
        } catch (error) {
            console.error(getCurrentTime("ERROR") + 'Error occurred while fetching auth settings, Error::', error);
            return undefined;
        }
    };

    const getAccessToken = async () => {
        try {
            const currentUser = await signInSilently();
            console.log(getCurrentTime("INFO") + "After silent signIn userInfo:: , " + currentUser.user + " serverAuthCode::", currentUser.serverAuthCode);

            const response = await axios.post('https://oauth2.googleapis.com/token', {
                code: currentUser.serverAuthCode,
                client_id: '473722209735-7tcidkd4hji670ckn20g9r6eu2dlivit.apps.googleusercontent.com',
                client_secret: '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',
                redirect_uri: 'http://localhost:8080/login/oauth2/code/google',
                grant_type: 'authorization_code',
            });

            const {access_token, refresh_token} = response.data;

            // Store the access token in your database
            await Database.insertAccessToken(access_token);
            console.log(getCurrentTime("INFO") + 'Access Token::', access_token);
            console.log(getCurrentTime("INFO") + 'Refresh Token::', refresh_token);

            return access_token;
        } catch (error) {
            if (error.response) {
                console.error(getCurrentTime("ERROR") + 'Error retrieving access token:', error.response.status, error.response.data);
            } else if (error.request) {
                console.error(getCurrentTime("ERROR") + 'No response received:', error.request);
            } else {
                console.error(getCurrentTime("ERROR") + 'Error setting up request:', error.message);
            }

            return undefined;
        }
    };


    // TODO : Need to check and update this function
    const getSMTPRef = async () => {
        try {
            let smtpRef;
            //fetch users detail
            Database.fetchUserById(1)
                .then((e) => {
                    if (e) {
                        smtpRef = e;
                    } else {
                        console.log(getCurrentTime("DEBUG") + 'User data not found for ID 1.');
                    }
                })
                .catch((error) => {
                    console.log(getCurrentTime("ERROR") + 'Error fetching user data:', error);
                });
            return smtpRef;
        } catch (error) {
            console.error(getCurrentTime("ERROR") + 'Error retrieving access token:', error);
            return undefined;
        }
    }

    async function fetchRecipients(id, latestObject) {
        try {
            const recipients = await Database.fetchAllRecords(id);
            console.log(getCurrentTime("INFO") + "Recipients :: ", recipients);
            let messageCondition = await canForwardMessage(id, latestObject);
            let newMessage = await changeMessageText(id, latestObject);
            console.log(getCurrentTime("INFO") + "New message return :: ", newMessage)

            if (recipients?.phoneNumbers) {
                const phoneNumbersRecipient = recipients?.phoneNumbers?.map(item => item.text);
                if (messageCondition) {
                    try {
                        DirectSms.sendDirectSms(phoneNumbersRecipient, newMessage);
                        for (const phoneNumber of phoneNumbersRecipient) {
                            await Database.insertResults(newMessage, latestObject?.address, phoneNumber, formatDateTime(moment()), "Success", latestObject?._id);
                        }
                    } catch (error) {
                        console.error(getCurrentTime("ERROR") + "Error occurred while sending SMS:", error);
                    }
                }
            }

            if (recipients?.urls) {
                if (messageCondition) {
                    recipients?.urls?.forEach((url) => {
                        const isForwarded = forwardToURL(url.requestMethod, url.text, url.key, latestObject?.body);
                        if (isForwarded) {
                            Database.insertResults(newMessage, latestObject?.address, url.text, formatDateTime(moment()), "Success", latestObject?._id);
                        } else {
                            console.error(getCurrentTime("ERROR") + "Error occurred while forwarding URL:", error);
                        }
                    });
                }
            }

            if (recipients?.emails) {
                if (messageCondition) {
                    const mailMethod = await getMailMethod();

                    // Check the mail method and perform actions accordingly
                    for (const email of recipients.emails) {
                        if (mailMethod === "Via Gmail API") {
                            const isForwarded = await sendEmail(email.text, latestObject?.address, newMessage);
                            if (isForwarded) {
                                await Database.insertResults(newMessage, latestObject?.address, email.text, formatDateTime(moment()), "Success", latestObject?._id);
                            } else {
                                console.error(getCurrentTime("ERROR") + "Error occurred while sending email:", error);
                            }
                        } else if (mailMethod === "Via SMTP") {
                            if (smtpRef.current) {
                                const isForwarded = sendEmailSmtp(email.text, newMessage);
                                if (isForwarded) {
                                    await Database.insertResults(newMessage, latestObject?.address, email.text, formatDateTime(moment()), "Success", latestObject?._id);
                                } else {
                                    console.error(getCurrentTime("ERROR") + "Error occurred while sending email:", error);
                                }
                            }
                        }
                    }
                }
            }

        } catch (error) {
            console.error(getCurrentTime("ERROR") + "Error occurred while fetching recipients, Error::", error);
        }
    }

    async function canForwardMessage(id, latestObject) {
        const rule = await Database.fetchAllByRule(id);
        console.log(getCurrentTime("DEBUG") + "rules ::", rule);
        let booleanValue = false;
        const forwardCondition = await Database.fetchFilters(id)
        console.log(getCurrentTime("DEBUG") + "forwardCondition::", forwardCondition);
        if ((rule.senderNumbers.length > 0 || rule.texts.length > 0)) {
            if (rule.senderNumbers.length > 0) {
                console.log(getCurrentTime("DEBUG") + "Verifying sender rules...");
                rule.senderNumbers.forEach((number) => {
                    console.log(getCurrentTime("DEBUG") + "\n\n each number : \t", number.sender, "\n\n slicing : \t,", latestObject.address.slice(3), "\n\n status \t", number.sendStatus);
                    if (number.sender === latestObject.address.slice(3) && number.sendStatus === "1") {
                        console.log(getCurrentTime("DEBUG") + "Sender number status is 1");
                        booleanValue = true;
                    }
                })
            }
            if (rule.texts.length > 0) {
                console.log(getCurrentTime("DEBUG") + "Verifying text rules...");
                for (const text of rule.texts) {
                    if (text.sendStatus === "1" && !latestObject?.body.includes(text.messageText)) {
                        booleanValue = false;
                        console.log(getCurrentTime("DEBUG") + "Send status is 1 and message not found ::", text.messageText, booleanValue);
                        return;
                    }
                    if (text.sendStatus === "0" && latestObject?.body.includes(text.messageText)) {
                        booleanValue = false;
                        console.log(getCurrentTime("DEBUG") + "Send status is 0 and message found ::", text.messageText, booleanValue);
                        return;
                    }
                    booleanValue = true;
                    console.log(getCurrentTime("DEBUG") + "Send status is 1 and message found ::", text.messageText, booleanValue);
                }
            }
        } else {
            console.log(getCurrentTime("DEBUG") + "No text and sender rule found. Returning true");
            booleanValue = true;
        }
        console.log(getCurrentTime("DEBUG") + "canForwardMessage ::\t", booleanValue)
        return booleanValue;
    }

    const forwardToURL = (method, url, key, message) => {
        try {
            const data = {[key]: message};
            if (method === 'post') {
                axios
                    .post(url, data)
                    .then(response => {
                        console.log(getCurrentTime("INFO") + 'SMS forwarded successfully:', response.data);
                    })
                    .catch(error => {
                        console.error(getCurrentTime("ERROR") + 'Failed to forward SMS, Error::', error);
                    });
            } else if (method === 'get') {
                axios
                    .get(url)
                    .then(response => {
                        console.log(getCurrentTime("INFO") + 'SMS forwarded successfully:', response.data);
                    })
                    .catch(error => {
                        console.error(getCurrentTime("ERROR") + 'Failed to forward SMS:', error);
                    });
            }
        } catch (e) {
            return false;
        }
        return true;
    };

    const sendEmail = async (to, from, text) => {
        const accessToken = await getAccessToken();
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
            console.log(getCurrentTime("INFO") + 'Email sent::', response.data);
            Alert.alert('Email sent via Gmail API:\n\n', JSON.stringify(response.data));
        } catch (error) {
            console.error(getCurrentTime("ERROR") + 'Error sending email:', error);
            return false;
        }
        return true;
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

    const sendEmailSmtp = (receiver, message) => {
        try {
            const jsonStringMessage = JSON.stringify(message);
            console.log(getCurrentTime("INFO") + "sendEmailSmtp smtpRef::\t", smtpRef)

            if (smtpRef) {
                console.log(getCurrentTime("INFO") + "sendEmailSmtp smtRef current::\t", smtpRef.current)

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
                    console.log(getCurrentTime("INFO") + 'Email sent successfully::', success)
                    Alert.alert("Email sent via smtp", JSON.stringify(success));

                    if (typeof message !== 'string') {
                        console.log(getCurrentTime("INFO") + "message is not a string");
                    }
                })
                    .catch((error) => {
                        console.log(getCurrentTime("ERROR") + 'Error sending email, Error::', error)
                        Alert.alert("Error while sending email through smtp\n\n", JSON.stringify(error));
                        throw error;
                    });
            }
        } catch (e) {
            return false;
        }
        return true;
    };


    // ---------------------------------------------------------------------------------------------------------------


    const requestSMSPermissions = async () => {
        const permissions = [
            PermissionsAndroid.PERMISSIONS.READ_SMS,
            PermissionsAndroid.PERMISSIONS.SEND_SMS,
        ];

        try {
            const granted = await PermissionsAndroid.requestMultiple(permissions, {
                title: 'SMS Permissions',
                message: 'App needs access to read and send SMS.',
                buttonPositive: 'OK',
                buttonNegative: 'Cancel',
            });

            const readSmsGranted = granted[PermissionsAndroid.PERMISSIONS.READ_SMS] === PermissionsAndroid.RESULTS.GRANTED;
            const sendSmsGranted = granted[PermissionsAndroid.PERMISSIONS.SEND_SMS] === PermissionsAndroid.RESULTS.GRANTED;

            if (readSmsGranted && sendSmsGranted) {
                if (!BackgroundService.isRunning()) {
                    await startBackgroundTask(smsResultRef, setResults);
                    await updateBackgroundNotification();
                }
                console.log(getCurrentTime("INFO") + 'SMS permissions granted');
            } else {
                console.log(getCurrentTime("INFO") + 'SMS permissions denied. Requesting again...');
                await requestSMSPermissions(); // Recursively request permissions if denied
            }
        } catch (err) {
            console.error(getCurrentTime("ERROR") + 'Error while requesting permissions:', err);
        }
    };

    useEffect(() => {
        requestSMSPermissions();
    }, []);

    useEffect(() => {
        Database.readResults()
            .then((resultRows) => {
                if (resultRows) {
                    smsResultRef.current = resultRows;
                    setResults(resultRows);
                }
            })
            .catch((error) => {
                console.log(getCurrentTime("ERROR") + 'Error occurred while fetching data, Error::', error);
            });
    }, [model, isBackgroundServiceRunning])

    async function deleteById(id) {
        try {
            await Database.deleteResultById(id);
            // Update smsResultRef to remove the deleted result
            smsResultRef.current = smsResultRef.current.filter(result => result.id !== id);
            setModel(false);
        } catch (error) {
            console.error(getCurrentTime("ERROR") + 'Error deleting result, Error:', error);
        }
    }

    const handleBackGroundService = async () => {
        if (isBackgroundServiceRunning) {
            await stopBackgroundTask();
        } else {
            await startBackgroundTask();
        }
        setIsBackgroundServiceRunning(!isBackgroundServiceRunning);
    };

    return (
        <View style={{flex: 1}}>

            <View style={[styles.blackCard, {marginTop: 10}]}>
                <TouchableOpacity style={styles.optionContainer} onPress={handleBackGroundService}>
                    <Text style={{fontSize: 15}}>Enable SMS Listening and Forwarding</Text>
                    <View style={[styles.toggleButton, isBackgroundServiceRunning && styles.toggleButtonActive]}>
                        <View style={[styles.toggleKnob, isBackgroundServiceRunning && styles.toggleKnobActive]} />
                    </View>
                </TouchableOpacity>
            </View>

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
    blackCard: {
        backgroundColor: 'white',
        borderColor: '#000',
        borderWidth: 0.5,
        borderRadius: 4,
        width: deviceWidth * 0.95,
        alignSelf: 'flex-start',
        margin: 10,
        marginTop: 18,
    },
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 12,
    },
    toggleButton: {
        width: 28,
        height: 17,
        borderRadius: 8,
        backgroundColor: '#ccc',
        justifyContent: 'center',
    },
    toggleButtonActive: {
        backgroundColor: '#B1D8B7',
    },
    toggleKnob: {
        width: 15,
        height: 15,
        borderRadius: 7,
        alignSelf: 'flex-start',
        backgroundColor: '#fff',

    },
    toggleKnobActive: {
        alignSelf: 'flex-end',
        backgroundColor: 'green',

    },
});

export default Result;
