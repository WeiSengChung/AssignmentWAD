import React, { useEffect, useState } from 'react';
import {StyleSheet, Platform, ScrollView, View, TouchableWithoutFeedback} from 'react-native';
import {InputWithLabel, AppButton} from '../UI';
import { LogBox } from 'react-native';
import { getDBConnection, createAddress } from '../db-service';
import { formatted } from '../utility';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const CreateScreen = ({route, navigation} : any ) => {

    const[name, setName] = useState('');
    const[address, setAddress] = useState('');
    const[phone_no, setPhoneNo] = useState('');
    const[date, setDate] = useState(new Date(Date.now()));
    const[openPicker, setOpenPicker] = useState(false);

    const openDatePicker = () => {
        setOpenPicker(true);
    }

    const onDateSelected = (event: DateTimePickerEvent, value: any ) => {
        setDate(value);
        setOpenPicker(false);
    }

    useEffect(()=>{
        navigation.setOptions({headerTitle: 'Add New Address'});
    },[]);

    const _insert = async () => {
        await createAddress(await getDBConnection(), name,address,phone_no, date.getTime());
        route.params.refresh();
        navigation.goBack();
    }

    return (
      <ScrollView style={styles.container}>
        <InputWithLabel
          textLabelStyle={styles.TextLabel}
          textInputStyle={styles.TextInput}
          label={'Name'}
          placeholder={'type Name here'}
          value={name}
          onChangeText={(name:any) => {
            setName(name);
          }}
          orientation={'vertical'}
        />
        <InputWithLabel
          textLabelStyle={styles.TextLabel}
          textInputStyle={styles.TextInput}
          placeholder={'type Address here'}
          label={'Address'}
          value={address}
          onChangeText={(address:any) => {
            setAddress(address);
          }}
          orientation={'vertical'}
        />
        <InputWithLabel
          textLabelStyle={styles.TextLabel}
          textInputStyle={styles.TextInput}
          placeholder={'type phone number here'}
          label={'Phone no'}
          value={phone_no}
          onChangeText={(phone_no:any) => {
            setPhoneNo(phone_no);
          }}
          orientation={'vertical'}
        />
        <TouchableWithoutFeedback onPress={openDatePicker}>
          <View>
            <InputWithLabel
              textInputStyle={styles.TextInput}
              textLabelStyle={styles.TextLabel}
              label="Date:"
              value={formatted(new Date(date))}
              editable={false}></InputWithLabel>
          </View>
        </TouchableWithoutFeedback>

        {openPicker &&
          <DateTimePicker
            value={new Date(date)}
            mode={'date'}
            display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
            is24Hour={false}
            onChange={onDateSelected}
            style={styles.datePicker}
        />}


        <AppButton
          style={styles.button}
          title={'Save'}
          theme={'primary'}
          onPress={_insert}
        />
      </ScrollView>
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
    color: '#000099',
  },

  pickerItemStyle: {
    fontSize: 20,
    color: '#000099',
  },
  button: {
    margin: 5,
    alignItems: 'center',
  },
  buttonText: {
    padding: 20,
    fontSize: 20,
    color: 'white',
  },

  datePicker: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: 320,
    height: 260,
    display: 'flex',
  }
});

export default CreateScreen;
