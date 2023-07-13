import React, { useState } from 'react';
import { View } from 'react-native';
import { RadioButton, Text } from 'react-native-paper';
import CustomHeader from "../components/custom-header";

const Setting = () => {
    const [selectedValue, setSelectedValue] = useState('');

    const onChangeValue = (value) => {
        setSelectedValue(value);
    };
    const emailText="Account authentication is required to send an e-mail via Gmail.A test mail will be sent to the selected account after the account is successfully authenicated \n" +
        "\n" +
        "(the 'Gmail' feature must be added to your Google account. A Google account that has created with a secondary e-mail address cannot send e-mails. i.e.frzinapps@naver.com)";

    return (
        <>
        <View style={{margin:10, marginHorizontal:15}}>
            <CustomHeader
                title="Settings"
                onPressBackButton={() => navigation.goBack()} />
        </View>

         <View>
            <RadioButton.Group onValueChange={onChangeValue} value={selectedValue}>
                <View>
                    <RadioButton.Item  value="None" label="None" />
                </View>
                <View>
                    <RadioButton.Item label="Via Gmail API" value="Via Gmail API" />
                    {selectedValue==="Via Gmail API" &&
                        <View>
                            <Text style={{margin:15}}>{emailText}</Text>
                        </View>
                    }
                </View>
                <View>
                    <RadioButton.Item label="Via SMTP" value="Via SMTP" />
                </View>
            </RadioButton.Group>
        </View>

        </>
    );
};

export default Setting;
