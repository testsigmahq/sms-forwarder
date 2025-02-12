import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  UIManager,
  View,
} from "react-native";
import { showMessage } from "react-native-flash-message";
import CheckBox from "../../components/checkbox";
import Database from "../../repository/database";
import { getCurrentTime } from "../../utils/date";
import BorderBox from "../border-box";

// Enable Layout Animation for Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FilterSettings = ({ saveClicked, id, filterIdForCreate }) => {
  const [forwardCondition, setForwardCondition] = useState(true);
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(-10)).current;
  const [inputValue, setInputValue] = useState("");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (saveClicked) {
      onSave();
    }
  }, [saveClicked]);

  useEffect(() => {
    async function fetchFilter() {
      if (id) {
        let filter = await Database.fetchFilters(id);
        console.log(getCurrentTime("INFO") + " filters::", filter);
        const isForwarding = filter[0]?.forward_all === 1;
        setForwardCondition(isForwarding);
        setExpanded(!isForwarding);
        animateBox(isForwarding)
        setInputValue(filter[0]?.filter_name || "");
      }
    }
    fetchFilter();
  }, []);

  function onSave() {
    if (filterIdForCreate) {
      Database.insertFilter(
        inputValue || `Filter ${filterIdForCreate}`,
        "active",
        1
      )
        .then((filter) => {
          showMessage({
            message: "Success",
            description: `Inserted filter: ${filter.filter_name}`,
            type: "success",
          });
          console.log(getCurrentTime("INFO") + "Inserted filter:", filter.id);
        })
        .catch((error) => {
          showMessage({
            message: "Error",
            description: `Error occurred on saving: ${error?.message}`,
            type: "danger",
          });
          console.log(
            getCurrentTime("ERROR") + "Error occurred on saving:",
            error
          );
        });
    } else if (id) {
      Database.updateFilterForCondition(id, forwardCondition);
      updateDatabase();
    }
  }

  const updateDatabase = () => {
    if (id) {
      Database.updateFilterForName(id, inputValue)
        .then(() => {
          console.log(
            getCurrentTime("INFO") + "Filter name updated successfully."
          );
        })
        .catch((error) => {
          showMessage({
            message: "Error",
            description: `Error occurred on updating database: ${error?.message}`,
            type: "danger",
          });
          console.log(getCurrentTime("ERROR") + "Error occurred:", error);
        });
    }
  };

  function animateBox(isForwarding) {
    // Set initial visibility and translation based on forwarding state
    if (isForwarding) {
      opacityAnim.setValue(0);
      translateYAnim.setValue(-10);
    } else {
      opacityAnim.setValue(1);
      translateYAnim.setValue(0);
    }
  
    // Layout Animation for height (Fixing the error)
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  
    // Animated opacity and slide-in effect
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: isForwarding ? 0 : 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: isForwarding ? -10 : 0,
        duration: 400,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }  

  function toggleForwardCondition() {
    const newCondition = !forwardCondition;
    setForwardCondition(newCondition);
    setExpanded(!newCondition);
    animateBox(newCondition);
  }

  return (
    <ScrollView style={styles.container}>
      {/* Heading */}
      <Text style={styles.title}>Filter Settings</Text>

      {/* Filter Name Section */}
      <View style={styles.section}>
        <Text style={styles.label}>Filter Name:</Text>
        <TextInput
          placeholder="Enter filter name"
          value={inputValue}
          onChangeText={setInputValue}
          style={styles.input}
        />
      </View>

      {/* Forward Conditions Section */}
      <View style={styles.box}>
        <Text style={styles.label}>Forward Conditions:</Text>
        <View style={styles.line} />

        {/* Checkbox */}
        <View style={styles.checkboxContainer}>
          <CheckBox
            onPress={toggleForwardCondition}
            isChecked={forwardCondition}
          />
          <Text style={styles.checkboxText}>Forward all messages</Text>
        </View>

        {/* Animated Content Section */}
        {expanded && (
          <Animated.View
            style={[
              styles.content,
              {
                opacity: opacityAnim,
                transform: [{ translateY: translateYAnim }],
              },
            ]}
          >
            <BorderBox
              saveClicked={saveClicked}
              id={id}
              filterIdForCreate={filterIdForCreate}
            />
          </Animated.View>
        )}
      </View>
    </ScrollView>
  );
};

const deviceWidth = Math.round(Dimensions.get("window").width);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 15,
  },
  divider: {
    height: 2,
    backgroundColor: "#ccc",
    marginVertical: 10,
    width: "100%",
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
  section: {
    paddingVertical: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    marginLeft: 2,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#FFF",
    margin: 3,
  },
  box: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    marginVertical: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    width: deviceWidth * 0.9,
    alignSelf: "center",
    margin: 3,
  },
  line: {
    height: 1,
    backgroundColor: "#AAA",
    marginVertical: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 10,
  },
  content: {
    marginTop: 10,
  },
});

export default FilterSettings;
