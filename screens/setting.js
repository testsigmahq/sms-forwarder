import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Button,
    Alert,
    TouchableHighlight
} from 'react-native';
import {RadioButton} from 'react-native-paper';
import CustomHeader from "../components/custom-header";
import GoogleSignupButton from "../components/google-signup-button";
import {useNavigation} from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome';
import RNSmtpMailer from "react-native-smtp-mailer";
import {setSmtp} from '../redux/actions/setUpRecipients';

import Database from "../repository/database";
import {useDispatch} from "react-redux";
import smtp from "../redux/reducers/smtp";
import {GoogleSignin} from "@react-native-google-signin/google-signin";
import {getCurrentTime} from "../utils/date";

const Setting = () => {
    const dispatch = useDispatch();

    const navigation = useNavigation();
    const [selectedValue, setSelectedValue] = useState('');
    const [text, onChangeText] = useState('');
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [host, setHost] = useState('');
    const [port, setPort] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [userInfo, setUserInfo] = useState('')
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const onChangeRadio = (value) => {
        setSelectedValue(value);
    };

    const emailText = "Account authentication is required to send an e-mail via Gmail. A test mail will be sent to the selected account after the account is successfully authenticated.\n\n(the 'Gmail' feature must be added to your Google account. A Google account that has been created with a secondary e-mail address cannot send e-mails. i.e. frzinapps@naver.com)";

    const handleGoogleSignup = (userInfo) => {
        GoogleSignin.getCurrentUser().then(res => {
            console.log(getCurrentTime("INFO") + "user email::", res.user.email)
            setEmail(res.user.email)
        });
        setUserInfo(userInfo);
        console.log(getCurrentTime("INFO") + 'Signed in userInfo::', userInfo);
    };

    const handleLoginIdChange = (value) => {
        setLoginId(value);
    };

    const handlePasswordChange = (value) => {
        setPassword(value);
    };

    const handleEmailAddressChange = (value) => {
        setEmailAddress(value);
    };

    const handleHostChange = (value) => {
        setHost(value);
    };

    const handlePortChange = (value) => {
        setPort(value);
    };

    const [showAuth, setShowAuth] = useState(false);
    const [showSSL, setShowSSL] = useState(false);
    const [showTLS, setShowTLS] = useState(false)

    const toggleAuth = () => {
        setShowAuth(!showAuth);
    };

    const toggleSSL = () => {
        setShowSSL(!showSSL);
    };
    const toggleTLS = () => {
        setShowTLS(!showTLS);
    };

    const handleValidation = () => {
        let isValid = true;


        if (selectedValue === "Via SMTP") {

            if (loginId.trim() === '') {
                isValid = false;
                Alert.alert('Invalid Input', 'Please enter a valid login ID.');
            } else if (password.trim() === '') {
                isValid = false;
                Alert.alert('Invalid Input', 'Please enter a valid password.');
            } else if (emailAddress.trim() === '' || !validateEmail(emailAddress)) {
                isValid = false;
                Alert.alert('Invalid Input', 'Please enter a valid email address.');
            } else if (host.trim() === '') {
                isValid = false;
                Alert.alert('Invalid Input', 'Please enter a valid host.');
            } else if (port.toString().trim() === '') {
                isValid = false;
                Alert.alert('Invalid Input', 'Please enter a valid port number.');
            }

            if (isValid && (selectedValue === "Via SMTP")) {
                Database.insertUser(
                    loginId,
                    password,
                    emailAddress,
                    host,
                    port,
                    showAuth,
                    showSSL,
                    showTLS
                ).then(r => console.log(getCurrentTime("INFO") + "User inserted successfully", r));
                dispatch(setSmtp('smtp'));
                Database.insertAuthSettings(0, 1, 0)
                navigation.goBack();
            }
        }
        if (selectedValue === "Via Gmail API") {
            console.log(getCurrentTime("INFO") + "serverAuthCode::", userInfo.serverAuthCode);
            Database.insertAuthCode(userInfo.serverAuthCode);
            Database.insertGmail(userInfo?.user?.email)
            dispatch(setSmtp('gmail'));
            Database.insertAuthSettings(0, 0, 1)
            navigation.goBack();
        }
        if (selectedValue === "None") {
            Database.insertAuthSettings(1, 0, 0)
            dispatch(setSmtp('none'));
            navigation.goBack();
        }
    };

    const validateEmail = (email) => {
        const emailRegex = /\S+@\S+\.\S+/;
        return emailRegex.test(email);
    }

    useEffect(() => {

        Database.fetchAuthSettings((authSettings) => {
            if (authSettings) {
                if (authSettings.none) {
                    setSelectedValue("None")
                } else if (authSettings.smtp) {
                    setSelectedValue("Via SMTP")
                } else {
                    setSelectedValue("Via Gmail API")
                }
            } else {
                console.log(getCurrentTime("ERROR") + 'AuthSettings not found or error occurred.');
            }
        });

        Database.fetchUserById(1)
            .then((e) => {
                if (e) {
                    setLoginId(e.loginId);
                    setPassword(e.password);
                    setEmailAddress(e.emailAddress);
                    setHost(e.host);
                    setPort(e.port);
                    setShowAuth(e.showAuth);
                    setShowSSL(e.showSSL);
                    setShowTLS(e.showTLS);
                } else {
                    console.log(getCurrentTime("INFO") + 'User data not found for ID 1.');
                }
            })
            .catch((error) => {
                console.log(getCurrentTime("ERROR") + 'Error fetching user data:', error);
            });

        GoogleSignin.getCurrentUser().then(res => {
            setEmail(res.user.email)
        });

    }, []);

    const sendEmail = () => {
        RNSmtpMailer.sendMail({
            mailhost: 'smtp.gmail.com',
            port: '465',
            ssl: true,
            username: 'ragulrahul973@gmail.com',
            password: 'nogexfdjohihshgd',
            from: 'ragulrahul973@gmail.com',
            recipients: 'as17112001@gmail.com',
            subject: 'Test Email',
            htmlBody: '<h1>Hello, this is a test email from sms forwarder</h1>',
        })
            .then(success => console.log(getCurrentTime("INFO") + 'Email sent successfully:', success))
            .catch(error => console.log(getCurrentTime("ERROR") + 'Error sending email:', error));
    };


    return (
        <>
            <View style={{margin: 10, marginHorizontal: 15}}>
                <CustomHeader
                    title="Settings"
                    onPressBackButton={handleValidation}
                />
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                <RadioButton.Group onValueChange={onChangeRadio} value={selectedValue}>
                    <View>
                        <RadioButton.Item value="None" label="None"/>
                    </View>
                    <View>
                        <RadioButton.Item label="Via Gmail API" value="Via Gmail API"/>
                        {selectedValue === "Via Gmail API" && (
                            <View>
                                <Text style={{margin: 15}}>{emailText}</Text>
                                <TextInput
                                    style={styles.input}
                                    value={email || userInfo?.user?.email}
                                />
                                <View style={{margin: 10}}>
                                    <GoogleSignupButton onSignup={handleGoogleSignup}/>
                                </View>
                            </View>
                        )}
                    </View>
                    <View>
                        <RadioButton.Item label="Via SMTP" value="Via SMTP"/>
                        {selectedValue === "Via SMTP" && (
                            <View>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Login ID"
                                    onChangeText={handleLoginIdChange}
                                    value={loginId}
                                />
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input1}
                                        placeholder="Password"
                                        secureTextEntry={!passwordVisible}
                                        onChangeText={handlePasswordChange}
                                        value={password}
                                    />
                                    <Icon
                                        name={passwordVisible ? 'eye-slash' : 'eye'}
                                        size={20}
                                        onPress={togglePasswordVisibility}
                                        style={styles.passwordIcon}
                                    />
                                </View>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email Address"
                                    onChangeText={handleEmailAddressChange}
                                    value={emailAddress}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Host"
                                    onChangeText={handleHostChange}
                                    value={host}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Port"
                                    onChangeText={handlePortChange}
                                    value={port.toString()}
                                    keyboardType="numeric"
                                />
                                <TouchableOpacity style={styles.optionContainer} onPress={toggleAuth}>
                                    <Text style={{fontSize: 16}}>Use authentication</Text>
                                    <View style={[styles.toggleButton, showAuth && styles.toggleButtonActive]}>
                                        <View style={[styles.toggleKnob, showAuth && styles.toggleKnobActive]}/>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.optionContainer} onPress={toggleSSL}>
                                    <Text style={{fontSize: 16}}>Use SSL</Text>
                                    <View style={[styles.toggleButton, showSSL && styles.toggleButtonActive]}>
                                        <View style={[styles.toggleKnob, showSSL && styles.toggleKnobActive]}/>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.optionContainer} onPress={toggleTLS}>
                                    <Text style={{fontSize: 16}}>Use TLS/StartTLS</Text>
                                    <View style={[styles.toggleButton, showTLS && styles.toggleButtonActive]}>
                                        <View style={[styles.toggleKnob, showTLS && styles.toggleKnobActive]}/>
                                    </View>
                                </TouchableOpacity>
                                <View style={{top: 10}}>
                                    <TouchableHighlight onPress={sendEmail}>
                                        <Button title="Send Test Mail" onPress={sendEmail}/>
                                    </TouchableHighlight>
                                </View>
                            </View>
                        )}
                    </View>
                </RadioButton.Group>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        margin: 10,
        marginHorizontal: 15,
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    passwordInput: {
        flex: 1,
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    passwordIcon: {
        marginLeft: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        padding: 10,
        margin: 12,
    },
    input1: {
        flex: 1,
    },
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 10,
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

export default Setting;
