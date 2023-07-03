
import React from 'react';
import {
    createStackNavigator,
    CardStyleInterpolators,
} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomSidebarMenu from './customSidebarMenu';
import {Image} from 'react-native';
import SmsRelay from "../screens/smsRelay";
import Wrapper from "../screens/wrapper";
import MessageTemplate from "../screens/messageTemplate";
import HomeScreen from "../components/home-screen";
import Setting from "../screens/setting";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const options = {
    gestureEnabled: true,
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
};

const drawerOptionSetting = {
    drawerIcon: ({focused, size}) => (
        <Image
          source={require('../assets/setting.png')}
          style={[
            {
              height: 13,
              width: 18,
              alignSelf: 'center',
              resizeMode: 'contain',
            },
          ]}
        />
    ),
    drawerItemStyle: {},
    drawerLabelStyle: {
        color: '#000000',
        fontFamily: 'Lato',
        fontSize: 14,
        lineHeight: 22,
    },
};

const drawerOptionHistory = {
    drawerIcon: ({focused, size}) => (
        <Image
            source={require('../assets/history.png')}
            style={[
                {
                    height: 13,
                    width: 18,
                    alignSelf: 'center',
                    resizeMode: 'contain',
                },
            ]}
        />
    ),
    drawerItemStyle: {},
    drawerLabelStyle: {
        color: '#000000',
        fontFamily: 'Lato',
        fontSize: 14,
        lineHeight: 22,
    },
};

const drawerOptionContact = {
    drawerIcon: ({focused, size}) => (
        <Image
            source={require('../assets/contact.png')}
            style={[
                {
                    height: 13,
                    width: 18,
                    alignSelf: 'center',
                    resizeMode: 'contain',
                },
            ]}
        />
    ),
    drawerItemStyle: {},
    drawerLabelStyle: {
        color: '#000000',
        fontFamily: 'Lato',
        fontSize: 14,
        lineHeight: 22,
    },
};

const drawerOptionFAQ = {
    drawerIcon: ({focused, size}) => (
        <Image
            source={require('../assets/faq.png')}
            style={[
                {
                    height: 13,
                    width: 18,
                    alignSelf: 'center',
                    resizeMode: 'contain',
                },
            ]}
        />
    ),
    drawerItemStyle: {},
    drawerLabelStyle: {
        color: '#000000',
        fontFamily: 'Lato',
        fontSize: 14,
        lineHeight: 22,
    },
};

const drawerOptionIncomingMessage = {
    drawerIcon: ({focused, size}) => (
        <Image
            source={require('../assets/list.png')}
            style={[
                {
                    height: 13,
                    width: 18,
                    alignSelf: 'center',
                    resizeMode: 'contain',
                },
            ]}
        />
    ),
    drawerItemStyle: {},
    drawerLabelStyle: {
        color: '#000000',
        fontFamily: 'Lato',
        fontSize: 14,
        lineHeight: 22,
    },
};

const DrawerStack = () => {
    return (
        <Drawer.Navigator
            screenOptions={{
                activeTintColor: '#e91e63',
                headerShown: false,
                swipeEdgeWidth: 0,
            }}
            drawerContent={props => <CustomSidebarMenu {...props} />}>
            <Stack.Screen
                name="SmsRelay"
                component={SmsRelay}
                options={{drawerItemStyle: {height: 0}}}
            />
            {/*<Drawer.Screen*/}
            {/*    name="Incoming Messages"*/}
            {/*    component={Setting}*/}
            {/*    options={{*/}
            {/*        ...drawerOptionIncomingMessage,*/}
            {/*        id: "setting-id",*/}
            {/*        name: "setting-name"*/}
            {/*    }}*/}
            {/*/>*/}
            <Drawer.Screen
                name="Setting"
                component={Setting}
                options={{
                    ...drawerOptionSetting,
                    id: "setting-id",
                    name: "setting-name"
                }}
            />
            {/*<Drawer.Screen*/}
            {/*    name="FAQ"*/}
            {/*    component={Setting}*/}
            {/*    options={{*/}
            {/*        ...drawerOptionFAQ,*/}
            {/*        id: "setting-id",*/}
            {/*        name: "setting-name"*/}
            {/*    }}*/}
            {/*/>*/}
            {/*<Drawer.Screen*/}
            {/*    name="Update History"*/}
            {/*    component={Setting}*/}
            {/*    options={{*/}
            {/*        ...drawerOptionHistory,*/}
            {/*        id: "setting-id",*/}
            {/*        name: "setting-name"*/}
            {/*    }}*/}
            {/*/>*/}
            {/*<Drawer.Screen*/}
            {/*    name="Contact Us"*/}
            {/*    component={Setting}*/}
            {/*    options={{*/}
            {/*        ...drawerOptionContact,*/}
            {/*        id: "setting-id",*/}
            {/*        name: "setting-name"*/}
            {/*    }}*/}
            {/*/>*/}

        </Drawer.Navigator>
    );
};

const HomeStack = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="SmsRelay" component={SmsRelay}  options={options} />
                <Stack.Screen name="Wrapper" component={Wrapper} />
                <Stack.Screen name="MessageTemplate" component={MessageTemplate} />

                <Stack.Screen
                    name="DrawerStack"
                    component={DrawerStack}
                    options={options}
                />

            </Stack.Navigator>
        </NavigationContainer>
    );
};
export default HomeStack;
