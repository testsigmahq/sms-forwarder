import React, { useState } from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import { RadioButton } from 'react-native-paper';
import CustomHeader from "../components/custom-header";
import GoogleSignupButton from "../components/google-signup-button";
import { useNavigation } from "@react-navigation/native";
import {Input} from "react-native-elements";

const Setting = () => {
    const navigation = useNavigation();
    const [selectedValue, setSelectedValue] = useState('');
    const [text, onChangeText] = useState('');

    const onChangeRadio = (value) => {
        setSelectedValue(value);
    };

    const emailText = "Account authentication is required to send an e-mail via Gmail. A test mail will be sent to the selected account after the account is successfully authenticated.\n\n(the 'Gmail' feature must be added to your Google account. A Google account that has been created with a secondary e-mail address cannot send e-mails. i.e. frzinapps@naver.com)";

    const handleGoogleSignup = (userInfo) => {
        console.log(userInfo);
    };

    return (
        <>
            <View style={{ margin: 10, marginHorizontal: 15 }}>
                <CustomHeader
                    title="Settings"
                    onPressBackButton={() => navigation.goBack()}
                />
            </View>

            <View>
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
                            <View></View>
                        )}
                    </View>
                </RadioButton.Group>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
});

export default Setting;
