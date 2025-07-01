import React, { useState, useEffect, useContext} from 'react';
import { Text, View, StyleSheet, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {buttonStyles, inputStyles} from '../Style';
import { CustomerContext } from './CustomerContext';
let config = require('../Config');

const LogInScreen = ({navigation }:any) => { // Receive navigation prop
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [customer, setUser] = useState(null);
  const { setCustomerId } = useContext(CustomerContext);

  useEffect(() => {
    setUsername('');
    setPassword('');
    syncUser();
  }, [])

  const syncUser = () => {
    try {
      AsyncStorage.getItem('UserData')
        .then(value => {
          if (value !== null && password !== '') {
            navigation.navigate("MainPage");
          }
        }

        )
    } catch (error) {
      console.log(error);
    }
  }

  const saveUser = async (user : any) => {
    try {
      var User = {
        Name: user.name,
        Username: user.username,
        Password: user.password,
      }
      console.log('Username:', User.Username);
      await AsyncStorage.setItem('UserData', JSON.stringify(User));
    } catch (error) {
      console.log(error);
    }
  }
  const handleLogin = () => {
    // if (username.length === 0 || password.length === 0) {
    //   Alert.alert('Warning', 'Please fill in email / password!');
    //   return;
    // }
    // Implement login logic here
    if (username.length == 0 || password.length == 0) {
        Alert.alert('Warning', 'Please fill in email / password!');
        return;
      }
    let url = config.setting.databaseServerPath + '/api/customer/' +  username;
    fetch(url)
      .then(response => {
        if (!response.ok) {
          Alert.alert('Warning', 'No account found. Please register an account');
          throw Error('Error: ' + response.status);
        }
        return response.json();
      })
      .then(customer => {
        if (customer != null) {
          if (password === customer.password) {
            setUser(customer);
            saveUser(customer);
            setCustomerId(customer.customer_id);
            navigation.navigate("MainPage", {customer_id: customer.customer_id});
          } else {
            Alert.alert('Warning', 'Incorrect password. Please try again');
          }
        } else {
          Alert.alert('Warning', 'No account found. Please register an account');
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../logo/cozilla.png')}
        style={styles.normalImage}
      />
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      
      {/* Log In as clickable text */}
      <TouchableOpacity onPress={handleLogin} style={buttonStyles.button}>
            <Text style={buttonStyles.buttonText}>Log In</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>or join with</Text>

      {/* Sign Up as clickable text */}
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={buttonStyles.button}>
        <Text style={buttonStyles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  normalImage: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  inputContainer: {
    width: '80%',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#000',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  },
  textButton: {
    color: '#000',
    fontSize: 28,
    marginTop: 20,
    fontWeight: 'bold',
    borderRadius:20, 
    borderColor:'black', 
    borderWidth:1,
    padding:10,
  },
  orText: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 14,
    color: '#000',
  },
});

export default LogInScreen;
