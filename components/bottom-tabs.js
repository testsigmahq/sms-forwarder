import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Filters from './filters';
import Results from './results';
import { Text, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
    return (

        <Tab.Navigator
            screenOptions={{headerShown: false}}// Disable the screenOptions
        >
            <Tab.Screen
                name="Filters"
                component={Filters}
                options={{
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName = 'filter';
                        const iconColor = focused ? 'green' : 'gray';
                        return <FontAwesome5 style={{ marginTop: 5 }} name={iconName} size={26} color={iconColor} />;
                    },
                    tabBarLabel: ({ focused, color }) => {
                        const labelColor = focused ? 'green' : 'gray';
                        return <Text style={{ color: labelColor }}>Filters</Text>;
                    },
                }}
            />
            <Tab.Screen
                name="Results"
                component={Results}
                options={{
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName = 'list-ul';
                        const iconColor = focused ? 'green' : 'gray';
                        return <FontAwesome5 style={{ marginTop: 5 }} name={iconName} size={26} color={iconColor} />;
                    },
                    tabBarLabel: ({ focused, color }) => {
                        const labelColor = focused ? 'green' : 'gray';
                        return <Text style={{ color: labelColor }}>Results</Text>;
                    },
                }}
            />
        </Tab.Navigator>
    );
};

export default BottomTabs;
