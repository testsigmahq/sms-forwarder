import React, { useEffect, useState } from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import Contacts from 'react-native-contacts';
import Contact from '../components/contact';
import Database from "../database";

const ContactPicker = ({ onCloseModal }) => {
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        Contacts.getAll().then((contacts) => {
            // console.log(contacts);
            setContacts(contacts);
        });
    }, []);

    const keyExtractor = (item, idx) => {
        return item?.recordID?.toString() || idx.toString();
    };

    const handleContactPress = (contact) => {
        const cleanedPhoneNumber = contact.phoneNumbers[0].number.replace("+91 ", "");
        Database.insertContact(cleanedPhoneNumber);
        console.log('Contact pressed:', contact.phoneNumbers[0].number.replace("+91 ", ""));
        onCloseModal();
    };

    const renderItem = ({ item, index }) => {
        return <Contact contact={item} onPress={handleContactPress} />;
    };

    // console.log('Contacts:', contacts);

    return (
        <FlatList
            data={contacts}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            style={styles.list}
        />
    );
};

const styles = StyleSheet.create({
    list: {
        flex: 1,
    },
});

export default ContactPicker;
