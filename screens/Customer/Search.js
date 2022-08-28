
import axios from 'axios';
import React, {useState, useEffect, useContext} from 'react';
import {Text , View, TouchableOpacity, ActivityIndicator, Image, ImageBackground} from 'react-native';

import { CredentialsContext } from '../../components/CredentialsContext';
import { Octicons, Ionicons , MaterialIcons } from '@expo/vector-icons';

import {
    ButtonText,
    PageTitle,
    StyledButton,
    StyledContainer,
    StyledTextInput,
    StyledFormArea,
    Colors,
    LeftIcon, 
    StyledInputLabel,
    MsgBox,
    DateInfo,
    DatePrevArea,
    DateTitleArea,
    DateTitle,
    DateNextArea,
    DateList,
    DateItem,
    DateItemWeekDay,
    DateItemNumber,
    InnerContainer,
    Line, 
    TimeList,
    TimeItem,
    TimeItemText,
    ModalItem,
    TimeListV, Container,
    Burger,
    ExtraText,
    ExtraView,
    SubTitle,
    ProItem,
    ProList,
    ServiceList,
    RightIcon,
    Avatar,
    TextLink
} from '../../components/styles';
import { baseAPIUrl } from '../../components/shared';
import { StatusBar } from 'expo-status-bar';

//formik
import { Formik } from 'formik';
import { NavigationContainer } from '@react-navigation/native';
import { duration } from '@material-ui/core';

const { background, buttontext, text, space, title, holder, button, icon, brand, darklight, primary } = Colors;
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
const days = [
    'ראשון',
    'שני',
    'שלישי',
    'רביעי',
    'חמישי',
    'שישי',
    'שבת'
];

