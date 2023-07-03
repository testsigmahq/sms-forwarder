import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TextInput,
    Dimensions,
    Image,
    Modal,
    TouchableOpacity,
} from 'react-native';

import {SetRecipientsInfo} from '../../redux/actions/setUpRecipients';
import {useDispatch} from "react-redux";
import Database from "../../database";



const Recipients = ({saveClicked}) => {
    const dispatch = useDispatch();

    const [showModal, setShowModal] = useState(false);

    const [selectedOption, setSelectedOption] = useState();
    const [recipients, setRecipients] = useState([]);

    function setContext(contextName) {
        setSelectedOption(contextName);
        setShowModal(false);
    }

    React.useEffect(() => {
        if (saveClicked) {
            onSave();
        }
    }, [saveClicked]);

    useEffect(() => {
        if (selectedOption) {
            const newRecipient = {
                type: selectedOption,
                text: '',
                requestMethod: '',
                key:'',
            };
            setRecipients([...recipients, newRecipient]);
            setSelectedOption('');
        }
    }, [selectedOption]);


    function removeRecipient(index) {
        const updatedRecipients = [...recipients];
        updatedRecipients.splice(index, 1);
        setRecipients(updatedRecipients);
    }

    function handleSelectPost(index) {
        const updatedRecipients = [...recipients];
        updatedRecipients[index].requestMethod = 'POST';
        setRecipients(updatedRecipients);
    }

    function handleSelectGet(index) {
        const updatedRecipients = [...recipients];
        updatedRecipients[index].requestMethod = 'GET';
        setRecipients(updatedRecipients);
    }

    function handleRecipientTextChange(text, index) {
        const updatedRecipients = [...recipients];
        updatedRecipients[index].text = text;
        setRecipients(updatedRecipients);
    }
    function handleRecipientKeyChange(text, index) {
        const updatedRecipients = [...recipients];
        updatedRecipients[index].key = text;
        setRecipients(updatedRecipients);
    }



    function onSave() {
        const recipientsInfo = recipients.reduce((result, item) => {
            const { type, text, requestMethod,key } = item;

            if (type === "PhoneNumber") {
                if (!result.phoneNumber) {
                    result.phoneNumber = [];
                }
                result.phoneNumber.push(text);
            } else if (type === "Email") {
                if (!result.email) {
                    result.email = [];
                }
                result.email.push(text.trim());
            } else if (type === "URL") {
                if (!result.url) {
                    result.url = [];
                }
                result.url.push({ url: text, requestMethod,key });
            }

            return result;
        }, {});

        console.log("recipientsInfo1" ,recipientsInfo);

         // Database.insertEmails(recipientsInfo.email, 1);
         // Database.insertPhoneNumbers(recipientsInfo.phoneNumber, 1);
         Database.insertUrls(recipientsInfo.url,1);

        dispatch(SetRecipientsInfo(recipientsInfo));
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.contentContainer}>
                <Text style={styles.title}>Set up recipients</Text>
                <Text style={styles.subtitle}>
                    Please enter the phone number, e-mail, or URL of the another device that will receive a message from this phone
                </Text>
            </View>
            <View style={styles.card}>
                <View>
                    {recipients.map((recipient, index) => (
                        <React.Fragment key={index}>
                            <View style={{ flexDirection: 'row', alignSelf: 'center', width: deviceWidth * 0.8, justifyContent: "space-between" }}>
                                <TextInput
                                    style={styles.input}
                                    placeholder={recipient.type}
                                    onChangeText={text => handleRecipientTextChange(text, index)}
                                />
                                <View style={styles.imageContainer}>
                                    <TouchableOpacity onPress={() => removeRecipient(index)}>
                                        <Image source={require('../../assets/minus.png')} style={styles.minus} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {recipient.type === "URL" && (
                                <View style={styles.inputContainer}>
                                    <TouchableOpacity onPress={() => handleSelectPost(index)} style={styles.radioButton}>
                                        <View
                                            style={[
                                                styles.radioOuterCircle,
                                                {
                                                    borderColor: recipient.requestMethod === 'POST' ? '#1AA874' : '#000',
                                                },
                                            ]}
                                        >
                                            {recipient.requestMethod === 'POST' && <View style={styles.radioInnerCircle} />}
                                        </View>
                                        <Text style={styles.radioLabel}>POST</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleSelectGet(index)} style={styles.radioButton}>
                                        <View
                                            style={[
                                                styles.radioOuterCircle,
                                                {
                                                    borderColor: recipient.requestMethod === 'GET' ? '#1AA874' : '#000',
                                                },
                                            ]}
                                        >
                                            {recipient.requestMethod === 'GET' && <View style={styles.radioInnerCircle} />}
                                        </View>
                                        <Text style={styles.radioLabel}>GET</Text>
                                    </TouchableOpacity>
                                    {recipient.requestMethod && (
                                        <TextInput
                                            style={styles.requestInput}
                                            placeholder={`${recipient.requestMethod} KEY`}
                                            onChangeText={text => handleRecipientKeyChange(text, index)} // Add this line to handle key text changes

                                        />
                                    )}
                                </View>
                            )}

                            <View
                                style={{
                                    marginTop: 20,
                                    borderBottomColor: 'rgba(0, 0, 0, 0.6)',
                                    borderBottomWidth: StyleSheet.hairlineWidth,
                                    width: deviceWidth * 0.9,
                                    marginLeft: 18,
                                    marginRight: 20,
                                    marginBottom: 10,
                                }}
                            />
                        </React.Fragment>
                    ))}
                </View>
                <View style={styles.imageContainer}>
                    <TouchableOpacity onPress={() => setShowModal(true)}>
                        <Image source={require('../../assets/plus.png')} style={styles.image} />
                    </TouchableOpacity>
                </View>
            </View>

            <Modal visible={showModal} animationType="none" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add</Text>
                        <TouchableOpacity onPress={() => setContext('PhoneNumber')}>
                            <Text style={styles.modalText}>Enter Phone Number</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setContext('Email')}>
                            <Text style={styles.modalText}>Enter Email</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setContext('URL')}>
                            <Text style={styles.modalText}>URL</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const deviceWidth = Math.round(Dimensions.get('window').width);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 16,
    },
    contentContainer: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 20,
        marginBottom: 10,
        fontWeight: '500',
        letterSpacing: 0.2,
    },
    subtitle: {
        fontSize: 18,
        lineHeight: 26
    },
    card: {
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 6,
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 10,
        width: 355,
        marginTop: 30,
        alignSelf: 'flex-start',
    },
    input: {
        height: 40,
        paddingHorizontal: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'gray',
        width: deviceWidth * 0.68,
        marginTop: 10,
    },
    requestInput: {
        height: 35,
        paddingHorizontal: 10,
        borderRadius: 5,
        borderWidth: 1,
        alignSelf: 'center',
        borderColor: 'gray',
        width: deviceWidth * 0.35,
        marginBottom: -3,
    },
    imageContainer: {
        marginBottom: 10,
    },
    image: {
        width: 32,
        height: 32,
        marginTop: 10,
    },
    minus: {
        width: 38,
        height: 38,
        marginTop: 10,
        left: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 20,
        alignSelf: 'stretch',
        marginBottom: 10,
        marginHorizontal: 20
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    radioOuterCircle: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioInnerCircle: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#1AA874',
    },
    radioLabel: {
        marginLeft: 5,
        fontSize: 16,
    },

    modalContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderRadius: 2,
        flexDirection: 'column',
        marginRight: 20,
        padding: 15,
        paddingRight: 185,
    },
    modalText: {
        alignSelf: 'flex-start',
        textAlign: 'left',
        marginBottom: 20,
        fontSize: 16,
    },
    modalTitle: {
        alignSelf: 'flex-start',
        textAlign: 'left',
        marginBottom: 20,
        fontWeight: '500',
        fontSize: 18,
    },
});

export default Recipients;
