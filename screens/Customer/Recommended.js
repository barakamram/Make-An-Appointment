
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

const days = [
    'ראשון',
    'שני',
    'שלישי',
    'רביעי',
    'חמישי',
    'שישי',
    'שבת'
];

const Recommended = ({navigation}) => {
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
            const MyAppointments = await getRecommended(values);
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
    const getRecommended = async (credentials) => {  
        let daysInMonth = new Date(selectedYear, selectedMonth+1, 0).getDate();
        let newList = [];
        let pastList = [];
        const url = `${baseAPIUrl}/appointments/RecommendedAppointments`; 
        await axios.post(url, credentials)
            .then((response) => {
                const result = response.data;
                const {message, status, data} = result; 
                if (status == 'SUCCESS') { 
                    const arr = data;
                    // console.log('arr:    ', arr);
                    for (let index = 0; index < arr.length; index++) {
                        // console.log(handleDayView(new Date(arr[index])));
                        let date = new Date(arr[index].date);
                        console.log(arr[index].date)
                        console.log(date.getDay())
                        let currDate = handleDayView(date);
                        // newList.push(arr[index]);  
                        if (date >= Date.now()) {
                            newList.push({

                                // id: arr[index]._id,
                                weekday: days[date.getDay()],
                                date: currDate,
                                time: arr[index].time,
                                provider: arr[index].provider,
                                proname: arr[index].proname, 
                                // service: arr[index].service,
                                // price: arr[index].price,
                            });
                        }
                        
                    } 
                    // console.log(newList);
                    setListDays(newList);
                    // console.log(availableListDays);
                }
                setSubmitting(false);

            })
            .catch((error)=> {
                console.log("problem in fetching data: ", error);
                setSubmitting(false);

            });

    }
   
    const handle = async (item) => {
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
            <PageTitle style={{color: '#000'}}>תורים מומלצים</PageTitle>
            <StyledFormArea>
                {!isSubmitting && ( <>
                    <ModalView style={{width:400, height: 650, backgroundColor: null , alignItems: 'center', alignSelf: 'center'}}>

                
                        <AppointmentsList horizontal={false} >
                            {listDays.map((item, key) => (
                                <AppointmentsItem 
                                    key={key}
                                    // onPress={() => }
                                    
                                    onPress={() => handle(item)}
                                    // onPress={() => openCancel(item.provider, item.weekday, item.time, item.proname, item.service,item.price)}
                                >
                                    <Line/>
                                    <AppointmentsTime style={{color: '#000', textAlign:'center'}}>פגישה ביום {item.weekday} בתאריך {item.date}</AppointmentsTime>
                                    <AppointmentsTime style={{color: '#000'}}>בשעה {item.time}</AppointmentsTime>
                                    <AppointmentsTime style={{color: '#000'}}>אצל {item.proname}</AppointmentsTime>
                                    {/* <AppointmentsTime style={{color: '#ffffff'}}>תספורת {item.service}</AppointmentsTime> */}
                                    {/* <AppointmentsTime style={{color: '#000'}}>תספורת {item.service}, מחיר: {item.price}₪ </AppointmentsTime> */}
                                    {/* <TouchableOpacity onPress={() => {}} >
                                        <Octicons name={'trashcan'} size={24} color={'#000'}/>
                                    </TouchableOpacity> */}
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
                screen='Recommended'
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

export default Recommended;