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
    StyledButton,
    ButtonText,
    ModalView,
    TimeList,
    ProItem
} from '../../components/styles';
import {View, TouchableOpacity,StyleSheet, ActivityIndicator,ImageBackground, Dimensions,  Text, Button, Image, TextInput,FlatList} from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CredentialsContext } from '../../components/CredentialsContext';
import { baseAPIUrl } from '../../components/shared';
const { brand, darklight, background, holder, primary } = Colors;
import CreateService from '../../components/CreateService';

import DateTimePicker from '@react-native-community/datetimepicker';
import KeyboardAvoidingWrapper from '../../components/KeyboardAvoidingWrapper';
const Services = ({navigation}) => {
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    const { name, email, phone, company } = storedCredentials; 
    const [submit, setSubmit] = useState(false);
    const [reload, setReload] = useState(false);
    const [visible, setVisible] = useState(false);
    const [serviceList, setServiceList] = useState([]);
    // const [isSubmitting, setSubmitting] = useState(true);
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const [services, setServices] = useState([]);
    const [selected, setSelected] = useState(null);
    useEffect( async () => {
        await getServices();
        // componentDidMount();
    }, [submit]);
  

    
      const handleCancel = async (credentials) => {
      handleMessage(null);
    //   const data = {name: selected};
      const url = 'https://young-brushlands-79715.herokuapp.com/company/deleteService';
        await axios
            .post(url, credentials)
            .then((response) => {
                const result = response.data;
                const { status, message, data } = result;
        
                if (status !== 'SUCCESS') {
                    handleMessage(message, status);
                    setSubmit(false);
                } else {
                    setSubmit(false);
                }
            })
            .catch((error) => {
            setSubmit(false);
            handleMessage('An error occurred. Check your network and try again');
            console.log(error.toJSON());
            });
          
        
    };
    const handleAddService = async (credentials) => {
        handleMessage(null);
        console.log(credentials);
        const url = 'https://young-brushlands-79715.herokuapp.com/company/addService';
        await axios
          .post(url, credentials)
          .then((response) => {
            const result = response.data;
            const { status, message, data } = result;
    
            if (status !== 'SUCCESS') 
                setSubmit(false);
            //   handleMessage(message, status);
            else {
                alert("success")
                setSubmit(false);
            }
            //   setVisible(false);
          })
          .catch((error) => {
            setSubmit(false);
            // setVisible(false);
            handleMessage('An error occurred. Check your network and try again');
            console.log(error.toJSON());
          });
        //   setSubmit(true);
        //   setReload(true);
        //   setVisible(false);
      };
      
  
    const getServices = async () => {
        handleMessage(null);
        const credentials = {company: company};
        // console.log(credentials);
        const url = 'https://young-brushlands-79715.herokuapp.com/company/getServices';
        await axios
            .post(url, credentials)
            .then((response) => {
                const result = response.data;
                const { status, message, data } = result;
                // console.log(data);
                if (status !== 'SUCCESS') {
                    handleMessage(message, status);
                    // setVisible(false);
                    setSubmit(false);
                } else {
                setServiceList(data);
                setServices(data);
                // setVis(true);
                // handleServiceList(data);
                setSubmit(false);

                }
            })
            .catch((error) => {
                handleMessage('An error occurred. Check your network and try again');
                console.log(error.toJSON());
            });
        
    };
    const handleServiceList = (credentials) => {
        let arr = credentials;
        // for 

    };
    const searchService = (value) => {
        const filter = services.filter(
            service => {
                let contactLowercase = (service.name).toLowerCase()
                let searchTermLowercase = value.toLowerCase()
                return contactLowercase.indexOf(searchTermLowercase)> -1
            }
        )
        setServiceList(filter);
    }
    const handleMessage = (message, type = '') => {
        setMessage(message);
        setMessageType(type);
    };
    const handleSelect = async (item) => {
        // setPrice(item.price);
        // setName(item.name);
        // setPhone(item.phone.toString());
        console.log(item.price.toString(), item.name);
        const value = {company: company, name: item.name};
        setSubmit(true);
        await handleCancel(value);
        
        // setLoading(true);
        // setVis(false);
    }
    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => setSelected(item.index)} style={{ minHeight: 70, padding: 10, margin: 5 }}> 
            <Text style={{
                color: item.index === selected? 'red' : 'black',
                fontSize: 20,
                    // paddingHorizontal: 50,

                
                }}>{item.name} - {item.price}₪  
            </Text>
           
            {item.index === selected && (
                <TouchableOpacity 
                style={{ 
                    backgroundColor: '#2f363c',
                    // height: 20, 
                    // width: 50, 
                    borderRadius: 5,
                    // paddingHorizontal: 20,
                    // alignSelf: 'center',

                }}
                onPress={() => handleSelect(item)}>
            <Text
            style={{
                color: 'red',
                fontSize: 16
            }}
            >מחק</Text>
                 {/* <Octicons name={"trashcan"} size={23} color={"red"}/> */}
            </TouchableOpacity>
            )}
            
        </TouchableOpacity>
    );
    
    return (
         <KeyboardAvoidingWrapper nestedScrollEnabled={true} >

            <Container>      
            <Burger title="Open drawer" onPress={() => navigation.openDrawer()} >
                    <Octicons name={'three-bars'} size={35} color={'#000000'}/>
                </Burger>          
            <ImageBackground
                        source={require('./../../assets/img/top-bg.jpg')}
                        style={{
                            opacity: 0.8,
                            alignItems: 'center',
                            paddingTop: 70,
                            height: Dimensions.get('window').height / 4,
                        }}
                        resizeMode="cover" 
                        >
                    <PageTitle>שירותים</PageTitle>
                        
                    </ImageBackground>

            <ImageBackground
                        source={require('./../../assets/img/bg15.jpg')}
                        style={{
                             paddingTop: 50,
                            // paddingVertical: '82%',
                            alignItems: 'center'
                            
                        }}
                        resizeMode="cover"
                        
                        >
                            
            <ModalView style={{backgroundColor: null}}>

              <Formik
              initialValues={{ name: '', price: '',duration: '', company: company}}
              onSubmit={(values,) => {
                values = { ...values};
                if ( values.name == '' || values.price == '' || values.duration == '') {
                    handleMessage('Please fill in all fields');
                    // setSubmit(false);
                } else {  
                    setSubmit(true);
                    handleAddService(values);
                } 
            }}
            >
              {({ handleChange, handleBlur, handleSubmit, values,  }) => (
                  
                  <StyledFormArea>

                  
                  <MyTextInput
                  label="שם שירות"
                  placeholder="שיער + זקן ארוך"
                  placeholderTextColor={darklight}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
                  icon="comment"
                  />
                <MyTextInput
                  label="מחיר"
                  placeholder="50"
                  placeholderTextColor={darklight}
                  onChangeText={handleChange('price')}
                  onBlur={handleBlur('price')}
                  value={values.price}
                  icon="plus"
                  />
                  <MyTextInput
                  label="משך פגישה"
                  placeholder="30 - חצי שעה, 60 - שעה"
                  placeholderTextColor={darklight}
                  onChangeText={handleChange('duration')}
                  onBlur={handleBlur('duration')}
                  value={values.duration}
                  icon="clock"
                  />
                  <MsgBox type={messageType}>{message}</MsgBox>
                  <DateInfo style={{ alignItems: 'center',
                      justifyContent: 'center',
                      }}
                      >
                      <DateNextArea style={{ backgroundColor: null, width: 50,alignItems: 'center',}} onPress={handleSubmit}>
                        <Octicons name="plus" size={30} color='green' />
                    </DateNextArea>
                    </DateInfo>
                    </StyledFormArea>
 )}
                  

             </Formik>
            </ModalView>

            <Line/>
            <ModalView style={{backgroundColor: null}}>
                <>
            <TextInput
                
                placeholder='חיפוש'
                placeholderTextColor='#dddddd'
                style={{ 
                    backgroundColor: '#2f363c', 
                    height: 50, 
                    fontSize: 36,
                    width: '70%',
                    color: 'white',
                    marginTop: 25,
                    borderBottomWidth: 0.5,
                    borderBottomColor: '#7d90a0'
                }}
                onChangeText={(value) => searchService(value)}
                />
        {!submit && (
               <TimeList> 
               {serviceList.map((item, key) => (
                   <ProItem 
                        key={key}
                        onPress={() => setSelected(item.index)} 
                        style={{ width: 200,minHeight: 60, padding: 10, margin: 5 }}
                    >    
                        <Text style={{color: item.index === selected? 'red' : 'black',fontSize: 20,
                }}>{item.name} - {item.price}₪ - משך פגישה:{item.duration} 
            </Text>
           
            {item.index === selected && (
                <TouchableOpacity 
                style={{ backgroundColor: '#2f363c',borderRadius: 5,}}
                onPress={() => handleSelect(item)}>
            <Text
            style={{color: 'red',fontSize: 16}}
            >מחק</Text>
            </TouchableOpacity>
            )}
                       
                   </ProItem>
               ))}
                   </TimeList>
           
            
            )}
        {submit && (           
            <ActivityIndicator size="large" color='#000' />
        )}
        </>
        </ModalView>
                <StatusBar style="black" />
                
            </ImageBackground>  
            </Container>
        </KeyboardAvoidingWrapper>       
    );
}


const MyTextInput = ({ label, icon, isDate,isStart,isEnd, showDatePicker,showTimePickerS,showTimePickerE, ...props }) => {
    return (
        <View>
        <LeftIcon>
          <Octicons name={icon} size={30} color={brand} />
        </LeftIcon>
        <StyledInputLabel style={{alignSelf: 'center'}}>{label}</StyledInputLabel>
  
        {isDate && (
            <TouchableOpacity onPress={showDatePicker}>
            <StyledTextInput {...props} />
          </TouchableOpacity>
        )}
        {isStart && (
          <TouchableOpacity onPress={showTimePickerS}>
            <StyledTextInput {...props} />
          </TouchableOpacity>
        )}
        {isEnd && (
          <TouchableOpacity onPress={showTimePickerE}>
            <StyledTextInput {...props} />
          </TouchableOpacity>
        )}

        {!isEnd && !isStart && !isDate && (
            <StyledTextInput {...props} />
        )}      
        </View>
    );
};


export default Services;