const Search = ({navigation}) => {
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    const { name, email, phone, company } = storedCredentials; 
    const [provider, setProvider] = useState('');
    const [providerName, setProviderName] = useState('');
    const [providerAvatar, setProviderAvatar] = useState('');
    const [service, setService] = useState('');
    const [price, setPrice] = useState('');
    const [duration, setDuration] = useState('');
    const [payment, setPayment] = useState('');
    const [okey, setOkey] = useState(false);
    const [okey2, setOkey2] = useState(false);
    const [selectedYear, setSelectedYear] = useState(0);
    const [selectedMonth, setSelectedMonth] = useState(0);
    const [selectedDay, setSelectedDay] = useState(0);
    const [selectedHour, setSelectedHour] = useState(null);
    const [listDays, setListDays] = useState([]);
    const [availableListDays, setAvailableListDays] = useState([]);
    const [listHours, setListHours] = useState([]);
    const [calMode, setCalMode] = useState(false);
    const [isSubmitting, setSubmitting] = useState(true);
    const [isSubmittingg, setSubmittingg] = useState(false);
    const [listProviders, setListProviders] = useState([]);
    const [listServices, setListServices] = useState([]);
    const [avatarList, setAvatarList] = useState([]);
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const handleMessage = (message, type = 'FAILED') =>{
        setMessage(message);
        setMessageType(type);
    }  
    useEffect(async() => {
        await getProviders();
        // await getAvatar();
        await getServices();

    }, [company])
    useEffect(async() => {
        if (provider != '' ) {
            if(service == '') {
                setOkey(true);
                setOkey2(false);
                setSubmitting(true);
            } else {
                console.log(service);
                setOkey2(true);
                setSubmitting(true);
                let today = new Date();
                setSelectedYear(today.getFullYear());
                setSelectedMonth(today.getMonth());
                setSelectedDay(today.getDate());
            }
        } else {
            setOkey(false);
            setOkey2(false);

        }
    }, [provider, service]);

    
    useEffect(async() => {
        let daysInMonth = new Date(selectedYear, selectedMonth+1, 0).getDate();
        let newListDays = [];
        console.log('--------------------------------------');
        let values = {"provider": provider
        , "slot_month": monthsName[selectedMonth]};
        console.log(values);
        await getAvailableDays(values);
        console.log(availableListDays);
        for (let i = 1; i <= daysInMonth; i++) {
            let date = new Date(selectedYear, selectedMonth, i);
            let selDate = handleDayView(date);
            if (new Date(selDate) >= Date.now()) {
                newListDays.push({
                    weekday: days[ date.getDay() ],
                    number: i,
                    value: selDate,
                });
            } else if (date.getDate() == new Date().getDate()) {
                newListDays.push({
                    weekday: days[ date.getDay() ],
                    number: i,
                    value: selDate,
                });
            }
        }
        setListDays(newListDays);
        setSubmitting(false);
        setListHours([]);
        setSelectedHour(0);
        setPayment('');
    }, [isSubmitting, selectedMonth, selectedYear]);

    const handleLeftDateClick = () => {
        let monthDate = new Date(selectedYear, selectedMonth, 1);
        setSubmitting(true);
        setListDays([]);
        setListHours([]);
        monthDate.setMonth(monthDate.getMonth() - 1);
        setSelectedYear(monthDate.getFullYear());
        setSelectedMonth(monthDate.getMonth());
        setSelectedDay(0)
    }
    const handleRightDateClick = () => {
        let monthDate = new Date(selectedYear, selectedMonth, 1);
        setSubmitting(true);
        setListHours([]);
        setListDays([]);
        monthDate.setMonth(monthDate.getMonth() + 1);
        setSelectedYear(monthDate.getFullYear());
        setSelectedMonth(monthDate.getMonth());
        setSelectedDay(0)
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
    const handleMakeAnAppointment = async (day, time) => {
        setSubmittingg(true);
        console.log(`day: ${day} time: ${time}`)
        let date = new Date(selectedYear,selectedMonth, day);
        let selDate = handleDayView(date);
        let values = {
            provider: {email: provider, name: providerName},
            slot_date: selDate,
            slot_start: time,
            email: email,
            service: {name: service, price: price, duration: duration},
            payment: payment,
        }
        await MakeAnAppointment(values);
    }   
    const handleGetAppointments = async (item) => {
        availableListDays.includes(item.value) ? setSelectedDay(item.number) : setSelectedDay(0)
        let date = new Date(selectedYear,selectedMonth, item.number);
        let selDate = handleDayView(date);
        let values = {"provider": provider, slot_date: selDate, duration };
        await getAppointments(values);
    }
    // API connection
    const getAppointments = async (credentials) => {    
        // console.log(credentials);   
        let newListHours = []; 
        const url = `${baseAPIUrl}/appointments/getAppointments`;
        await axios.post(url, credentials)
            .then((response) => {
                const result = response.data;
                const {message, status, data} = result; 
                if (status == 'EMPTY') {
                    // console.log("empty"); 
                    // setSubmitting(false);  
                    // availableListDays.pop(data)
                    setListHours([]);                 

                } else if (status != 'SUCCESS') {
                    console.log(message, status);
                    // setSubmitting(false); 
                    setListHours([]);                  
                 
                } else {
                    const arr = data.AppointmentsRecords;
                    for (let index = 0; index < arr.length; index++) {
                        console.log(arr[index]);
                        newListHours.push({
                            value: arr[index]
                        });   
                    } 
                    // setSubmitting(false);
                    setListHours(newListHours);
                    
                }
            })
            .catch((error)=> {
                console.log("problem in fetching data: ", error);
                // setSubmitting(false);
            });
    }

    const getProviders = async () => {    
        // console.log(credentials);   
        let newListProviders = []; 
        const url = `${baseAPIUrl}/provider/getProviders`;
        const value = {company: company};
        await axios.post(url, value)
            .then((response) => {
                const result = response.data;
                const {message, status, data} = result; 
                 if (status != 'SUCCESS') {
                    console.log(message, status);
                    setSubmitting(false); 
                    setListProviders([]);                  
                    
                } else {

                    console.log(data);
                    const arr = data;
                    for (let index = 0; index < arr.length; index++) {
                        console.log(arr[index].provider);

                        newListProviders.push({
                            provider_email: arr[index].email,
                            name: arr[index].name,
                            avatar: arr[index].avatar ? arr[index].avatar : require('../../assets/user-profile.jpg'),
                        });   
                    } 
                    // console.log(newListProviders);
                    setListProviders(newListProviders);
                    setSubmitting(false);
                }
            })
            .catch((error)=> {
                console.log("problem in fetching data: ", error);
                setSubmitting(false);
            });
    }
    const getServices = async () => {    
        // console.log(credentials);   
        let newListServices = []; 
        const url = `${baseAPIUrl}/company/getServices`;
        const value = {company: company};
        await axios.post(url, value)
            .then((response) => {
                const result = response.data;
                const {message, status, data} = result; 
                if (status == 'EMPTY') {
                    // console.log("empty"); 
                    setSubmitting(false);  
                    // availableListDays.pop(data)
                    setListServices([]);                 

                } else if (status != 'SUCCESS') {
                    console.log(message, status);
                    setSubmitting(false); 
                    setListServices([]);                  
                    
                } else {
                    console.log(data);
                    const arr = data;
                    for (let index = 0; index < arr.length; index++) {
                        
                        newListServices.push({
                            name: arr[index].name,
                            price: arr[index].price,
                            duration: arr[index].duration
                            // avatar: arr[index].avatar? arr[index].avatar: null 
                        });   
                    } 
                    // console.log(newListServices);
                    setSubmitting(false);
                    setListServices(newListServices);
                    
                }
            })
            .catch((error)=> {
                console.log("problem in fetching data: ", error);
                setSubmitting(false);
            });
    }
    const getAvailableDays = async (credentials) => {  
        let daysInMonth = new Date(selectedYear, selectedMonth+1, 0).getDate();
        let newList = [];
        const url = `${baseAPIUrl}/appointments/getAvailableDays`; 
        await axios.post(url, credentials)
            .then((response) => {
                const result = response.data;
                const {message, status, data} = result; 
                if (status == 'SUCCESS') { 
                    // console.log(data);
                    const arr = data.DayRecords;
                    for (let index = 0; index < arr.length; index++) {
                        // console.log(handleDayView(new Date(arr[index])));
                        // console.log('length:        dfdg                    ',arr[index]);
                        // if(arr[index])
                        newList.push(
                            handleDayView(new Date(arr[index]))
                        );   
                    } 
                    setAvailableListDays(newList);
                    // console.log(availableListDays);
                    // console.log(newList);
                }
            })
            .catch((error)=> {
                console.log("problem in fetching data: ", error);
            });
    }
    const MakeAnAppointment = async (credentials) => {
        const url = `${baseAPIUrl}/appointments/makeAnAppointment`; 
        await axios.post(url, credentials)
        .then((response) => {
            const result = response.data;
            const {message, status, data} = result; 
            if (status == 'SUCCESS') {
                console.log(credentials); 
                setSubmittingg(false);
                alert("נקבעה לך פגישה בהצלחה");
                setSelectedDay(0)
                navigation.navigate("פגישות שלי", isSubmitting);
            }
        })
        .catch((error)=> {
            console.log("problem in fetching data: ", error);
            setSubmittingg(false);
        });
    }
    const openFullCal = () => {
        if(calMode){
            setCalMode(false);
        } else {
            setCalMode(true);
        }
    }
    return (
         <Container>
            {/* <InnerContainer> */}
                <Burger title="Open drawer" onPress={() => navigation.openDrawer()} >
                <Octicons name={'three-bars'} size={35} color={'#000000'}/>
            </Burger>
            
            <ImageBackground
                        source={require('./../../assets/img/bg15.jpg')}
                        style={{
                            paddingVertical: '98%',
                            alignItems: 'center',
                            justifyContent: 'center',
                            // bottom: 100,
                            // marginTop: 100,
                        }}
                        resizeMode="cover"        
                    >
                <StatusBar style="black" />
            {!okey && (
                <StyledFormArea>
                    <PageTitle>בחר ספר</PageTitle>
                    <ProList> 
                    {listProviders.map((item, key) => (
                        <ProItem 
                            key={key}
                            onPress={() => {
                                setProvider(item.provider_email)
                                setProviderName(item.name)
                                setProviderAvatar(item.avatar)
                                setSubmitting(true)
                            }}
                            >
                            <TimeItemText style={{
                                color: item.provider_email === provider? 'red' : 'black',
                                // paddingBottom: 10
                            }}>
                                {item.name}
                            </TimeItemText>
                            <Avatar resizeMode="cover" source={{uri: item.avatar}}  />                               
                        </ProItem>
                    ))}
                        </ProList>

                    </StyledFormArea>
            )}
              {okey && !okey2 && (
                <StyledFormArea>    
                    <RightIcon onPress={() => {
                        setProvider('')
                        setAvailableListDays([])
                        setListDays([])
                    }} >
                        <Octicons name={'arrow-right'} size={35} color={'#000000'}/>
                    </RightIcon>
                    <PageTitle>בחר שירות</PageTitle>
                    <ServiceList horizontal={false}>
                    {listServices.map((item, key) => (
                        <ProItem 
                        key={key}
                        onPress={() => {
                            setService(item.name)
                            setPrice(item.price)
                            setDuration(item.duration)
                            // setProviderName(item.name)
                            setSubmitting(true)
                        }}
                        style={{width: 150}}
                        >
                                <TimeItemText style={{
                                    color: item.name === service? 'red' : 'black',
                                    // justifyContent: 'center',
                                }}>{item.name} - {item.price}₪</TimeItemText>  
                        </ProItem>
                    ))}
                    </ServiceList>
                </StyledFormArea>
            )}
            {okey && okey2 && (
                <StyledFormArea>
                    <RightIcon onPress={() => setService('')} >
                        <Octicons name={'arrow-right'} size={35} color={'#000000'}/>
                    </RightIcon>
                    <View>
                        <Avatar 
                            // style={{ height: 80, width: 80 ,borderRadius: 40, marginBottom: 10,}}   
                            source={{uri: providerAvatar}} 
                            />   
                        {/* <PageTitle>
                            קביעת תספורת אצל {providerName}
                        </PageTitle> */}
                    </View>
                <ModalItem>
                <DateInfo>
                        {(new Date(selectedYear, selectedMonth-1, 31) > Date.now()) && (
                        <DatePrevArea onPress={handleLeftDateClick}>
                            <Image style={{ width: 35, height: 35}} source={require('../../assets/Icons/prev-black.png')}/>
                        </DatePrevArea>
                        )}
                        {(new Date(selectedYear, selectedMonth-1, 31) <= Date.now()) && (
                        <DatePrevArea/>
                        )}
                        <DateTitleArea>
                            <DateTitle>{months[selectedMonth]} {selectedYear}</DateTitle>
                        </DateTitleArea>
                        <DateNextArea  onPress={handleRightDateClick}>
                           <Image style={{ width: 35, height: 35}} source={require('../../assets/Icons/next-black.png')}/>
                        </DateNextArea>
                    </DateInfo>
                    <DateInfo>
                        <DatePrevArea 
                        style={{ width: 50, alignItems: 'center',justifyContent: 'flex-start'}} 
                        onPress={openFullCal}
                        > 
                        {!calMode && (
                            <Octicons name="calendar" size={30} color='black' />
                        )}
                        {calMode && (
                            <Octicons name="calendar" size={30} color='red' />
                        )}
                        </DatePrevArea>
                    </DateInfo>
                </ModalItem>
                <ModalItem>
                    {!isSubmitting && !calMode && (
                        <DateList horizontal={true} showsHorizontalScrollIndicator={false} >
                            {listDays.map((item, key) => (
                                <DateItem 
                                    key={key}
                                    style={{
                                        opacity: availableListDays.includes(item.value) ? 1 : 0.2,
                                        // backgroundColor: item.number === selectedDay ? '#000000' : '#ffffff' 
                                    }}
                                    onPress={() => handleGetAppointments(item)} 
                                >
                                    <DateItemWeekDay style={{
                                        fontWeight: availableListDays.includes(item.value) ? 'bold' : 'normal',
                                        color: item.number === selectedDay? '#ff0000' : availableListDays.includes(item.value) ? '#3b3a4f' : '#000000'

                                    }}>{item.weekday}</DateItemWeekDay>
                                    <DateItemNumber style={{
                                        fontWeight: availableListDays.includes(item.value) ? 'bold' : 'normal',
                                        color: item.number === selectedDay? '#ff0000' : availableListDays.includes(item.value) ? '#3b3a4f' : '#000000'
                                    }}>{item.number}</DateItemNumber>
                                </DateItem>
                            ))}
                        </DateList>
                        
                    )}
                    {!isSubmitting && calMode && (
                        <TimeListV>

                            {listDays.map((item, key) => (
                                <DateItem 
                                    key={key}
                                    style={{
                                        opacity: availableListDays.includes(item.value) ? 1 : 0.2,
                                        // backgroundColor: item.number === selectedDay ? '#000000' : '#ffffff' 
                                    }}
                                    onPress={() => handleGetAppointments(item)} 
                                >
                                    <DateItemWeekDay style={{
                                        fontWeight: availableListDays.includes(item.value) ? 'bold' : 'normal',
                                        color: item.number === selectedDay? 'red' : availableListDays.includes(item.value) ? '#3b3a4f' : 'black'

                                    }}>{item.weekday}</DateItemWeekDay>
                                    <DateItemNumber style={{
                                        fontWeight: availableListDays.includes(item.value) ? 'bold' : 'normal',
                                        color: item.number === selectedDay? 'red' : availableListDays.includes(item.value) ? '#3b3a4f' : 'black'
                                    }}>{item.number}</DateItemNumber>
                                </DateItem>
                            ))}
                        </TimeListV>
                        
                    )}
                    {isSubmitting && (
                        <DateList>
                            <ActivityIndicator size="large" color='#3b3a4f'/>
                        </DateList> 
                    )} 
                </ModalItem>
                <ModalItem>
                    {!isSubmitting && selectedDay > 0 && (
                        <TimeListV>
                         {/* <TimeList horizontal={true} showsHorizontalScrollIndicator={false}> */}
                            {listHours.map((item, key) => (
                                <TimeItem 
                                    key={key}
                                    onPress={() => setSelectedHour(item.value)}
                                    style={{
                                        
                                        // backgroundColor: item.value === selectedHour ? '#666b85' : '#ffffff' 
                                    }}
                                    >
                                        <TimeItemText style={{
                                            color: item.value === selectedHour? 'red' : 'black'
                                        }}>{item.value}</TimeItemText>
                                        {/* {item.value === selectedHour && (
                                            <TouchableOpacity style={{ alignItems: 'center'}}onPress={() => handleMakeAnAppointment(selectedDay, selectedHour)}>
                                            <Text style={{color: 'red', fontWeight: 'bold', fontSize: 20}}>הזמן</Text>
                                             <Octicons name={"fold-up"} size={30} color={'red'}/>  
                                        </TouchableOpacity>
                                        )} */}
                                        
                                    </TimeItem>
                            ))}
                            
                        </TimeListV>
                    )}
                </ModalItem>
                {!isSubmittingg && selectedDay !== 0 && selectedHour !== 0 &&  ( <ExtraView>
                    <StyledButton style={{ alignItems: 'center', backgroundColor: null}} onPress={() => setPayment('מזומן')}>
                    <Text style={{color: payment == 'מזומן' ? 'red' : 'black' ,fontWeight: 'bold', fontSize: 16}}>מזומן </Text>
                </StyledButton>
                 <StyledButton style={{ alignItems: 'center', backgroundColor: null}} onPress={() => setPayment('אשראי')}>
                 <Text style={{color: payment == 'אשראי' ? 'red' : 'black' ,fontWeight: 'bold', fontSize:16}}>אשראי </Text>
                 </StyledButton>
                </ExtraView>)} 
                {!isSubmittingg && selectedDay !== 0 && selectedHour !== 0 && payment !== '' && (
                    <TouchableOpacity style={{ alignItems: 'center'}}onPress={() => handleMakeAnAppointment(selectedDay, selectedHour)}>
                    <Text style={{color: 'red',fontWeight: 'bold', fontSize: 24}}>קבע תספורת</Text>
                     {/* <Octicons name={"fold-up"} size={30} color={'red'}/>  */}
                </TouchableOpacity>
                )} 
            
                <MsgBox type={messageType}>{message}</MsgBox>
                {isSubmittingg && (
                // <StyledButton>
                        <ActivityIndicator size="large" color='#3b3a4f'/>
                // </StyledButton>
                )}

            </StyledFormArea> 
            )}
             </ImageBackground>
             {/* </InnerContainer> */}
        </Container>
    );    
}

export default Search;