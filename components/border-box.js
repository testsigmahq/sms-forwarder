import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, Dimensions, TouchableOpacity, Modal, TextInput, Image} from 'react-native';
import ContactPicker from "./contact-picker";
import {Input} from "react-native-elements";
import DropDownPicker from "react-native-dropdown-picker";
import Database from "../database";

const BorderBox = props => {
   const [ruleModel,setRuleModel]=useState(false)
    const [showModal, setShowModal] = useState(false);
    const [tap, setTap] = useState(false);
    const [enter,setEnter]=useState(false);
    const [openContact,setOpenContact]=useState(false);
    const [number,setNumber]=useState();

    const [ruleText,setRuleText]=useState('');
    const [inputValidation,setInputValidation]=useState(false);

    const [ruleNumber,setRuleNumber]=useState( [])
    const [ruleTextTemplate,setRuleTextTemplate]=useState([]);


    useEffect(() => {
        if (props.id) {
            Database.fetchAllByRule(props.id)
                .then((records) => {
                    setRuleNumber(records.senderNumbers);
                    setRuleTextTemplate(records.texts)
                    console.log('Sender Numbers:', records.senderNumbers);
                    console.log('Texts:', records.texts);
                })
                .catch((error) => {
                    console.log('Error occurred while fetching records:', error);
                });
        }
    }, []);

    function handleCondition() {
        setShowModal(false);

        if (number) {
            const sendStatus = value2.toLowerCase() === "send";
            const newData = { number, sendStatus };
            setRuleNumber((prevMessages) => [...prevMessages, newData]);
        }
        else {
            setInputValidation(true);
        }
        setNumber('');
        console.log("message",ruleNumber)
    }

    const [open1, setOpen1] = useState(false);
    const [items1, setItems1] = useState([
        { label: 'have', value: 'have' },
        { label: 'have not', value: 'have not' },
    ]);
    const [value1, setValue1] = useState('have');

    const [open2, setOpen2] = useState(false);
    const [items2, setItems2] = useState([
        { label: 'send', value: 'send' },
        { label: 'do not send', value: 'do not send' },
    ]);
    const [value2, setValue2] = useState('send');
    function handleRuleCondition() {
        setRuleModel(false);
        if(ruleText){
            const sendStatus = value1.toLowerCase() === "send";
            const newData = { ruleText, sendStatus };
            setRuleTextTemplate((prevMessages) => [...prevMessages, newData]);
        }
        setRuleText('')
        console.log("setRuleMessages",ruleTextTemplate)
    }
    function onSave() {

            ruleNumber.forEach((ruleNumber) => {
                if(!ruleNumber.id){
                Database.insertSenderNumber(ruleNumber.number,ruleNumber.sendStatus,props.filterIdForCreate || props.id);
                }
            });

            ruleTextTemplate.forEach((ruleTextTemplate) => {
                if(!ruleTextTemplate.id){
                Database.insertText(ruleTextTemplate.ruleText,ruleTextTemplate.sendStatus,props.filterIdForCreate || props.id);
                }
            });
    }

        React.useEffect(() => {
        if (props.saveClicked) {
            onSave();
        }
    }, [props.saveClicked]);

    return (
        <View style={styles.blackCard}>
            <Text style={styles.text}>{props.title}</Text>
            <View style={styles.line}></View>
            {props.rule==="number" && (
                <View>
                    { ruleNumber && ruleNumber.map((message, index) => (
                        <View style={styles.cardGreen} key={index}>
                            <Text style={{fontSize:13,color:'green',fontWeight:500}}>Rule {index+1}</Text>
                            <Text style={{ fontSize: 12 }}>{`If the sender is  ${message.number || message.sender}, ${message.sendStatus ? 'it will be sent' : 'it will not be sent'}`}</Text>
                        </View>
                    ))}

                    <View style={styles.addBorder}>
                    <TouchableOpacity onPress={() => setShowModal(true)}>
                        <Text style={styles.addBorderText}>{props.content}</Text>
                    </TouchableOpacity>
                </View>
                </View>
            )}
            {
                props.rule==="text" && (
                    <View>
                        { ruleTextTemplate && ruleTextTemplate.map((message, index) => (
                            <View style={styles.cardGreen} key={index}>
                                <Text style={{fontSize:13,color:'green',fontWeight:500}}>Rule {index+1}</Text>
                                <Text style={{fontSize:12}}>{`If the message content ${message.sendStatus ? 'has':'does not have'} ${message.ruleText ||message.messageText},it will be sent`}</Text>
                            </View>
                        ))}
                        <View style={styles.addBorder}>
                        <TouchableOpacity onPress={() => setRuleModel(true)}>
                            <Text style={styles.addBorderText}>{props.content}</Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                )
            }

            <Modal visible={showModal} animationType="slide-up" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                         <View>
                            <View style={styles.card}>
                                <Text style={styles.modelText}>If the sender is</Text>
                            </View>
                            <TouchableOpacity onPress={()=>setTap(true)}>
                            <View style={[styles.card, {width: deviceWidth * 0.8}]}>
                                <Text style={[styles.cardText, styles.underlineText]}>{number ? number :"Tap here"}</Text>
                            </View>
                            </TouchableOpacity>
                            <View style={[styles.card,{padding: 0, zIndex:2,fontSize:20}]}>
                                <DropDownPicker
                                    style={[styles.dropDown]}
                                    dropDownDirection="AUTO"
                                    items={items2}
                                    open={open2}
                                    value={value2}
                                    setOpen={setOpen2}
                                    setValue={setValue2}
                                    setItems={setItems2}
                                    stickyHeader={true}
                                    containerStyle={{
                                        width: deviceWidth * 0.4,
                                    }}
                                    defaultNull
                                />

                            </View>
                            <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
                                <TouchableOpacity onPress={() => {
                                    setShowModal(false)
                                }}>
                                    <Text style={styles.bottom}>CANCEL</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                   handleCondition()
                                }}>
                                <Text style={styles.bottom}>OK</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>



            <Modal visible={ruleModel} animationType="slide-up" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View>
                            <View style={styles.card}>
                                <Text style={styles.modelText}>If the message</Text>
                            </View>
                            <TouchableOpacity style={{zIndex:4}}>
                                <View style={[styles.card,{padding: 0,width: deviceWidth*0.75}]}>
                                <View style={[{ width: deviceWidth * 0.6, flexDirection: 'row'}]}>
                                    <View style={[styles.inputContainer]}>
                                        <Input onChangeText={(text)=>setRuleText(text)} />
                                        <DropDownPicker
                                            style={[styles.dropDown,{marginTop:8}]}
                                            dropDownDirection="AUTO"
                                            items={items1}
                                            open={open1}
                                            value={value1}
                                            setOpen={setOpen1}
                                            setValue={setValue1}
                                            setItems={setItems1}
                                            stickyHeader={true}
                                            containerStyle={{
                                                width: deviceWidth * 0.3,
                                            }}
                                            defaultNull
                                        />
                                    </View>
                                </View>
                                </View>
                            </TouchableOpacity>
                            <View style={styles.card}>
                                <Text style={styles.modelText}>send</Text>
                            </View>
                            <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
                                <TouchableOpacity onPress={() => {
                                    setRuleModel(false)
                                }}>
                                    <Text style={styles.bottom}>CANCEL</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    handleRuleCondition()
                                }}>
                                    <Text style={styles.bottom}>OK</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>




            <Modal visible={tap} animationType="slide-up" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                         <View>
                            <TouchableOpacity onPress={()=> {
                                setEnter(true)
                                setTap(false);
                            }}>
                            <Text style={{fontSize:19,marginVertical:10}}>Enter directly</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{
                                setOpenContact(true)
                                setTap(false);
                            }}
                            >
                            <Text style={{fontSize:19,marginVertical:10}}>From contacts</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>


            <Modal visible={enter} animationType="slide-up" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>

                        <View>
                            <TextInput
                                onChangeText={setNumber}
                                style={styles.input}
                                value={number}

                            />

                            <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
                                <TouchableOpacity onPress={() => {
                                    setEnter(false)
                                }}>
                                    <Text style={styles.bottom}>CANCEL</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    setEnter(false)
                                }}>
                                <Text style={styles.bottom}>OK</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>


            <Modal visible={openContact} animationType="slide-up" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={{height:700}}>
                            <View style={{flexDirection:'row',margin:7}}>
                            <Image
                                source={require('../assets/back.png')}
                                style={styles.arrowLeft}
                            />
                            <Text style={{fontSize:18,marginLeft:10}}>Select contacts
                            </Text>
                            </View>
                      <ContactPicker/>
                        </View>
                    </View>
                </View>
            </Modal>


            {/*<Modal visible={inputValidation} animationType="slide-up" transparent={true}>*/}
            {/*    <View style={styles.modalContainer}>*/}
            {/*        <View style={styles.modalContent}>*/}
            {/*            <Text style={{marginBottom:1,fontSize:20}}>Please check the input value.</Text>*/}
            {/*            <TouchableOpacity onPress={()=>{setInputValidation(false)}}>*/}
            {/*                <Text style={{alignSelf:'flex-end',fontSize:20,margin:10,color:'green',marginBottom:5,right:5}}>OK</Text>*/}
            {/*            </TouchableOpacity>*/}
            {/*        </View>*/}
            {/*    </View>*/}
            {/*</Modal>*/}
        </View>
    );
};

