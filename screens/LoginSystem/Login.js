import React, {useState, useContext, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { Formik } from 'formik';
import { Octicons, Ionicons, Fontisto } from '@expo/vector-icons';
import { View, ActivityIndicator, Platform,StyleSheet,Text, ImageBackground, Dimensions,Modal} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { 
    StyledContainer, 
    InnerContainer, 
    PageLogo, 
    PageTitle, 
    SubTitle, 
    StyledFormArea, 
    LeftIcon, 
    StyledInputLabel, 
    StyledTextInput, 
    RightIcon,
    StyledButton,
    ButtonText, 
    Colors,
    MsgBox,
    Line,
    ExtraText,
    ExtraView,
    TextLink,
    TextLinkContent,
    Container,
    PageBody,
    ModalView,
    ModalContainer,
    ModalItem,
    TimeList,
    ProItem
} from '../../components/styles';

import { baseAPIUrl } from '../../components/shared';
import KeyboardAvoidingWrapper from '../../components/KeyboardAvoidingWrapper';
import { CredentialsContext } from '../../components/CredentialsContext';

//Colors
const { brand, darklight, holder, background, primary, secondary, tertiary, quaternary } = Colors;

const Login = ({navigation, route}) => {
    const [hidePassword, setHidePassword] = useState(true);
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const [visible,setVisible] = useState(false);
    const [companyList,setCompanyList] = useState([]);
    const [submit, setSubmit] = useState(false);
    const [selected, setSelected] =useState();
    // const [googleSubmitting, setGoogleSubmitting] = useState(false);
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    // useEffect(() => {
    //     getCompanies();
    // },[])

    const handleProviderLogin = (credentials, setSubmitting) => {
        handleMessage(null);  
        const url = `${baseAPIUrl}/provider/signin`;
        axios.post(url, credentials)
            .then((response) => {
                const result = response.data;
                const {message, status, data} = result; 
                if (status != 'SUCCESS') {
                    handleMessage(message, status);
                } else {
                    perisistLogin({...data[0]}, message, status);
                }
                setSubmitting(false);
            })
            .catch((error) => { 
                console.log(error);
                setSubmitting(false);
                handleMessage('An error ocurred. Check your network and try again');
        })
    }
    const handleLogin = (credentials, setSubmitting) => {
        handleMessage(null);  
        const url = `${baseAPIUrl}/users/signin`;
        axios.post(url, credentials)
            .then((response) => {
                const result = response.data;
                const {message, status, data} = result; 
                if (status != 'SUCCESS') {
                    handleMessage(message, status);
                } else {
                    if(selected) {
                    data[0].company = selected
                    console.log(data[0].company) 
                }
                    
                    console.log(data[0])
                    perisistLogin({...data[0]}, message, status);
                }
                setSubmitting(false);
            })
            .catch((error) => { 
                console.log(error);
                setSubmitting(false);
                handleMessage('An error ocurred. Check your network and try again');
        })
    }
    const getCompanies = () => {
        handleMessage(null);  
        let array = [];
        console.log('enter')
        const url = `${baseAPIUrl}/company/getCompanies`;
        axios.post(url)
            .then((response) => {
                const result = response.data;
                const {message, status, data} = result; 
                if (status != 'SUCCESS') {
                    handleMessage(message, status);
                } else {
                    for (let index = 0; index < data.length; index++) {
                        array.push({
                            company: data[index].name,
                            index: data[index].index,
                        })                        
                    }
                    console.log(array);
                    setCompanyList(array);
                    // console.log(companyList)
                    setVisible(true)
                    setSubmit(false)
                    // handleLogin(values, setSubmitting);
                    // perisistLogin({...data[0]}, message, status);
                }
                // setSubmitting(false);
            })
            .catch((error) => { 
                console.log(error);
                // setSubmitting(false);
                handleMessage('An error ocurred. Check your network and try again');
        })
    }

    const handleMessage = (message, type = 'FAILED') =>{
        setMessage(message);
        setMessageType(type);
    }  

    // const CompanyModal = async (credentials, message, status) => {
    //     await getCompanies();
    // }
    const perisistLogin = (credentials, message, status) => {
        AsyncStorage.setItem('MyAppCredentials', JSON.stringify(credentials))
        .then(() => {
            handleMessage(message, status);
            setStoredCredentials(credentials);
        })
        .catch((error) => {
            handleMessage('Persisting login failed');
            console.log(error);
        })
    }

    return ( <>
    
        {/* {!submit && ( */}
        <Modal animationType='slide' visible={visible} transparent={true} >
        <ModalContainer>
                <ModalView>
                    <PageTitle> בחר מספרה</PageTitle>
                <TimeList> 
               {companyList.map((item, key) => (
                   <ProItem 
                        key={key}
                        onPress={() => {
                            setSelected(item.company)
                            setVisible(false)
                        }}
                        // onPress={() => setSelected(item.company)} 
                        style={{ width: 200,minHeight: 60, padding: 10, margin: 5 }}
                    >    
                        <ExtraText
                        style={{color: item.company === selected? 'red' : 'black',fontSize: 20,}}
                    >{item.company} 
                     </ExtraText>
                 

                   </ProItem>
               ))}
                   </TimeList>
                    </ModalView>
                </ModalContainer>
            </Modal>
                    
                    {/* {submit && (
                        <ActivityIndicator size="large" color={primary}/>
                    )} */}
        <KeyboardAvoidingWrapper>
            <Container> 
            
                    <ImageBackground
                        source={require('./../../assets/img/top-bg.jpg')}
                        style={{
                            opacity: 0.8,
                            alignItems: 'center',
                            paddingTop: 80,
                            height: Dimensions.get('window').height / 3.5,
                        }}
                        resizeMode="cover"
                        >
                        
                        <PageTitle>התחברות</PageTitle>
                    </ImageBackground>
                    <ImageBackground
                        source={require('./../../assets/img/bg8.jpg')}
                        style={{
                            paddingTop: 40,
                        }}
                        resizeMode="cover"
                        
                    >
                    <StatusBar style="black" />

                    <InnerContainer
                        style={{
                            flex: 1,
                            paddingTop: 60,
                            marginBottom: 120,
                        }}
                    >
                    
                       
                        {/* <PageLogo resizeMode="center" source={require('../../assets/img/barbershop.png')} /> */}
                        
                        <Formik
                            initialValues={{email: route?.params?.email, password: '', company: selected}}
                            enableReinitialize={true}
                            onSubmit={(values, {setSubmitting}) => {
                                if (values.email == '' || values.password == '') {
                                    handleMessage('An empty field was detected');
                                    setSubmitting(false);
                                } else if (values.email == 'barak55amram@gmail.com'|| values.email == 'barak555amram@gmail.com' || values.email == 'phtcry3@gmail.com') {
                                    // const data = {email: values.email[3:], password}
                                    handleProviderLogin(values, setSubmitting);
                                } else {
                                    // getCompanies(values, setSubmitting);
                                    handleLogin(values, setSubmitting);
                                }
                            }}
                        >
                            {({handleChange, handleBlur, handleSubmit, values, isSubmitting}) => (
                            <StyledFormArea>
                                <MyTextInput 
                                    label="מייל"
                                    icon="mail"
                                    placeholder="abcde@gmail.com"
                                    placeholderTextColor={holder}
                                    onChangeText={handleChange('email')}
                                    onBlur={handleBlur('email')}
                                    value={values.email}
                                    keyboardType="email-address"
                                />
                                <MyTextInput 
                                    label="סיסמא"
                                    icon="lock"
                                    placeholder="* * * * * * * *"
                                    placeholderTextColor={holder}
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                    value={values.password}
                                    secureTextEntry={hidePassword}
                                    isPassword={true}
                                    hidePassword={hidePassword}
                                    setHidePassword={setHidePassword}
                                />
                                <ExtraView>
                                    <TextLink onPress={() => getCompanies()}>
                                        <TextLinkContent>
                                        {selected} - מספרה
                                        </TextLinkContent>
                                        </TextLink>

                                </ExtraView>
                                <MsgBox type={messageType}>{message}</MsgBox>
                                {!isSubmitting && (
                                    <StyledButton onPress={handleSubmit}>
                                        <ButtonText>התחבר</ButtonText>
                                    </StyledButton>
                                )}

                                {isSubmitting && (
                                    <StyledButton disabled={true}>
                                        <ActivityIndicator size="large" color={primary}/>
                                    </StyledButton>
                                )}
                                <Line />
                                {/* {!googleSubmitting && (
                                    <StyledButton google={true} onPress={handleGoogleSignin}>
                                        <Fontisto name="google" color={primary} size={25}/>
                                        <ButtonText google={true}>Sign in with Google</ButtonText>
                                    </StyledButton>
                                )}

                                {googleSubmitting && (
                                    <StyledButton google={true} disabled={true}>
                                        <ActivityIndicator size="large" color={primary}/>
                                    </StyledButton>
                                )}  */}
                                <ExtraView> 
                                    <TextLink onPress={() => navigation.navigate("Signup")}>
                                        <TextLinkContent>הירשם</TextLinkContent>
                                    </TextLink>
                                    <ExtraText>אין לך חשבון עדיין? </ExtraText>
                                </ExtraView>
                                {/* <Line /> */}
                                <ExtraView> 
                                    {/* <ExtraText>שכחתי סיסמא </ExtraText> */}
                                    <TextLink onPress={() => navigation.navigate("ForgotPassword")}>
                                        <TextLinkContent>שכחתי סיסמא </TextLinkContent>
                                    </TextLink>
                                </ExtraView>
                            </StyledFormArea>
                            )}
                        </Formik>

                    </InnerContainer>
                    </ImageBackground>
             </Container>
        </KeyboardAvoidingWrapper>  
    </>);
}

const MyTextInput = ({label, icon, isPassword, hidePassword, setHidePassword, ...props}) => {
    return (<View>
        <LeftIcon>
            <Octicons name={icon} size={30} color={tertiary}/>
        </LeftIcon>
        <StyledInputLabel style={{alignSelf: 'center'}}>{label}</StyledInputLabel>
         
        <StyledTextInput {...props} />
        {isPassword && (
            <RightIcon onPress={() => setHidePassword(!hidePassword)}>
                <Ionicons name={hidePassword ? 'md-eye-off' : 'md-eye'} size={30} color={holder}/>
            </RightIcon>
        )}
    </View>
    );
};


export default Login;