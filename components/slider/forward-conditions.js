import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomHeader from "../custom-header";
import CheckBox from "../../components/checkbox";

const ForwardConditions = () => {
    const navigation = useNavigation();
    const [isSet, setIsSet] = useState(false);
    const [ignoreCase, setIgnoreCase] = useState(false);
    const [useWildcards, setUseWildcards] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ marginBottom: 4 }}>
                <CustomHeader
                    title="Add filter"
                    onPressBackButton={() => navigation.goBack()} />
            </View>
            <Text style={styles.title}>Forwarding conditions</Text>

            <View style={styles.headerCard}>
                <CheckBox
                    onPress={() => setIsSet(!isSet)}
                    isChecked={isSet} />
                <Text style={styles.headerCardText}>Forward all messages</Text>
            </View>

            <View style={styles.card}>
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
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 16,
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
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
        margin: 8,
    },
    headerCardText: {
        marginRight: 8,
        fontSize: 18,
        color: 'black',
        fontWeight: '400',
    },
    card: {
        alignItems: 'flex-start',
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
});

export default ForwardConditions;
