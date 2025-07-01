import React, { useState, useEffect, useContext, useCallback  } from 'react'; 
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useFocusEffect  } from '@react-navigation/native';
import { CustomerContext } from './CustomerContext'; // Assuming you have a CustomerContext providing the customer_id
let config = require('../Config');

interface Order {
  order_id: string;
  product_id: string;
  customer_id: string;
  quantity: number;
  price: number;
  address: string;
  status: string;
  product_name?: string;
}
const StatusScreen = ({ route, navigation }: any) => {
  const { customerId } = useContext(CustomerContext); // Fetch customer ID from the context
  const [orders, setOrders] = useState([]); // Initialize orders state
  const [completedOrders, setCompletedOrders] = useState([]);

  const fetchProductName = async (productId: string): Promise<string> => {
    try {
      let serverUrl = `${config.setting.databaseServerPath}/api/clothesCategories/${productId}`;
      const response = await fetch(serverUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch product details');
      }
      const data = await response.json();
      return data.product_name;
    } catch (error) {
      console.error('Error fetching product details:', error);
      return 'Unknown Product';
    }
  };
  // Function to fetch orders from the database server
  const fetchOrders = async () => {
    console.log(customerId);
    try {
      let serverUrl = `${config.setting.databaseServerPath}/api/orders/${customerId}/In_Delivery`;
      const response = await fetch(serverUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data: Order[] = await response.json();
      const ordersWithProductNames = await Promise.all(
        data.map(async (order) => {
          const productName = await fetchProductName(order.product_id);
          return { ...order, product_name: productName };
        })
      );
      setOrders(ordersWithProductNames);
    } catch (error) {
      console.error('Error fetching orders:', error);
      Alert.alert('Error', 'Could not fetch orders.');
    }
  };

  // Use effect to fetch the orders on component mount
  useEffect(() => {
    fetchOrders();
  }, [customerId]);

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [fetchOrders])
  );

  const handleOrderReceived = (order) => {
    let serverUrl = `${config.setting.databaseServerPath}/api/orders/${order.order_id}`;
    fetch(serverUrl, {
      method: 'PUT',
      headers:{
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: "Completed",
        order_id : parseInt(order.order_id),
      })
    })
    .then(response => {
      console.log(response);
      if(!response.ok)
      {
        Alert.alert("Didn't update successfully");
        throw Error("Error, " + response.status);
      }
      return response.json();
    })
    .then(respondJson => {
      if(respondJson.affected > 0)
      {
        Alert.alert("Successfully confirmed order, check in history");
        setCompletedOrders([...completedOrders, order]);
        setOrders(orders.filter(o => o.order_id !== order.order_id));
      }
    })
    .catch(err => console.log(err))
  };

  const goToHistoryScreen = () => {
    navigation.navigate('History', { completedOrders });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {orders.length > 0 ? (
        orders.map((item, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.label}>Order ID: {item.order_id}</Text>
            <Text style={styles.label}>Product: {item.product_name}</Text>
            <Text style={styles.label}>Customer ID: {item.customer_id}</Text>
            <Text style={styles.label}>Product Quantity: {item.quantity}</Text>
            <Text style={styles.label}>Total Price: RM{parseFloat(item.price).toFixed(2)}</Text>
            <Text style={styles.label}>Address: {item.address}</Text>
            <Text style={styles.label}>Status: {item.status}</Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleOrderReceived(item)}
              >
                <Text style={styles.buttonText}>Order Received</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.noOrdersText}>No current orders.</Text>
      )}

      <TouchableOpacity style={styles.historyButton} onPress={goToHistoryScreen}>
        <Text style={styles.historyButtonText}>View History</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '90%',
    padding: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#665757',
    padding: 10,
    borderRadius: 20,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  noOrdersText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 20,
  },
  historyButton: {
    backgroundColor: '#665757',
    padding: 10,
    borderRadius: 20,
    marginTop: 20,
  },
  historyButtonText: {
    fontSize: 20,
    color: 'white',
    alignSelf: 'center',
  },
});

export default StatusScreen;
