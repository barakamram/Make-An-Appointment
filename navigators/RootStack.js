import React, {useContext} from 'react';

// React navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// screens
// import Roots from './Roots';
import RootTab from './RootTab';
// import RootProviderTab from './RootProviderTab';
import BurgerMenu from './BurgerMenu';
import Login from './../screens/LoginSystem/Login';
import Signup from './../screens/LoginSystem/Signup';
import Verification from './../screens/LoginSystem/OtpVerification';
import ForgotPassword from './../screens/LoginSystem/ForgotPassword';
import ChangeDetails from './../screens/Customer/ChangeDetails';

import { CredentialsContext } from './../components/CredentialsContext';
import { Colors } from '../components/styles';
const {primary, tertiary} = Colors;
const Stack = createNativeStackNavigator();

const RootStack = () => {
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    // if (storedCredentials)
    // const {name, email,phone, avatar, company} = storedCredentials;
    // console.log(view)
    return (
        <CredentialsContext.Consumer>
            {({storedCredentials}) => (
                <NavigationContainer>
                    <Stack.Navigator
                        screenOptions={{
                            headerStyled: {
                                backgroundColor: 'transparent'
                            },
                            headerTintColor:  tertiary,
                            headerTransparent: true,
                            headerTitle: '',
                            headerLeftContainerStyle: {
                                paddingLeft: 20,
                            },
                        }}
                        initialRouteName="Login"
                    >
                    {storedCredentials ? (
                        <Stack.Screen options={{ headerTintColor: primary}} name="BurgerMenu" component={BurgerMenu}/>
                    ) : (
                        <> 
                            <Stack.Screen name="Login" component={Login}/>
                            <Stack.Screen name="Signup" component={Signup}/>   
                            <Stack.Screen name="Verification" component={Verification}/>
                            <Stack.Screen name="ForgotPassword" component={ForgotPassword}/>
                            {/* <Stack.Screen name="ChangeDetails" component={ChangeDetails}/> */}
                            {/* <Stack.Screen name="RootTab" component={RootTab}/> */}
                            <Stack.Screen name="BurgerMenu" component={BurgerMenu}/>
                            {/* <Stack.Screen name="Sms" component={Sms}/> */}
                        </>
                    )}        
                    </Stack.Navigator>
                </NavigationContainer>
            )}
        </CredentialsContext.Consumer>
        
    )
}

export default RootStack;