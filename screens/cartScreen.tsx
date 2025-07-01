import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, Alert, Modal } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import { CustomerContext } from './CustomerContext';
import io from 'socket.io-client';
import { getAddresses, getDBConnection } from '../db-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
let config = require('../Config')
let externalStyle = require('../Style');
const socket = io('http://10.0.2.2:5003/orders', {
  transports: ['websocket'],
});

const PaymentScreen = ({ route, navigation }) => {
  const { customerId } = useContext(CustomerContext);
  const { product_id, price, color, size, name, image, customer_id } = route.params || {};
  const [cartItems, setCartItems] = useState([]);
  const [orderValue, setOrderValue] = useState('0');
  const [deliveryFee, setDeliveryFee] = useState('0');
  const [total, setTotal] = useState('0');
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');

  const resetCart_ = async () => {
    setCartItems([]);
    await AsyncStorage.multiRemove(['product_id', 'quantity', 'color', 'size']);
  }

  const saveToAsyncStorage = async (item) => {
    try {
      await AsyncStorage.setItem('product_id', item.id.toString());
      await AsyncStorage.setItem('quantity', item.quantity.toString());
      await AsyncStorage.setItem('color', item.color);
      await AsyncStorage.setItem('size', item.size);
    } catch (error) {
      console.error('Error saving to AsyncStorage:', error);
    }
  };

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const result = await getAddresses(await getDBConnection());
        setAddresses(result);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    fetchAddresses();

    const loadCartFromAsyncStorage = async () => {
      try {
        const storedProductId = await AsyncStorage.getItem('product_id');
        const storedQuantity = await AsyncStorage.getItem('quantity');
        const storedColor = await AsyncStorage.getItem('color');
        const storedSize = await AsyncStorage.getItem('size');

        if (storedProductId && storedQuantity && storedColor && storedSize) {
          console.log("STOREDPRODUCTID" + storedProductId)
          const url = `${config.setting.databaseServerPath}/api/clothesSelection/${storedProductId}`;
          const response = await fetch(url);
          const productData = await response.json();

          setCartItems([{
            id: parseInt(storedProductId),
            name: productData.product_name,
            price: parseFloat(productData.product_price),
            quantity: parseInt(storedQuantity),
            image: productData.image || require('../logo/cozilla.png'),
            color: storedColor,
            size: storedSize
          }]);
        } else if (product_id && price && color && size && name) {
          const newItem = {
            id: product_id,
            name: name,
            price: parseFloat(price),
            quantity: 1,
            image: image || require('../logo/cozilla.png'),
            color: color,
            size: size
          };
          setCartItems([newItem]);
          saveToAsyncStorage(newItem);
        }
      } catch (error) {
        console.error('Error loading cart from AsyncStorage:', error);
      }
    };

    loadCartFromAsyncStorage();
  }, [product_id, price, color, size, name, image]);

  const calculateOrderOnServer = useCallback(() => {
    const orderItems = cartItems.map((item) => ({
      price: item.price,
      quantity: item.quantity,
    }));
    console.log("Emitting order data to server:", { order_items: orderItems });
    socket.emit('calculate_order', { order_items: orderItems });
  }, [cartItems]);

  useEffect(() => {
    console.log(product_id, price, color, size);
    socket.on("connect", () => {
      console.log("Connected to server with ID:", socket.id);
      calculateOrderOnServer();
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    socket.on('calculation_success', (data) => {
      console.log("Received calculation success data:", data);
      try {
        let result;
        if (typeof data === 'string') {
          result = JSON.parse(data);
        } else if (typeof data === 'object' && data !== null) {
          result = data;
        } else {
          throw new Error('Invalid data format received');
        }

        if (typeof result.order_value === 'number' &&
            typeof result.delivery_fee === 'number' &&
            typeof result.total === 'number') {
          setOrderValue(result.order_value.toFixed(2));
          setDeliveryFee(result.delivery_fee.toFixed(2));
          setTotal(result.total.toFixed(2));
        } else {
          throw new Error('Invalid data structure received');
        }
      } catch (error) {
        console.error("Error processing calculation data:", error);
        Alert.alert('Error', 'Failed to process order calculation');
      }
    });

    socket.on('calculation_error', (error) => {
      console.error("Received calculation error:", error);
      Alert.alert('Error', typeof error === 'string' ? error : 'An error occurred during calculation');
    });

    return () => {
      socket.off('calculation_success');
      socket.off('calculation_error');
    };
  }, [calculateOrderOnServer]);

  useEffect(() => {
    calculateOrderOnServer();
  }, [calculateOrderOnServer]);

  const handleQuantityChange = async (id, change) => {
    const updatedItems = cartItems.map((item) =>
      item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + change) }
        : item
    );
    setCartItems(updatedItems);
    if (updatedItems.length > 0) {
      await saveToAsyncStorage(updatedItems[0]);
    }
  };

  const handleDeleteItem = async (id) => {
    setCartItems([]);
    await resetCart_();
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={item.image} style={styles.productImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>RM{parseFloat(item.price).toFixed(2)}</Text>
        <Text>Colour: {item.color}</Text>
        <Text>Size: {item.size}</Text>
        <View style={styles.quantityControl}>
          <TouchableOpacity onPress={() => handleQuantityChange(item.id, -1)}>
            <Ionicons name="remove-circle-outline" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => handleQuantityChange(item.id, 1)}>
            <Ionicons name="add-circle-outline" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeleteItem(item.id)} style={styles.trashButton}>
            <Ionicons name="trash-outline" size={24} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {cartItems.length === 0 ? (
        <View style={styles.emptyCartContainer}>
          <Text style={styles.emptyCartText}>You have no items in the cart</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
          />
          <View style={styles.addressContainer}>
            <Text style={styles.quantityText}>Select Delivery Address:</Text>
            <Picker
              itemStyle={{ fontSize: 16, lineHeight: 25, paddingVertical: 10 }}
              selectedValue={selectedAddress}
              onValueChange={(itemValue) => setSelectedAddress(itemValue)}
              style={[styles.picker, {height: 50, fontSize: 16, padding: 10 }]}
            >
              {addresses.map((addressItem) => (
                <Picker.Item 
                  label={`${addressItem.address}, ${addressItem.phone_no}`} 
                  value={addressItem.address} 
                  key={addressItem.id}
                />
              ))}
            </Picker>
          </View>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Order value:</Text>
              <Text style={styles.summaryValue}>RM{orderValue}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery:</Text>
              <Text style={styles.summaryValue}>RM{deliveryFee}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>RM{total}</Text>
            </View>
            <TouchableOpacity
              style={externalStyle.buttonStyles.payButton}
              onPress={async () => {
                if (cartItems.length === 0) {
                  Alert.alert('Error', 'Cart is empty');
                  return;
                }
                if (!selectedAddress) {
                  Alert.alert('Error', 'Please select a delivery address');
                  return;
                }

                const { id, quantity, color, size } = cartItems[0];

                let url = config.setting.databaseServerPath + '/api/orders';

                try {
                  const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      product_id: id,
                      customer_id: parseInt(customerId),
                      size: size,
                      color: color,
                      quantity: quantity.toString(),
                      price: total,
                      address: selectedAddress,
                      status: 'In_Delivery'
                    }),
                  });

                  if (!response.ok) {
                    throw new Error('Error ' + response.status);
                  }

                  const respondJson = await response.json();

                  if (respondJson.affected > 0) {
                    Alert.alert("Successfully paid!", "Thank you for your purchase", [
                      {
                        text: 'Ok',
                        onPress: async () => {
                          await resetCart_();
                          navigation.setParams({
                            product_id: undefined,
                            price: undefined,
                            color: undefined,
                            size: undefined,
                            name: undefined,
                            image: undefined,
                          });
                        },
                      },
                    ]);
                  } else {
                    Alert.alert('Error in paying');
                  }
                } catch (error) {
                  console.log(error);
                  Alert.alert('Error', 'Failed to process payment');
                }
              }}
            >
              <Text style={styles.payButtonText}>Pay</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  productImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 20,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 14,
    color: '#888',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityText: {
    fontSize: 18,
    marginHorizontal: 10,
  },
  trashButton: {
    marginLeft: 'auto',
  },
  summaryContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 16,
    color: 'black',
  },
  summaryValue: {
    fontSize: 16,
    color: 'black',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  payButton: {
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
    marginLeft: 'auto',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addressContainer: {
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
  },
});

export default PaymentScreen;