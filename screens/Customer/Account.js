
import React, {useContext, useState, useEffect} from 'react';
import { Text, ActivityIndicator, ImageBackground,View, TouchableOpacity } from 'react-native';
import {
    ModalItem,
    PageTitle,
    StyledContainer,
    StyledFormArea,
    StyledTextInput,
    AppointmentsList,
    AppointmentsItem,
    AppointmentsWeekDay,
    AppointmentsTime,
    Line,
    Container,
    StyledButton,
    Burger,
    ExtraView,
    DateInfo,
    LeftIcon,
    RightIcon,
    ModalContainer,
    ModalView
} from '../../components/styles';
import { CredentialsContext } from '../../components/CredentialsContext';
import { baseAPIUrl } from '../../components/shared';
import AppointmentData from '../../components/AppointmentData';
import axios from 'axios';
import { Octicons } from '@expo/vector-icons';

const Account = ({navigation}) => {
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    const { name, email , phone} = storedCredentials;
    const [visible, setVisible] = useState(false);
    const [reload, setReload] = useState(false);
    const [selectedYear, setSelectedYear] = useState(0);
    const [selectedMonth, setSelectedMonth] = useState(0);
    const [selectedDay, setSelectedDay] = useState(0);
    // const [selectedHour, setSelectedHour] = useState(null);
    const [listDays, setListDays] = useState([]);
    const [pastListDays, setPastListDays] = useState([]);
    const [appointmentsList, setAppointmentsList] = useState([]);
    const [availableListDays, setAvailableListDays] = useState([]);
    const [listHours, setListHours] = useState([]);

    const [isSubmitting, setSubmitting] = useState(true);
    const [isSubmittingg, setSubmittingg] = useState(false);
    
    const [existData, setExistData] = useState([]);
    const [date, setDate] = useState('');
    const [start, setStart] = useState('');
    const [provider, setProvider] = useState('');
    
    useEffect(() => {
        let today = new Date();
        setSelectedYear(today.getFullYear());
        setSelectedMonth(today.getMonth());
        setSelectedDay(today.getDate());
        setListDays([]);
        setPastListDays([]);
        setSubmitting(true);
    }, []);

    useEffect(async() => {
        if (isSubmitting){
            console.log('--------------------------------------');
            let values = {"email": email};
            const MyAppointments = await getMyAppointments(values);
        }
    }, [isSubmitting, isSubmittingg]);
    const handleDayView = (date) => {
		let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        month = month < 10 ? '0'+month : month;
        day = day < 10 ? '0'+day : day;
        let selDate = `${year}-${month}-${day}`;
        return selDate;
    }
    const getMyAppointments = async (credentials) => {  
        let daysInMonth = new Date(selectedYear, selectedMonth+1, 0).getDate();
        let newList = [];
        let pastList = [];
        const url = `${baseAPIUrl}/appointments/getMyAppointments`; 
        await axios.post(url, credentials)
            .then((response) => {
                const result = response.data;
                const {message, status, data} = result; 
                if (status == 'SUCCESS') { 
                    // console.log(data);
                    const arr = data.MyAppointmentsRecords;
                    for (let index = 0; index < arr.length; index++) {
                        // console.log(handleDayView(new Date(arr[index])));
                        let date = new Date(arr[index].slot_date);
                        let currDate = handleDayView(date);
                        // newList.push(arr[index]);  
                        if (date >= Date.now()) {
                            newList.push({
                                id: arr[index]._id,
                                weekday: currDate,
                                time: arr[index].slot_start,
                                provider: arr[index].provider,
                                proname: arr[index].proname, 
                                service: arr[index].service,
                                price: arr[index].price,
                            });
                        } else {
                            pastList.push({
                                id: arr[index]._id,
                                weekday: currDate,
                                time: arr[index].slot_start,
                                provider: arr[index].provider, 
                                proname: arr[index].proname, 
                                service: arr[index].service,
                                price: arr[index].price,
                            });
                        }
                        
                    } 
                    console.log(newList);
                    setListDays(newList);
                    setPastListDays(pastList);
                    // console.log(availableListDays);
                }
                setSubmitting(false);

            })
            .catch((error)=> {
                console.log("problem in fetching data: ", error);
                setSubmitting(false);

            });

    }
   
    const openCancel = async (item) => {
        console.log(item)
        setExistData(item)
        setVisible(true)        
    }
    return (<>
        <Container>
                <Burger title="Open drawer" onPress={() => navigation.openDrawer()} >
                <Octicons name={'three-bars'} size={35} color={'#000'}/>
            </Burger>
        
            <ImageBackground
                source={require('./../../assets/img/bg15.jpg')}
                style={{
                    paddingVertical: 100,
                    alignItems: 'center',
                    // bottom: 100,
                    // marginTop: 100,
                }}
                // resizeMode="cover"
            >
            <PageTitle style={{color: '#000'}}>הפגישות שלי</PageTitle>
            <StyledFormArea>
                {!isSubmitting && ( <>
                    <ModalView style={{backgroundColor: null , alignItems: 'center', alignSelf: 'center'}}>

                    <Text style={{ 
                        fontSize: 32, color: 'green', fontWeight: 'bold'
                    }}>פגישות עתידיות:</Text>
                        <AppointmentsList horizontal={false} >
                            {listDays.map((item, key) => (
                                <AppointmentsItem 
                                    key={item.id}
                                    // onPress={() => }
                                    onPress={() => openCancel(item)}
                                    // onPress={() => openCancel(item.provider, item.weekday, item.time, item.proname, item.service,item.price)}
                                >
                                    <Line/>
                                    <AppointmentsTime style={{color: '#000'}}>פגישה בתאריך {item.weekday}</AppointmentsTime>
                                    <AppointmentsTime style={{color: '#000'}}>בשעה {item.time}</AppointmentsTime>
                                    <AppointmentsTime style={{color: '#000'}}>אצל {item.proname}</AppointmentsTime>
                                    {/* <AppointmentsTime style={{color: '#ffffff'}}>תספורת {item.service}</AppointmentsTime> */}
                                    <AppointmentsTime style={{color: '#000'}}>תספורת {item.service}, מחיר: {item.price}₪ </AppointmentsTime>
                                    {/* <TouchableOpacity onPress={() => {}} >
                                        <Octicons name={'trashcan'} size={24} color={'#000'}/>
                                    </TouchableOpacity> */}
                                </AppointmentsItem>
                            ))}
                        </AppointmentsList>
                        </ModalView>
                        <ModalView style={{backgroundColor: null, alignItems: 'center', alignSelf: 'center'}}>
                    <Text style={{
                        fontSize: 32, color: 'grey', fontWeight: 'bold'
                    }}>פגישות קודמות:</Text>
                        <AppointmentsList horizontal={false} >
                            {pastListDays.map((item, key) => (
                               
                                <AppointmentsItem 
                                key={item.id}
                                onPress={() => {}}
                                >
                                    <Line/>
                                    <AppointmentsTime style={{color: '#000'}}>פגישה בתאריך: {item.weekday} בשעה: {item.time} </AppointmentsTime>
                                </AppointmentsItem>                                
                            ))}
                        </AppointmentsList>
                        </ModalView>
                        </>
                    )}
                    {isSubmitting && (
                        <AppointmentsList>
                            <ActivityIndicator size="large" color='#000' />
                        </AppointmentsList> 
                    )}
            </StyledFormArea>
            </ImageBackground>

        </Container>
        <AppointmentData
                screen='Account'
                navigation={navigation}
                visible={visible}
                setVisible={setVisible}
                setSubmitting={setSubmitting}
                setReload={setReload}
                existData={existData}
            />
            </>
    )
}

export default Account;