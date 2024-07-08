import React, {useCallback, useEffect, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Switch,
    Image,
    TouchableOpacity,
    Modal,
    ScrollView,
    Platform,
    PermissionsAndroid
} from 'react-native';
import Database from "../repository/database";
import {getCurrentTime} from "../utils/data";

const Filters = ({ navigation }) => {
    const [toggleValue, setToggleValue] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [filter, setFilter] = useState([]);

    const fetchFilters = useCallback(() => {
        Database.fetchAllFilters()
            .then((filters) => {
                setFilter(filters);
            })
            .catch((err) => {
                console.log(getCurrentTime("ERROR") + 'Error occurred while fetching all filters, Error::', err);
            });
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchFilters();
        });

        return unsubscribe;
    }, [navigation, fetchFilters]);

    const requestContactsPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
                    {
                        title: 'Contacts Permission',
                        message: 'This app needs access to your contacts.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    // You now have the permission to access contacts
                    // Proceed with fetching contacts using the Contacts library
                } else {
                    // Permission denied
                }
            } catch (err) {
                console.warn(err);
            }
        } else if (Platform.OS === 'ios') {
            // iOS handles permissions through Info.plist settings
            // Make sure you've added the required keys in Info.plist
        }
    };

    useEffect(()=>{
        requestContactsPermission();
    },[])
    const handleToggleChange = (id, status) => {
        const newStatus = status === "active" ? "inactive" : "active";

        Database.updateFilterForStatus(id, newStatus)
            .then(() => {
                const updatedFilters = filter.map((filterItem) =>
                    filterItem.id === id ? { ...filterItem, status: newStatus } : filterItem
                );
                setFilter(updatedFilters);
            })
            .catch((error) => {
                console.log(getCurrentTime("ERROR") +'Error updating filter status, Error::', error);
            });
    };


    const handleImagePress = () => {
        // setShowModal(true);
        handleForwardSMS();
    };

    const handleForwardSMS = () => {
        const  length = filter.length;
        navigation.navigate('Wrapper', { filterIdForCreate: length+1 });
        setShowModal(false);
    };

    const handleFilterNavigation = (id) => {
        navigation.navigate('Wrapper', { filterIdForFetch: id });
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                {filter.map((filterItem) => (
                    <TouchableOpacity activeOpacity={1} key={filterItem.id} onPress={()=>{handleFilterNavigation(filterItem.id)}}>
                    <View style={styles.card} >
                            <Text style={styles.cardText}>{filterItem.filterName}</Text>
                        <View style={styles.switchContainer}>
                            <Switch
                                value={filterItem.status === "active"}
                                onValueChange={() => handleToggleChange(filterItem?.id, filterItem?.status)}
                                trackColor={{ false: '#767577', true: 'white' }}
                                thumbColor={filterItem.status === "active" ? 'lightgreen' : '#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                style={styles.switch}
                            />
                        </View>
                    </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <TouchableOpacity onPress={handleImagePress} style={styles.floatingButton}>
                <View style={styles.imageContainer}>
                    <Image source={require('../assets/plus.png')} style={styles.image} />
                </View>
            </TouchableOpacity>

            {/*<Modal visible={showModal} animationType="none" transparent={true}>*/}
            {/*    <View style={styles.modalContainer}>*/}
            {/*        <View style={[styles.modalContent]}>*/}
            {/*            <Text style={styles.modalTitle}>Add filter</Text>*/}
            {/*            <TouchableOpacity onPress={handleForwardSMS}>*/}
            {/*                <Text style={styles.modalText}>Forward SMS</Text>*/}
            {/*            </TouchableOpacity>*/}
            {/*            <Text style={styles.modalText}>Forward Notification</Text>*/}
            {/*        </View>*/}
            {/*    </View>*/}
            {/*</Modal>*/}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'space-between',
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        backgroundColor: '#03A973',
        borderRadius: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
        margin: 8,
    },
    cardText: {
        marginRight: 8,
        fontSize: 22,
        color: 'white',
        fontWeight: '800',
        letterSpacing: 2,
    },
    switchContainer: {
        flex: 1,
        alignItems: 'flex-end',
    },
    switch: {
        transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
    },
    floatingButton: {
        position: 'relative',
    },
    imageContainer: {
        alignItems: 'center',
        margin: 5,
    },
    image: {
        width: 40,
        height: 40,
        backgroundColor:"#fff",
        borderRadius:50,
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
    }
});

export default Filters;
