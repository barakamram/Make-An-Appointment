import React, {useState, useContext, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { Formik } from 'formik';
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
    Colors,
    MsgBox,
    Line,
    ExtraText,
    ExtraView,
    TextLink,
    TextLinkContent,
    Container,
    Burger,
    ChangeArea,
    DateList,
    Avatar
} from '../../components/styles';
import {View, TouchableOpacity, ActivityIndicator,ImageBackground, Dimensions,  Text, Button, Image} from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CredentialsContext } from '../../components/CredentialsContext';
import { baseAPIUrl } from '../../components/shared';
const { brand, darklight, background, holder, primary } = Colors;
import DateTimePicker from '@react-native-community/datetimepicker';
import KeyboardAvoidingWrapper from '../../components/KeyboardAvoidingWrapper';

const ChangeDetails = ({navigation}) => {
    const [hidePassword, setHidePassword] = useState(true);
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    const [chEmail, setChEmail] = useState(false);
    const [chName, setChName] = useState(false);
    const [chPhone, setChPhone] = useState(false);
    const [chPassword, setChPassword] = useState(false);
    const [submit, setSubmit] = useState(false);
    
    const [hasGalleryPermission, setHasGalleryPermission] = useState('');
    const [image, setImage] = useState(null);
    const [avatarImage, setAvatarImage] = useState(null)

    const { name, email, phone, view} = storedCredentials;
    // const AvatarImg = avatar ? {uri: avatar} : require('../../assets/img/barbershop2.png');
    useEffect(() => {
        (async () => {
            const galleryStatus =await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasGalleryPermission(galleryStatus.status === 'granted');
        })();
    },[]);

    const updateStoredCredentials = (credentials, message, status) => {
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
    const change = (ch) => {
        if (ch == 'name') changeName();
        else if (ch == 'email') changeEmail();
        else if (ch == 'phone') changePhone();
    };
    const changeEmail = () => {
        if(chEmail)
            setChEmail(false);
        else {
            setChEmail(true);
            setChName(false);
            setChPhone(false);
            setChPassword(false);
        }
    };
    const changeName = () => {
        if(chName)
            setChName(false);
        else {
            setChName(true);
            setChEmail(false);
            setChPhone(false);
            setChPassword(false);
        }
    };
    const changePhone = () => {
        if(chPhone)
            setChPhone(false);
        else {
            setChPhone(true);
            setChEmail(false);
            setChName(false);
            setChPassword(false);
        }
    };
    const changePassword = () => {
        if(chPassword)
            setChPassword(false);
        else {
            setChPassword(true);
            setChEmail(false);
            setChName(false);
            setChPhone(false);
        }
    };

    
    const handleEmail = async (credentials, setSubmitting) => {
        setSubmit(true);
        handleMessage(null);
        const url = `${baseAPIUrl}/provider/updateEmail`;
        axios.post(url, credentials)
            .then((response) => {
                const result = response.data;
                const {message, status, data} = result; 
                if (status !== 'SUCCESS') 
                    handleMessage(message, status);
                else {
                    alert('אימייל שונה בהצלחה')
                    setChEmail(false);
                    // updateStoredCredentials({...data[0]}, message, status);
                }
                setSubmitting(false);
            })
            .catch((error) => { 
                console.log(error);
                setSubmitting(false);
                handleMessage("An error ocurred. Check your network and try again")
            });
            // setSubmit(false);
    }
    const handleName = async (credentials, setSubmitting) => {
        setSubmit(true);
        handleMessage(null);
        const url = `${baseAPIUrl}/provider/updateName`;
        axios.post(url, credentials)
            .then((response) => {
                const result = response.data;
                const {message, status, data} = result; 
                if (status !== 'SUCCESS') 
                    handleMessage(message, status);
                else {
                    alert('שם שונה בהצלחה')
                    setChName(false);
                    updateStoredCredentials({...data[0]}, message, status);
                }
                setSubmitting(false);
            })
            .catch((error) => { 
                console.log(error);
                setSubmitting(false);
                handleMessage("An error ocurred. Check your network and try again")
            });
            setSubmit(false);

    }
    const handlePhone = async (credentials, setSubmitting) => {
        setSubmit(true);
        handleMessage(null);
        console.log(credentials);
        const url = `${baseAPIUrl}/provider/updatePhone`;
        axios.post(url, credentials)
            .then((response) => {
                const result = response.data;
                const {message, status, data} = result; 
                if (status !== 'SUCCESS') 
                    handleMessage(message, status);
                else {
                    alert('מספר פלאפון שונה בהצלחה')
                    setChPhone(false);
                    updateStoredCredentials({...data[0]}, message, status);
                }
                setSubmitting(false);
            })
            .catch((error) => { 
                console.log(error);
                setSubmitting(false);
                handleMessage("An error ocurred. Check your network and try again")
            });
            setSubmit(false);

    }
    const handlePassword = async (credentials, setSubmitting) => {
        setSubmit(true);
        handleMessage(null);
        const url = `${baseAPIUrl}/provider/updatePassword`;
        axios.post(url, credentials)
            .then((response) => {
                const result = response.data;
                const {message, status, data} = result; 
                if (status !== 'SUCCESS') 
                    handleMessage(message, status);
                else {
                    alert('סיסמא שונה בהצלחה')
                    setChPassword(false);
                    updateStoredCredentials({...data[0]}, message, status);
                }
                setSubmitting(false);
            })
            .catch((error) => { 
                console.log(error);
                setSubmitting(false);
                handleMessage("An error ocurred. Check your network and try again")
            });
            setSubmit(false);

    }

    const handleMessage = (message, type = 'FAILED') =>{
        setMessage(message);
        setMessageType(type);
    }

    const uploadImage = async () => {    
        // console.log(credentials);   
        const url = `${baseAPIUrl}/provider/updatePhoto`;
        const credentials = {email: email, photo: image};
        console.log(credentials);
        await axios.post(url, credentials)
            .then((response) => {
                const result = response.data;
                const {message, status, data} = result; 
                if (status != 'SUCCESS') {
                    console.log(message, status);               
                } else {
                  alert('התמונה עלתה בהצלחה') 
                  updateStoredCredentials({...data[0]}, message, status);
   
                }
            })
            .catch((error)=> {
                console.log("problem in fetching data: ", error);
                // setSubmitting(false);
            });
    }
    // bio for each provider 
    // const updateBio = async () => {    
    //     // console.log(credentials);   
    //     const url = `${baseAPIUrl}/provider/updatePhoto`;
    //     const credentials = {email: email, bio: bio};
    //     console.log(credentials);
    //     await axios.post(url, credentials)
    //         .then((response) => {
    //             const result = response.data;
    //             const {message, status, data} = result; 
    //             if (status != 'SUCCESS') {
    //                 console.log(message, status);               
    //             } else {
    //               alert('התמונה עלתה בהצלחה') 
    //               updateStoredCredentials({...data[0]}, message, status);
   
    //             }
    //         })
    //         .catch((error)=> {
    //             console.log("problem in fetching data: ", error);
    //             // setSubmitting(false);
    //         });
    // }


    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            base64: true,
            allowsEditing: true,
            aspect: [1,1],
            quality: 1,
            width: 200,
            height: 200,
        });
        console.log(result);
        if(!result.cancelled) {
            const profileImage = result.uri ? `data:image/jpg;base64,${result.base64}` : null
            setImage(profileImage);
            // setImage(result.uri);
        }
    };
    if (hasGalleryPermission === false) {
        return <Text>לא ניתן לגשת לגלריה ללא אישור</Text>
    }

    return (
        <KeyboardAvoidingWrapper>
            
            <Container>
                {/* {view == 'burger' && ( */}
                    <Burger title="Open drawer" onPress={() => navigation.openDrawer()} >
                <Octicons name={'three-bars'} size={35} color={'#000000'}/>
            </Burger>
                {/* )} */}
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
                <PageTitle>שינוי פרטים</PageTitle>
            </ImageBackground>
            <ImageBackground
                        source={require('./../../assets/img/bg15.jpg')}
                        style={{
                            paddingTop: 40,
                            paddingVertical: '100%',
                            
                        }}
                        resizeMode="cover"
                        
                        >
                <StatusBar style="black" />
                <InnerContainer>  
                    <Formik
                        initialValues={{newName: '', newEmail: '', newPhone: '', password: '', newPassword: '', confirmPassword: ''}} // ,dateOfBirth: ''
                        onSubmit={(values, {setSubmitting}) => {
                            values = {...values }; // ,dateOfBirth: dob
                            if(chEmail && values.newEmail != ''){
                                const data = {email, newEmail: values.newEmail};
                                handleEmail(data, setSubmitting);
                            } if (chName && values.newName != '') {
                                const data = {email,newName: values.newName};
                                handleName(data, setSubmitting);
                            } if (chPhone && values.newpPhone != '') {
                                const data = {email,newPhone: values.newPhone};
                                handlePhone(data, setSubmitting);
                            } if (chPassword && (values.password != '' || values.newPassword != '' || values.confirmPassword != '')) {
                                if (values.newPassword !== values.confirmPassword) {
                                    handleMessage('Password do not match');
                                    setSubmitting(false);
                                } else {
                                    const data = {email, password:values.password, newPassword:values.newPassword}
                                    handlePassword(data, setSubmitting);
                                }
                            }                           
                        }}
                    >
                        {({handleChange, handleBlur, handleSubmit, values, isSubmitting}) => (
                        <StyledFormArea style={{alignItems: 'center'}}>
                            <ExtraView>
                            <ChangeArea>
                                {`${name} ` || 'Jennifer Aniston'}
                                <RightIcon onPress={() => change('name')}>
                                    <Octicons name={'chevron-down'} size={20} color={'#000000'}/>
                                </RightIcon>
                            </ChangeArea>
                            
                            </ExtraView>
                            {chName && ( <>
                            <MyTextInput 
                                label="שם"
                                icon="person"
                                placeholder={name}
                                placeholderTextColor={holder}
                                onChangeText={handleChange('newName')}
                                onBlur={handleBlur('newName')}
                                value={values.newName}
                            />
                            {values.newName != '' && (<>
                                {!isSubmitting && (
                                <TextLink onPress={handleSubmit}>
                                    <TextLinkContent style={{color: 'red'}} >שנה שם</TextLinkContent>
                                </TextLink>        
                                )}
                                {isSubmitting && (
                                    <TextLink disabled={true}>
                                        <ActivityIndicator size="large" color={primary}/>
                                    </TextLink>
                                )} 
                            </> 
                            )}
                            </>)}
                            
                            <ExtraView>
                             <ChangeArea>{`${email} ` || 'JenniferAniston@gmail.com'} 
                                <RightIcon onPress={() => change('email')}>
                                    <Octicons name={'chevron-down'} size={20} color={'#000000'}/>
                                </RightIcon>
                            </ChangeArea>
                            </ExtraView>

                            {chEmail && (<>
                            <MyTextInput 
                                label="Email Address"
                                icon="mail"
                                placeholder={email}
                                placeholderTextColor={holder}
                                onChangeText={handleChange('newEmail')}
                                onBlur={handleBlur('newEmail')}
                                value={values.newEmail}
                                keyboardType="email-address"
                            />
                            {values.newEmail != '' && (<>
                                {!isSubmitting && (
                                    <TextLink onPress={handleSubmit}>
                                        <TextLinkContent style={{color: 'red'}}>שנה אימייל</TextLinkContent>
                                    </TextLink>        
                                )}
                                {isSubmitting && (
                                    <TextLink disabled={true}>
                                        <ActivityIndicator size="large" color={primary}/>
                                    </TextLink>
                                )} 
                            </> )}
                            </>)}
                            <ExtraView> 

                            <ChangeArea >{`0${phone} ` || 'no phone'} 
                                <RightIcon onPress={() => change('phone')}>
                                    <Octicons name={'chevron-down'} size={20} color={'#000000'}/>
                                </RightIcon>
                            </ChangeArea>
                            </ExtraView>
                            {chPhone && ( <>
                             <MyTextInput 
                                label="Phone Number"
                                icon="phone-portrait"
                                placeholder="0509029019"
                                // placeholder={`0${phone.toString()}`}
                                placeholderTextColor={holder}
                                onChangeText={handleChange('newPhone')}
                                onBlur={handleBlur('newPhone')}
                                value={values.newPhone}
                                isPhone={true}
                            />
                            {values.newPhone != '' && (<>
                                {!isSubmitting && (
                                    <TextLink onPress={handleSubmit}>
                                    <TextLinkContent style={{color: 'red'}}>שנה מספר פלאפון</TextLinkContent>
                                    </TextLink>
                                )}
                                {isSubmitting && (
                                    <TextLink disabled={true}>
                                        <ActivityIndicator size="large" color={primary}/>
                                    </TextLink>
                                )} 
                               </>
                                
                            )}
                            </>)}

                            <ExtraView> 
                                <TextLink onPress={changePassword}>
                                    <TextLinkContent>לחץ כאן על מנת לשנות סיסמא</TextLinkContent>
                                </TextLink>
                            </ExtraView>
                            {chPassword && (<>
                                <MyTextInput 
                                    label="סיסמא ישנה"
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
                                    label="סיסמא חדשה"
                                    icon="lock"
                                    placeholder="* * * * * * * *"
                                    placeholderTextColor={holder}
                                    onChangeText={handleChange('newPassword')}
                                    onBlur={handleBlur('newPassword')}
                                    value={values.newPassword}
                                    secureTextEntry={hidePassword}
                                    isPassword={true}
                                    hidePassword={hidePassword}
                                    setHidePassword={setHidePassword}
                                />
                                <MyTextInput 
                                    label="אישור סיסמא"
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
                                {values.password != '' && values.newPassword != '' && values.confirmPassword != '' &&  ( 
                                <>
                                    {values.newPassword !== values.confirmPassword && (     
                                        <ExtraView>
                                            <ExtraText>Password do not match</ExtraText>
                                        </ExtraView>
                                    )} 
                                    {values.newPassword == values.confirmPassword && ( <>
                                        {!isSubmitting && (
                                            <TextLink onPress={handleSubmit}>
                                            <TextLinkContent style={{color: 'red'}}>שנה סיסמא</TextLinkContent>
                                        </TextLink>
                                        )}
                                        {isSubmitting && (
                                            <TextLink disabled={true}>
                                                <ActivityIndicator size="large" color={primary}/>
                                            </TextLink>
                                        )} 
                                   </> )}
                                </>)}
                            </>)}
                            <MsgBox type={messageType}>{message}</MsgBox>        
                        </StyledFormArea>
                        )}
                    </Formik>
                    <ExtraView>
                        <TextLink onPress={() => pickImage()}>
                            <TextLinkContent>לחץ כאן על מנת לבחור תמונת פרופיל חדשה</TextLinkContent>
                        </TextLink>
                    </ExtraView>

                    {image && (<>
                    <ExtraView>
                        <Avatar source={{uri: image}} style={{justifyContent: 'center',alignSelf: 'center',  width: 200, height: 200}}/>
                    </ExtraView>
                    <ExtraView>
                        <TextLink onPress={() => uploadImage()}>
                            <TextLinkContent style={{color: 'red'}}>שנה תמונה</TextLinkContent>
                        </TextLink>     
                    </ExtraView>
                    </>)}

                    
                </InnerContainer>
            </ImageBackground>  
            </Container>
        </KeyboardAvoidingWrapper>  
    );
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

export default ChangeDetails;