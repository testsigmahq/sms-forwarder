package com.smsforwarder;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.uimanager.IllegalViewOperationException;
import android.telephony.SmsManager;
import com.facebook.react.bridge.ReadableArray;

public class DirectSmsModule extends ReactContextBaseJavaModule {

    public DirectSmsModule(ReactApplicationContext reactContext) {
        super(reactContext); //required by React Native
    }

    @Override
    //getName is required to define the name of the module represented in JavaScript
    public String getName() {
        return "DirectSms";
    }

    @ReactMethod
    public void sendDirectSms(ReadableArray phoneNumbers, String msg) {
        try {
            SmsManager smsManager = SmsManager.getDefault();

            for (int i = 0; i < phoneNumbers.size(); i++) {
                String phoneNumber = phoneNumbers.getString(i);
                smsManager.sendTextMessage(phoneNumber, null, msg, null, null);
            }
        } catch (Exception ex) {
            System.out.println("Couldn't send message.");
        }
    }

}