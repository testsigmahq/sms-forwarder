import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Checkbox = (props) => {
    const iconName = props.isChecked ?
        "checkbox-marked" : "checkbox-blank-outline";
    return (
        <View style={styles.container}>
            <Pressable onPress={props.onPress}>
                <MaterialCommunityIcons
                    name={iconName} size={28} color={props.isChecked ? '#1AA874' : 'gray'} />
            </Pressable>
        </View>
    );
};

export default Checkbox;

const styles = StyleSheet.create({
    container: {
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "row",
        width: 40,
        marginTop: 2,
        marginHorizontal: 5,
    }
});
