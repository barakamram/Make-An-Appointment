import 'react-native-gesture-handler';
import React, { useState } from 'react';

import { I18nManager } from 'react-native';

// React navigation stack
import RootStack from './navigators/RootStack';

// apploading
import AppLoading from 'expo-app-loading';

// async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

// credentials context
import { CredentialsContext } from './components/CredentialsContext';

I18nManager.allowRTL(false); 

export default function App() {

    const [appReady, setAppReady] = useState(false);
    const [storedCredentials, setStoredCredentials] = useState("");

    const checkLoginCredentials = () => {
        AsyncStorage.getItem('MyAppCredentials')
        .then((result) => {
            if (result !== null) {
            setStoredCredentials(JSON.parse(result));
            } else {
            setStoredCredentials(null);
            }
        })
        .catch((error) => console.log(error));
    };

    if (!appReady) {
        return <AppLoading startAsync={checkLoginCredentials} onFinish={() => setAppReady(true)} onError={console.warn} />;
    }

	return (
        <CredentialsContext.Provider value={{ storedCredentials, setStoredCredentials }}>
            <RootStack />
        </CredentialsContext.Provider>
      );
}



