import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation';
import { Amplify } from 'aws-amplify';
import awsconfig from './src/aws-exports';
import { withAuthenticator } from 'aws-amplify-react-native';
import BasketContextProvider from './src/context/BasketContext';
import OrderContextProvider from './src/context/OrderContext';
import AuthContextProvider from './src/context/AuthContext';
import { StripeProvider } from '@stripe/stripe-react-native';
import { LogBox } from 'react-native';

Amplify.configure({...awsconfig, Analytics: {disabled: true}});

const STRIPE_KEY =
  'pk_test_51MJf9jGbbj7dyMidAOniPN162ZuAduGXghFRgViAVWrMUR2i9tbqd9lM7PjlG32MnkZwWMZamhn1qQTrVVzIT2eT00aEnHZkCY'

function App() {
  return (
    <NavigationContainer>
      <AuthContextProvider>
        <BasketContextProvider>
        <OrderContextProvider>
        <StripeProvider publishableKey={STRIPE_KEY}>
          <RootNavigator />
        </StripeProvider>
        </OrderContextProvider>
        </BasketContextProvider>
      </AuthContextProvider>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

LogBox.ignoreLogs(['new NativeEventEmitter']);

export default withAuthenticator(App);