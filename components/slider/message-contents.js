import React, {useEffect, useState} from 'react';
import {View, Text, Button, StyleSheet, SafeAreaView, Dimensions, Image, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomHeader from "../custom-header";
import CheckBox from "../checkbox";
import {Input} from "react-native-elements";
import {FontAwesome5} from "@expo/vector-icons";
import {useDispatch, useSelector} from "react-redux";
import Database from "../../database";
const MessageContents = ({saveClicked,id}) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();


    const [wordPairs, setWordPairs] = useState([]);
    const [exp,setExp]=useState(false);

    const duplicateFields = () => {
        setWordPairs([...wordPairs, { oldWord: '', newWord: '' }]);
        console.log("words",wordPairs);
    };

    const removeField = (index) => {
        const updatedPairs = [...wordPairs];
        updatedPairs.splice(index, 1);
        setWordPairs(updatedPairs);
    };
    function forward(){
        navigation.navigate('MessageTemplate');

    }
    const Message = useSelector((state) => {return (state.messageTemplate)});
    console.log("messageTemplate",Message.templateTitle)

    function onSave() {
        wordPairs.forEach((wordPairs)=>{
            Database.insertChangeContent(wordPairs.oldWord,wordPairs.newWord,1)
        })
    }

    React.useEffect(() => {
        if (saveClicked) {
            onSave();
        }
    }, [saveClicked]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.contentContainer}>
                <Text style={styles.title}>Change the content</Text>
                <Text style={styles.subtitle}>
                    You can choose to add the phone number of the initial sender of the message, a specific word, etc., to the message that you wish to forward ,or change certain words within the body of the message.
                </Text>
            </View>

            <View style={styles.blackCard}>
                <View style={{flexDirection:'row',justifyContent:'center'}}>
                    <Text style={styles.text}>Message Template</Text>
                </View>
                <View style={{position:"absolute", alignSelf:"flex-end"}}>
                <TouchableOpacity onPress={forward}>
                    <Image  source={require('../../assets/edit.png')} style={styles.editIcon} />
                </TouchableOpacity>
                </View>
                    <View style={styles.line}></View>
                <View style={{flexDirection:'row'}}>
                {/*{(Message.templateTitle).map((title,index)=> {*/}
                {/*   return <Text>{title}</Text>*/}
                {/*})}*/}
                </View>
            </View>

            <View style={styles.blackCard}>
                <Text style={styles.text}>Replace words</Text>
                <View style={styles.line}></View>
                <View style={{ flexDirection: 'row', marginLeft:10,marginBottom:10, justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 17 }}> Use regular expression </Text>
                    <CheckBox onPress={() => setExp(!exp)} isChecked={exp} />
                </View>

                {wordPairs.map((pair, index) => (
                    <View key={index} style={{width:deviceWidth*0.4, flexDirection: 'row', }}>
                        <Input
                            style={{width:deviceWidth*0.1}}
                            placeholder={'Old Word'}
                            value={pair.oldWord}
                            onChangeText={(text) => {
                                const updatedPairs = [...wordPairs];
                                updatedPairs[index].oldWord = text;
                                setWordPairs(updatedPairs);
                            }}
                        />
                        <View style={{paddingHorizontal:8,marginTop:15 }}>
                            <FontAwesome5 name={'arrow-right'} size={17} />
                        </View>
                        <Input
                            placeholder={'New Word'}
                            value={pair.newWord}
                            onChangeText={(text) => {
                                const updatedPairs = [...wordPairs];
                                updatedPairs[index].newWord = text;
                                setWordPairs(updatedPairs);
                            }}
                        />
                        <TouchableOpacity style={{padding:2}} onPress={() => removeField(index)}>
                            <Image source={require('../../assets/minus.png')} style={styles.imageMinus} />
                        </TouchableOpacity>
                    </View>
                ))}

                <TouchableOpacity onPress={duplicateFields}>
                    <Image source={require('../../assets/plus.png')} style={styles.imageIcon} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const deviceWidth = Math.round(Dimensions.get('window').width);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    contentContainer: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 20,
        margin: 20,
        fontWeight: '500',
        letterSpacing: 0.2,
    },
    subtitle: {
        fontSize: 18,
        lineHeight: 26,
        margin: 20,
        marginTop:-3,
    },
    blackCard: {
        backgroundColor: 'white',
        borderColor: '#000',
        borderWidth: 0.5,
        borderRadius: 4,
        width: deviceWidth*0.95,
        alignSelf:"flex-start",
        margin: 10,
        marginTop: 18,
    },
    line: {
        borderColor: '#000',
        borderWidth: 0.2,
        alignSelf:"center",
        width: deviceWidth*0.9,
        marginBottom:20,
        marginTop:10,
    },
    text: {
        fontSize: 20,
        fontWeight: '400',
        alignSelf: 'center',
        margin: 5,
    },
    imageIcon:{
        width:32,
        height:32,
        alignSelf:'center',
        marginBottom:10,
    },
    imageMinus:{
        width:30,
        height:30,
        alignSelf:'center',
        right:12,
    },
    editIcon:{
        width:22,
        height:22,
        alignSelf:'center',
        right:12,
        margin:10,
    }

});

export default MessageContents;
