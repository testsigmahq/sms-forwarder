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
    TouchableOpacity, ScrollView, TouchableWithoutFeedback,
} from 'react-native';

import {SetRecipientsInfo} from '../../redux/actions/setUpRecipients';
import {useDispatch} from "react-redux";
import Database from "../../database";
import {useNavigation} from "@react-navigation/native";



const Recipients = ({saveClicked,id,filterIdForCreate}) => {

    const navigation = useNavigation();

    const dispatch = useDispatch();
   const [fetch,setFetch]=useState([])
    const [error, setError] = useState(false);
    const [condition, setCondition] = useState(false);

    useEffect(() => {
        if (id) {
            Database.fetchAllRecords(id)
                .then((result) => {
                    const emailsArray = result.emails;
                    const phoneNumbersArray = result.phoneNumbers;
                    const urlsArray = result.urls;

                    // console.log('Emails:', emailsArray);
                    // console.log('Phone Numbers:', phoneNumbersArray);
                    // console.log('URLs:', urlsArray);

                    const combinedArray = phoneNumbersArray.concat(emailsArray, urlsArray);
                    // console.log("Combined Array:", combinedArray);
                    setFetch(combinedArray);
                })
                .catch((err) => {
                    console.log('Error occurred:', err);
                });
        }
    }, []);

    useEffect(() => {
        setRecipients(fetch);
        // console.log("fetch",fetch)
    }, [fetch]) ;

    const [showModal, setShowModal] = useState(false);

    const [selectedOption, setSelectedOption] = useState();
    const [recipients, setRecipients] = useState(fetch || []);

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


    function removeRecipient(index,id,type) {
        const updatedRecipients = [...recipients];
        if(type==="URL"){
            Database.deleteUrlById(filterIdForCreate||id )
                .then(() => {
                    // console.log('URL deleted successfully');
                })
                .catch((err) => {
                    // console.log('Error occurred while deleting URL:', err);
                });
        }
        else if (type==="Email"){
            Database.deleteEmailById(filterIdForCreate||id)
                .then(() => {
                    // console.log('Email deleted successfully');
                })
                .catch((err) => {
                    // console.log('Error occurred while deleting email:', err);
                });
        }
        else
        {
            Database.deletePhoneNumberById(filterIdForCreate||id)
                .then(() => {
                    // console.log('Phone number deleted successfully');
                })
                .catch((err) => {
                    // console.log('Error occurred while deleting phone number:', err);
                });
        }
        updatedRecipients.splice(index, 1);
        setRecipients(updatedRecipients);
    }

    function handleSelectPost(index,id) {
        const updatedRecipients = [...recipients];
        updatedRecipients[index].requestMethod = 'POST';
        setRecipients(updatedRecipients);
    }

    function handleSelectGet(index,id) {
        const updatedRecipients = [...recipients];
        updatedRecipients[index].requestMethod = 'GET';
        setRecipients(updatedRecipients);
    }

    function handleRecipientTextChange(text, index,id) {
        const updatedRecipients = [...recipients];
        updatedRecipients[index].text = text;
        setRecipients(updatedRecipients);
    }
    function handleRecipientKeyChange(text, index,id) {
        const updatedRecipients = [...recipients];
        updatedRecipients[index].key = text;
        setRecipients(updatedRecipients);
    }

    function onSave() {
        const recipientsInfo = recipients.reduce((result, item) => {
            const { type, text, requestMethod,key,id } = item;

            if (type === "PhoneNumber") {
                if (!result.phoneNumber) {
                    result.phoneNumber = [];
                }
                result.phoneNumber.push({text:text,id:id});
            } else if (type === "Email") {
                if (!result.email) {
                    result.email = [];
                }
                result.email.push({text:text.trim(),id:id});
            } else if (type === "URL") {
                if (!result.url) {
                    result.url = [];
                }
                result.url.push({ url: text, requestMethod,key ,id:id});
            }
            return result;
        }, {});
        const emailsUndefined = recipientsInfo?.email
            ?.filter((emailObj) => emailObj.id === undefined)
            ?.map((emailObj) => emailObj.text) ?? [];

        const phoneNumbersUndefined = (recipientsInfo.phoneNumber || [])
            .filter((phoneNumberObj) => phoneNumberObj.id === undefined)
            .map((phoneNumberObj) => phoneNumberObj.text);

        const urlsUndefined = {
            url: recipientsInfo?.url
                ?.filter((urlObj) => urlObj.id === undefined)
                ?.map((urlObj) => ({
                    key: urlObj.key,
                    requestMethod: urlObj.requestMethod,
                    url: urlObj.url,
                })) ?? [],
        };


        const emailsDefined = recipientsInfo?.email
            ?.filter((emailObj) => emailObj.id !== undefined)
            ?.map((emailObj) => ({ id: emailObj.id, text: emailObj.text })) ?? [];

        const phoneNumbersDefined = (recipientsInfo.phoneNumber || [])
            .filter((phoneNumberObj) => phoneNumberObj.id !== undefined)
            .map((phoneNumberObj) => ({ id: phoneNumberObj.id, text: phoneNumberObj.text }));

        const urlsDefined = {
            url: recipientsInfo?.url
                ?.filter((urlObj) => urlObj.id !== undefined)
                ?.map((urlObj) => ({
                    id: urlObj.id,
                    key: urlObj.key,
                    requestMethod: urlObj.requestMethod,
                    url: urlObj.url,
                })) ?? [],
        };
        // console.log("emailsDefined",emailsDefined)
        // console.log("phoneNumbersDefined",phoneNumbersDefined)
        // console.log("urlsDefined",urlsDefined)
        //  console.log("filterIdForCreate",filterIdForCreate);
        // console.log("id",id);
        if(emailsUndefined){
            Database.insertEmails(emailsUndefined, filterIdForCreate || id);
        }
        if(phoneNumbersUndefined){
            Database.insertPhoneNumbers(phoneNumbersUndefined, filterIdForCreate || id);
        }
        if(urlsUndefined) {
            Database.insertUrls(urlsUndefined.url, filterIdForCreate || id);
        }

      if(urlsDefined.url){
          urlsDefined.url.forEach((urlInfo) => {
            const { id, url, requestMethod, key } = urlInfo;
            Database.updateUrlById(id, url, requestMethod, key,filterIdForCreate || id)
                .then(() => {
                    // console.log(`URL with ID ${id} updated successfully`);
                })
                .catch((error) => {
                    // console.log(`Error occurred while updating URL with ID ${id}:`, error);
                });
        });


        dispatch(SetRecipientsInfo(recipientsInfo));
    }


      if(emailsDefined){
          emailsDefined.forEach((emailInfo)=>{
              const {id,text}=emailInfo;
              Database.updateEmailById(id,text,filterIdForCreate || id).
              then(()=>console.log(` updating Email with ${id}`));
          })
      }

        if(phoneNumbersDefined){
            phoneNumbersDefined.forEach((NumberInfo)=>{
                const {id,text}=NumberInfo;
                Database.updatePhoneNumberById(id,text,filterIdForCreate || id).
                then(()=>console.log(` updating phoneNumbers with ${id}`));
            })
        }

        console.log("recipient info ==// ", recipientsInfo.phoneNumber, recipientsInfo.email, recipientsInfo.url)
        if (recipientsInfo.phoneNumber || recipientsInfo.email || recipientsInfo.url){
            navigation.navigate("Filters");
        } else {
            setError(true)
        }
    }
    async function handleClose(){
        setError(false);
        await Database.deleteFilter(id);
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContentContainer}>
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
                                    value={recipient.text}
                                    onChangeText={text => handleRecipientTextChange(text, index,recipient.id)}
                                />
                                <View style={styles.imageContainer}>
                                    <TouchableOpacity onPress={() => removeRecipient(index,recipient.id,recipient.type)}>
                                        <Image source={require('../../assets/minus.png')} style={styles.minus} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {recipient.type === "URL" && (
                                <View style={styles.inputContainer}>
                                    <TouchableOpacity onPress={() => handleSelectPost(index,recipient.id)} style={styles.radioButton}>
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
                                    <TouchableOpacity onPress={() => handleSelectGet(index,recipient.id)} style={styles.radioButton}>
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
                                            value={recipient.key}
                                            onChangeText={text => handleRecipientKeyChange(text, index,recipient.id)} // Add this line to handle key text changes

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
                <TouchableWithoutFeedback onPress={()=>setShowModal(false)}>
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
                </TouchableWithoutFeedback>
            </Modal>

                <Modal visible={error} animationType="none" transparent={true} style={{}}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Error</Text>
                            <Text style={styles.modalText}>Please check the phone number or email or URL in the recipients setting.</Text>
                            <TouchableOpacity onPress={() => {handleClose()}}>
                                <Text style={[styles.bottom,{color:"green",alignSelf:"flex-end"}]}>CLOSE</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Modal visible={condition} animationType="none" transparent={true} style={{}}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Warning</Text>
                            <Text style={styles.modalText}>There're no conditions in the "Forwarding condition" field, so all messages are forwarded.</Text>
                            <View style={{flexDirection:"row",justifyContent:"flex-end"}}>
                            <TouchableOpacity onPress={() => {handleClose()}}>
                                <Text style={[styles.bottom,{color:"green", marginRight: 15}]}>CANCEL</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {handleClose()}}>
                                <Text style={[styles.bottom,{color:"green", marginRight: 15}]}>OK</Text>
                            </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

            </ScrollView>
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
    scrollContentContainer: {
        flexGrow: 1,
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
        borderRadius: 5,
        flexDirection: 'column',
        padding: 15,
        width:deviceWidth*0.8,
    },
    modalText: {
        alignSelf: 'stretch',
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
