import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import * as SMS from 'expo-sms';

// You can import from local files
import SmsExample from '../../components/SmsExample';

// or any pure javascript modules available in npm
import { Card, Button, Paragraph } from 'react-native-paper';
import SendSMS from 'react-native-sms';
 
//some stuff
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CredentialsContext } from './../../components/CredentialsContext';


   
const ss = () => {
    SendSMS.send({
        body: 'The default body of the SMS!',
        recipients: ['0527388832', '0542457171'],
        successTypes: ['sent', 'queued'],
        allowAndroidSendWithoutReadPermission: true
    }, (completed, cancelled, error) => {
 
        console.log('SMS Callback: completed: ' + completed + ' cancelled: ' + cancelled + 'error: ' + error);
 
    });
}


export default function Sms0() {
  const [smsAvailable, setSmsAvailable] = React.useState(false);
  const {storedCredentials, setStoredCredentials} = React.useContext(CredentialsContext);
  const {name, email,phone, avatar} = storedCredentials;
  const onComposeSms = React.useCallback(async () => {
    if (smsAvailable) {
      console.log('going for it!');
      await SMS.sendSMSAsync(
          // ['0527388832', '0542457171'],
          '0542457171',
          'My sample HelloWorld message',
          
        
      )


    //   const result = await SendSMS.send({
      //     body: 'My sample HelloWorld message',
    //     // recipients: `0${phone}`,
    //     recipients: '0542457171',
    //     successTypes: ['sent', 'queued'],

    //     allowAndroidSendWithoutReadPermission: true

    //     // '0527388832',
       

    //   }, (completed, cancelled, error) => {
 
    //     console.log('SMS Callback: completed: ' + completed + ' cancelled: ' + cancelled + 'error: ' + error);
 
    // });



    console.log(result);
      }
    }, [smsAvailable]);
    
    // React.useEffect(() => {
    //   SMS.isAvailableAsync().then(setSmsAvailable);
    // }, []);
    
    return (
      <View style={styles.container}>
      <View>
        {smsAvailable
          ? <Paragraph>Press the button below to compose a SMS</Paragraph>
          : <Paragraph>Unfortunately, SMS is not available on this device</Paragraph>
        }
      </View>
      <Button onPress={onComposeSms} disabled={!smsAvailable} mode="contained" icon="message">
        Send sms
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 36,
  },
});

// export default Sms;