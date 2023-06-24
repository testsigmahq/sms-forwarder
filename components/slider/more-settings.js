import React, { useState } from 'react';
import { Button, View, Text, Alert } from 'react-native';

const MoreSettings = () => {


    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ marginBottom: 16 }}>
                Latest Received SMS
            </Text>
            <Button title="Listen SMS"/>
        </View>
    );
};

export default MoreSettings;
