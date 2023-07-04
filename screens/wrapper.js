import React, { useState } from 'react';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import Recipients from "../components/slider/recipients";
import ForwardConditions from "../components/slider/forward-conditions";
import MessageContents from "../components/slider/message-contents";
import MoreSettings from "../components/slider/more-settings";
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from "react-native";
import CustomHeader from "../components/custom-header";
import {useNavigation, useRoute} from "@react-navigation/native";

const windowWidth = Dimensions.get('window').width;

const Wrapper = () => {
    const navigation = useNavigation();

    const [saveClicked, setSaveClicked] = useState(false);
    const handleSaveButton = () => {
        setSaveClicked(prevState => !prevState);
    };

    const route = useRoute();
    const filterIdForCreate = route.params?.filterIdForCreate;
    const filterIdForFetch = route.params?.filterIdForFetch;
    console.log("id", filterIdForCreate);


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
                <TouchableOpacity onPress={handleSaveButton}>
                    <Text style={{ margin: 6, fontSize: 19, fontWeight: '500' }}>Save</Text>
                </TouchableOpacity>
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
        </View>
    );
};

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
        backgroundColor: 'green', // Adjust the color as needed
    },
    dotContainerStyle: {
        marginHorizontal: 6,
    },
    inactiveDotStyle: {
        backgroundColor: 'lightgray', // Adjust the color as needed
    },
});

export default Wrapper;
