import React, { useState, useEffect } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Order = ({order}) => {

  
  const [createdAt, setCreatedAt] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    if (!order.createdAt) {
      return;
    }

    const results = order?.createdAt?.split('T');
    setCreatedAt(results);

  }, [order.createdAt]);
  

  const onPress = () => {
    navigation.navigate('Order', {id: order.id})
  };

  return (
    <Pressable 
      onPress={onPress}
      style={{flexDirection: 'row', margin: 10, alignItems: 'center',}}>
        <Image 
            source={{uri: order.Restaurant.image}} 
            style={{width: 100, height: 100, marginRight: 10,}} />
        <View style={{flex: 1,}}>
            <Text style={{fontWeight: '600', fontSize: 16,}}>{order.Restaurant.name}</Text>
            <Text style={{color: 'grey',}}>Total: ${order.total.toFixed(2)}</Text>
            <Text style={{color: 'grey',}}>Status: {order.status}</Text>
            <Text style={{color: 'grey',}}>Pickup Date/Time: {order.createdAt ? createdAt[0] : ''} {order.pickUpTime}</Text>
        </View>  
    </Pressable>
  );
};

export default Order;