const deviceWidth = Math.round(Dimensions.get('window').width);

const styles = StyleSheet.create({
    blackCard: {
        backgroundColor: 'white',
        borderColor: '#000',
        borderWidth: 0.5,
        borderRadius: 4,
        width: deviceWidth*0.85,
        alignSelf:"flex-start",
        margin: 10,
        marginTop: 18,
    },
    line: {
        borderColor: '#000',
        borderWidth: 0.2,
        marginLeft: 18,
        marginRight: 20,

    },
    text: {
        fontSize: 20,
        fontWeight: '400',
        alignSelf: 'center',
        margin: 5,
    },
    addBorder: {
        backgroundColor: 'white',
        borderColor: '#000',
        borderWidth: 0.5,
        borderRadius: 4,
        width: 80,
        height: 40,
        margin: 22,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    addBorderText: {
        fontSize: 16,
        fontWeight: '400',
        alignSelf: 'center',
        margin: 7,
        color: 'green',
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
        width:deviceWidth*0.9,
    },
    card: {
        flexDirection: 'row',
        justifyContent: 'center', // Center horizontally
        alignItems: 'center', // Center vertically
        padding: 10,
        backgroundColor: '#FFF',
        borderRadius:25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        alignSelf: 'center',
        elevation: 4,
        margin: 8,
        width: deviceWidth * 0.5,
    },
    cardGreen: {
        flexDirection: 'column',
        justifyContent: 'flex-start', // Center horizontally
        alignItems: 'flex-start', // Center vertically
        padding: 5,
        backgroundColor: '#B1D8B7',
        borderRadius:3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        alignSelf: 'center',
        elevation: 4,
        margin: 8,
        borderColor:'green',
        borderWidth:0.3,
        width: deviceWidth * 0.8,
    },
    cardText: {
        marginRight: 8,
        fontSize: 19,
        fontWeight: '400',
        letterSpacing: 1,
        color: 'green',
    },
    modelText:{
        marginRight: 8,
        fontSize: 17,
        fontWeight: '400',
        letterSpacing: 1,
        color: 'black',
    },
    underlineText: {
        textDecorationLine: 'underline',
    },
    bottom:{
        letterSpacing:3,
        fontWeight:500,
        fontSize:18,
        color: 'green',
        margin:10,
    },
    input: {
        height: 40,
        paddingHorizontal: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'gray',
        width: deviceWidth * 0.68,
        alignSelf: 'center',
        margin:10,
    },
    arrowLeft: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        width:deviceWidth*0.3,
    },
    inputLine: {
        width: 1,
        height: '80%',
        backgroundColor: 'black',
    },
    dropDown: {
        backgroundColor: 'rgba(255, 255, 255, 0)',
        alignContent: 'stretch',
        borderWidth:0,
    },


});

export default BorderBox;
