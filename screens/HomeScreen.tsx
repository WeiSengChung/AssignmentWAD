import React, { useRef, useState, useEffect } from "react";
import {
  Text,
  View,
  Image,
  TouchableNativeFeedback,
  TextInput,
  ScrollView,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Swiper from 'react-native-swiper';
import AntDesign from "react-native-vector-icons/AntDesign";
let config = require('../Config');
const { width } = Dimensions.get('window');
const cardWidth = width * 0.8; // 80% of screen width
const fallbackImage = require('../img/default.jpg'); // Add a default fallback image
const julia = require('../img/julie.jpg'); 
const emerson = require('../img/emerson.jpg');
const pewds = require('../img/pewds.jpg'); 
const ReviewCard = ({ name, quote, stars, imageSrc }: any) => (
  <View style={styles.card}>
    <View style={styles.topRow}>
      <Image source={name === 'Julia' ? julia: name==='Emerson' ? emerson : name === 'Felix' ? pewds : fallbackImage} style={styles.avatar} />
      <Text style={styles.name}>{name}</Text>
    </View>
    <Text style={styles.quote}>{quote}</Text>
    <View style={styles.starContainer}>
      {[...Array(stars)].map((_, i) => (
        <Text key={i} style={styles.star}>
          ★
        </Text>
      ))}
    </View>
  </View>
);

const promotionImages = [
  require('../img/fashionSale.jpg'),
  require('../img/summerClassic.jpg'),
  require('../img/offer50.jpg'),
];
const App = ({route, navigation}) => {
  const [reviewData, setReviewData] = useState([]);
  const textInputRef = useRef(null);
  let url = config.setting.feedbackServerPath + "/api/feedback";
  const fetchReviews = async () => {
    await fetch(url)
      .then(data => {
        return data.json();
      })
      .then(dataJson => {
        console.log(dataJson);
        setReviewData(dataJson);
      })
      .catch(err => console.log(err))
  }
  useEffect(()=>{
    fetchReviews();
  }, [])
  const handlePress = () => {
    navigation.navigate("Men", {customer_id: route.params.customer_id})
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 0.2, justifyContent: "center", flexDirection: "row", backgroundColor: "#fff", width: '100%', height: 60}}>
          <Image source={require('../logo/cozilla.png')} style={{ height: 80, width: 240 }} />
        </View>
        <View style={{ flex: 0.3, marginBottom: -20 }}>
          <TouchableNativeFeedback onPress={handlePress}>
            <View style={styles.searchContainer}>
              <AntDesign name="search1" size={30} style={{ padding: 20 }} />
              <TextInput
                ref={textInputRef}
                style={{ fontSize: 30 }}
                placeholder="Search item"
              />
            </View>
          </TouchableNativeFeedback>
        </View>
        <View style={styles.swiperContainer}>
            <Swiper
              autoplay
              autoplayTimeout={5}
              showsPagination={true}
              dotStyle={styles.dotStyle}
              activeDotStyle={styles.activeDotStyle}
              paginationStyle={styles.paginationStyle}
            >
              {promotionImages.map((imageSrc, index) => (
                <View key={index} style={styles.slide}>
                  <Image source={imageSrc} style={styles.promoImage} />
                </View>
              ))}
            </Swiper>
        </View>
        <FlatList
          data={reviewData}
          renderItem={({ item }) => <ReviewCard name={item.name} quote={item.message} stars = {item.stars_count} imageSrc = {item.image} />}
          keyExtractor={(item) => item.name}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.reviewList}
        />
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({    
  swiperContainer: {
    height: 200,
    marginTop: 10,
  },
    card: {
    backgroundColor: '#3e5141',
    borderRadius: 10,
    padding: 20,
    width: cardWidth,
    maxWidth: 350,
    margin:20,
    height:200,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  name: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quote: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
    fontStyle: 'italic',
  },
  starContainer: {
    flexDirection: 'row',
  },
  star: {
    color: '#e0c56e',
    fontSize: 24,
    marginRight: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    marginHorizontal: 30,
    borderWidth: 2,
    borderRadius: 50,
  },
  imageContainer: {
    flex: 0.7,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  reviewList: {
    paddingHorizontal: 10,
  },
  carouselContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  promoImage: {
    width: width - 40, // Full width minus some padding
    height: (width - 20) * 0.5625, // 16:9 aspect ratio
    resizeMode: 'cover',
    borderRadius: 10,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#333',
  },
  dotStyle: {
    backgroundColor: 'rgba(0,0,0,.2)',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },  
  activeDotStyle: {
    backgroundColor: '#007aff',
    width: 8,
    height: 8,
    borderRadius: 4,
  },  
  paginationStyle: {
    bottom: 10,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
});

export default App;
