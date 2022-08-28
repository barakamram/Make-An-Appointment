import React, {useState, useContext, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { Octicons, Ionicons, Fontisto } from '@expo/vector-icons';
import { ImageBackground, Image} from 'react-native';
import { 
    InnerContainer, 
    PageTitle, 
    SubTitle, 
    StyledFormArea, 
    StyledButton,
    ButtonText,
    Line,
    WelcomeContainer,
    WelcomeImage, 
    Avatar,
    Container,
    RightIcon,
    Burger,
    ExtraView,
    TextLink,
    TextLinkContent
} from '../../components/styles';
import KeyboardAvoidingWrapper from '../../components/KeyboardAvoidingWrapper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CredentialsContext } from '../../components/CredentialsContext';

// import * as GoogleSignIn from 'expo-google-sign-in';
const Setting = ({navigation}) => {
    
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    const { name, email,phone, avatar} = storedCredentials;
    const AvatarImg = avatar ? {uri: avatar} : require('../../assets/img/barbershop2.png');
    const [tab, setTab] = useState(false);

    // useEffect(() => {
    //     if (view == 'burger') 
    //     setTab(false)
    //     else 
    //     setTab(true)
    // }, [])
    /* for google sign in
}, [])

    name = name ? name : displayName;

    const clearLogin = async () => {
        try {
            if (!__DEV__) {
                await GoogleSignIn.signOutAsync();
                await AsyncStorage.removeItem('MyAppCredentials')
            } else {
                await AsyncStorage.removeItem('MyAppCredentials')
            }
            setStoredCredentials("");
        } catch ({message}) {
            alert("Logout Error: "+ message);
        }
    };
    */

    const clearLogin = () => {
        AsyncStorage.removeItem('MyAppCredentials')
        .then(() => {
            setStoredCredentials("");
            navigation.navigate("Login");
        })
        .catch((error) => console.log(error));
    };
    
    // const changeView = () => {
    //     if(tab){
    //         setTab(false)
    //         setStoredCredentials({ name, email, phone, avatar, view: 'burger'}) 
    //     } else {
    //         setTab(true)
    //         setStoredCredentials({ name, email, phone, avatar, view: 'tab'})
    //     }
    // }

    return (
        <KeyboardAvoidingWrapper>
        <Container>
            <ImageBackground
                source={require('./../../assets/img/bg15.jpg')}
                style={{
                    paddingTop: 90,
                    paddingVertical: '100%',
                    // bottom: 150
                }}
                resizeMode="cover"
            >
            <StatusBar style="black"/>
                <Burger style={{top: 40 }} title="Open drawer" onPress={() => navigation.openDrawer()} >
                <Octicons name={'three-bars'} size={35} color={'#000000'}/>
            </Burger>
            
            <InnerContainer>
                {/* <WelcomeImage resizeMode="cover" source={require('../../assets/img/bgchair.jpg')}/> */}
                <WelcomeContainer>
                <Avatar style={{width: 80, height: 80}} source={AvatarImg} />   
                    <PageTitle>שלום {name}</PageTitle>
                    <StyledFormArea>
                        <ExtraView>
                            <TextLink onPress={() => navigation.navigate("שנה פרטים")}> 
                                <TextLinkContent style={{color: '#000'}}>שנה פרטים</TextLinkContent>
                            </TextLink>
                        </ExtraView>
                        {/* <ExtraView>
                            <TextLink onPress={changeView}> 
                                <TextLinkContent style={{color: '#000'}}>שנה תצוגה {view}</TextLinkContent>
                            </TextLink>
                        </ExtraView>
                        <ExtraView>
                            <TextLink onPress={() => navigation.navigate("ChangeDetails")}> 
                                <TextLinkContent style={{color: '#000'}}>מצב לילה\dark mode</TextLinkContent>
                            </TextLink>
                        </ExtraView> */}
                    </StyledFormArea>
                </WelcomeContainer>
            </InnerContainer>
            </ImageBackground>
        </Container>
        </KeyboardAvoidingWrapper>

    );
}



export default Setting;