import React, { useState, useMemo, useCallback } from "react";
import Carousel, { Pagination } from "react-native-snap-carousel";
import Recipients from "../components/slider/recipients";
import FilterSettings from "../components/slider/filter-setting";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  Modal,
} from "react-native";
import CustomHeader from "../components/custom-header";
import { useNavigation, useRoute } from "@react-navigation/native";
import Database from "../repository/database";
import { useSelector } from "react-redux";

const windowWidth = Dimensions.get("window").width;
const deviceWidth = Math.round(windowWidth);

const Wrapper = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [deleteWarning, setDeleteWarning] = useState(false);
  const [saveClicked, setSaveClicked] = useState(false);
  const [error, setError] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const recipients = useSelector((state) => state.recipients);

  const filterIdForCreate = route.params?.filterIdForCreate;
  const filterIdForFetch = route.params?.filterIdForFetch;

  const handleSaveButton = useCallback(() => {
    const isAllTextNotEmpty = recipients.recipients.every(
      (recipient) => recipient.text.trim() !== ""
    );

    if (recipients.recipients.length !== 0 && isAllTextNotEmpty) {
      setSaveClicked((prevState) => !prevState);
      setError(false);
    } else {
      setError(true);
      setSaveClicked(false);
    }
  }, [recipients]);

  const handleDelete = useCallback(() => {
    Database.deleteFilter(filterIdForFetch);
    navigation.navigate("Filters");
  }, [filterIdForFetch, navigation]);

  const component = useMemo(
    () => [
      <Recipients
        key="recipients"
        saveClicked={saveClicked}
        filterIdForCreate={filterIdForCreate}
        id={filterIdForFetch}
        errorMessage={error}
      />,
      <FilterSettings
        key="filter-settings"
        saveClicked={saveClicked}
        filterIdForCreate={filterIdForCreate}
        id={filterIdForFetch}
        errorMessage={error}
      />,
    ],
    [saveClicked, filterIdForCreate, filterIdForFetch, error]
  );

  const renderItem = useCallback(({ item }) => {
    return <View style={styles.itemContainer}>{item}</View>;
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <CustomHeader title="Add filter" onPressBackButton={navigation.goBack} />
        <View style={styles.headerButtons}>
          {filterIdForFetch && (
            <TouchableOpacity onPress={() => setDeleteWarning(true)}>
              <Text style={styles.headerButtonText}>Delete</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleSaveButton}>
            <Text style={styles.headerButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Carousel */}
      <Carousel
        data={component}
        renderItem={renderItem}
        sliderWidth={windowWidth}
        itemWidth={windowWidth}
        onSnapToItem={setActiveSlide}
      />
      
      {/* Pagination */}
      <Pagination
        dotsLength={component.length}
        activeDotIndex={activeSlide}
        containerStyle={styles.paginationContainer}
        dotStyle={styles.dotStyle}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
        inactiveDotStyle={styles.inactiveDotStyle}
      />

      {/* Delete Confirmation Modal */}
      <Modal visible={deleteWarning} animationType="fade" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Warning</Text>
            <Text style={styles.modalText}>
              Would you like to proceed with deleting the filter?
            </Text>
            <Text style={styles.modalText}>
              Note: This action is not reversible, and all data associated with
              the filter will be permanently lost.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setDeleteWarning(false)}>
                <Text style={styles.cancelButton}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete}>
                <Text style={styles.okButton}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
  },
  headerContainer: {
    margin: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerButtons: {
    flexDirection: "row",
  },
  headerButtonText: {
    margin: 6,
    fontSize: 19,
    fontWeight: "500",
  },
  itemContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "white",
  },
  paginationContainer: {
    paddingVertical: 8,
  },
  dotStyle: {
    width: 26,
    height: 12,
    borderRadius: 10,
    backgroundColor: "green",
  },
  inactiveDotStyle: {
    backgroundColor: "lightgray",
  },
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 5,
    padding: 15,
    width: deviceWidth * 0.8,
  },
  modalTitle: {
    alignSelf: "flex-start",
    textAlign: "left",
    marginBottom: 20,
    fontWeight: "500",
    fontSize: 18,
  },
  modalText: {
    alignSelf: "stretch",
    textAlign: "left",
    marginBottom: 20,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cancelButton: {
    color: "green",
    marginHorizontal: 5,
    fontSize: 16,
  },
  okButton: {
    color: "green",
    marginHorizontal: 5,
    fontSize: 16,
  },
});

export default Wrapper;
