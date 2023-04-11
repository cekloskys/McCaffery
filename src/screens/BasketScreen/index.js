import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, Alert } from 'react-native';
import styles from './styles';
import BasketItem from '../../components/BasketItem';
import { useBasketContext } from '../../context/BasketContext';
import { useOrderContext } from '../../context/OrderContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { useStripe } from '@stripe/stripe-react-native';
import { createPaymentIntent } from '../../graphql/mutations';
import { API, graphqlOperation } from 'aws-amplify';

const BasketScreen = () => {
    const { createOrder } = useOrderContext();

    const { restaurant, finalBasketDishes, totalPrice, deleteBasket } = useBasketContext();
    const [timePicker, setTimePicker] = useState(false);
    const [time, setTime] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState('');
    const [clientSecret, setClientSecret] = useState('');

    const { initPaymentSheet, presentPaymentSheet } = useStripe();

    const navigation = useNavigation();

    function showTimePicker() {
        setTimePicker(true);
    };

    function onTimeSelected(event, value) {
        const currentTime = value || time;
        if(value) {
            setTime(value);
        }
        let tempTime = new Date(currentTime);
        let hours = tempTime.getHours();
        let minutes = tempTime.getMinutes();
        let timeValue = "" + ((hours > 12) ? hours - 12 : hours);
        timeValue += (minutes < 10) ? ":0" + minutes : ":" + minutes;
        timeValue += (hours >= 12) ? " PM" : " AM";
        setSelectedTime(timeValue);
        setTimePicker(false);
    };

    const onDeleteBasket = () => {
        deleteBasket(finalBasketDishes[0].basketID);
        navigation.navigate('Restaurants');
        alert('Basket deleted.')
    };

    useEffect(() => {
        fetchPaymentIntent();
    }, []);

    useEffect(() => {
        if (clientSecret) {
            initializePaymentSheet();
        }
    }, [clientSecret]);

    const fetchPaymentIntent = async () => {
        const amount = Math.floor(totalPrice * 100);
        const response = await API.graphql(
            graphqlOperation(createPaymentIntent, { amount }),
        );
        setClientSecret(response.data.createPaymentIntent.clientSecret);
    };

    const initializePaymentSheet = async () => {
        if (!clientSecret) {
            return;
        }
        const { error } = await initPaymentSheet({
            merchantDisplayName: 'McCaffery To Go',
            paymentIntentClientSecret: clientSecret,
        });
        
        console.log(error);

    };

    const openPaymentSheet = async () => {
        if (!clientSecret) {
            return;
        }
        const { error } = await presentPaymentSheet({ clientSecret });

        if (error) {
            Alert.alert(`${error.code}`, error.message + '.');
        } else {
            createOrder(selectedTime);
            alert('The payment has been confirmed.');
            navigation.navigate('Restaurants');
        }
    };

    const validateOrder = () => {

        if (!selectedTime) {
            Alert.alert('Error', 'Please select a pick up time between ' + restaurant.startHrs + ' and ' +
                restaurant.endHrs);
            return
        }

        const startHrs = restaurant.startHrs.split(':');
        const startMins = startHrs[1].split(' ');

        const endHrs = restaurant.endHrs.split(':');
        const endMins = endHrs[1].split(' ');

        const selectedHrs = selectedTime.split(':');
        const selectedMins = selectedHrs[1].split(' ');

        const today = new Date();
        const day = today.getDate();
        const month = today.getMonth();
        const year = today.getFullYear();

        const selected = new Date((month + 1) + '/' + day + '/' + year + ' ' +
            selectedHrs[0] + ':' + selectedMins[0] + ':00' + ' ' + selectedMins[1] + 'UTC+0000');
        const end = new Date((month + 1) + '/' + day + '/' + year + ' ' +
            endHrs[0] + ':' + endMins[0] + ':00' + ' ' + endMins[1] + 'UTC+0000');
        const start = new Date((month + 1) + '/' + day + '/' + year + ' ' +
            startHrs[0] + ':' + startMins[0] + ':00' + ' ' + startMins[1] + 'UTC+0000');

        if (selected < start || selected > end) {
            alert('Please select a pick up time between ' + restaurant.startHrs + ' and ' +
                restaurant.endHrs);
            return;
        }

        openPaymentSheet();
        //createOrder(selectedTime);
    }

    return (
        <View style={styles.page}>
            <Text style={styles.name}>{restaurant?.name}</Text>
            {timePicker && (
                <DateTimePicker
                    value={time}
                    mode={'time'}
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    is24Hour={false}
                    onChange={onTimeSelected}
                    minuteInterval={5}
                    
                />
            )}
            {!timePicker && (
                <View>
                    <Pressable onPress={showTimePicker} style={styles.button}>
                        <Text style={styles.buttonText}>{!selectedTime ? 'SELECT PICKUP TIME' :
                            'PICKUP TIME: ' + (time.getMonth() + 1) + '/' + time.getDate() + '/' + time.getFullYear() + ' ' + selectedTime}</Text>
                    </Pressable>
                </View>
            )}
            <View style={styles.separator}></View>
            <Text style={{ fontSize: 18, }}>Your Items</Text>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={finalBasketDishes}
                renderItem={({ item }) => <BasketItem basketItem={item} />}
            />
            <View style={styles.separator}></View>
            <View style={styles.row}>
                <Text style={{ fontWeight: '600', color: 'grey' }}>Service Fee:</Text>
                <Text style={{ marginLeft: 'auto', color: 'grey' }}>$ {restaurant.serviceFee.toFixed(2)}</Text>
            </View>
            <View style={styles.row}>
                <Text style={{ fontWeight: '600', color: 'grey' }}>Total:</Text>
                <Text style={{ marginLeft: 'auto', color: 'grey' }}>$ {totalPrice.toFixed(2)}</Text>
            </View>
            <Pressable onPress={validateOrder} style={styles.button}>
                <Text style={styles.buttonText}>CREATE ORDER</Text>
            </Pressable>
            <Pressable onPress={onDeleteBasket} style={styles.cancelbutton} >
                <Text style={styles.buttonText}>DELETE BASKET</Text>
            </Pressable>
        </View>
    );
};

export default BasketScreen;