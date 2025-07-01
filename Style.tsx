import React from 'react';
import {StyleSheet} from 'react-native';

export const buttonStyles = StyleSheet.create({
  button: {
    borderRadius: 50,
    margin: 20,
    alignItems: 'center',
    height: 70,
    width: 200,
    backgroundColor: '#665757',
    color: '#302F2D',
  },
  buttonText: {
    padding: 20,
    fontSize: 20,
    color: 'white',
    alignSelf: 'center',
  },
  payButton: {
    backgroundColor: '#665757',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 20,
    alignItems: 'center',
    marginLeft: 'auto',
  },
});

export const inputStyles = StyleSheet.create({
  container: {
    height: 100,
  },
  label: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
    textAlignVertical: 'center',
  },

  input: {
    color: '#493D15',
    fontSize: 15,
    fontStyle: 'normal',
    marginLeft: 20,
  },
});
