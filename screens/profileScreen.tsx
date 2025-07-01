import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {NavigationContainer, useNavigation, CommonActions } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


const Profile = ({route, navigation}) => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.welcomeMessage}>Welcome To Cozilla</Text>

      <Image
        source={require('../img/qrcode.jpg')}
        style={styles.qrCode}
      />

      <View style={styles.myOrders}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate("Status")}>
          <MaterialCommunityIcons name="list-status" size={40} color="black" />
          <Text>Status</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate("History")}>
          <FontAwesome name="history" size={40} color="black" />
          <Text>History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate("ContactUs") }>
          <AntDesign name="phone" size={40} color="black" />
          <Text>Contact Us</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() =>    
            Alert.alert(
            'Confirm Logout',
            'Do you really want to Logout?',
            [
              {
                text: 'No',
                onPress: () => console.log('Logout cancelled'),
                style: 'cancel',
              },
              {
                text: 'Yes',
                onPress: () => {
                  // Reset the navigation stack and navigate to the Login screen
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{ name: 'Login' }],
                    })
                  );
                },
              },
            ],
            { cancelable: false }
          )
  }>
          <AntDesign name="logout" size={40} color="black" />
          <Text>Log out</Text>
        </TouchableOpacity>
      </View>

      {/* Sales Section */}
      <Text style={styles.salesText}>Sales</Text>
      <Image
        source={require('../img/offer50.jpg')}
        style={styles.salesPoster}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  navButton: {
    padding: 10,
  },
  logo: {
    width: 100,
    height: 40,
    resizeMode: 'contain',
  },
  welcomeMessage: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  qrCode: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  myOrders: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  iconButton: {
    alignItems: 'center',
  },
  salesText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  salesPoster: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
  },
});

export default Profile;
