
import React, {useState, useContext, useEffect} from 'react';
import { StyleSheet, Text, View, Image, ScrollView, ActivityIndicator, TextInput, Modal } from 'react-native';
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
    ExtraView,
    ExtraText,
    TextLink,
    TextLinkContent,
    ProItem,
    ModalContainer,
    ModalView,
    StyledButton,
    ButtonText,
    
} from '../../components/styles';
import axios from 'axios';
import { baseAPIUrl } from '../../components/shared';
import * as ImagePicker from 'expo-image-picker';
import UpdateBio from '../../components/UpdateBio';
import { CredentialsContext } from '../../components/CredentialsContext';
import { Octicons } from '@expo/vector-icons';

const Home = ({navigation}) => {
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    const {name, email,phone, avatar, company} = storedCredentials;
    const [image, setImage] = useState(null);
    const [hasGalleryPermission, setHasGalleryPermission] = useState('');
    const [isSubmitting, setSubmitting] = useState(true);
    const [isSubmittingg, setSubmittingg] = useState(false);
    const [images, setImages] = useState([]);
    const [bio, setBio] = useState('');
    const [location, setLocation] = useState('');
    const [visible, setVisible] = useState(false);
    const [text, onChangeText] = useState('');

    useEffect(() => {
        // console.log(company)
        getImages();
        getLocation();
        getDataBio();
        (async () => {
            const galleryStatus =await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasGalleryPermission(galleryStatus.status === 'granted');
        })();
    },[company]);
   
    const getLocation = async () => {    
        console.log(company);   
        const url = `${baseAPIUrl}/company/getLocation`;
        // const credentials = {bio};
        // console.log(credentials);
        // await axios.post(url, credentials)
        const value = {company: company};
        await axios.post(url, value)
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
    const getDataBio = async () => {    
        console.log(company);   
        const url = `${baseAPIUrl}/company/getDataBio`;
        // const credentials = {bio};
        // console.log(credentials);
        // await axios.post(url, credentials)
        const value = {company: company};
        await axios.post(url, value)
            .then((response) => {
                const result = response.data;
                const {message, status, data} = result; 
                if (status != 'SUCCESS') {
                    console.log(message, status);               
                } else {
                    console.log(data);               
                    setBio(data);
                    setSubmitting(false);
                }
            })
            .catch((error)=> {
                console.log("problem in fetching data: ", error);
                // setSubmitting(false);
            });
    }
    const getImages = async () => {    
        const url = `${baseAPIUrl}/company/getImages`;
        let arr = [];
        const value = {company: company};
        await axios.post(url, value)
            .then((response) => {
                const result = response.data;
                const {message, status, data} = result; 
                if (status != 'SUCCESS') {
                    console.log(message, status);               
                } else {
                    // console.log(data);
                    for (let index = 0; index < data.length; index++) {
                        arr.push({
                            position: index,
                            img: data[index].image,
                        })   
        
                        console.log(arr[index].position)
                    }
                //   alert('התמונה עלתה בהצלחה אתה יכול להשתמש בה במסך הראשי')    
                  setImages(arr);
                  setSubmitting(false);
                  
                }
            })
            .catch((error)=> {
                console.log("problem in fetching data: ", error);
                // setSubmitting(false);
            });
    }


    const uploadImage = async () => {    
        // console.log(credentials);   
        const url = `${baseAPIUrl}/company/uploadImage`;
        const credentials = {company: company, image: image};
        // console.log(credentials);
        await axios.post(url, credentials)
            .then((response) => {
                const result = response.data;
                const {message, status, data} = result; 
                if (status != 'SUCCESS') {
                    console.log(message, status);               
                } else {
                  alert('התמונה עלתה בהצלחה')    
                  setImage(null);
                  setSubmittingg(false);
                  
                }
            })
            .catch((error)=> {
                console.log("problem in fetching data: ", error);
                setSubmitting(false);
            });
    }
    // const updateBio = () => {
    //     setVisible(true)  
    //     console.log('visible', visible)
    //     return(
    //         <Modal animationType='slide' visible={visible} transparent={true} >
    //         {/* <ModalContainer> */}
    //         {/* <ModalView> */}
    //         <TextInput
    //             style={styless.input}
    //             onChangeText={onChangeText}
    //             value={text}
    //         /> 
    //         {/* </ModalView>  */}
    //         {/* </ModalContainer> */}
    //         </Modal>
    //     )
    // }
    const swiperItems = images.map(item => {
        return(
                <CarouselImage source={{uri: item.img}}
                key={item.position}
                 resizeMode="cover" style={styless.carousel} />
        )
    })
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            base64: true,
            allowsEditing: true,
            aspect: [3,2],
            quality: 1,
            width: 480,
            height: 320,
        });
        console.log(result);
        if(!result.cancelled) {
            const upload = result.uri ? `data:image/jpg;base64,${result.base64}` : null
            setImage(upload);
            // setImage(result.uri);
        }
    };
    if (hasGalleryPermission === false) {
        return <Text>לא ניתן לגשת לגלריה ללא אישור</Text>
    }
    return (<>
        <Container>
            <ScrollView>
                {/* {images !== [] && ( */}
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
                    <ExtraView>
                        <TextLink onPress={() => pickImage()}>
                            <TextLinkContent>לחץ כאן על מנת לעלות תמונות</TextLinkContent>
                        </TextLink>
                    </ExtraView>

                    {!isSubmittingg && image && (<>
                    <ExtraView>
                        <Image source={{uri: image}} style={{justifyContent: 'center',alignSelf: 'center',  width: 400, height: 200}}/>
                    </ExtraView>
                    <ExtraView>
                        <TextLink onPress={() => {
                            setSubmittingg(true)
                            uploadImage()
                        }}>
                            <TextLinkContent style={{color: 'red'}}>העלה תמונה</TextLinkContent>
                        </TextLink>     
                    </ExtraView>
                    </>)}
                    {isSubmittingg && (
                        <ActivityIndicator size="large" color='#000' />
                    )}
                    <ModalItem style={{width: 320, justifyContant: 'center', alignItems: 'center'}}>
                        <TextLink onPress={() => {
                            // console.log('push')
                            setVisible(true)  
                            // updateBio()
                        }}>
                          <TextLinkContent>{bio}</TextLinkContent>
                          {/* <ExtraText>{bio}</ExtraText> */}
                        </TextLink>
                    {/* <Text>    
                        אהלן גבר, הגעת למשפחת המספרה. אנחנו ”ברברס“ - ספרי גברים, כן, אך ורק. אמרנו גברים, אמרנו זְקָנִים אנחנו מתמקצעים בעיצוב הזקן לפי צורת הפנים כדי שיחמיא לנו.
                        נכון, מהאולד סקול ועד הניו סקול. מוזמן לקבוע תור, נחכה לך בזמן עם דרינק על העמדה. תבוא פשוט.
                        צוות המספרה     
                    </Text> */}
                    </ModalItem>
                    {/* <ExtraView> 
                        <StyledButton onPress={() => navigation.navigate("יומן")}>
                            <ButtonText>יומן</ButtonText>
                        </StyledButton>
                    </ExtraView> */}
                   
                    <ExtraView> 
                        <TextLink onPress={() => navigation.navigate("יומן")}>
                            <TextLinkContent>לחץ כאן לעבור ליומן</TextLinkContent>
                        </TextLink>
                    </ExtraView>
                    <ExtraView> 
                        <TextLink onPress={() => navigation.navigate("נתונים")}>
                            <TextLinkContent>לחץ כאן לנתונים שלי</TextLinkContent>
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
                        <ActivityIndicator size="large" color='#000' />
                )}
            </ScrollView>
        </Container>
        <UpdateBio
        visible={visible}
        setVisible={setVisible}
        bio={bio}
        setBio={setBio}
      />
      </>
    );
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
        // alignItems: 'center',
    },
    carousel: { 
        // justifyContent: 'center',
        width: 480, 
        // alignSelf: 'center',
        height: 320, 
        // width: '100%'
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
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
      },
    
    checkbox: {
        width: 30,
        height: 30,
        marginRight: 20,
        
    },
    
  });
  
export default Home;