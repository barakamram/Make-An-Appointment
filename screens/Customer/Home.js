
import React, {useEffect, useState, useContext} from 'react';
import { StyleSheet, Text, View, Image, ScrollView,ActivityIndicator, Modal } from 'react-native';
import Swiper from 'react-native-swiper';
import {
    InnerContainer,
    StyledContainer,
    StyledTextInput,
    CarouselImage,
    TopHalf,
    BottomHalf,
    Container,
    WelcomeContainer,
    PageBody,
    SwipeDot,
    SwipeDotActive,
    ModalItem,
    ModalView,
    ExtraView,
    ExtraText,
    TextLink,
    TextLinkContent,
    ModalContainer,
    PageTitle,
    TimeList,
    ProItem
} from '../../components/styles';
import axios from 'axios';
import { baseAPIUrl } from '../../components/shared';
import { CredentialsContext } from '../../components/CredentialsContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Octicons } from '@expo/vector-icons';

const Home = ({navigation}) => {
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    const {name, email,phone, avatar, company} = storedCredentials;
    const [visible, setVisible] =useState(true);
    const [images, setImages] = useState([]);
    const [isSubmitting, setSubmitting] = useState(true);
    const [bio, setBio] = useState('');
    const [location, setLocation] = useState('');
    const [companyList,setCompanyList] = useState([]);
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const [selected, setSelected] =useState();
    const [submit, setSubmit] = useState(false);

    useEffect(() => {
        console.log(company)
        // if(!company)
        //     getCompanies();
        // else {
            const value={company: company}
            getImages(value);
            getLocation(value);
            getDataBio(value);
        // }
    }, [company]);

    const getLocation = async (credentials) => {    
        console.log(company);   
        const url = `${baseAPIUrl}/company/getLocation`;
        // const credentials = {bio};
        // console.log(credentials);
        // await axios.post(url, credentials)
        // const value = {company: company};
        await axios.post(url, credentials)
            .then((response) => {
                const result = response.data;
                const {message, status, data} = result; 
                if (status != 'SUCCESS') {
                    console.log(message, status);               
                } else {
                    console.log(data);               
                    setLocation(data);
                    setSubmitting(false);
                }
            })
            .catch((error)=> {
                console.log("problem in fetching data: ", error);
                // setSubmitting(false);
            });
    }
    const getDataBio = async (credentials) => {    
        // console.log(credentials);   
        const url = `${baseAPIUrl}/company/getDataBio`;
        // const value = {company: company};
        await axios.post(url, credentials)
            .then((response) => {
                const result = response.data;
                const {message, status, data} = result; 
                if (status !== 'SUCCESS') {
                    console.log(message, status);   
                    setSubmitting(false);

                } else {
                    // console.log(data);               
                    setBio(data);
                    setSubmitting(false);
                }
            })
            .catch((error)=> {
                console.log("problem in fetching data: ", error);
                // setSubmitting(false);
            });
    }
    const getImages = async (credentials) => {    
        const url = `${baseAPIUrl}/company/getImages`;
        let arr = [];
        // const value = {company: company};
        await axios.post(url, credentials)
            .then((response) => {
                const result = response.data;
                const {message, status, data} = result; 
                if (status !== 'SUCCESS') {
                    console.log(message, status);               
                } else {
                    // console.log(data);
                    for (let index = 0; index < data.length; index++) {
                        arr.push({
                            position: index,
                            img: data[index].image,
                        })   
        
                        // console.log(arr[index].position)
                    }
                  setImages(arr);
                //   setSubmitting(false);
                  
                }
            })
            .catch((error)=> {
                console.log("problem in fetching data: ", error);
                // setSubmitting(false);
            });
    }
    
    const swiperItems = images.map(item => {
        return(
                <CarouselImage 
                source={{uri: item.img}}
                key={item.position}
                resizeMode="cover" 
                style={styless.carousel} />
        )
    })
    // const getCompanies = () => {
    //     handleMessage(null);  
    //     let array = [];
    //     console.log('enter')
    //     const url = `${baseAPIUrl}/company/getCompanies`;
    //     axios.post(url)
    //         .then((response) => {
    //             const result = response.data;
    //             const {message, status, data} = result; 
    //             if (status != 'SUCCESS') {
    //                 handleMessage(message, status);
    //             } else {
    //                 for (let index = 0; index < data.length; index++) {
    //                     array.push({
    //                         company: data[index].name,
    //                         index: data[index].index,
    //                     })                        
    //                 }
    //                 console.log(array);
    //                 setCompanyList(array);
    //                 // console.log(companyList)
    //                 setVisible(true)
    //                 setSubmit(false)
    //                 // handleLogin(values, setSubmitting);
    //                 // perisistLogin({...data[0]}, message, status);
    //             }
    //             // setSubmitting(false);
    //         })
    //         .catch((error) => { 
    //             console.log(error);
    //             // setSubmitting(false);
    //             handleMessage('An error ocurred. Check your network and try again');
    //     })
    // }
    // const perisistLogin = (credentials) => {
    //     AsyncStorage.setItem('MyAppCredentials', JSON.stringify(credentials))
    //     .then(() => {
    //         setStoredCredentials(credentials);
    //     })
    //     .catch((error) => {
    //         handleMessage('Persisting login failed');
    //         console.log(error);
    //     })
    // }
    // const handleMessage = (message, type = 'FAILED') =>{
    //     setMessage(message);
    //     setMessageType(type);
    // }  
    return (<>
    {/* {!company && (
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
                            const values = {company: item.company}
                            perisistLogin({...company});

                            getImages(values);
                            getDataBio(values);    
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
    )} */}
        <Container>
            <ScrollView>
                {!isSubmitting && (<>
                <Swiper
                    style={styless.swiper}
                    // loop
                    key={images.length}
                    autoplay={true}
                    dot={<SwipeDot/>}
                    activeDot={<SwipeDotActive/>}
                    paginationStyle={{top: 15, right: 15, bottom: null, left: null}}
                >
                 {swiperItems}
                </Swiper>
                <PageBody style={styless.body}>    
                <ModalView style={{width: 320, justifyContant: 'center', alignItems: 'center', backgroundColor: null}}>
                    <Text>{bio}</Text>
                </ModalView>
                <ExtraView> 
                    <TextLink onPress={() => navigation.navigate("קביעת תור")}>
                        <TextLinkContent>לחץ כאן כדי לתאם תור</TextLinkContent>
                    </TextLink>
                </ExtraView>
                <ExtraView> 
                    <TextLink onPress={() => navigation.navigate("פגישות שלי")}>
                        <TextLinkContent>לחץ כאן לפגישות שלי</TextLinkContent>
                    </TextLink>
                </ExtraView>
                <ExtraView> 
                    <TextLink onPress={() => navigation.navigate("הגדרות")}>
                        <TextLinkContent>לחץ כאן לפרופיל שלי</TextLinkContent>
                    </TextLink>
                </ExtraView>
                <ExtraView>
                    <ExtraText style={{fontSize: 18}}>    {location}   </ExtraText>
                    <Octicons name={'location'} size={35} color={'#000000'}/>
                </ExtraView>
                </PageBody>
                </>)}
                {isSubmitting && (
                    // <ModalView style={{justifyContant: 'center', alignItems: 'center', backgroundColor: null}}>
                        <ActivityIndicator size="large" color='#000' />
                    // </ModalView>
                )}
            </ScrollView>
        </Container>
    </>);
}

const styless = StyleSheet.create({
    swiper: { 
        backgroundColor: '#ffffff',
        // borderBottomRightRadius: 90,
        // marginBottom: 0,
        height: 320, 
        // overflow: 'hidden',
        // borderBottomLeftRadius: -180,
        // marginBottom: 45,

    },
    carousel: { 
        height: 320, 
    },
    body: { 
        backgroundColor: '#ffffff',
        borderTopRightRadius: 45,
        borderTopLeftRadius: 45,
        marginTop: -45,
        justifyContent: 'center', 
        alignItems: 'center'
        // height: 590, 
        // overflow: 'hidden',

    },
    checkbox: {
        width: 30,
        height: 30,
        marginRight: 20,
        
    },
    
  });
  
export default Home;