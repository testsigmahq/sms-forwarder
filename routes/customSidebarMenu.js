import React from 'react';
import {SafeAreaView, View, StyleSheet, Image, Text} from 'react-native';

import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import {GoogleSignin} from "@react-native-google-signin/google-signin";
import {useRoute} from "@react-navigation/native";


const handleGoogleSignout = async () => {
  try {
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
  } catch (error) {
    // console.log('Google sign-out error:', error);
  }
};
const CustomSidebarMenu = props => {
  const route = useRoute();
  let userDetails = route.params?.user;
  // console.log("userdetails ==>", userDetails)
  return (
    <SafeAreaView style={{flex: 1}}>
      {/*<View style={{alignSelf:"center", marginVertical:20}}>*/}
      {/*  <Image*/}
      {/*      source={{ uri: userDetails?.user?.photo }}*/}
      {/*      style={{ width: 100, height: 100, borderRadius:50 }}*/}
      {/*  />*/}
      {/*</View>*/}

      {/*<View style={{alignSelf:"center", marginVertical:10}}>*/}
      {/*  <Text style={{fontWeight:"500"}}>{userDetails.user.givenName} {userDetails.user.familyName}</Text>*/}
      {/*</View>*/}

      {/*<View style={{borderTopWidth:1, marginVertical:10, borderColor:"grey"}}></View>*/}

      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        {/*<DrawerItem*/}
        {/*  label="Logout"*/}
        {/*  labelStyle={styles.logout}*/}
        {/*  icon={({focused, color, size}) => {*/}
        {/*    return (*/}
        {/*      <Image*/}
        {/*        source={require('../assets/logout.png')}*/}
        {/*        style={[*/}
        {/*          {*/}
        {/*            height: 13,*/}
        {/*            width: 18,*/}
        {/*            alignSelf: 'center',*/}
        {/*            resizeMode: 'contain',*/}
        {/*          },*/}
        {/*        ]}*/}
        {/*      />*/}
        {/*    );*/}
        {/*  }}*/}
        {/*  onPress={() => {*/}
        {/*    handleGoogleSignout().then(r => console.log("log-out successfully!!"));*/}
        {/*    props.navigation.navigate('Home')*/}

        {/*  }}*/}
        {/*  testId={"log-out"}*/}
        {/*  name={"log-out"}*/}
        {/*/>*/}
      </DrawerContentScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  profileNameContainer: {
    top: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    height: 42,
    fontFamily: 'Lato',
    fontStyle: 'normal',
    // fontWeight: '700',
    fontSize: 16,
    lineHeight: 22,
    color: '#000000',
  },
  iconStyle: {
    width: 15,
    height: 15,
    marginHorizontal: 5,
  },
  logout: {
    color: '#000000',
    fontFamily: 'Lato',
    // fontWeight: '400',
    fontSize: 14,
    lineHeight: 22,
  },
});

export default CustomSidebarMenu;
