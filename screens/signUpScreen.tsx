import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  Image,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
let config = require('../Config');

const SignUpScreen = ({route, navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);

  const resetInput = () => {
    setName('')
    setEmail('')
    setAddress('')
    setUsername('')
    setPassword('')
    setAgree(false);
  }
  const handleDone = () => {
    let url = config.setting.databaseServerPath + '/api/customer';
    const errors = [];

    if (name.length == 0) {
        Alert.alert('Warning', 'Please fill in your name');
        errors.push('name')
        return;
    }
    if (email.length == 0) {
        Alert.alert('Warning', 'Please fill in your email');
        errors.push('email')
        return;
    }
    if (address.length == 0) {
        Alert.alert('Warning', 'Please fill in your address');
        errors.push('address')
        return;
    }
    if (username.length == 0) {
        Alert.alert('Warning', 'Please fill in your username');
        errors.push('username')
        return;
    }
    if(!agree)
    {
        errors.push('terms')
        Alert.alert("Warning", 'Please agree to our terms and conditions')
        return;
    }
  
    if (password.length == 0) {
        Alert.alert('Warning', 'Please fill in your password');
        errors.push('password')
        return;
    }

    if(errors.length === 0)
    {
        fetch(url,{
            method:'POST',
            headers:{
                Accept:'application/json',
                'Content-type':'application/json',
            },
            body:
                JSON.stringify({
                    name:name,
                    email:email,
                    address:address,
                    username:username,
                    password:password,
                }),
            
        })
        .then(response => {
            console.log(response);
            if(!response.ok)
            {
                Alert.alert("Error: ", response.status.toString());
                throw Error('Error ' + response.status);
            }
            return response.json();
        })
        .then(respondJson => {
            if(respondJson.affected > 0)
            {
                Alert.alert('Successfully signed up', 'Please login', [{text:'Ok', onPress:() =>{resetInput(); navigation.navigate('Login')}}]);

            }
            else
            {
                Alert.alert("Error signing up, please try again");
            }
        })
        .catch(error => {console.log(error)});
    }
  };

  return (
    <SafeAreaView style={{flex:1}}>
        <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{flex:1}}>
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => {resetInput(); navigation.navigate("Login")}}>
                <Ionicons name='arrow-back-outline' size={50}/>
           </TouchableOpacity>
      <Image
        source={require('../logo/cozilla.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Sign Up</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
        />
      </View>
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
      <View style={styles.checkboxContainer}>
        <Switch
          value={agree}
          onValueChange={setAgree}
        />
        <Text style={styles.checkboxText}>Term and condition</Text>
      </View>
      <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
        <Text style={styles.doneText}>Done</Text>
      </TouchableOpacity>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 100,
    height: 40,
    resizeMode: 'contain',
    position: 'absolute',
    top: 50,
    right: 20,
  },
  backButton: {
    width: 100,
    height: 40,
    resizeMode: 'contain',
    position: 'absolute',
    top: 50,
    left: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
    borderRadius: 50,
    
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxText: {
    marginLeft: 8,
    fontSize: 16,
  },
  doneButton: {
    width: '50%',
    backgroundColor: '#665757',
    padding: 10,
    alignItems: 'center',
    borderRadius: 50,
    borderColor: '#000',
    borderWidth: 1,
  },
  doneText: {
    fontSize: 18,
    color:'white',
    fontWeight: 'bold',
  },
});

export default SignUpScreen;
