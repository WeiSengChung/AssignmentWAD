import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { CustomerContext } from './CustomerContext';
import { useNavigation, CommonActions } from '@react-navigation/native';

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

const HistoryScreen = () => {
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { customerId } = useContext(CustomerContext);
  const navigation = useNavigation();

  const goToStatusScreen = () => {
    navigation.navigate('Status');
  };

  const fetchCompletedOrders = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${config.setting.databaseServerPath}/api/orders/${customerId}/Completed`);
      if (!response.ok) {
        throw new Error('Failed to fetch completed orders');
      }
      const data = await response.json();
      setCompletedOrders(data);
    } catch (error) {
      console.error('Error fetching completed orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchCompletedOrders();
    }, [customerId])
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  const handleDeleteItem = (order_id) =>{
    console.log("ORDER: "+order_id);
    let url = config.setting.databaseServerPath + "/api/orders";
    console.log(url);
    Alert.alert(
      'Confirm Delete',
      'Do you really want to Delete?',
      [
        {
          text: 'No',
          onPress: () => console.log('Delete cancelled'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            fetch(`${url}/${order_id}`,{
              method: 'DELETE',
              headers:{
                Accept:'application/json',
                'Content-type': 'application/json'
              },
              body:JSON.stringify({
                order_id: order_id,
              })
            })
            .then(response => {
              if(!response.ok)
              {
                Alert.alert("Error", response.status.toString());
                throw Error("Error"+ response.status);
              }
              return response.json();
            })
            .then(respondJson => {
              if(respondJson.affected ===0)
              {
                Alert.alert("Error deleting")
              }
              else
              {
                Alert.alert("Successfully deleted", "", [{
                  text:"Ok",
                  onPress: () => {
                    navigation.dispatch(
                      CommonActions.reset({
                        index: 0,
                        routes: [{ name: 'MainPage' }],
                      })
                    );
                  }
                }]);
              }

            })
            .catch(err => {console.log(err)})
          },
        },
      ],
      { cancelable: false })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Completed Orders:</Text>
      {completedOrders.length > 0 ? (
        <FlatList
          data={completedOrders}
          keyExtractor={(item) => item.order_id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.label}>Order ID: {item.order_id}</Text>
              <Text style={styles.label}>Product ID: {item.product_id}</Text>
              <Text style={styles.label}>Quantity: {item.quantity}</Text>
              <Text style={styles.label}>Total Price: RM{parseFloat(item.price.toString()).toFixed(2)}</Text>
              <Text style={styles.label}>Address: {item.address}</Text>
              <Text style={styles.label}>Status: {item.status}</Text>
              <TouchableOpacity onPress={() => handleDeleteItem(item.order_id)} style={styles.trashButton}>
                <Ionicons name="trash-outline" size={24} color="red" />
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <View style={{flex:1}}>
        <Text style={styles.noOrdersText}>No completed orders.</Text>
        <TouchableOpacity style={styles.historyButton} onPress={goToStatusScreen}>
          <Text style={styles.historyButtonText}>View Orders Status</Text>
        </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  card: {
    padding: 20,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  noOrdersText: {
    fontSize: 18,
    color: '#555',
  },
  trashButton: {
    marginLeft: 'auto',
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

export default HistoryScreen;
