import React, { useEffect, useState } from 'react';
import {View, Text, Button, StyleSheet, SafeAreaView, Dimensions} from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import CheckBox from "../../components/checkbox";
import BorderBox from "../border-box";

const ForwardConditions = () => {
    const [forwardCondition, setforwardCondition] = useState(false);
    const [ignoreCase, setIgnoreCase] = useState(false);
    const [useWildcards, setUseWildcards] = useState(false);

    const data = useSelector((state) => {return (state.recipients)});
    console.log("data2",data)


    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Forwarding conditions</Text>

            <View style={styles.headerCard}>
                <CheckBox
                    onPress={() => setforwardCondition(!forwardCondition)}
                    isChecked={forwardCondition} />
                <Text style={styles.headerCardText}>Forward all messages</Text>
            </View>

            {!forwardCondition && <View style={styles.card}>
                <View style={styles.checkboxRow}>
                    <CheckBox
                        onPress={() => setIgnoreCase(!ignoreCase)}
                        isChecked={ignoreCase} />
                    <Text style={styles.checkboxLabel}>Ignore case sensitive</Text>
                </View>
                <View style={styles.checkboxRow}>
                    <CheckBox
                        onPress={() => setUseWildcards(!useWildcards)}
                        isChecked={useWildcards} />
                    <Text style={styles.checkboxLabel}>Use wildcards(*)</Text>
                </View>
                <View style={{justifyContent:"center",width:deviceWidth*1}} >
                <BorderBox  title={"From who"} content={"ADD"} />
                <BorderBox  title={"Rule for text"} content={"ADD"} />
                </View>
            </View>
            }
        </SafeAreaView>
    );
};
const deviceWidth = Math.round(Dimensions.get('window').width);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 10,
    },
    title: {
        fontSize: 20,
        marginBottom: 10,
        marginTop: 5,
        marginLeft: 5,
        fontWeight: 'bold',
        letterSpacing: 0.2,
    },
    headerCard: {
        flexDirection: 'row',
        padding: 10,
        paddingVertical:15,
        backgroundColor: 'white',
        borderRadius: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
        width: deviceWidth*0.95,
    },
    headerCardText: {
        fontSize: 18,
        color: 'black',
        fontWeight: '400',
    },
    card: {
        padding: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 6,
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 10,
        width: deviceWidth*0.95,
        marginTop: 20,
        alignSelf: 'center',
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    checkboxLabel: {
        marginLeft: 8,
        fontSize: 16,
        color: 'black',
        fontWeight: '400',
    },
    blackCard: {
        backgroundColor: 'white',
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 6,
        width: 300,
        height:100,
    },
});

export default ForwardConditions;
