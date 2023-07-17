import React, { useState } from 'react';
import {View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity} from 'react-native';
import { RadioButton } from 'react-native-paper';
import CustomHeader from "../components/custom-header";
import GoogleSignupButton from "../components/google-signup-button";
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome';
import RNSmtpMailer from "react-native-smtp-mailer";

const Setting = options => {
    const navigation = useNavigation();
    const [selectedValue, setSelectedValue] = useState('');
    const [text, onChangeText] = useState('');
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [host, setHost] = useState('');
    const [port, setPort] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const onChangeRadio = (value) => {
        setSelectedValue(value);
    };

    const emailText = "Account authentication is required to send an e-mail via Gmail. A test mail will be sent to the selected account after the account is successfully authenticated.\n\n(the 'Gmail' feature must be added to your Google account. A Google account that has been created with a secondary e-mail address cannot send e-mails. i.e. frzinapps@naver.com)";

    const handleGoogleSignup = (userInfo) => {
        console.log(userInfo);
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
    const [showTLS,setShowTLS]=useState(false)

    const toggleAuth = () => {
        setShowAuth(!showAuth);
    };

    const toggleSSL = () => {
        setShowSSL(!showSSL);
    };
    const toggleTLS = () => {
        setShowTLS(!showTLS);
    };


    const sendEmail = () => {
        RNSmtpMailer.sendMail({
            mailhost: "smtp.gmail.com",
            port: "465",
            ssl: true,
            username: "ragulrahul973@gmail.com",
            password: "dybyaighgandbktw",
            from: "selvarasuragul18711@gmail.com",
            recipients: "selvarasuragul18711@gmail.com",
            subject: "subject",
            htmlBody: "<h1>header</h1><p>body</p>"
        })
            .then(success => console.log(success))
            .catch(err => console.log(err))
    };

    return (
        <>
            <View style={{ margin: 10, marginHorizontal: 15 }}>
                <CustomHeader
                    title="Settings"
                    onPressBackButton={() => navigation.goBack()}
                />
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                <RadioButton.Group onValueChange={onChangeRadio} value={selectedValue}>
                    <View>
                        <RadioButton.Item value="None" label="None" />
                    </View>
                    <View>
                        <RadioButton.Item label="Via Gmail API" value="Via Gmail API" />
                        {selectedValue === "Via Gmail API" && (
                            <View>
                                <Text style={{ margin: 15 }}>{emailText}</Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={onChangeText}
                                    value={text}
                                />
                                <GoogleSignupButton onSignup={handleGoogleSignup} />
                            </View>
                        )}
                    </View>
                    <View>
                        <RadioButton.Item label="Via SMTP" value="Via SMTP" />
                        {selectedValue === "Via SMTP" && (
                            <View>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Login ID"
                                    onChangeText={handleLoginIdChange}
                                />
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input1}
                                    placeholder="Password"
                                    secureTextEntry={!passwordVisible}
                                    onChangeText={handlePasswordChange}
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
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Host"
                                    onChangeText={handleHostChange}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Port"
                                    onChangeText={handlePortChange}
                                />
                                <TouchableOpacity style={styles.optionContainer} onPress={toggleAuth}>
                                    <Text style={{ fontSize: 16 }}>Use authentication</Text>
                                    <View style={[styles.toggleButton, showAuth && styles.toggleButtonActive]}>
                                        <View style={[styles.toggleKnob, showAuth && styles.toggleKnobActive]} />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.optionContainer} onPress={toggleSSL}>
                                    <Text style={{ fontSize: 16 }}>Use SSL</Text>
                                    <View style={[styles.toggleButton, showSSL && styles.toggleButtonActive]}>
                                        <View style={[styles.toggleKnob, showSSL && styles.toggleKnobActive]} />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.optionContainer} onPress={toggleTLS}>
                                    <Text style={{ fontSize: 16 }}>Use TLS/StartTLS</Text>
                                    <View style={[styles.toggleButton, showTLS && styles.toggleButtonActive]}>
                                        <View style={[styles.toggleKnob, showTLS && styles.toggleKnobActive]} />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={sendEmail}>
                                    <Text >Send Email</Text>
                                </TouchableOpacity>
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
