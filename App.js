import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Provider } from 'react-redux';
import store from './redux/store';
import Database from './database';
import HomeStack from './routes/homeStack';
import BackgroundService from 'react-native-background-actions';

const Stack = createStackNavigator();

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

const veryIntensiveTask = async (taskDataArguments) => {
    const { delay } = taskDataArguments;
    await new Promise(async (resolve) => {
        for (let i = 0; BackgroundService.isRunning(); i++) {
            console.log(i);
            await sleep(delay);
        }
    });
};

const options = {
    taskName: 'Example',
    taskTitle: 'ExampleTask title',
    taskDesc: 'ExampleTask description',
    taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
    },
    color: '#ff00ff',
    linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
    parameters: {
        delay: 1000,
    },
};

export default function App() {
    useEffect(() => {
        const configureGoogleSignin = async () => {
            GoogleSignin.configure({
                androidClientId: '473722209735-7tcidkd4hji670ckn20g9r6eu2dlivit.apps.googleusercontent.com',
                webClientId: '473722209735-7tcidkd4hji670ckn20g9r6eu2dlivit.apps.googleusercontent.com',
                scopes: ['email', 'profile', 'https://www.googleapis.com/auth/gmail.send'],
                include_granted_scopes: true,
                response_type: 'code',
                access_type: 'offline',
                offlineAccess: true,
            });
        };

        configureGoogleSignin();
    }, []);

    useEffect(() => {
        // Database initialization and other setup code
        Database.initDB();
        Database.createFilterTable();
        Database.createEmailTable();
        Database.createPhoneNumberTable()
        Database.createUrlTable();
        Database.createSenderNumberTable();
        Database.createTextTable();
        Database.createChangeContentTable();
        Database.createResultTable();
        Database.createSettings();
        Database.createUsersTable();
        Database.createAuthCodesTable();
    }, []);

    useEffect(() => {
        const startBackgroundTask = async () => {
            try {
                // Start the background service with the intensive task
                await BackgroundService.start(veryIntensiveTask, options);
                console.log('Background task started.');
            } catch (error) {
                console.error('Error starting background task:', error);
            }
        };

        const updateBackgroundNotification = async () => {
            try {
                // Update the background task notification with a new description
                await BackgroundService.updateNotification({ taskDesc: 'New ExampleTask description' });
                console.log('Background notification updated.');
            } catch (error) {
                console.error('Error updating background notification:', error);
            }
        };

        const stopBackgroundTask = async () => {
            try {
                // Stop the background task
                await BackgroundService.stop();
                console.log('Background task stopped.');
            } catch (error) {
                console.error('Error stopping background task:', error);
            }
        };

        // Start the background task and update the notification
        startBackgroundTask();
        updateBackgroundNotification();


    }, []);

    return (
        <View style={styles.container}>
            <Provider store={store}>
                <HomeStack />
            </Provider>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
