import React from "react";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Wrapper from "../screens/wrapper";
import MessageTemplate from "../screens/messageTemplate";
import BottomTabs from "../components/bottom-tabs";

const Stack = createStackNavigator();

const options = {
  gestureEnabled: true,
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
};

const HomeStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="BottomTabs"
          component={BottomTabs}
          options={options}
        />
        <Stack.Screen name="Wrapper" component={Wrapper} />
        <Stack.Screen name="MessageTemplate" component={MessageTemplate} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default HomeStack;
