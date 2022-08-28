import React, { useState, useEffect, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import ResendTimer from '../../components/ResendTimer';
import CodeInputField from '../../components/CodeInputField';
import KeyBoardAvoidingWrapper from '../../components/KeyboardAvoidingWrapper';
import VerificationModal from '../../components/VerificationModal';
import { baseAPIUrl } from '../../components/shared';
import { CredentialsContext } from '../../components/CredentialsContext';

const { brand, primary, green,blue, lightGreen,lightBlue, grey, holder, tertiary } = Colors;
import { Formik } from 'formik';
import { Octicons, Ionicons, Fontisto } from '@expo/vector-icons';
import { View, ActivityIndicator, Platform,StyleSheet, ImageBackground, Dimensions} from 'react-native';
import { 
    StyledContainer, 
    InnerContainer, 
    PageLogo, 
    TopHalf, 
    BottomHalf, 
    IconBg, 
    InfoText, 
    EmphasizeText, 
    InlineGroup,
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
    PageBody
} from '../../components/styles';

const ForgotPassword = ({navigation}) => {
    const [code, setCode] = useState('');
    const [pinReady, setPinReady] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const MAX_CODE_LENGTH = 4;
    const [modalVisible, setModalVisible] = useState(false);
    const [verificationSuccessful, setVerificationSuccessful] = useState(false);
    const [requestMessage, setRequestMessge] = useState('');
    const [hidePassword, setHidePassword] = useState(true);
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    // Resend timer
    const [resendingEmail, setResendingEmail] = useState(false);
    const [resendStatus, setResendStatus] = useState('Resend');
    const [timeLeft, setTimeLeft] = useState(null);
    const [targetTime, setTargetTime] = useState(null);
    const [activeResend, setActiveResend] = useState(false);
    const [mail, setMail] = useState('');
    const [visible, setVisible] = useState(false);
    const [visible2, setVisible2] = useState(true);
    let resendTimerInterval;
    // const { email, userId } = route?.params;

    const triggerTimer = (targetTimeInSeconds = 30) => {
        setTargetTime(targetTimeInSeconds);
        setActiveResend(false);
        const finalTime = +new Date() + targetTimeInSeconds * 1000;
        resendTimerInterval = setInterval(() => calculateTimeLeft(finalTime), 1000);
    };

    const calculateTimeLeft = (finalTime) => {
        const difference = finalTime - +new Date();
        if (difference >= 0) {
            setTimeLeft(Math.round(difference / 1000));
        } else {
            setTimeLeft(null);
            clearInterval(resendTimerInterval);
            setActiveResend(true);
        }
    };

    useEffect(() => {
        triggerTimer();
        return () => {
            clearInterval(resendTimerInterval);
        };
    }, []);

    const sendEmail = async (email, setSubmitting) => {
        setResendingEmail(true);
        const values = {email};
        // console.log(values);
        const url = `${baseAPIUrl}/forgot_password_otp/requestPasswordReset`;
        try {
            console.log(values);
            await axios.post(url, values);
            setSubmitting(false);
            alert(`הקוד נשלח בהצלחה לאימייל - ${email}`);
            setVisible(true);
            setVisible2(false);
        } catch (error) {
            setResendStatus('Failed!');
            setSubmitting(false);
            alert('Resending reset password email failed!');

        }
        setResendingEmail(false);
        // setTimeout(() => {
        //     setResendStatus('Resend');
        //     setActiveResend(false);
        //     triggerTimer();
        //     setSubmitting(false);
        // }, 5000);
    };

    const submitOTPResetPassword = async (credentials, setSubmitting) => {
        try {
            setVerifying(true);
            console.log(credentials);
            const url = `${baseAPIUrl}/forgot_password_otp/passwordReset`;
            const result = await axios.post(url, credentials);
            const { data } = result;  
            if (data.status !== 'SUCCESS') {
                setVerificationSuccessful(false);
                setRequestMessge(data.message);
            } else {
                setVerificationSuccessful(true);
                alert('סיסמא שונתה בהצלחה');
                navigation.navigate('Login');
            }
            setModalVisible(true);
            setVerifying(false);
        } catch (error) {
            setRequestMessge(error.message);
            setVerificationSuccessful(true);
            setModalVisible(true);
            setVerifying(false);
        }
    };

    const handleMessage = (message, type = 'FAILED') =>{
        setMessage(message);
        setMessageType(type);
    }  

    

    return (
        <KeyBoardAvoidingWrapper>
            <StyledContainer style={{alignItems: 'center',}}>
                <TopHalf></TopHalf>
                <BottomHalf>
                <PageTitle style={{ fontSize: 25 }}>שינוי סיסמא</PageTitle>
                <Formik
                            initialValues={{email: '', newPassword: '',confirmPassword : '', otp: code}}
                            enableReinitialize={true}
                            onSubmit={(values, {setSubmitting}) => {
                                
                                if (values.email == '') {
                                    if(mail != ''){
                                        if (values.newPassword == values.confirmPassword){
                                            values.email = mail;
                                        // handleMessage(' ');
                                            submitOTPResetPassword(values, setSubmitting);
                                        } else {
                                            handleMessage('Password doesnt match');
                                            setSubmitting(false);
                                        }
                                        
                                    } else {
                                    handleMessage('An empty field was detected');
                                    setSubmitting(false);
                                    }
                                } else if (values.newPassword == '') {
                                    // handleMessage(' ');
                                    setMail(values.email);
                                    sendEmail(values.email, setSubmitting);
                                }
                                    // } else {
                                //     values.email = mail;
                                //     // handleMessage(' ');
                                //     submitOTPResetPassword(values, setSubmitting);
                                // }
                            }}
                        >
                            {({handleChange, handleBlur, handleSubmit, values, isSubmitting}) => (
                            <StyledFormArea>
                                {visible && (
                                    <CodeInputField 
                                    setPinReady={setPinReady}
                                    code={code}
                                    setCode={setCode}
                                    maxLength={MAX_CODE_LENGTH}
                                    // mail={mail}
                                    // setMail={setMail}
                                />
                                )}
                                {visible2 && (
                                     <MyTextInput 
                                     label="אימייל"
                                     icon="mail"
                                     placeholder="abcde@gmail.com"
                                     placeholderTextColor={holder}
                                     onChangeText={handleChange('email')}
                                     onBlur={handleBlur('email')}
                                     value={values.email} 
                                     keyboardType="email-address"
                                 />
                                )}
                                {pinReady && (
                                     <MyTextInput 
                                     label="מייל"
                                     icon="mail"
                                     placeholder={mail}
                                     placeholderTextColor={holder}
                                     onChangeText={handleChange('email')}
                                     onBlur={handleBlur('email')}
                                     value={mail}
                                     keyboardType="email-address"
                                 />
                                )}
                                {!isSubmitting && visible2 && (
                                <ExtraView> 
                                    <TextLink onPress={handleSubmit}>
                                        <TextLinkContent>לחץ כאן</TextLinkContent>
                                    </TextLink>
                                    <ExtraText> על מנת לשלוח קוד למייל</ExtraText>

                                </ExtraView>
                                )}
                                {isSubmitting && !verifying && (  
                                <ExtraView> 
                                    <ExtraText>
                                        <ActivityIndicator size="large" color={primary}/>
                                    </ExtraText>   
                                </ExtraView>
                                )} 
                                {pinReady && visible && (  <>  
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
                               </> )}
                                <MsgBox type={messageType}>{message}</MsgBox>
                    {!verifying && pinReady && (
                        <StyledButton
                            style={{ backgroundColor: lightBlue, flexDirection: 'row' }}
                            onPress={handleSubmit}    
                        >
                            <ButtonText>שנה סיסמא </ButtonText>
                            <Ionicons name="checkmark-circle" size={25} color={primary} />
                        </StyledButton>
                    )}

                    {!verifying && !pinReady && (
                        <StyledButton
                            disabled={true}
                            style={{ backgroundColor: blue, flexDirection: 'row' }}
                            onPress={submitOTPResetPassword}    
                        >
                            <ButtonText style={{ color: lightBlue }}>הכנס קוד </ButtonText>
                            <Ionicons name="checkmark-circle" size={25} color={primary} />
                        </StyledButton>
                    )}

                    {verifying && (
                        <StyledButton
                            disabled={true}
                            style={{ backgroundColor: lightBlue, flexDirection: 'row' }}
                            // onPress={submitOTPResetPassword}    
                        >
                           <ActivityIndicator size="large" color={primary} />
                        </StyledButton>
                    )}
                                                           
                            </StyledFormArea>
                            )}
                        </Formik> 
                    
                    {/* <ResendTimer
                        activeResend={activeResend}
                        resendingEmail={resendingEmail}
                        resendStatus={resendStatus}
                        timeLeft={timeLeft}
                        targetTime={targetTime}
                        resendEmail={sendEmail}
                    />   */}
                    <ExtraView> 
                        <TextLink onPress={() => navigation.navigate('Login')}>
                            <TextLinkContent>חזור למסך התחברות</TextLinkContent>
                        </TextLink>
                    </ExtraView>
                </BottomHalf>
                {/* <VerificationModal 
                    successful={verificationSuccessful}
                    setModalVisible={setModalVisible}
                    modalVisible={modalVisible}
                    requestMessage={requestMessage}
                    // persistLoginAftetOTPVerification={persistLoginAftetOTPVerification}
                /> */}
            </StyledContainer>
        </KeyBoardAvoidingWrapper>
    );
};    

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


export default ForgotPassword;