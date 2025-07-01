import React, {useState, useContext} from 'react';
import { Text, View, TextInput, StyleSheet, Image, TouchableOpacity,Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { CustomerContext, CustomerProvider } from './CustomerContext';
import {NavigationContainer, useNavigation, CommonActions } from '@react-navigation/native';
let config = require('../Config')
const ContactUs = ({route, navigation}) => {
    const { customerId } = useContext(CustomerContext);
    const [feedback, setFeedback] = useState('');
    

    //handle submit button
    const handleSubmit =()=> {
      let url = config.setting.feedbackServerPath + '/api/feedback';
      const errors = [];
      feedback? '' : errors.push("feedback");
      if(errors.length !== 0)
      {
        Alert.alert("Please Enter Feedback");
      }
      else
      {
        fetch(url, {
          method:'POST',
          headers:{
            Accept:'application/json',
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            name:`${customerId}`,
            message:feedback,
            stars_count: 5,
            image: 'none',
          })
        })
        .then(response => {
          console.log(response);
          if(!response.ok)
          {
            Alert.alert('Error', response.status.toString());
            throw Error("Error inserting feedback")
          }
          return response.json();
        })
        .then(respondJson => {
          if(respondJson.affected > 0)
          {
            Alert.alert("Feedback Submitted!!!","Successfully uploaded feedback message", [
              {
                text:'OK',
                onPress: () =>{
                  // Reset the navigation stack and navigate to the Login screen
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{ name: 'MainPage' }],
                    })
                  );
                }
              }
            ]);
          }
        })
        .catch(err => console.log(err));
      }
        };

  return (
    <CustomerProvider>
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          {/* menu bar */}

        </View>

        <View style={styles.contactUsSection}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Contact Us</Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Address: No 25, Jalan SS 15/8, 47500 Subang Jaya, Selangor, Malaysia.</Text>
            <Text style={styles.infoText}>Email: Cozilla6868@corzilla.com</Text>
            <Text style={styles.infoText}>Company phone: +60 3-1836 9327</Text>
          </View>
        </View>

        <View style={styles.QnAContainer}>
          <View style={styles.QnATitle}>
            <Text style={styles.QnATitleText}>Q&A</Text>
          </View>

          <View>
            <Text style={styles.QnASection}>Here is Q&A section</Text>
            <Text style={styles.QnASection}> 1. How to check my purchase status? </Text>
            <Text style={styles.QnASection}> 2. How long the shipping time take? </Text>
            <Text style={styles.QnASection}> 3. What kind do payment method that system support? </Text>
          </View>
        </View>

        <View style = {styles.feedbackContainer}>
              <TextInput
                style = {styles.inputFeedback}
                value = {feedback}
                onChangeText = {setFeedback}
                placeholder = 'You may provide your feedback here~'
                keyboardType = "default"
               />

              <TouchableOpacity
              style = {styles.feedbackButton}
                onPress = {handleSubmit}>
                <Text style = {{color:'white'}}>Submit Feedback</Text>
               </TouchableOpacity>

        </View>
      </View>

      <View style={styles.iconBar}>
        <View style={styles.icon}>
          <FontAwesome name="instagram" size={30} color="black" />
          <Text style={styles.label}>Instagram</Text>
        </View>

        <View style={styles.icon}>
          <FontAwesome name="twitter-square" size={30} color="black" />
          <Text style={styles.label}>Twitter</Text>
        </View>

        <View style={styles.icon}>
          <FontAwesome name="facebook-square" size={30} color="black" />
          <Text style={styles.label}>Facebook</Text>
        </View>
      </View>
    </View>
    </CustomerProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between', // Ensure content is spaced between top and bottom
  },

  content: {
    flex: 1,
    padding: 20,
  },

  header: {
    flex:0.1,
    flexDirection:'row'
  },

  contactUsSection: {
    flex: 0.5,
    alignItems: 'center',
  },

  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  titleText: {
    color: 'black',
    fontSize: 30,
    paddingBottom: 20,
  },

  infoContainer: {
    alignItems: 'flex-start',
    lineSpacing:20,
    justifyContent: 'center',
    paddingTop: 20,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 15,
    marginLeft:15,
    marginRight:15,
    padding: 20,
  },

  infoText: {
    color: 'black',
    lineHeight:24
  },

  QnAContainer: {
      paddingTop:90,
      paddingBottom: 40
  },

  QnASection: {
    marginTop: 20,
  },

  QnATitle: {
    textAlign: 'center',
  },

  QnATitleText: {
    color: 'black',
    fontSize: 30,
    textAlign: 'center',
  },

  iconBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    borderTopColor: 'black',
    borderTopWidth: 1,
    backgroundColor: 'white',
  },

  icon: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingLeft: 40,
    paddingRight:40,
  },

imageContainer : {
    alignItems: 'left',
    justifyContent:'left'
    },


  image: {
      width: 300,
      height: 300,
    },

  label: {
    marginTop: 3,
    fontSize: 10,
    color: '#333',
  },

  inputFeedback: {
      borderColor: 'black',
      borderWidth: 1,
      padding: 10,
      borderRadius: 10,
      height: 150,
      textAlignVertical: 'top',
      width: '100%',
      marginBottom: 10,
    },

  feedbackContainer: {
      flexDirection: 'column',
      alignItems: 'flex-end',
      paddingTop: 30,
    },


   QnASection: {
       color: 'black',
      },

   feedbackButton: {
       backgroundColor: 'black',
       height: 40,
       width: 100,
       alignItems: 'center',
       justifyContent: 'space-between',
       paddingHorizontal: 10,
       borderRadius: 5,

   },

});

export default ContactUs;
