import React from 'react';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import Recipients from "../components/slider/recipients";
import ForwardConditions from "../components/slider/forward-conditions";
import MessageContents from "../components/slider/message-contents";
import MoreSettings from "../components/slider/more-settings";
import { View, StyleSheet, Dimensions } from "react-native";

const windowWidth = Dimensions.get('window').width;

const Wrapper = () => {
    const component = [
        <Recipients />,
        <ForwardConditions />,
        <MessageContents />,
        <MoreSettings />,
    ];

    const [activeSlide, setActiveSlide] = React.useState(0);

    const renderItem = ({ item }) => {
        return <View style={styles.itemContainer}>{item}</View>;
    };

    return (
        <View style={styles.container}>
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
        width: 10,
        height: 10,
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
