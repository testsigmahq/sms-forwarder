import React, { useState } from 'react';
import { View, SafeAreaView, StyleSheet, TextInput, Text, ScrollView, TouchableOpacity } from 'react-native';
import CustomHeader from "../components/custom-header";
import {useNavigation} from "@react-navigation/native";
import {messageTemplate} from '../redux/actions/setUpRecipients'
import {useDispatch} from "react-redux";
import {getCurrentTime} from "../utils/data";

const MessageTemplate = () => {
    const navigation = useNavigation();

    const [text, setText] = useState('');
    const [previewList, setPreviewList] = useState([]);
     const [bodyTemplate,setBodyTemplate]=useState([]);
    const handleChangeText = (value) => {
        setText(value);
    };

    const getCurrentDateTime = () => {
        const currentDate = new Date();
        return currentDate.toLocaleString();
    };

    const getCurrentYear = () => {
        const currentDate = new Date();
        return currentDate.getFullYear().toString();
    };

    const getCurrentMonth = () => {
        const currentDate = new Date();
        return (currentDate.getMonth() + 1).toString().padStart(2, '0');
    };

    const getCurrentDay = () => {
        const currentDate = new Date();
        return currentDate.getDate().toString().padStart(2, '0');
    };

    const getCurrentHour12 = () => {
        const currentDate = new Date();
        let hours = currentDate.getHours();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours %= 12;
        hours = hours || 12;
        return hours.toString().padStart(2, '0') + ampm;
    };

    const getCurrentHour24 = () => {
        const currentDate = new Date();
        return currentDate.getHours().toString().padStart(2, '0');
    };

    const getCurrentMinute = () => {
        const currentDate = new Date();
        return currentDate.getMinutes().toString().padStart(2, '0');
    };

    const getCurrentDayOfWeek = () => {
        const currentDate = new Date();
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayIndex = currentDate.getDay();
        return daysOfWeek[dayIndex];
    };

    const handlePlaceholderPress = (placeholder) => {
        let updatedText = text;
        let updatedPreviewList = [...previewList];
        setBodyTemplate([...bodyTemplate,placeholder.title]);
        switch (placeholder.identity) {
            case '%rt%':
                const currentDateTime = getCurrentDateTime();
                updatedText += currentDateTime;
                updatedPreviewList.push(`${currentDateTime}`);
                break;
            case '%Y':
                const currentYear = getCurrentYear();
                updatedText += currentYear;
                updatedPreviewList.push(`${currentYear}`);
                break;
            case '%M':
                const currentMonth = getCurrentMonth();
                updatedText += currentMonth;
                updatedPreviewList.push(`${currentMonth}`);
                break;
            case '%d':
                const currentDay = getCurrentDay();
                updatedText += currentDay;
                updatedPreviewList.push(`${currentDay}`);
                break;
            case '%a':
                const currentAmPm = getCurrentHour12();
                updatedText += currentAmPm;
                updatedPreviewList.push(`${currentAmPm}`);
                break;
            case '%h':
                const currentHour12 = getCurrentHour12();
                updatedText += currentHour12;
                updatedPreviewList.push(`${currentHour12}`);
                break;
            case '%H':
                const currentHour24 = getCurrentHour24();
                updatedText += currentHour24;
                updatedPreviewList.push(` ${currentHour24}`);
                break;
            case '%m':
                const currentMinute = getCurrentMinute();
                updatedText += currentMinute;
                updatedPreviewList.push(` ${currentMinute}`);
                break;
            case '%w%':
                const currentDayOfWeek = getCurrentDayOfWeek();
                updatedText += currentDayOfWeek;
                updatedPreviewList.push(`${currentDayOfWeek}`);
                break;
            default:
                break;
        }

        setText(updatedText);
        setPreviewList(updatedPreviewList);
        console.log(getCurrentTime("INFO") + "body::",bodyTemplate);
    };

    const placeholders = [
        { id: 1, title: 'Incoming Number', identity: '%pni%' },
        { id: 2, title: 'Filter Name', identity: '%fn%' },
        { id: 3, title: 'Contact Name', identity: '%ct%' },
        { id: 4, title: 'SIM Number', identity: '%sn%' },
        { id: 5, title: 'Received Time', identity: '%rt%' },
        { id: 6, title: 'Message Body', identity: '%mb%' },
        { id: 7, title: 'Year', identity: '%Y' },
        { id: 8, title: 'Month', identity: '%M' },
        { id: 9, title: 'Day', identity: '%d' },
        { id: 10, title: 'AM/PM', identity: '%a' },
        { id: 11, title: 'Hour 1~12', identity: '%h' },
        { id: 12, title: 'Hour 0~24', identity: '%H' },
        { id: 13, title: 'Minute', identity: '%m' },
        { id: 14, title: 'Day of the Week', identity: '%w%' },
    ];
    const dispatch = useDispatch();


    function handleNavigation(){
        dispatch(messageTemplate(bodyTemplate,previewList))
        navigation.goBack();
    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={{ margin: 10 }}>
                <CustomHeader title="Message Template" onPressBackButton={handleNavigation} />
            </View>
            <View style={styles.previewCard}>
                <Text style={{ color: 'green',fontSize:16 }}>Preview</Text>
                <ScrollView style={{ marginTop: 10 }} horizontal>
                    {previewList.map((previewItem, index) => (
                        <Text key={index}>{previewItem}</Text>
                    ))}
                </ScrollView>
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    multiline
                    placeholder="Enter your message"
                    textAlignVertical="top"
                    value={text}
                    onChangeText={handleChangeText}
                />
            </View>
            <Text style={{ marginLeft: 10, marginTop: 5, fontSize: 15, fontWeight: '500' }}>
                Touch an item to add.
            </Text>
            <View style={styles.dottedBox}>
                <ScrollView style={{height:450,marginVertical:5,marginTop:10}}>
                {placeholders.map((placeholder) => (
                    <TouchableOpacity
                        style={styles.dotCard}
                        key={placeholder.id}
                        onPress={() => handlePlaceholderPress(placeholder)}>
                        <Text style={{ color: 'green', fontSize: 18 }}>
                            {placeholder.title}: {placeholder.identity}
                        </Text>
                    </TouchableOpacity>
                ))}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    inputContainer: {
        borderWidth: 1,
        borderColor: 'gray',
        margin: 10,
        borderRadius:5,
        padding: 10,
    },
    input: {
        minHeight: 60,
    },
    dottedBox: {
        borderWidth: 1.5,
        borderStyle: 'dotted',
        borderColor: 'black',
        borderRadius:5,
        marginHorizontal: 10,
        marginTop: 10,
        padding: 0,
        minHeight: 80,
        maxHeight: 450,
    },
    dotCard: {
        backgroundColor: '#D1F2C9',
        borderRadius: 5,
        padding: 8,
        margin: 10,
        borderColor: 'green',
        minHeight: 18,
    },
    previewCard: {
        borderWidth: 1,
        borderColor: 'green',
        marginHorizontal: 10,
        marginTop: 10,
        padding: 10,
        minHeight: 80,
        maxHeight: 100,
        borderRadius: 5
    },
});

export default MessageTemplate;
