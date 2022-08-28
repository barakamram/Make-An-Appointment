import React, {useState, useContext} from 'react';
import { StatusBar } from 'expo-status-bar';

//formik
import { Formik } from 'formik';

//icons
import { Octicons, Ionicons, Fontisto } from '@expo/vector-icons';

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
    ModalContainer,
    ModalItem,
    ModalView,
    TimeList,
    ProItem,
} from '../../components/styles';

import {View, TouchableOpacity,StyleSheet,Modal, ActivityIndicator,ImageBackground,Text, Dimensions} from 'react-native';

import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { CredentialsContext } from '../../components/CredentialsContext';

import { baseAPIUrl } from '../../components/shared';
//Colors
const { brand, darklight, background, holder, primary } = Colors;

import DateTimePicker from '@react-native-community/datetimepicker';

import KeyboardAvoidingWrapper from '../../components/KeyboardAvoidingWrapper';
import CheckBox from 'expo-checkbox';

const Signup = ({navigation}) => {
    const [hidePassword, setHidePassword] = useState(true);
    // const [show, setShow] = useState(false);
    // const [date, setDate] = useState(new Date(2000, 0 , 1));
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    const [proSignUp, setProSignUp] = useState(false);
    const [visible,setVisible] = useState(false);
    const [vis,setVis] = useState(false);
    const [companyList,setCompanyList] = useState([]);
    const [company,setCompany] = useState([]);
    const [submit, setSubmit] = useState(false);
    const [selected, setSelected] = useState();
    const [cb, setcb] = useState(false);
    // const [dob, setDob] = useState();

    // const onChange = (event, selectedDate) => {
    //     const currentDate = selectedDate || date;
    //     setShow(false);
    //     setDate(currentDate);
    //     setDob(currentDate);
    // }
    // const showDatePicker = () => {
    //     setShow(true);
    // }
   
    const handleSignupPro= async (credentials, setSubmitting) => {
        handleMessage(null);
        const url = `${baseAPIUrl}/provider/signup`;
        // credentials.company = company;
        axios.post(url, credentials)
            .then((response) => {
                const result = response.data;
                const {message, status, data} = result; 

                if (status !== 'PENDING') {
                    handleMessage(message, status);
                } else {
                    tempUserPersist(({ email, name } = credentials));
                    navigation.navigate('Verification', { ...data }); 
                }
                setSubmitting(false);
            })
            .catch((error) => { 
                console.log(error);
                setSubmitting(false);
                handleMessage("An error ocurred. Check your network and try again")
            });
    }
    
    const handleSignup = async (credentials, setSubmitting) => {
        handleMessage(null);
        const url = `${baseAPIUrl}/users/signup`;
        axios.post(url, credentials)
            .then((response) => {
                const result = response.data;
                const {message, status, data} = result; 

                if (status !== 'PENDING') {
                    handleMessage(message, status);
                } else {
                    tempUserPersist(({ email, name } = credentials));
                    navigation.navigate('Verification', { ...data }); 
                }
                setSubmitting(false);
            })
            .catch((error) => { 
                console.log(error);
                setSubmitting(false);
                handleMessage("An error ocurred. Check your network and try again")
            });
    }
    const tempUserPersist = async (credentials) => {
        try {
            await AsyncStorage.setItem('MyAppCredentials', JSON.stringify(credentials));
        } catch (error) {
            handleMessage('Error with inintial data handling.');
            console.log(error);
        }
    }
    const handleAddCompany = (credentials) => {
        handleMessage(null);  
        const url = `${baseAPIUrl}/company/addCompany`;
        axios.post(url, credentials)
            .then((response) => {
                const result = response.data;
                const {message, status, data} = result; 
                if (status != 'SUCCESS') {
                    handleMessage(message, status);
                } else { 
                    console.log(data);
                    setVisible(false)
                    setVis(false)
                    setCompany(credentials.company)
                    setSubmit(false)
                    alert(`נפתחה בהצלחה מספרה חדשה בשם ${credentials.company} אנא הירשם עבור הסמפרה החדשה שלך`)
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
    return (<>
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
               <ExtraView>
                   <TextLink onPress={() => {
                    if(vis)
                        setVis(false)
                    else setVis(true)
                }}>
                    {!vis && (<TextLinkContent style={{color: 'green'}}>פתח מספרה חדשה</TextLinkContent>)}
                    {vis && (<TextLinkContent style={{color: 'red'}}>סגור</TextLinkContent>)}

                           </TextLink>
               </ExtraView>
               {vis && (
               <Formik
                        initialValues={{company: ''}} 
                        onSubmit={(values, {setSubmitting}) => {
                            values = {...values }; 
                            if (values.company == '' ) { 
                                handleMessage('An empty field was detected');
                                // setSubmitting(false);
                            } else { 
                                handleAddCompany(values, setSubmitting); 
                            }
                        }}
                    >
                        {({handleChange, handleBlur, handleSubmit, values, isSubmitting}) => (
                        <StyledFormArea>
                     
                            <MyTextInput 
                                label="שם"
                                icon="project"
                                placeholder="מספרה"
                                placeholderTextColor={holder}
                                onChangeText={handleChange('company')}
                                onBlur={handleBlur('company')}
                                value={values.company}
                            />
                            <TextLink onPress={handleSubmit}>
                            <Octicons name="plus" size={30} color='green' />
                            </TextLink>
                            </StyledFormArea>
                        )}
                </Formik>
               )}
                   </TimeList>
                    </ModalView>
                </ModalContainer>
            </Modal>
        <KeyboardAvoidingWrapper>
            
            <Container>
            <ImageBackground
                        source={require('./../../assets/img/top-bg.jpg')}
                        style={{
                            opacity: 0.8,
                            alignItems: 'center',
                            paddingTop: 80,
                            height: Dimensions.get('window').height / 4,
                        }}
                        resizeMode="cover"
                        
                        >
                <PageTitle>הרשמה</PageTitle>
            </ImageBackground>
            <ImageBackground
                        source={require('./../../assets/img/bg8.jpg')}
                        style={{
                            paddingTop: 40,
                        }}
                        resizeMode="cover"
                        
            >
                <StatusBar style="black" />
                <InnerContainer>
                 
                    
                    <Formik
                        initialValues={{name: '', email: '', phone: '', password: '', confirmPassword: ''}} // ,dateOfBirth: ''
                        onSubmit={(values, {setSubmitting}) => {
                            values = {...values }; // ,dateOfBirth: dob
                            if (values.email == '' || values.password == '' || values.confirmPassword == '' || values.name == '' || values.phone == '' ) { // || values.dateOfBirth == '') {
                                handleMessage('An empty field was detected');
                                setSubmitting(false);
                            } else if (values.password !== values.confirmPassword) {
                                handleMessage('Password do not match');
                                setSubmitting(false);
                            } else if (!proSignUp) { 
                                handleSignup(values, setSubmitting); 
                            } else if (proSignUp) { 
                                handleSignupPro(values, setSubmitting); 
                            }
                        }}
                    >
                        {({handleChange, handleBlur, handleSubmit, values, isSubmitting}) => (
                        <StyledFormArea>
                            <View 
                      style={styless.checkboxProperty}
                      horizontal={true}
                    >
                        <Text>נותן שירות</Text>
                    
                      <CheckBox 
                        style={styless.checkbox}
                        disabled={false}
                        value={cb}
                        color={cb ? '#3b3a4f' : undefined}
                        onValueChange={(newValue) => {
                            setcb(newValue)
                            setProSignUp(newValue)
                        }}
                      >
                      </CheckBox>
            </View>
                            <MyTextInput 
                                label="שם"
                                icon="person"
                                placeholder="Jennifer Aniston"
                                placeholderTextColor={holder}
                                onChangeText={handleChange('name')}
                                onBlur={handleBlur('name')}
                                value={values.name}
                            />
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
                                label="מס' פלאפון"
                                icon="phone-portrait"
                                placeholder="050-1234567"
                                placeholderTextColor={holder}
                                onChangeText={handleChange('phone')}
                                onBlur={handleBlur('phone')}
                                value={values.phone}
                                isPhone={true}
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
                            <MyTextInput 
                                label="אשר סיסמא"
                                icon="lock"
                                placeholder="* * * * * * * *"
                                placeholderTextColor={holder}
                                onChangeText={handleChange('confirmPassword')}
                                onBlur={handleBlur('confirmPassword')}
                                value={values.confirmPassword}
                                secureTextEntry={hidePassword}
                                isPassword={true}
                                hidePassword={hidePassword}
                                setHidePassword={setHidePassword}
                            />
                            {proSignUp && (
                                 <ExtraView>
                                 <TextLink onPress={() => getCompanies()}>
                                     <TextLinkContent>
                                     {selected} - מספרה
                                     </TextLinkContent>
                                     </TextLink>

                             </ExtraView>
                            )}
                            <MsgBox type={messageType}>{message}</MsgBox>
                            {!isSubmitting && (
                                <StyledButton onPress={handleSubmit}>
                                    <ButtonText>הירשם</ButtonText>
                                </StyledButton>
                            )}
                            {isSubmitting && (
                                <StyledButton disabled={true}>
                                    <ActivityIndicator size="large" color={primary}/>
                                </StyledButton>
                            )}
                            <Line />
                            <ExtraView> 
                                <TextLink onPress={() => navigation.navigate('Login')}>
                                    <TextLinkContent>התחברות</TextLinkContent>
                                </TextLink>
                                <ExtraText>כבר יש לך חשבון?</ExtraText>
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

const MyTextInput = ({label, icon, isPhone, isPassword, hidePassword, setHidePassword, ...props}) => { 
    return (
        <View>
            {isPhone && (
                <LeftIcon>
                    <Ionicons name={icon} size={30} color={brand}/>
                </LeftIcon>
            )}
            {!isPhone && (
                <LeftIcon>
                    <Octicons name={icon} size={30} color={brand}/>
                </LeftIcon> 
            )}
            
            <StyledInputLabel style={{alignSelf: 'center'}}>{label}</StyledInputLabel>
            
            <StyledTextInput {...props} /> 
            {isPassword && (
                <RightIcon onPress={() => setHidePassword(!hidePassword)}>
                    <Ionicons name={hidePassword ? 'md-eye-off' : 'md-eye'} size={30} color={holder}/>
                </RightIcon>
            )}
            {/* </ImageBackground> */}
        </View>
    );
};
const styless = StyleSheet.create({
    checkbox: {
        width: 30,
        height: 30,
    },
    checkboxProperty: {
      alignItems: 'center',
      marginRight: 7,  
    }
  
    
  });

export default Signup;