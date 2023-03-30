import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';
import { useBasketContext } from '../../context/BasketContext';

const BasketItem = ({ basketItem }) => {

  const { basketDish } = useBasketContext();


  return (
    <View style={styles.row}>
      <View style={styles.quantityContainer}>
        <Text>{basketItem.quantity}</Text>
      </View>
      <Text style={{ fontWeight: '600', maxWidth: 250 }} numberOfLines={1}>{basketItem?.Dish.name}</Text>
      <Text style={{ marginLeft: 'auto', }}>$ {basketItem?.Dish.price.toFixed(2)}</Text>
      {basketDish?.specialInstructions &&
        <View style={{ marginHorizontal: 35, }}>
          <Text style={{ fontStyle: 'italic', }}>{basketDish?.specialInstructions}</Text>
        </View>
      }
    </View>
  );
};

export default BasketItem;