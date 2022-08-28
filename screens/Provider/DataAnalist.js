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
    Avatar,
    ModalItem,
    DateInfo,
    DatePrevArea,
    DateNextArea,
    DateTitleArea,
    DateTitle,
    AppointmentsItem,
    AppointmentsList,
    AppointmentsTime
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
const months = [
    'ינואר',
    'פברואר',
    'מרץ',
    'אפריל',
    'מאי',
    'יוני',
    'יולי',
    'אוגוסט',
    'ספטמבר',
    'אוקטובר',
    'נובמבר',
    'דצמבר'
];
const monthsName = [  
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

const DataAnalist = ({navigation}) => {
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const [count, setCount] = useState(0);
    const [countCancel, setCountCancel] = useState(0);
    const [countFree, setCountFree] = useState(0);
    const [userCount, setUserCount] = useState(0);
    const [sum, setSum] = useState(0);
    const [dataList,setDataList] = useState([]);
    const [submit, setSubmit] = useState(true);
    const [isSubmitting, setSubmitting] = useState(true);
    
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    const { name, email, phone, company} = storedCredentials;
    // const AvatarImg = avatar ? {uri: avatar} : require('../../assets/img/barbershop2.png');
    const [selectedYear, setSelectedYear] = useState(0);
    const [selectedMonth, setSelectedMonth] = useState(0);
    const [selectedDay, setSelectedDay] = useState(0);
    useEffect(async() => {
        let _today = new Date();
        setSelectedYear( _today.getFullYear());
        setSelectedMonth( _today.getMonth());
        setSelectedDay( _today.getDate());
        // const month = _today.getMonth();
        const slot_time = monthsName[selectedMonth];
        // console.log(slot_time);
        const values = {company: company, provider: email, slot_time};
        console.log(values)
        await getData(values);
    }, [])
    useEffect( async () => {
        const slot_time = monthsName[selectedMonth];
        // console.log(slot_time);
        const values = {company: company, provider: email, slot_time};
        console.log(values)
        await getData(values);
    }, [email, selectedMonth, selectedYear])


    const handleLeftDateClick = () => {
        let monthDate = new Date(selectedYear, selectedMonth, 1);
        setSubmitting(true);
        monthDate.setMonth(monthDate.getMonth() - 1);
        setSelectedYear(monthDate.getFullYear());
        setSelectedMonth(monthDate.getMonth());
    }
    const handleRightDateClick = () => {
        let monthDate = new Date(selectedYear, selectedMonth, 1);
        setSubmitting(true);
        monthDate.setMonth(monthDate.getMonth() + 1);
        setSelectedYear(monthDate.getFullYear());
        setSelectedMonth(monthDate.getMonth());
    }
    const handleLeftYearClick = () => {
        let yearDate = new Date(selectedYear, selectedMonth, 1);
        setSubmitting(true);
        setSelectedYear(yearDate.getFullYear() - 1);
        setSelectedMonth(yearDate.getMonth());
    }
    const handleRightYearClick = () => {
        let yearDate = new Date(selectedYear, selectedMonth, 1);
        setSubmitting(true);
        setSelectedYear(yearDate.getFullYear() + 1);
        setSelectedMonth(yearDate.getMonth());
    }
    const handleDayView = (date) => {
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        month = month < 10 ? '0'+month : month;
        day = day < 10 ? '0'+day : day;
        let selDate = `${year}-${month}-${day}`;
        return selDate;
    }
    
    const getData = async (credentials) => {
        // setSubmit(true);
        handleMessage(null);
        const url = `${baseAPIUrl}/appointments/getData`;
        axios.post(url, credentials)
            .then((response) => {
                const result = response.data;
                const {message, status, data} = result; 
                if (status !== 'SUCCESS') 
                    handleMessage(message, status);
                else {
                   console.log(data);
                   setDataList(data.array)
                   setCount(data.count)
                   setCountCancel(data.countCancel)
                   setCountFree(data.countFree)
                   setSum(data.sum)
                   setUserCount(data.userCount)
                   setSubmitting(false);
                //    setSubmit(false);
                }
            })
            .catch((error) => { 
                console.log(error);
                setSubmitting(false);
                handleMessage("An error ocurred. Check your network and try again")
            });
            // setSubmitting(false);
    }
    

    const handleMessage = (message, type = 'FAILED') =>{
        setMessage(message);
        setMessageType(type);
    }


    return (
        <KeyboardAvoidingWrapper>
            
            <Container>
                {/* {view == 'burger' && ( */}
                    <Burger title="Open drawer" onPress={() => navigation.openDrawer()} >
                <Octicons name={'three-bars'} size={35} color={'#000000'}/>
            </Burger>
                
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
                <PageTitle>נתונים</PageTitle>
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
                {/* <ModalItem>
                <DateInfo>
                            <DatePrevArea onPress={handleLeftYearClick}>
                            <Image style={{ width: 35, height: 35}} source={require('../../assets/Icons/prev-black.png')}/>
                        </DatePrevArea>
                        <DateTitleArea>
                            <DateTitle>{selectedYear}</DateTitle>
                        </DateTitleArea>
                        <DateNextArea  onPress={handleRightYearClick}>
                           <Image style={{ width: 35, height: 35}} source={require('../../assets/Icons/next-black.png')}/>
                        </DateNextArea>
                    </DateInfo>
                </ModalItem> */}
                <ModalItem>
                <DateInfo>
                            <DatePrevArea onPress={handleLeftDateClick}>
                            <Image style={{ width: 35, height: 35}} source={require('../../assets/Icons/prev-black.png')}/>
                        </DatePrevArea>
                        <DateTitleArea>
                            <DateTitle>{months[selectedMonth]} {selectedYear}</DateTitle>
                        </DateTitleArea>
                        <DateNextArea  onPress={handleRightDateClick}>
                           <Image style={{ width: 35, height: 35}} source={require('../../assets/Icons/next-black.png')}/>
                        </DateNextArea>
                    </DateInfo>
                </ModalItem>
                <InnerContainer> 
                {isSubmitting && (
                    <ActivityIndicator size="large" color='#000' />
                )}
                {!isSubmitting && (<>
                            {dataList.map((item, key) => (
                               
                                <AppointmentsItem 
                                key={item.id}
                                onPress={() => {}}
                                >
                                    <ExtraText style={{color: '#000', fontWeight: 'bold'}}> {item.service}  </ExtraText>
                                    <ExtraText style={{color: '#000'}}>כמות פגישות: {item.count}, שכר: {item.sum}  </ExtraText>
                                                          
                                </AppointmentsItem>                                
                            ))}
                    <Line/>
                <ExtraView>
                    <ExtraText>סה"כ כמות פגישות: {count} ({countFree+count})</ExtraText>
                  </ExtraView>
                  <ExtraView>
                    <ExtraText> סה"כ משכורת: {sum}</ExtraText>
                  </ExtraView>
                  <ExtraView>
                    <ExtraText> סה"כ אנשים: {userCount} ({count})</ExtraText>
                  </ExtraView> 
                  <ExtraView>
                    <ExtraText>סה"כ כמות הביטולים: {countCancel}</ExtraText>
                  </ExtraView>
                  {/* <ExtraView>
                    <ExtraText>כמות פגישות חופשיות: {countFree}</ExtraText>
                  </ExtraView> */}
                </>)}
                    
                </InnerContainer>
            </ImageBackground>  
            </Container>
        </KeyboardAvoidingWrapper>  
    );
}



export default DataAnalist;