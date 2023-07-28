import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Filters from './filters';
import Results from './results';
import {Dimensions, Text, View} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
    return (

        <Tab.Navigator
            screenOptions={{headerShown: false, tabBarStyle: { height: deviceHeight*0.06 }}}// Disable the screenOptions
        >
            <Tab.Screen
                name="Results"
                component={Results}
                options={{
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName = 'list-ul';
                        const iconColor = focused ? 'green' : 'gray';
                        return <FontAwesome5 style={{ }} name={iconName} size={20} color={iconColor} />;
                    },
                    tabBarLabel: ({ focused, color }) => {
                        const labelColor = focused ? 'green' : 'gray';
                        return <Text style={{ color: labelColor, fontSize:12 }}>Results</Text>;
                    },
                }}
            />
            <Tab.Screen
                name="Filters"
                component={Filters}
                options={{
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName = 'filter';
                        const iconColor = focused ? '#03A973' : 'gray';
                        return <FontAwesome5 style={{ marginTop: 5 }} name={iconName} size={20} color={iconColor} />;
                    },
                    tabBarLabel: ({ focused, color }) => {
                        const labelColor = focused ? '#03A973' : 'gray';
                        return <Text style={{ color: labelColor, fontSize:12 }}>Filters</Text>;
                    },
                }}
            />
        </Tab.Navigator>
    );
};

const deviceWidth = Math.round(Dimensions.get('window').width);
const deviceHeight = Math.round(Dimensions.get('window').height);

export default BottomTabs;
