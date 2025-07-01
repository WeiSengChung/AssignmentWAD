import React, { useState, useEffect } from 'react';
import {StyleSheet, Alert, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import { InputWithLabel } from '../UI';
import {FloatingAction} from 'react-native-floating-action';
import { getDBConnection, getAddressById, deleteAddress } from '../db-service';
import { formatted } from '../utility';

const actions = [
  {
    text: 'Edit',
    color: '#665757',
    icon: require('../icons/edit_icon.png'),
    name: 'edit',
    position: 2,
  },
  {
    text: 'Delete',
    color: '#665757',
    icon: require('../icons/delete_icon.jpg'),
    name: 'delete',
    position: 1,
  },
];

const ViewScreen = ({route, navigation} : any ) => {

    const [addressId, setAddressId] = useState(route.params.id);
    const [address, setAddress] = useState<any>(null);

    const _queryByID = async (id: any) => {
        setAddress(await getAddressById(await getDBConnection(), id));
    }

    const _delete = () => {
    Alert.alert('Confirm to delete ?', address.name, [
      {
        text: 'No',
        onPress: () => {},
      },
      {
        text: 'Yes',
        onPress: async () => {
            await deleteAddress(await getDBConnection(), addressId)
            route.params.refresh();
            navigation.goBack();
        },
      },
    ]);
  }

    useEffect(()=>{
      _queryByID(addressId);
    },[]);

    return (
      <View style={styles.container}>
        <ScrollView>
          <InputWithLabel
            textLabelStyle={styles.TextLabel}
            textInputStyle={styles.TextInput}
            label={'Name'}
            value={address ? address.name : ''}
            orientation={'vertical'}
            editable={false}
          />
          <InputWithLabel
            textLabelStyle={styles.TextLabel}
            textInputStyle={styles.TextInput}
            label={'Address'}
            value={address ? address.address : ''}
            orientation={'vertical'}
            editable={false}
            multiline={true}
          />
          <InputWithLabel
            textLabelStyle={styles.TextLabel}
            textInputStyle={styles.TextInput}
            label={'Phone number'}
            value={address ? address.phone_no : ''}
            orientation={'vertical'}
            editable={false}
          />
          <InputWithLabel
            textLabelStyle={styles.TextLabel}
            textInputStyle={styles.TextInput}
            label={'Date'}
            value={address ? formatted(new Date(address.date)) : ''}
            orientation={'vertical'}
            editable={false}
          />
        </ScrollView>
        <FloatingAction
          actions={actions}
          color={'#665757'} 
          onPressItem={name => {
            switch (name) {
              case 'edit':
                navigation.navigate('EditAddress', {
                  id: address ? address.id : 0,
                  headerTitle: address ? address.name : '',
                  refresh: _queryByID,
                  homeRefresh: route.params.refresh,
                });
                break;
              case 'delete':
                _delete();
                break;
            }
          }}
        />
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  TextLabel: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 3,
    textAlignVertical: 'center',
  },

  TextInput: {
    fontSize: 24,
    color: 'black',
  },

  pickerItemStyle: {
    fontSize: 20,
    color: '#000099',
  },
});

export default ViewScreen;
