import React, { useEffect, useState } from 'react';
import {View, Text, Button, StyleSheet, Dimensions, TouchableOpacity, Modal, TextInput, Image} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ContactPicker from "./contact-picker";

const BorderBox = props => {
    const navigation = useNavigation();

    const [showModal, setShowModal] = useState(false);
    const [tap, setTap] = useState(false);
    const [enter,setEnter]=useState(false);
    const [openContact,setOpenContact]=useState(false);
    const [number,setNumber]=useState();
    return (
        <View style={styles.blackCard}>
            <Text style={styles.text}>{props.title}</Text>
            <View style={styles.line}></View>
            {props.content && (
                <View style={styles.addBorder}>
                    <TouchableOpacity onPress={() => setShowModal(true)}>
                        <Text style={styles.addBorderText}>{props.content}</Text>
                    </TouchableOpacity>
                </View>
            )}

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
                            <View style={styles.card}>
                                <Text style={styles.modelText}>send</Text>
                            </View>
                            <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
                                <TouchableOpacity onPress={() => {
                                    setShowModal(false)
                                }}>
                                    <Text style={styles.bottom}>CANCEL</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    setShowModal(false)
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
        width: 300,
        height: 120,
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
        borderRadius: 5,
        padding: 15,
        width:deviceWidth*0.9,
    },
    card: {
        flexDirection: 'row',
        justifyContent: 'center', // Center horizontally
        alignItems: 'center', // Center vertically
        padding: 10,
        backgroundColor: '#FFF',
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        alignSelf: 'center',
        elevation: 4,
        margin: 8,
        width: deviceWidth * 0.5,
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
});

export default BorderBox;
