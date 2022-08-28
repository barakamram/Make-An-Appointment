import React, { Component, useState, useEffect, useContext } from 'react';
import { Platform, StyleSheet, Text,StatusBar , View, ActivityIndicator, Image, Alert, Modal, SafeAreaView } from 'react-native';
import { VCalendar } from './../../components/VCalendar';
import { DateInfo,
    DatePrevArea,
    DateTitleArea,
    DateTitle,
    DateNextArea,
    DateList,
    ModalItem,
    StyledButton,
    ButtonText,
    LeftIcon,
    RightIcon,
    ModalView,
    PageTitle,
    InfoText,
    Burger
} from '../../components/styles';
import { baseAPIUrl } from '../../components/shared';
import axios from 'axios';
import moment from 'moment';
import { Octicons, Ionicons, Fontisto } from '@expo/vector-icons';
import Popup from '../../components/Popup';
import CreateWorkDay from '../../components/CreateWorkDay';
import CreateService from '../../components/CreateService';
import Actions from '../../components/Actions';
import { Dialog } from 'react-native-paper';

// import DatePicker from 'react-native-date-picker';

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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CredentialsContext } from '../../components/CredentialsContext';

const Cal = ({navigation}) => {
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    const {name, email, phone, avatar, company} = storedCredentials;
    const [reload, setReload] = useState(false);
    const [listHours, setListHours] =useState([]);
    const [listDays, setListDays] = useState([]);
    const [tempListDays, setTempListDays] = useState([]);

    const [selectedYear, setSelectedYear] = useState(0);
    const [selectedMonth, setSelectedMonth] = useState(0);
    const [selectedDay, setSelectedDay] = useState(0);
    const [isSubmitting,setSubmitting] = useState(true);
    // const [wrongCredentials,setWrongCredentials] = useState(true);
    // const [openPopup,setOpenPopup] = useState(false);
    const [visible, setVisible] = useState(false);
    const [visibleN, setVisibleN] = useState(false);
    const [visibleE, setVisibleE] = useState(false);
    const [visibleS, setVisibleS] = useState(false);
    const [date, setDate] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [cancel, setCancel] = useState(false);
    const [exist, setExist] = useState(false);
    const [check, setCheck] = useState(false);
    const [existData, setExistData] = useState([]);
    // const state = data;

    useEffect(() => {
        let _today = new Date();
        console.log(_today);
        setAll(_today);
        // console.log('day: ', selectedDay);
        // console.log('month: ', selectedMonth);
        // console.log('year: ', selectedYear);   
    }, []);
    const setAll = (today) => {
        setVisible(false);
        setVisibleN(false);
        setVisibleE(false);
        setVisibleS(false);
        setReload(false);
        setCancel(false);
        setExist(false);
        setSelectedYear( today.getFullYear());
        setSelectedMonth( today.getMonth());
        setSelectedDay( today.getDate());
    }
    useEffect( async () => {
        // setSubmitting(true);
        const mn = monthsName[selectedMonth];
        const value = {"provider": email, "slot_time": mn};
        // getCalendar(value);
        console.log(value);  
        await getCalendar(value);
        // setTimeout(() => { 
        // if(check){
        //     setHeaders(getHeaders());
        //     setReload(false);
        //     setSubmitting(false);
        //     setCheck(false);

        // } else {
        //     getCalendar(value);
        // }
        //     setHeaders(getHeaders());
        //     setReload(false);
        //     setSubmitting(false);
        //     setCheck(false);

        // }, 3000);

    }, [isSubmitting, selectedMonth, reload]);   
     useEffect(() => {
        setTimeout(() => { 
        console.log(`check - ${check}`);  

        if(check){
            setHeaders(getHeaders());
            setReload(false);
            setSubmitting(false);
            setCheck(false);
        }
        }, 3000);
        
    }, [check]);

    const getCalendar = async (credentials) => {
        let newList = [];
		let tempNewList = [];
        let newListDays = [];
		const url = `${baseAPIUrl}/appointments/getCalendar`; 
		await axios.post(url, credentials)
			.then((response) => {
				const result = response.data;
				const {message, status, data} = result; 
				if (status == 'SUCCESS') { 
					// console.log(data);
					const arr = data.DaysRecords;
					for (let index = 0; index < arr.length; index++) {
						const array = arr[index].slot_time; 
                        let date = new Date(arr[index].slot_date);
                        let selDate = handleDayView(date);
                        tempNewList = [];
						for (let i = 0; i < array.length; i++) {
                            tempNewList.push({
                                start: `${selDate} ${array[i].slot_start}:00`,
                                end: `${selDate} ${array[i].slot_end}:00`,
                                title:  array[i].available ? 'Free' : `${array[i].name} שם:`,
                                summary: array[i].available ? 'Free' : `${array[i].phone} מס':`,
                                color: array[i].available ? 'green' : '#2cc7ad',
                                service: array[i].available ? 'Free' : array[i].service,
                            });
                        } 
                        // console.log(`${date.getDate()} ${days[date.getDay()]}`);  
                        newList.push({
                            Title: `${date.getDate()} ${days[date.getDay()]}`,
                            events: tempNewList
                        });
                        newListDays.push(selDate);
                    }
				}
                setListDays(newListDays);
                setListHours(newList);
                setCheck(true);

                // console.log('yyyyyyyyyyyyyyyyyyyyy        hhhhhhhhhhhhhh      ',listHours);
			})
			.catch((error)=> {
				console.log("problem in fetching data: ", error);
                setSubmitting(false);

			});
	}
    const handleLeftDateClick = () => {
        let monthDate = new Date(selectedYear, selectedMonth, 1);
        setSubmitting(true);
        setListDays([]);
        setListHours([]);
        monthDate.setMonth(monthDate.getMonth() - 1);
        setSelectedYear(monthDate.getFullYear());
        setSelectedMonth(monthDate.getMonth());
        setHeaders([]);
        // setSelectedDay(1);
    }
    const handleRightDateClick = () => {
        let monthDate = new Date(selectedYear, selectedMonth, 1);
        setSubmitting(true);
        setListHours([]);
        setListDays([]);
        monthDate.setMonth(monthDate.getMonth() + 1);
        setSelectedYear(monthDate.getFullYear());
        setSelectedMonth(monthDate.getMonth());
        setHeaders([]);

        // setSelectedDay(1);
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
	const getHeaders = () => {
        let newListDays = [];      
        let daysInMonth = new Date(selectedYear, selectedMonth+1, 0).getDate(); 
        // console.log('listDays    -------------------------------------------------------- ' ,listDays);
        for (let i = 1; i <= daysInMonth; i++) {
            let date = new Date(selectedYear, selectedMonth, i);
            let selDate = handleDayView(date);
            let title =  `${i} ${days[date.getDay()]}`;
            if(listDays.includes(selDate)){
                // console.log(selDate);
                // console.log(listHours[listDays.indexOf(selDate)].events);
                let index = listDays.indexOf(selDate);
                // console.log(index);
                if(listHours[index]) {
                    newListDays.push({
                        Title: title,
                        events: listHours[index].events,      
                    });
                }
            } else if (date.getDate() == new Date().getDate()) {
                newListDays.push({
                    Title: title,
                }); 
            } else if (date >= new Date()) {
                newListDays.push({
                    Title: title,
                }); 
            }     
        } 
        newListDays.push({
            Title: '',
        })
        return newListDays;   
    }
    const onNewEvent = (item) => {
        console.log(item)
        const { index, Title, hours } = item
        if (Title != '') {
            // const msg = `index=${hours}, Title=${listDays[index]}, hours=${hours.from}-${hours.to}`
            // console.log(item)
            const i = item.Title.split(' ')
            // const item_date = listDays[index]
            let date = new Date(selectedYear, selectedMonth,i[0])
            const item_date = handleDayView(date)
            const item_start = hours.from
            const item_end = hours.to
            setDate(item_date)
            // console.log(item_date)
            setExist(false)

            setStart(item_start)
            setEnd(item_end)
            setCancel(false)
            setVisibleE(true)
            // alert(msg)
        } else {
            alert('wrong')
        }
    }
    const onClickEvent = (item) => {
        console.log(item)
        const i = item.start.split(' ')
        const name = item.title.split(' ')
        const phone = item.summary.split(' ')
        const service = item.service
        // const service = item.service.split(':')
        const item_date = i[0]
        console.log(i[1].split(':'))
        const j = i[1].split(':')
        const item_start = `${j[0]}:${j[1]}`
        console.log(item_start)
        
        setDate(item_date)
        setStart(item_start) 
        if(item.summary != 'Free') {
            setExist(true)
            setExistData([name[0],name[1],name[2], phone[0], phone[1],service])
        } else {
            setExist(false)
        }
        setCancel(true)
        setVisibleE(true)
        
        // Alert.alert(date, start)
    }
   
    const [ headers, setHeaders ] =useState([]);
    const [value, onChange] = useState([new Date(), new Date()]);
    
    return ( <>
        <View style={styles.container}>
        <Burger style={{bottom:20}} title="Open drawer" onPress={() => navigation.openDrawer()} >
                <Text/>
                <Octicons name={'three-bars'} size={35} color={'#000000'}/>
            </Burger>
        {/* <SafeAreaView> */}
            {/* <Text style={styles.welcome}>☆Calendar☆</Text> */}
            {/* <Text style={styles.welcome}>Calendar</Text> */}
            <Text style={styles.welcome}/>
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
					<DateTitle style={{
                        color: '#000000'

                    }}>{months[selectedMonth]} {selectedYear}</DateTitle>
				</DateTitleArea>
				<DateNextArea  onPress={handleRightDateClick}>
				<Image style={{ width: 35, height: 35}} source={require('../../assets/Icons/next-black.png')}/>
				</DateNextArea>
			</DateInfo>	
                    {/* </SafeAreaView> */}
            <RightIcon onPress = {() => setVisible(true)}
                style={{padding: 15}}
            >
                <Text/>
                <Octicons name={"calendar"} size={30} color={"#000000"}/>
            </RightIcon>
            {/* <Burger onPress = {() => setVisibleS(true)}
                style={{ top:60}}
            >
                <Text/>
                <Octicons name={"plus"} size={30} color={"#000000"}/>
            </Burger> */}
            {/* <Text style={styles.welcome}>☆☆☆</Text> */}
            {!isSubmitting && (
               
                <VCalendar
                    onNewEvent={onNewEvent}
                    onClickEvent={onClickEvent}
                    month={selectedMonth}

                    // columnHeaders={headers}
                    columnHeaders={getHeaders()}
                    title= ""
                    hourStart={8}
                    hourEnd={20}
                    showHourStart={8}
                />
         
            )} 
            {isSubmitting && (
                <ActivityIndicator size="large" color='#000' />
            )} 
            <CreateWorkDay
                visible={visible}
                setVisible={setVisible}
                setSubmitting={setSubmitting}
                setReload={setReload}
            />
            <CreateService
                visible={visibleS}
                setVisible={setVisibleS}
                setSubmitting={setSubmitting}
                setReload={setReload}
            />
            <Actions
                navigation={navigation}
                visible={visibleE}
                setVisible={setVisibleE}
                setReload={setReload}
                setSubmitting={setSubmitting}
                slot_date={date}
                slot_start={start}
                slot_end={end}
                cancel={cancel}
                setCancel={setCancel}
                exist={exist}
                setExist={setExist}
                existData={existData}
                providerEmail={email}
                providerName={name}
            />

        </View>
    </> );

  
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        paddingTop: 30,
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});

export default Cal;