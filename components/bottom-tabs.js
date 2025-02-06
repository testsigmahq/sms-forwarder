import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Filters from "./filters";
import Results from "./results";
import { Dimensions, View, Keyboard } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import Setting from "../screens/setting";

const Tab = createBottomTabNavigator();
const deviceWidth = Math.round(Dimensions.get("window").width);
const deviceHeight = Math.round(Dimensions.get("window").height);

const BottomTabs = () => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Listen to keyboard events
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true); // Set keyboard visibility to true
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false); // Set keyboard visibility to false
      }
    );

    // Cleanup listeners when the component is unmounted
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: deviceHeight * 0.08,
          width: deviceWidth * 0.6,
          borderRadius: 50,
          elevation: 10,
          shadowColor: "rgba(0, 0, 0, 0.2)",
          shadowOffset: { width: 0, height: -3 },
          shadowRadius: 6,
          shadowOpacity: 0.2,
          backgroundColor: "white",
          position: "absolute",
          left:"20%",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          alignSelf: "center",
          marginTop: 10,
          marginBottom: keyboardVisible ? 0 : 10, // Adjust bottom margin when keyboard is visible
          display: keyboardVisible ? "none" : "flex", // Hide the tab bar when keyboard is visible
        },

        tabBarIconStyle: {
          margin: 5,
          size: 20,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
          marginBottom: 5,
          display: "none",
        },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#d1d1d1",
      }}
    >
      <Tab.Screen
        name="Results"
        component={Results}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = "list-alt";
            const iconColor = focused ? "#fff" : "#d1d1d1";
            const backgroundColor = focused ? "#03A973" : "transparent";
            return (
              <View
                style={{
                  backgroundColor,
                  borderRadius: 50,
                  padding: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  width: 50,
                  height: 50,
                }}
              >
                <FontAwesome5 name={iconName} size={20} color={iconColor} />
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="Filters"
        component={Filters}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = "filter";
            const iconColor = focused ? "#fff" : "#d1d1d1";
            const backgroundColor = focused ? "#03A973" : "transparent";
            return (
              <View
                style={{
                  backgroundColor,
                  borderRadius: 50,
                  padding: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  width: 50,
                  height: 50,
                }}
              >
                <FontAwesome5 name={iconName} size={20} color={iconColor} />
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="Setting"
        component={Setting}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = "envelope";
            const iconColor = focused ? "#fff" : "#d1d1d1";
            const backgroundColor = focused ? "#03A973" : "transparent";
            return (
              <View
                style={{
                  backgroundColor,
                  borderRadius: 50,
                  padding: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  width: 50,
                  height: 50,
                }}
              >
                <FontAwesome5 name={iconName} size={20} color={iconColor} />
              </View>
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;
