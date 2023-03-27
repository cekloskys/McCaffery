import { FlatList, View, ActivityIndicator } from 'react-native';
import RestaurantItem from '../../components/RestaurantItem';
import styles from './styles';
import { useState, useEffect } from 'react';
import { DataStore, Hub } from 'aws-amplify';
import { useAuthContext } from '../../context/AuthContext';
import { ALERT_TYPE, Dialog, Root } from "react-native-alert-notification";
import { Restaurant, Dish } from '../../models';

export default function HomeScreen() {

  const { dbUser } = useAuthContext()
  const [restaurants, setRestaurants] = useState([]);

  const fetchRestaurants = async () => {
    try {
      let results = await DataStore.query(Restaurant);
      let dishes = await DataStore.query(Dish);
      let uniqueDishes = new Set();
      for (const dish of dishes) {
        uniqueDishes.add(dish.restaurantID);
      }
      const display = [];
      for (const uq of uniqueDishes) {
        let rest = results.find(r => r.id == uq)
        if (rest.name) {
          display.push(rest);
        }
      }
      setRestaurants(display);


    } catch (error) {
      console.log(error);
    }

  };

  useEffect(() => {
    const removeListener = Hub.listen('datastore', async ({ payload }) => {
      if (payload.event === 'syncQueriesReady') {
        fetchRestaurants();
      }
    });

    DataStore.start();

    return () => removeListener();
  }, []);

  if (restaurants.length === 0) {
    return (
        <ActivityIndicator size="large" color="#8B0000" style={{flex: 1}}/>
    )
  }

  return (
    <View style={styles.page}>
      <FlatList
        data={restaurants}
        renderItem={({ item }) => <RestaurantItem restaurant={item} />}
        showsVerticalScrollIndicator={false} />
    </View>
  );
}

