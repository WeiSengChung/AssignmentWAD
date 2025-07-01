import React, {Component} from 'react';
import {TouchableOpacity} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import HomeScreen from './Preferences';
import ViewScreen from './ViewPreference';
import CreateScreen from './CreatePreferenceScreen';
import EditScreen from './EditPreference';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Stack = createStackNavigator();

const CustomBackButton = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
      <Ionicons name="arrow-back" size={24} color="#302f2d" />
    </TouchableOpacity>
  );
};

export default function PreferenceMain() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerLeft: () => <CustomBackButton />,
        ...myStyle.HomeHeader
      })}
    >
      <Stack.Screen
        name="Addresses"
        component={HomeScreen}
        options={{ title: 'My Delivery Addresses' }}
      />
      <Stack.Screen
        name="ViewAddress"
        component={ViewScreen}
        options={{ title: 'View Saved Addresses' }}
      />
      <Stack.Screen
        name="CreateAddress"
        component={CreateScreen}
        options={{ title: 'Create New Address' }}
      />
      <Stack.Screen
        name="EditAddress"
        component={EditScreen}
        options={{ title: 'Edit Address' }}
      />
    </Stack.Navigator>
  );
}

const myStyle = {
  HomeHeader: {
    headerStyle: {
      backgroundColor: '#665757',
    },
    headerTitleAlign: 'center',
    headerTintColor: '#f0f0f4',
    headerTitleStyle: {
      fontWeight: 'bold',
      color: '#302f2d',
    },
    headerLeftContainerStyle: {
      paddingLeft: 10,
    },
  },
};
