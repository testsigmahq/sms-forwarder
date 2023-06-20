# sms-forwarder
It is a react-native app for SMS to email forward.


BUILD node modules :
npm install

RUN in IOS :
1. On first time OR after modifying packages do run the command -  'pod install'
2. npx react-native run-ios


RUN in Android :
1. npx react-native run-android


Build .ipa :
1. Open ios/SimplyTravel.xcworkspace in xcode
2. Select Signature. You will need an apple developement certificate.
3. Archive.
4. Distribute.
5. Export.


Build .apk :

1. Go to project directory and run this command in terminal
   react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res

2. Go to android directory
   cd android/

3.  In android path run this command
    ./gradlew assembleDebug

4. Step 5: Go to this folder and check the apk file
   android-> app/build/outputs/apk/debug/app-debug.apk
