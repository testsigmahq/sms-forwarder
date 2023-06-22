import React, { useEffect, useState } from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import Contacts from 'react-native-contacts';
import Contact from '../components/contact';

const ContactPicker = () => {
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        Contacts.getAll().then((contacts) => {
            console.log(contacts);
            setContacts(contacts);
        });
    }, []);

    const keyExtractor = (item, idx) => {
        return item?.recordID?.toString() || idx.toString();
    };

    const handleContactPress = (contact) => {
        console.log('Contact pressed:', contact);
        // Handle the contact press event here
    };

    const renderItem = ({ item, index }) => {
        return <Contact contact={item} onPress={handleContactPress} />;
    };

    console.log('Contacts:', contacts);

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
