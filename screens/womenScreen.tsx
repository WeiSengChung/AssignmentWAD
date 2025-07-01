import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';

const ProductsScreen = ({route, navigation}) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('t_shirt');
    const [customerType, setCustomerType] = useState('Women');
  
    useEffect(() => {
      const fetchProducts = async () => {
        setLoading(true);
        try {
          let url = `http://10.0.2.2:5000/api/clothesSelection/${customerType}/${selectedCategory}`;
          console.log(url)
          const response = await fetch(url);
          const textResponse = await response.text();
          console.log('Response:', textResponse);
  
          if (response.ok) {
            const data = JSON.parse(textResponse);
            setProducts(data);
            console.log(data);
          } else {
            console.error('Error:', textResponse);
          }
  
          setLoading(false);
        } catch (error) {
          console.error('Fetch error:', error);
          setLoading(false);
        }
      };
  
      fetchProducts();
    }, [selectedCategory, customerType]);
  
    const handleItemPress = (item, imageSource) => {
      // Handle item press here
      console.log('Clicked item:', item);
      navigation.navigate("Product", {
          product_id: item.product_id + "", 
          imageSource: imageSource
      });
    };
  
  
  
 // Object mapping for image paths based on categories
const imagePaths = {
  t_shirt: {
    ts1: require("../productImg/women/top/t-shirt/ts1.jpg"),
    ts2: require("../productImg/women/top/t-shirt/ts2.jpg"),
    ts3: require("../productImg/women/top/t-shirt/ts3.jpg"),
    ts4: require("../productImg/women/top/t-shirt/ts4.jpg"),
    ts5: require("../productImg/women/top/t-shirt/ts5.jpg")
  },
  long_sleeve: {
    ls1: require("../productImg/women/top/longSleeve/ls1.jpg"),
    ls2: require("../productImg/women/top/longSleeve/ls2.jpg"),
    ls3: require("../productImg/women/top/longSleeve/ls3.jpg"),
    ls4: require("../productImg/women/top/longSleeve/ls4.jpg"),
    ls5: require("../productImg/women/top/longSleeve/ls5.jpg")
  },
  hoodies: {
    h1: require("../productImg/women/top/hoodie/h1.jpg"),
    h2: require("../productImg/women/top/hoodie/h2.jpg"),
    h3: require("../productImg/women/top/hoodie/h3.jpg"),
    h4: require("../productImg/women/top/hoodie/h4.jpg"),
    h5: require("../productImg/women/top/hoodie/h5.jpg")
  },
  sweatshirt: {
    sw1: require("../productImg/women/top/sweatshirt/s1.jpg"),
    sw2: require("../productImg/women/top/sweatshirt/s2.jpg"),
    sw3: require("../productImg/women/top/sweatshirt/s3.jpg"),
    sw4: require("../productImg/women/top/sweatshirt/s4.jpg"),
    sw5: require("../productImg/women/top/sweatshirt/s5.jpg")
  },
  blouses: {
    b1: require("../productImg/women/top/blouses/b1.jpg"),
    b2: require("../productImg/women/top/blouses/b2.jpg"),
    b3: require("../productImg/women/top/blouses/b3.jpg"),
    b4: require("../productImg/women/top/blouses/b4.jpg"),
    b5: require("../productImg/women/top/blouses/b5.jpg")
  },
  shorts: {
    sh1: require("../productImg/women/bottom/shorts/s1.jpg"),
    sh2: require("../productImg/women/bottom/shorts/s2.jpg"),
    sh3: require("../productImg/women/bottom/shorts/s3.jpg"),
    sh4: require("../productImg/women/bottom/shorts/s4.jpg"),
    sh5: require("../productImg/women/bottom/shorts/s5.jpg")
  },
  jeans: {
    j1: require("../productImg/women/bottom/jeans/j1.jpg"),
    j2: require("../productImg/women/bottom/jeans/j2.jpg"),
    j3: require("../productImg/women/bottom/jeans/j3.jpg"),
    j4: require("../productImg/women/bottom/jeans/j4.jpg"),
    j5: require("../productImg/women/bottom/jeans/j5.jpg")
  },
  casual_pants: {
    cp1: require("../productImg/women/bottom/casualPants/cs1.jpg"),
    cp2: require("../productImg/women/bottom/casualPants/cs2.jpg"),
    cp3: require("../productImg/women/bottom/casualPants/cs3.jpg"),
    cp4: require("../productImg/women/bottom/casualPants/cs4.jpg"),
    cp5: require("../productImg/women/bottom/casualPants/cs5.jpg")
  },
  long_pants: {
    lp1: require("../productImg/women/bottom/longPants/lp1.jpg"),
    lp2: require("../productImg/women/bottom/longPants/lp2.jpg"),
    lp3: require("../productImg/women/bottom/longPants/lp3.jpg"),
    lp4: require("../productImg/women/bottom/longPants/lp4.jpg"),
    lp5: require("../productImg/women/bottom/longPants/lp5.jpg")
  },
  legging: {
    lg1: require("../productImg/women/bottom/legging/l1.jpg"),
    lg2: require("../productImg/women/bottom/legging/l2.jpg"),
    lg3: require("../productImg/women/bottom/legging/l3.jpg"),
    lg4: require("../productImg/women/bottom/legging/l4.jpg"),
    lg5: require("../productImg/women/bottom/legging/l5.jpg")
  }
  };
  // Add other categories here as required


