import React, { useState } from 'react';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import Recipients from "../components/slider/recipients";
import ForwardConditions from "../components/slider/forward-conditions";
import MessageContents from "../components/slider/message-contents";
import MoreSettings from "../components/slider/more-settings";
import {View, StyleSheet, Dimensions, TouchableOpacity, Text, Modal} from "react-native";
import CustomHeader from "../components/custom-header";
import {useNavigation, useRoute} from "@react-navigation/native";
import Database from "../database";

const windowWidth = Dimensions.get('window').width;

const Wrapper = () => {
    const navigation = useNavigation();
    const [deleteWarning, setDeleteWarning] = useState(false);
    const [saveClicked, setSaveClicked] = useState(false);
    const handleSaveButton = () => {
        setSaveClicked(prevState => !prevState);
    };

    const route = useRoute();
    const filterIdForCreate = route.params?.filterIdForCreate;
    const filterIdForFetch = route.params?.filterIdForFetch;
    console.log("id", filterIdForFetch);

    const handleDelete = () => {
        Database.deleteFilter(filterIdForFetch)
        navigation.navigate("Filters")
    };

    const component = [
        <Recipients saveClicked={saveClicked} filterIdForCreate={filterIdForCreate} id={filterIdForFetch} />,
        <ForwardConditions saveClicked={saveClicked} filterIdForCreate={filterIdForCreate} id={filterIdForFetch}/>,
        <MessageContents saveClicked={saveClicked} filterIdForCreate={filterIdForCreate} id={filterIdForFetch} />,
        <MoreSettings saveClicked={saveClicked} filterIdForCreate={filterIdForCreate} id={filterIdForFetch} />,
    ];

    const [activeSlide, setActiveSlide] = React.useState(0);

    const renderItem = ({ item }) => {
        return <View style={styles.itemContainer}>{item}</View>;
    };

    return (
        <View style={styles.container}>
            <View style={{ margin: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                <CustomHeader
                    title="Add filter"
                    onPressBackButton={() => navigation.goBack()} />
                <View style={{flexDirection:"row"}}>
                    { filterIdForFetch &&
                        <TouchableOpacity onPress={() => setDeleteWarning(true)}>
                        <Text style={{margin: 6, fontSize: 19, fontWeight: '500'}}>Delete</Text>
                        </TouchableOpacity> }
                <TouchableOpacity onPress={handleSaveButton}>
                    <Text style={{ margin: 6, fontSize: 19, fontWeight: '500' }}>Save</Text>
                </TouchableOpacity>
                </View>
            </View>
            <Carousel
                data={component}
                renderItem={renderItem}
                sliderWidth={windowWidth}
                itemWidth={windowWidth}
                onSnapToItem={(index) => setActiveSlide(index)}
            />
            <Pagination
                dotsLength={component.length}
                activeDotIndex={activeSlide}
                containerStyle={styles.paginationContainer}
                dotStyle={styles.dotStyle}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
                dotContainerStyle={styles.dotContainerStyle}
                inactiveDotStyle={styles.inactiveDotStyle}
            />
            <Modal visible={deleteWarning} animationType="none" transparent={true} style={{}}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Warning</Text>
                        <Text style={styles.modalText}>Would you like to proceed with deleting the filter?</Text>
                        <Text style={styles.modalText}>Note: This action is not reversible, and all data associated with the filter will be permanently lost.</Text>
                        <View style={{flexDirection:"row", justifyContent:"flex-end"}}>
                        <TouchableOpacity onPress={() => setDeleteWarning(false)}>
                            <Text style={[styles.bottom,{color:"green", marginHorizontal:5}]}>CANCEL</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {handleDelete()}}>
                            <Text style={[styles.bottom,{color:"green",marginHorizontal:5}]}>OK</Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const deviceWidth = Math.round(Dimensions.get('window').width);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    itemContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: 'white',
    },
    paginationContainer: {
        paddingVertical: 8,
    },
    dotStyle: {
        width: 26,
        height: 12,
        borderRadius: 10,
        backgroundColor: 'green',
    },
    dotContainerStyle: {
        marginHorizontal: 6,
    },
    inactiveDotStyle: {
        backgroundColor: 'lightgray',
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

export default Wrapper;
