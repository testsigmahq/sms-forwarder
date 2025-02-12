import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Dimensions,
  Image,
  Modal,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";

import { SetRecipientsInfo } from "../../redux/actions/setUpRecipients";
import { useDispatch } from "react-redux";
import Database from "../../repository/database";
import { useNavigation } from "@react-navigation/native";
import { getCurrentTime } from "../../utils/date";
import Icon from "react-native-vector-icons/FontAwesome";
import { showMessage } from "react-native-flash-message";

const Recipients = ({ saveClicked, id, filterIdForCreate, errorMessage }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [error, setError] = useState(errorMessage);
  const [condition, setCondition] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [recipients, setRecipients] = useState([]);

  useEffect(() => {
    if (id) {
      console.log("id", id);
      Database.fetchAllRecords(id)
        .then((result) => {
          const { emails = [], phoneNumbers = [], urls = [] } = result;
          const combinedArray = [...phoneNumbers, ...emails, ...urls];

          if (
            combinedArray.length !== recipients.length ||
            !combinedArray.every((item, index) => item === recipients[index])
          ) {
            setRecipients(combinedArray);
          }
        })
        .catch((err) => {
          showMessage({
            message: "Error",
            description: `Error occurred while fetching recipients: ${err?.message}`,
            type: "danger",
          });
          console.log(
            getCurrentTime("ERROR") +
              "Error occurred while fetching recipients:",
            err
          );
        });
    }
  }, []);

  // ToDo: Need to remove this useEffect
  useEffect(() => {
    dispatch(SetRecipientsInfo(recipients));
  }, [recipients]);

  useEffect(() => {
    if (saveClicked) {
      onSave();
    }
  }, [saveClicked]);

  async function onSave() {
    const recipientsInfo = recipients.reduce(
      (result, { type, text, requestMethod, key, id }) => {
        const entry = { text: text.trim(), id, requestMethod, key };
        if (type === "PhoneNumber") result.phoneNumbers.push(entry);
        else if (type === "Email") result.emails.push(entry);
        else if (type === "URL") result.urls.push(entry);
        return result;
      },
      { phoneNumbers: [], emails: [], urls: [] }
    );

    const filterId = filterIdForCreate || id;

    try {
      // Batch insert operations for new entries
      await Promise.all([
        recipientsInfo.emails.some((e) => !e.id) &&
          Database.insertEmails(
            recipientsInfo.emails.filter((e) => !e.id).map((e) => e.text),
            filterId
          ),
        recipientsInfo.phoneNumbers.some((p) => !p.id) &&
          Database.insertPhoneNumbers(
            recipientsInfo.phoneNumbers.filter((p) => !p.id).map((p) => p.text),
            filterId
          ),
        recipientsInfo.urls.some((u) => !u.id) &&
          Database.insertUrls(
            recipientsInfo.urls.filter((u) => !u.id),
            filterId
          ),
      ]);

      // Batch update operations for existing entries
      await Promise.all([
        ...recipientsInfo.emails
          .filter((e) => e.id)
          .map((e) => Database.updateEmailById(e.id, e.text, filterId)),

        ...recipientsInfo.phoneNumbers
          .filter((p) => p.id)
          .map((p) => Database.updatePhoneNumberById(p.id, p.text, filterId)),

        ...recipientsInfo.urls
          .filter((u) => u.id)
          .map((u) =>
            Database.updateUrlById(
              u.id,
              u.url,
              u.requestMethod,
              u.key,
              filterId
            )
          ),
      ]);

      console.log(
        getCurrentTime("INFO") + " Saved recipients successfully:",
        recipientsInfo
      );

      if (
        recipientsInfo.phoneNumbers.length ||
        recipientsInfo.emails.length ||
        recipientsInfo.urls.length
      ) {
        navigation.navigate("Filters");
      } else {
        setError(true);
      }
    } catch (error) {
      showMessage({
        message: "Error",
        description: `Error occurred while saving recipients: ${error.message}`,
        type: "danger",
      });
      console.error(
        getCurrentTime("ERROR") + " Failed to save recipients:",
        error
      );
    }
  }

  function createEmptyRecipientInput(recipientType) {
    if (recipientType) {
      const newRecipient = {
        type: recipientType,
        text: "",
        requestMethod: "",
        key: "",
      };
      setRecipients((prevRecipients) => [
        ...(prevRecipients || []),
        newRecipient,
      ]);
    }
    setShowModal(false);
  }

  function removeRecipient(index, id, type) {
    const updatedRecipients = [...recipients];

    const deleteEntity = (deleteFunction, entityType) => {
      deleteFunction(filterIdForCreate || id)
        .then(() => {
          console.log(
            getCurrentTime("INFO") + `${entityType} deleted successfully`
          );
          updatedRecipients.splice(index, 1);
          setRecipients(updatedRecipients);
        })
        .catch((err) => {
          showMessage({
            message: "Error",
            description: `Error occurred while deleting ${entityType}: ${err?.message}`,
            type: "danger",
          });
          console.log(
            getCurrentTime("ERROR") +
              `Error occurred while deleting ${entityType}:`,
            err
          );
        });
    };

    if (type === "URL") {
      deleteEntity(Database.deleteUrlById, "URL");
    } else if (type === "Email") {
      deleteEntity(Database.deleteEmailById, "Email");
    } else {
      deleteEntity(Database.deletePhoneNumberById, "Phone number");
    }
  }

  function updateRecipientField(index, field, value) {
    const updatedRecipients = [...recipients];
    updatedRecipients[index][field] = value;
    setRecipients(updatedRecipients);
  }

  async function handleClose() {
    setError(false);
    // await Database.deleteFilter(id);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Set up recipients</Text>
          <Text style={styles.subtitle}>
            Please enter the phone number, e-mail of the another device that
            will receive a message from this phone
          </Text>
        </View>
        <View style={styles.card}>
          <View>
            {recipients.length > 0 &&
              recipients.map((recipient, index) => (
                <React.Fragment key={index}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignSelf: "center",
                      width: deviceWidth * 0.8,
                      justifyContent: "space-between",
                    }}
                  >
                    <TextInput
                      style={styles.input}
                      placeholder={recipient.type}
                      value={recipient.text}
                      onChangeText={(text) =>
                        updateRecipientField(index, "text", text)
                      }
                    />
                    <View style={{ justifyContent: "center", top: 5 }}>
                      <TouchableOpacity
                        onPress={() =>
                          removeRecipient(index, recipient.id, recipient.type)
                        }
                      >
                        <Image
                          source={require("../../assets/minus.png")}
                          style={styles.minus}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  {recipient.type === "URL" && (
                    <View style={styles.inputContainer}>
                      <TouchableOpacity
                        onPress={() =>
                          updateRecipientField(index, "requestMethod", "POST")
                        }
                        style={styles.radioButton}
                      >
                        <View
                          style={[
                            styles.radioOuterCircle,
                            {
                              borderColor:
                                recipient.requestMethod === "POST"
                                  ? "#1AA874"
                                  : "#000",
                            },
                          ]}
                        >
                          {recipient.requestMethod === "POST" && (
                            <View style={styles.radioInnerCircle} />
                          )}
                        </View>
                        <Text style={styles.radioLabel}>POST</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          updateRecipientField(index, "requestMethod", "GET")
                        }
                        style={styles.radioButton}
                      >
                        <View
                          style={[
                            styles.radioOuterCircle,
                            {
                              borderColor:
                                recipient.requestMethod === "GET"
                                  ? "#1AA874"
                                  : "#000",
                            },
                          ]}
                        >
                          {recipient.requestMethod === "GET" && (
                            <View style={styles.radioInnerCircle} />
                          )}
                        </View>
                        <Text style={styles.radioLabel}>GET</Text>
                      </TouchableOpacity>
                      {recipient.requestMethod && (
                        <TextInput
                          style={styles.requestInput}
                          placeholder={`${recipient.requestMethod} KEY`}
                          value={recipient.key}
                          onChangeText={(text) =>
                            updateRecipientField(index, "key", text)
                          }
                        />
                      )}
                    </View>
                  )}

                  <View
                    style={{
                      marginTop: 20,
                      borderBottomColor: "rgba(0, 0, 0, 0.6)",
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      width: deviceWidth * 0.9,
                      marginLeft: 18,
                      marginRight: 20,
                      marginBottom: 10,
                    }}
                  />
                </React.Fragment>
              ))}
          </View>
          <View style={styles.imageContainer}>
            <TouchableOpacity
              onPress={() => setShowModal(true)}
              style={styles.floatingButton}
            >
              <View
                style={{
                  backgroundColor: "#03A973",
                  borderRadius: 50,
                  padding: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  width: 50,
                  height: 50,
                }}
              >
                <Icon name={"plus"} size={20} color={"white"} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <Modal visible={showModal} animationType="none" transparent={true}>
          <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Add</Text>
                <TouchableOpacity
                  onPress={() => createEmptyRecipientInput("PhoneNumber")}
                >
                  <Text style={styles.modalText}>Enter Phone Number</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => createEmptyRecipientInput("Email")}
                >
                  <Text style={styles.modalText}>Enter Email</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity onPress={() => createEmptyRecipientInput("URL")}>
                  <Text style={styles.modalText}>URL</Text>
                </TouchableOpacity> */}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <Modal
          visible={error}
          animationType="none"
          transparent={true}
          style={{}}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Error</Text>
              <Text style={styles.modalText}>
                Please check the phone number or email in the recipients
                setting.
              </Text>
              <TouchableOpacity
                onPress={() => {
                  handleClose();
                }}
              >
                <Text
                  style={[
                    styles.bottom,
                    { color: "green", alignSelf: "flex-end" },
                  ]}
                >
                  CLOSE
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          visible={condition}
          animationType="none"
          transparent={true}
          style={{}}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Warning</Text>
              <Text style={styles.modalText}>
                There're no conditions in the "Forwarding condition" field, so
                all messages are forwarded.
              </Text>
              <View
                style={{ flexDirection: "row", justifyContent: "flex-end" }}
              >
                <TouchableOpacity
                  onPress={() => {
                    handleClose();
                  }}
                >
                  <Text
                    style={[styles.bottom, { color: "green", marginRight: 15 }]}
                  >
                    CANCEL
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    handleClose();
                  }}
                >
                  <Text
                    style={[styles.bottom, { color: "green", marginRight: 15 }]}
                  >
                    OK
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const deviceWidth = Math.round(Dimensions.get("window").width);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 16,
  },
  scrollContentContainer: {
    flexGrow: 1,
  },
  contentContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 26,
  },
  card: {
    alignItems: "center",
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 6,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    width: deviceWidth * 0.9,
    marginTop: 30,
    margin: 10,
    alignSelf: "center",
  },
  input: {
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "gray",
    width: deviceWidth * 0.68,
    marginTop: 10,
  },
  requestInput: {
    height: 35,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderWidth: 1,
    alignSelf: "center",
    borderColor: "gray",
    width: deviceWidth * 0.35,
    marginBottom: -3,
  },
  image: {
    width: 32,
    height: 32,
    marginTop: 10,
  },
  minus: {
    width: 30,
    height: 30,
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 20,
    alignSelf: "stretch",
    marginBottom: 10,
    marginHorizontal: 20,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  radioOuterCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioInnerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#1AA874",
  },
  radioLabel: {
    marginLeft: 5,
    fontSize: 16,
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
    flexDirection: "column",
    padding: 15,
    width: deviceWidth * 0.8,
  },
  modalText: {
    alignSelf: "stretch",
    textAlign: "left",
    marginBottom: 20,
    fontSize: 14,
  },
  modalTitle: {
    alignSelf: "flex-start",
    textAlign: "left",
    marginBottom: 20,
    fontWeight: "500",
    fontSize: 20,
  },
});

export default Recipients;
