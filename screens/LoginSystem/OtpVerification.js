import React, { useState, useEffect, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Octicons, Ionicons } from '@expo/vector-icons';

import ResendTimer from '../../components/ResendTimer';
import CodeInputField from '../../components/CodeInputField';
import KeyBoardAvoidingWrapper from '../../components/KeyboardAvoidingWrapper';
import VerificationModal from '../../components/VerificationModal';
import { baseAPIUrl } from '../../components/shared';
import { CredentialsContext } from '../../components/CredentialsContext';

import { StyledContainer, TopHalf, BottomHalf, IconBg, Colors, PageTitle, InfoText, EmphasizeText, StyledButton, ButtonText, InlineGroup, TextLink, TextLinkContent } from '../../components/styles';
const { brand, primary, green,blue, lightGreen,lightBlue, grey } = Colors;

const Verification = ({navigation, route}) => {
    const [code, setCode] = useState('');
    const [pinReady, setPinReady] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const MAX_CODE_LENGTH = 4;
    const [modalVisible, setModalVisible] = useState(false);
    const [verificationSuccessful, setVerificationSuccessful] = useState(false);
    const [requestMessage, setRequestMessge] = useState('');
    
    // Resend timer
    const [resendingEmail, setResendingEmail] = useState(false);
    const [resendStatus, setResendStatus] = useState('Resend');
    const [timeLeft, setTimeLeft] = useState(null);
    const [targetTime, setTargetTime] = useState(null);
    const [activeResend, setActiveResend] = useState(false);
    let resendTimerInterval;
    const { email, userId } = route?.params;

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

    const resendEmail = async () => {
        setResendingEmail(true);
        const url = `${baseAPIUrl}/email_verification_otp/resendOTPVerificationCode`;
        try {
            await axios.post(url, { email, userId });
            setResendStatus('Sent!');
        } catch (error) {
            setResendStatus('Failed!');
            alert('Resending verification email failed!');
        }
        setResendingEmail(false);
        setTimeout(() => {
            setResendStatus('Resend');
            setActiveResend(false);
            triggerTimer();
        }, 5000);
    };

    const submitOTPVerification = async () => {
        try {
            setVerifying(true);
            const url = `${baseAPIUrl}/email_verification_otp/verifyOTP/`;
            const result = await axios.post(url, { userId, otp: code });
            const { data } = result;  
            if (data.status !== 'VERIFIED') {
                setVerificationSuccessful(false);
                setRequestMessge(data.message);
            } else {
                setVerificationSuccessful(true);
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

    const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);
    const persistLoginAftetOTPVerification = async () => {
        try {
            const tempUser = await AsyncStorage.getItem('tempUser');
            await AsyncStorage.setItem('MyAppCredentials', JSON.stringify(tempUser));
            setStoredCredentials(JSON.parse(tempUser));
            navigation.navigate('Login');
        } catch (error) {
            alert('Error with persisting user data.');
        }
    };

    return (
        <KeyBoardAvoidingWrapper>
            <StyledContainer style={{alignItems: 'center',}}>
                <TopHalf>
                <IconBg>
                    <StatusBar style="dark" />
                    <Octicons name="lock" size={125} color={brand} />
                </IconBg>
                </TopHalf>
                <BottomHalf>
                    <PageTitle style={{ fontSize: 25 }}>Account Verification</PageTitle>
                    <InfoText>Please enter the 4-digit code send to
                        <EmphasizeText>{` ${email}`}</EmphasizeText>
                    </InfoText>
                    <CodeInputField 
                        setPinReady={setPinReady}
                        code={code}
                        setCode={setCode}
                        maxLength={MAX_CODE_LENGTH}
                    />
                    {!verifying && pinReady && (
                        <StyledButton
                            style={{ backgroundColor: lightBlue, flexDirection: 'row' }}
                            onPress={submitOTPVerification}    
                        >
                            <ButtonText>Verify </ButtonText>
                            <Ionicons name="checkmark-circle" size={25} color={primary} />
                        </StyledButton>
                    )}

                    {!verifying && !pinReady && (
                        <StyledButton
                            disabled={true}
                            style={{ backgroundColor: blue, flexDirection: 'row' }}
                            onPress={submitOTPVerification}    
                        >
                            <ButtonText style={{ color: {primary} }}>Verify </ButtonText>
                            <Ionicons name="checkmark-circle" size={25} color={primary} />
                        </StyledButton>
                    )}

                    {verifying && (
                        <StyledButton
                            disabled={true}
                            style={{ backgroundColor: lightBlue, flexDirection: 'row' }}
                            onPress={submitOTPVerification}    
                        >
                           <ActivityIndicator size="large" color={primary} />
                        </StyledButton>
                    )}
                    <ResendTimer
                        activeResend={activeResend}
                        resendingEmail={resendingEmail}
                        resendStatus={resendStatus}
                        timeLeft={timeLeft}
                        targetTime={targetTime}
                        resendEmail={resendEmail}
                    />  
                </BottomHalf>
                <VerificationModal 
                    successful={verificationSuccessful}
                    setModalVisible={setModalVisible}
                    modalVisible={modalVisible}
                    requestMessage={requestMessage}
                    persistLoginAftetOTPVerification={persistLoginAftetOTPVerification}
                />
            </StyledContainer>
        </KeyBoardAvoidingWrapper>
    );
};



export default Verification;