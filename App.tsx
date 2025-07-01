import React, {useContext, createContext} from 'react';
import {
  Image,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {createDrawerNavigator, DrawerItemList} from '@react-navigation/drawer';

import {
  NavigationContainer,
  useNavigation,
  CommonActions,
} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ContactUs from './screens/contactUs';
import LoginPage from './screens/loginScreen';
import BottomTab from './buttomTab';
import SignUpPage from './screens/signUpScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HistoryPage from './screens/historyScreen';
import StatusPage from './screens/statusScreen';
import Men from './screens/menScreen';
import Women from './screens/womenScreen';
import Kids from './screens/kidScreen';
import ProductPage from './screens/productScreen';
import {CustomerProvider} from './screens/CustomerContext';
import PreferencePage from './screens/PreferencesMain';

const Drawer = createDrawerNavigator();

const MyDrawerComponent = (props: any) => {
  const navigation = useNavigation();
  return (
    <View style={{flex: 1}}>
      <View style={[styles.header, {flex: 0.15}]}>
        <Image style={styles.logo} source={require('./logo/cozilla.png')} />
      </View>

      <View style={{flex: 0.75, marginTop: -20, marginLeft: 10}}>
        <DrawerItemList {...props} />
      </View>

      {/* Bottom drawer items for Contact Us, My Account, and Logout */}
      <View style={{flex: 0.1, justifyContent: 'flex-end', marginLeft: 10}}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ContactUs')}
          style={styles.bottomItem}>
          <Ionicons
            name="call-outline"
            size={24}
            color="black"
            style={styles.icon}
          />
          <Text style={styles.bottomText}>Contact Us</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomItem}
          onPress={() => {
            navigation.navigate('Preference');
          }}>
          <Ionicons
            name="location-outline"
            size={24}
            color="black"
            style={styles.icon}
          />
          <Text style={styles.bottomText}>My Saved Addresses</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomItem}
          onPress={() =>
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
                        routes: [{name: 'Login'}],
                      }),
                    );
                  },
                },
              ],
              {cancelable: false},
            )
          }>
          <Ionicons
            name="log-out-outline"
            size={24}
            color="black"
            style={styles.icon}
          />
          <Text style={styles.bottomText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const App = () => {
  return (
    <CustomerProvider>
      <NavigationContainer>
        <Drawer.Navigator
          initialRouteName="Login"
          drawerContent={props => <MyDrawerComponent {...props} />}
          screenOptions={({route}) => ({
            drawerActiveTintColor: 'white',
            drawerActiveBackgroundColor: '#665757',
            drawerLabelStyle: {
              fontSize: 15,
              marginLeft: -24,
              fontFamily: 'Anta-Regular',
            },
          })}>
          <Drawer.Screen
            name="MainPage"
            component={BottomTab}
            options={({route}) => ({
              unmountOnBlur: true,
              drawerLabel: 'Main Page',
              headerTitle: 'Cozilla Home',
              drawerIcon: ({color}) => (
                <Ionicons name="home-outline" size={30} color={color} />
              ),
              // Pass customer_id to BottomTab
              initialParams: {customer_id: route.params?.customer_id},
            })}
          />
          <Drawer.Screen
            name="Men"
            component={Men}
            options={{
              drawerIcon: ({color}) => (
                <Ionicons name="man-outline" size={30} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="Women"
            component={Women}
            options={{
              drawerIcon: ({color}) => (
                <Ionicons name="woman-outline" size={30} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="Kids"
            component={Kids}
            options={{
              drawerIcon: ({color}) => (
                <MaterialCommunityIcons
                  name="baby-face-outline"
                  size={30}
                  color={color}
                />
              ),
            }}
          />
          <Drawer.Screen
            name="ContactUs"
            component={ContactUs}
            options={{
              drawerLabel: () => null,
              drawerActiveTintColor: 'white',
              drawerActiveBackgroundColor: 'white',
            }}
          />
          <Drawer.Screen
            name="Login"
            component={LoginPage}
            options={{
              drawerLabel: () => null,
              drawerActiveTintColor: 'white',
              drawerActiveBackgroundColor: 'white',
              headerShown: false,
            }}
          />
          <Drawer.Screen
            name="SignUp"
            component={SignUpPage}
            options={{
              drawerLabel: () => null,
              drawerActiveTintColor: 'white',
              drawerActiveBackgroundColor: 'white',
              headerShown: false,
            }}
          />
          <Drawer.Screen
            name="History"
            component={HistoryPage}
            options={{
              drawerLabel: () => null,
              drawerActiveTintColor: 'white',
              drawerActiveBackgroundColor: 'white',
            }}
          />
          <Drawer.Screen
            name="Preference"
            component={PreferencePage}
            options={{
              drawerLabel: () => null,
              drawerActiveTintColor: 'white',
              drawerActiveBackgroundColor: 'white',
              headerShown: false,
            }}
          />
          <Drawer.Screen
            name="Status"
            component={StatusPage}
            options={{
              drawerLabel: () => null,
              drawerActiveTintColor: 'white',
              drawerActiveBackgroundColor: 'white',
            }}
          />
          <Drawer.Screen
            name="Product"
            component={ProductPage}
            options={{
              drawerLabel: () => null,
              drawerActiveTintColor: 'white',
              drawerActiveBackgroundColor: 'white',
            }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </CustomerProvider>
  );
};

export default App;
const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
  logo: {
    width: 180,
    height: 90,
    resizeMode: 'contain',
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  drawerImage: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  drawerText: {
    fontSize: 26,
  },
  bottomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  bottomText: {
    fontSize: 20,
    color: 'black',
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
});
