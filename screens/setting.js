import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Animated,
  Easing,
  Alert,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { RadioButton } from "react-native-paper";
import GoogleSignupButton from "../components/google-signup-button";
import { useNavigation } from "@react-navigation/native";
import { showMessage } from "react-native-flash-message";
import { useDispatch } from "react-redux";
import Database from "../repository/database";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { getCurrentTime } from "../utils/date";
import RNSmtpMailer from "react-native-smtp-mailer";
import { FontAwesome5 } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/FontAwesome";

const { height: deviceHeight } = Dimensions.get("window");

const Setting = () => {
  const dispatch = useDispatch();

  const navigation = useNavigation();
  const [selectedValue, setSelectedValue] = useState("");
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const slideAnim = useState(new Animated.Value(0))[0];
  const [emailAddress, setEmailAddress] = useState("");
  const [host, setHost] = useState("");
  const [port, setPort] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [userInfo, setUserInfo] = useState("");

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleGoogleSignup = (userInfo) => {
    GoogleSignin.getCurrentUser().then((res) => {
      console.log(getCurrentTime("INFO") + "user email::", res.user.email);
      setEmail(res.user.email);
    });
    setUserInfo(userInfo);
    console.log(getCurrentTime("INFO") + "Signed in userInfo::", userInfo);
  };

  const [showAuth, setShowAuth] = useState(false);
  const [showSSL, setShowSSL] = useState(false);
  const [showTLS, setShowTLS] = useState(false);

  const toggleAuth = () => {
    setShowAuth(!showAuth);
  };

  const toggleSSL = () => {
    setShowSSL(!showSSL);
  };
  const toggleTLS = () => {
    setShowTLS(!showTLS);
  };

  const validateSMTP = () => {
    if (!loginId.trim()) {
      Alert.alert("Invalid Input", "Please enter a valid login ID.");
      return false;
    }
    if (!password.trim()) {
      Alert.alert("Invalid Input", "Please enter a valid password.");
      return false;
    }
    if (!emailAddress.trim() || !validateEmail(emailAddress)) {
      Alert.alert("Invalid Input", "Please enter a valid email address.");
      return false;
    }
    if (!host.trim()) {
      Alert.alert("Invalid Input", "Please enter a valid host.");
      return false;
    }
    if (!port.toString().trim()) {
      Alert.alert("Invalid Input", "Please enter a valid port number.");
      return false;
    }
    return true;
  };

  const validateEmail = (email) => {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    Database.fetchAuthSettings((authSettings) => {
      if (authSettings) {
        if (authSettings.none) {
          setSelectedValue("None");
        } else if (authSettings.smtp) {
          setSelectedValue("Via SMTP");
        } else {
          setSelectedValue("Via Gmail API");
        }
      } else {
        console.log(
          getCurrentTime("ERROR") + "AuthSettings not found or error occurred."
        );
      }
    });

    Database.fetchLatestUser()
      .then((e) => {
        if (e) {
          setLoginId(e.loginId);
          setPassword(e.password);
          setEmailAddress(e.emailAddress);
          setHost(e.host);
          setPort(e.port);
          setShowAuth(e.showAuth);
          setShowSSL(e.showSSL);
          setShowTLS(e.showTLS);
        } else {
          console.log(getCurrentTime("INFO") + "User data not found for ID 1.");
        }
      })
      .catch((error) => {
        console.log(
          getCurrentTime("ERROR") + "Error fetching user data:",
          error
        );
      });

    GoogleSignin.getCurrentUser()
      .then((res) => {
        if (res && res.user) {
          setEmail(res.user.email);
        } else {
          console.log(
            getCurrentTime("INFO") + "No user is currently signed in."
          );
        }
      })
      .catch((error) => {
        showMessage({
          message: "Error",
          description: `Error getting current user: ${error?.message}`,
          type: "danger",
        });
        console.error(
          getCurrentTime("ERROR") + "Error getting current user: ",
          error
        );
      });
  }, []);

  const sendEmail = () => {
    if (!validateSMTP()) {
      return;
    }

    // For gmail verification

    // RNSmtpMailer.sendMail({
    //     mailhost: "smtp.gmail.com",
    //     port: "465",
    //     ssl: true,
    //     username: "seenivasan.a@testsigma.com",
    //     password: "mphoyuwlvrekqjwd",
    //     replyTo: "seenivasan.a@testsigma.com",
    //     recipients: "as17112001@gmail.com",
    //     subject: "subject",
    //     htmlBody: "<h1>header</h1><p>body</p>"
    //   })

    RNSmtpMailer.sendMail({
      mailhost: host,
      port: port?.toString(),
      ssl: !!showSSL,
      username: loginId,
      password: password,
      replyTo: "no_reply@testsigma.com",
      recipients: loginId,
      subject: "[SMTP Test] Email Delivery Verification from Testsigma App",
      htmlBody: `
          <div style="font-family: Arial, sans-serif; color: #333;">
              <h2 style="color: #007BFF;">SMTP Configuration Test</h2>
              <p>Dear User,</p>
              <p>This is a test email to verify the SMTP configuration from the <strong>Testsigma</strong> app.</p>
              <p>If you received this email, it confirms that your SMTP settings are correctly configured and working as expected.</p>
              <hr style="border: none; border-top: 1px solid #ddd;">
              <p style="color: #666;">If you did not initiate this test or need assistance, please contact <a href="mailto:support@testsigma.com">support@testsigma.com</a>.</p>
              <p>Best Regards,<br><strong>Testsigma Team</strong></p>
          </div>
      `,
    })
      .then((success) => {
        showMessage({
          message: "Success",
          description: "Test email sent successfully",
          type: "success",
        });
        console.log(
          getCurrentTime("INFO") + "Test email sent successfully:",
          success
        );
      })
      .catch((error) => {
        showMessage({
          message: "Error",
          description: `Error sending test email: ${error?.message}`,
          type: "danger",
        });
        console.log(
          getCurrentTime("ERROR") + "Error sending test email:",
          error
        );
      });
  };

  const onChangeRadio = (value) => {
    setSelectedValue(value);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  };

  const renderGmailAPIAccordionContent = (type) => {
    return (
      <Animated.View
        style={[
          styles.accordionContent,
          {
            height: slideAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 330],
            }),
            opacity: slideAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }),
          },
        ]}
      >
        <View style={{}}>
          {/* Title with an Icon */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <FontAwesome5
              name="envelope"
              size={20}
              color="#007BFF"
              style={{ marginRight: 8 }}
            />
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333" }}>
              Gmail Authentication Required
            </Text>
          </View>

          {/* Description */}
          <Text style={{ fontSize: 14, color: "#555", lineHeight: 20 }}>
            To send emails via Gmail, authentication is required. Once
            authenticated, a test email will be sent to the selected account.
          </Text>

          {/* Important Notes Section */}
          <View
            style={{
              marginTop: 12,
              padding: 10,
              backgroundColor: "#F0F8FF",
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                color: "#007BFF",
                marginBottom: 5,
              }}
            >
              <FontAwesome5 name="info-circle" size={14} color="#007BFF" />{" "}
              Important Notes:
            </Text>
            <Text style={{ fontSize: 14, color: "#444" }}>
              • Ensure the Gmail feature is enabled for your account.
            </Text>
            <Text style={{ fontSize: 14, color: "#444" }}>
              • Google accounts with a secondary email (e.g.,
              frzinapps@naver.com) may not support sending emails.
            </Text>
          </View>

          {/* Display User Email */}
          {userInfo?.user?.email && (
            <Text
              style={{
                marginTop: 15,
                fontSize: 14,
                fontWeight: "600",
                color: "#333",
                textAlign: "center",
              }}
            >
              {userInfo?.user?.email}
            </Text>
          )}

          {/* Signup Button */}
          <View style={{ marginTop: 15 }}>
            <GoogleSignupButton onSignup={handleGoogleSignup} />
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderSMTPAccordionContent = () => {
    return (
      <Animated.View
        style={[
          styles.accordionContent,
          {
            height: slideAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 550],
            }),
            opacity: slideAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }),
          },
        ]}
      >
        <>
          <TextInput
            style={styles.input}
            placeholder="Login ID"
            onChangeText={setLoginId}
            value={loginId}
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input1}
              placeholder="Password"
              secureTextEntry={!passwordVisible}
              onChangeText={setPassword}
              value={password}
            />
            <Icon
              name={passwordVisible ? "eye-slash" : "eye"}
              size={20}
              onPress={togglePasswordVisibility}
              style={styles.passwordIcon}
            />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            onChangeText={setEmailAddress}
            value={emailAddress}
          />
          <TextInput
            style={styles.input}
            placeholder="Host"
            onChangeText={setHost}
            value={host}
          />
          <TextInput
            style={styles.input}
            placeholder="Port"
            onChangeText={setPort}
            value={port.toString()}
            keyboardType="numeric"
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingLeft: 10,
            }}
          >
            <Text style={{ fontSize: 16 }}>Use authentication</Text>
            <TouchableOpacity
              style={styles.optionContainer}
              onPress={toggleAuth}
            >
              <View
                style={[
                  styles.toggleButton,
                  showAuth && styles.toggleButtonActive,
                ]}
              >
                <View
                  style={[
                    styles.toggleKnob,
                    showAuth && styles.toggleKnobActive,
                  ]}
                />
              </View>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingLeft: 10,
            }}
          >
            <Text style={{ fontSize: 16 }}>Use SSL</Text>
            <TouchableOpacity
              style={styles.optionContainer}
              onPress={toggleSSL}
            >
              <View
                style={[
                  styles.toggleButton,
                  showSSL && styles.toggleButtonActive,
                ]}
              >
                <View
                  style={[
                    styles.toggleKnob,
                    showSSL && styles.toggleKnobActive,
                  ]}
                />
              </View>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingLeft: 10,
            }}
          >
            <Text style={{ fontSize: 16 }}>Use TLS/StartTLS</Text>
            <TouchableOpacity
              style={styles.optionContainer}
              onPress={toggleTLS}
            >
              <View
                style={[
                  styles.toggleButton,
                  showTLS && styles.toggleButtonActive,
                ]}
              >
                <View
                  style={[
                    styles.toggleKnob,
                    showTLS && styles.toggleKnobActive,
                  ]}
                />
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: "#03A973",
              padding: 10,
              paddingHorizontal: 20,
              borderRadius: 10,
              alignItems: "center",
              alignSelf: "center",
              flexDirection: "row",
            }}
            onPress={sendEmail}
          >
            <Icon name="envelope" size={18} color="white" />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: "white",
                paddingLeft: 5,
              }}
            >
              Send Test Mail
            </Text>
          </TouchableOpacity>
        </>
      </Animated.View>
    );
  };

  const handleSave = () => {
    if (selectedValue === "Via SMTP") {
      if (!validateSMTP()) return;

      Database.insertUser(
        loginId,
        password,
        emailAddress,
        host,
        port,
        showAuth,
        showSSL,
        showTLS
      ).then((r) =>
        console.log(
          getCurrentTime("INFO") + "User inserted successfully for SMTP",
          r
        )
      );
      Database.insertAuthSettings(0, 1, 0);
      navigation.goBack();
    }
    if (selectedValue === "Via Gmail API") {
      console.log(
        getCurrentTime("INFO") + "serverAuthCode::",
        userInfo.serverAuthCode
      );
      Database.insertAuthCode(userInfo.serverAuthCode);
      Database.insertGmail(userInfo?.user?.email);
      Database.insertAuthSettings(0, 0, 1);
      navigation.goBack();
    }
    if (selectedValue === "None") {
      Database.insertAuthSettings(1, 0, 0);
      navigation.goBack();
    }

    showMessage({
      message: "Settings Saved",
      description: "Your settings have been saved successfully.",
      type: "success",
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <View style={styles.header}>
            <Text style={styles.title}>Mail Settings</Text>

            {/* Save Settings Button */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Icon name="save" size={18} color="white" />
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            <RadioButton.Group
              onValueChange={onChangeRadio}
              value={selectedValue}
            >
              <View style={styles.radioButtonContainer}>
                <RadioButton.Item value="None" label="None" />
                <RadioButton.Item value="Via Gmail API" label="Via Gmail API" />
                {selectedValue === "Via Gmail API" &&
                  renderGmailAPIAccordionContent()}
                <RadioButton.Item value="Via SMTP" label="Via SMTP" />
                {selectedValue === "Via SMTP" && renderSMTPAccordionContent()}
              </View>
            </RadioButton.Group>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  header: {
    margin: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  scrollViewContainer: {
    paddingHorizontal: 20,
    paddingBottom: deviceHeight * 0.1,
  },
  radioButtonContainer: {
    marginBottom: 20,
  },
  accordionContent: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 1,
  },
  accordionText: {
    color: "#666",
    fontSize: 14,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#03A973",
    padding: 8,
    paddingRight: 0,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    paddingHorizontal: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
  },
  input1: {
    flex: 1,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    paddingVertical: 5,
    marginBottom: 10,
  },
  toggleButton: {
    width: 40,
    height: 22,
    borderRadius: 12,
    backgroundColor: "#D1D1D1",
    justifyContent: "center",
    alignItems: "center",
    padding: 3,
    transition: "all 0.3s ease",
  },
  toggleButtonActive: {
    backgroundColor: "#03A973",
  },
  toggleKnob: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
    transition: "all 0.3s ease",
    alignSelf: "flex-start",
  },
  toggleKnobActive: {
    alignSelf: "flex-end",
    backgroundColor: "#fff",
  },
});

export default Setting;
