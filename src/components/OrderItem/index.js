import React from 'react';
import { View, Text} from 'react-native';
import styles from './styles';

const OrderItem = ({orderDish}) => {

  return (
    <View>
    <View style={styles.row}>
      <View style={styles.quantityContainer}>
        <Text>{orderDish.quantity}</Text>
      </View>
      <Text style={{ fontWeight: '600', maxWidth: 250 }} numberOfLines={1}>{orderDish.Dish.name}</Text>
      <Text style={{ marginLeft: 'auto', }}>$ {orderDish.Dish.price.toFixed(2)}</Text>
    </View>
    {orderDish.specialInstructions &&
      <View style={{ marginHorizontal: 35, }}>
        <Text style={{ fontStyle: 'italic', }}>{orderDish.specialInstructions}</Text>
      </View>
    }
  </View>
  );
};

export default OrderItem;