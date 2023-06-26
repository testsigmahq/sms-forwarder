import React from 'react';
import {SafeAreaView, View, StyleSheet, Image, Text} from 'react-native';

import {
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem,
} from '@react-navigation/drawer';

const CustomSidebarMenu = props => {
    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={{height: 90}}>
                <Image
                    source={require('../assets/minus.png')}
                    style={styles.sideMenuProfileIcon}
                />
                <View style={styles.profileNameContainer}>
                    <Text style={styles.profileName}>Jose Mourinho</Text>
                </View>
            </View>

            <DrawerContentScrollView {...props}>
                <DrawerItemList {...props} />
                <DrawerItem
                    label="Logout"
                    style={{height: 100, top: 60}}
                    labelStyle={styles.logout}
                    // icon={({focused, color, size}) => {
                    //   return (
                    //     <Image
                    //       // source={require('../assets/logout.png')}
                    //       style={[
                    //         {
                    //           height: 13,
                    //           width: 18,
                    //           alignSelf: 'center',
                    //           resizeMode: 'contain',
                    //         },
                    //       ]}
                    //     />
                    //   );
                    // }}
                    // onPress={() => props.navigation.navigate('Home')}
                    name={"log-out"}
                />
            </DrawerContentScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    sideMenuProfileIcon: {
        top: 40,
        width: 80,
        height: 80,
        alignSelf: 'center',
    },
    profileNameContainer: {
        top: 56,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileName: {
        height: 42,
        fontFamily: 'Lato',
        fontStyle: 'normal',
        // fontWeight: '700',
        fontSize: 16,
        lineHeight: 22,
        color: '#000000',
    },
    iconStyle: {
        width: 15,
        height: 15,
        marginHorizontal: 5,
    },
    logout: {
        color: '#000000',
        fontFamily: 'Lato',
        // fontWeight: '400',
        fontSize: 14,
        lineHeight: 22,
    },
});

export default CustomSidebarMenu;
