import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';

const ProductDetailScreen = ({ route, navigation }) => {
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [showDescription, setShowDescription] = useState(false);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const { product_id, imageSource, customer_id } = route.params;  // Get product_id and imageSource from navigation params

    const colors = ['black', 'white', 'grey', 'blue'];
    const sizes = ['S', 'M', 'L', 'XL'];

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                console.log(product_id);
                const response = await fetch(`http://10.0.2.2:5000/api/clothesSelection/${product_id}`);
                const data = await response.json();
                console.log(data);
                setProduct(data);
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [product_id]);

    const handleColorSelect = (color) => {
        setSelectedColor(color);
      };
    
      const handleSizeSelect = (size) => {
        setSelectedSize(size);
      };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (!product) {
        return <Text style={styles.errorText}>Product not found</Text>;
    }

    return (
        <ScrollView style={styles.container}>
            <Image source={imageSource} style={styles.productImage} />
            <Text style={styles.productTitle}>{product.product_name}</Text>
            <Text style={styles.productPrice}>RM {product.product_price ? product.product_price.toFixed(2) : 'N/A'}</Text>

            <Text style={styles.sectionTitle}>Colours</Text>
            <View style={styles.colorContainer}>
                {colors.map((color, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.colorOption, selectedColor === color && styles.selectedColor, { backgroundColor: color }]}
                        onPress={() => handleColorSelect(color)}
                    />
                ))}
            </View>

            <Text style={styles.sectionTitle}>Sizes</Text>
            <View style={styles.sizeContainer}>
                {sizes.map((size, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.sizeOption, selectedSize === size && styles.selectedSize]}
                        onPress={() => handleSizeSelect(size)}
                    >
                      <Text style={selectedSize === size? styles.selectedSizeText : styles.sizeText}>{size}</Text> 
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity style={styles.descriptionToggle} onPress={() => setShowDescription(!showDescription)}>
                <Text style={styles.descriptionToggleText}>
                    {showDescription ? 'Hide Description' : 'Show Description'}
                </Text>
            </TouchableOpacity>

            {showDescription && (
                <Text style={styles.descriptionText}>
                    {product.description || 'No description available.'}
                </Text>
            )}

        <TouchableOpacity style={styles.addToCartButton} onPress={() =>{
             navigation.navigate("MainPage", {screen: 'Cart', 
                params:{ 
                product_id : product_id, 
                name:product.product_name, 
                price: product.product_price, 
                color: selectedColor, size: selectedSize, 
                customer_id: customer_id
          }})
      }}>
        <Text style={styles.addToCartText}>Add To Cart</Text>
      </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#ffffff',
    },
    productImage: {
        width: '100%',
        height: 400,
        resizeMode: 'cover',
    },
    productTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 16,
    },
    productPrice: {
        fontSize: 20,
        color: '#888',
        marginVertical: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 16,
    },
    colorContainer: {
        flexDirection: 'row',
        marginVertical: 8,
    },
    colorOption: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    selectedColor: {
        borderWidth: 2,
        borderColor: '#000',
    },
    sizeContainer: {
        flexDirection: 'row',
        marginVertical: 8,
    },
    sizeOption: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        padding: 8,
        marginRight: 10,
    },
    selectedSize: {
        backgroundColor: '#000',
    },
    sizeText: {
        fontSize: 16,
        color: '#000',
    },
    descriptionToggle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 16,
    },
    descriptionToggleText: {
        fontSize: 16,
        color: '#333',
    },
    descriptionText: {
        fontSize: 14,
        color: '#666',
        marginVertical: 8,
    },
    addToCartButton: {
        backgroundColor: '#4C4C4C',
        paddingVertical: 16,
        borderRadius: 4,
        alignItems: 'center',
        marginTop: 20,
    },
    addToCartText: {
        color: '#fff',
        fontSize: 18,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
    selectedSizeText: {
        fontSize: 16,
        color: '#fff',
      },
});

export default ProductDetailScreen;