// Function to get image path based on product category and specific image
const getImageForCategory = (category, productId) => {
  // Ensure category matches the keys in imagePaths

  const categoryImages = imagePaths[category];

  if (!categoryImages) {
    return require("../productImg/default.jpg"); // Fallback to default image if category not found
  }

  // Map productId to an image key (this is basic, adjust logic as necessary)
  const keys = Object.keys(categoryImages);
  const imageKey = keys[productId % keys.length]; // Cycles through available images

  return categoryImages[imageKey] || require("../productImg/default.jpg");
};

// Render item with dynamic image assignment
const renderItem = ({ item }) => {
  const imageSource = getImageForCategory(item.clothesCategories, item.product_id); // Fetch appropriate image based on category and productId

  return (
    <TouchableOpacity onPress={() => handleItemPress(item, imageSource)} style={styles.itemContainer}>
      <Image style={styles.image} source={imageSource} />
      <Text style={styles.name}>{item.product_name}</Text>
      <Text style={styles.price}>RM {item.product_price.toFixed(2)}</Text>
    </TouchableOpacity>
  );
};


  
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }

  return (
    <View style={styles.container}>
      <ScrollView horizontal style={styles.categoryContainer} showsHorizontalScrollIndicator={false}>
        <TouchableOpacity onPress={() => setSelectedCategory('t_shirt')}>
          <Text style={selectedCategory === 't-shirt' ? styles.selectedCategory : styles.category}>T-shirt</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedCategory('long_sleeve')}>
          <Text style={selectedCategory === 'long_sleeve' ? styles.selectedCategory : styles.category}>Long Sleeve</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedCategory('hoodies')}>
          <Text style={selectedCategory === 'hoodies' ? styles.selectedCategory : styles.category}>Hoodies</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedCategory('sweatshirt')}>
          <Text style={selectedCategory === 'sweatshirt' ? styles.selectedCategory : styles.category}>Sweatshirt</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedCategory('blouses')}>
          <Text style={selectedCategory === 'blouses' ? styles.selectedCategory : styles.category}>Blouses</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedCategory('shorts')}>
          <Text style={selectedCategory === 'shorts' ? styles.selectedCategory : styles.category}>Shorts</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedCategory('jeans')}>
          <Text style={selectedCategory === 'jeans' ? styles.selectedCategory : styles.category}>Jeans</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedCategory('casual_pants')}>
          <Text style={selectedCategory === 'casual_pants' ? styles.selectedCategory : styles.category}>Casual Pants</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedCategory('long_pants')}>
          <Text style={selectedCategory === 'long_pants' ? styles.selectedCategory : styles.category}>Long Pants</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedCategory('legging')}>
          <Text style={selectedCategory === 'legging' ? styles.selectedCategory : styles.category}>Legging</Text>
        </TouchableOpacity>
      </ScrollView>

      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.product_id}
        numColumns={2}
        contentContainerStyle={styles.grid}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  category: {
    fontSize: 16,
    padding: 10,
    backgroundColor: '#ddd',
    marginHorizontal: 5,
    borderRadius: 10,
  },
  selectedCategory: {
    fontSize: 16,
    padding: 10,
    backgroundColor: '#000',
    color: '#fff',
    marginHorizontal: 5,
    borderRadius: 10,
  },
  grid: {
    justifyContent: 'space-between',
  },
  itemContainer: {
    flex: 1,
    margin: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  price: {
    fontSize: 14,
    marginBottom: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProductsScreen;
