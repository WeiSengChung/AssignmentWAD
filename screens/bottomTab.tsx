import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import Cart from './cartScreen';
import ProfilePage from './profileScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


const Tab = createBottomTabNavigator();
const BottomTab = ({route, navigation} : any) => {
  return(
    <Tab.Navigator
    initialRouteName={'Home'}
    screenOptions={{
      tabBarActiveTintColor: 'white',
      tabBarActiveBackgroundColor: '#665757',
      tabBarInactiveBackgroundColor: 'white',
      tabBarLabelStyle: {
        fontSize: 22,
      },
      tabBarStyle: {
      backgroundColor: 'lightgrey',
      borderRadius:50
    },}}
    >
    <Tab.Screen name="Home" component={HomeScreen} options={{
      headerShown:false,
      tabBarIcon: ({focused}) => {                
        return <Ionicons name="home" size={20} color={focused ? 'white' : 'grey'}/>;
    }
    }}/>
    <Tab.Screen
        name = "Cart" component = {Cart}
        options={{
          headerShown:false,
        tabBarIcon:({focused}) => {
            return <Ionicons name="cart-outline" size={20} color={focused ? 'white' : 'grey'}/>
        }
        }}
    />
    <Tab.Screen
        name = "Profile" component = {ProfilePage}
        options={{
        tabBarIcon:({focused}) => {
            return <MaterialIcons name="person" size={20} color={focused ? 'white' : 'grey'}/>
        }
        }}
    />
    </Tab.Navigator>
  );
}
export default BottomTab;