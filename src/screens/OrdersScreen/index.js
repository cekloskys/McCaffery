import { View, FlatList, RefreshControl } from 'react-native';
import OrderComponent from '../../components/Order';
import { useOrderContext } from '../../context/OrderContext';
import { useCallback, useEffect, useState } from 'react';
import { DataStore, Predicates } from 'aws-amplify';
import { Order, Restaurant } from '../../models';
import { useAuthContext } from '../../context/AuthContext';

const OrdersScreen = () => {

  const { finalOrders, setFinalOrders } = useOrderContext();
  const { dbUser, setDBUser } = useAuthContext();
  const [refreshing, setRefreshing] = useState(false);
  const [ sortedFinalOrders, setSortedFinalOrders ] = useState([]);

  const { setOrders } = useOrderContext();


  useEffect(() => {
    if (finalOrders.length === 0) {
      return;
    }
    const sorted = finalOrders.sort((d1, d2) => new Date(d2.createdAt).getTime() - new Date(d1.createdAt).getTime());
    setSortedFinalOrders(sorted);
  }, [finalOrders]);
    
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const orders = await DataStore.query(Order, o => o.userID.eq(dbUser.id));
      const restaurants = await DataStore.query(Restaurant);
      setFinalOrders(
        orders.map(order => ({
          ...order,
          Restaurant: restaurants.find(r => r.id == order.orderRestaurantId),
        }))
      );
      const sorted = finalOrders.sort((d1, d2) => new Date(d2.createdAt).getTime() - new Date(d1.createdAt).getTime());
      setSortedFinalOrders(sorted);
      setRefreshing(false);
    } catch (error) {
      console.error(error);
    }
  }, [refreshing]);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={sortedFinalOrders}
        renderItem={({ item }) => <OrderComponent order={item} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>

  );
};

export default OrdersScreen;