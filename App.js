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
import { Provider } from 'react-native-paper';

Amplify.configure({...awsconfig, Analytics: {disabled: true}});

const STRIPE_KEY =
  'pk_test_51MJf9jGbbj7dyMidAOniPN162ZuAduGXghFRgViAVWrMUR2i9tbqd9lM7PjlG32MnkZwWMZamhn1qQTrVVzIT2eT00aEnHZkCY'

function App() {
  return (
    <Provider>
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
    </Provider>
  );
}


const signUpConfig = {
  header: "Sign up for McCafferyToGo",
  hideAllDefaults: true,
  signUpFields: [
    {
      label: "Username",
      key: "preferred_username",
      required: true,
      displayOrder: 1,
      type: "string",
      placeholder: "Enter username (must be a valid email)",
    },
    {
      label: "Password",
      key: "password",
      required: true,
      displayOrder: 2,
      type: "password",
      placeholder: "Enter password",
    },
  ],
};

LogBox.ignoreLogs(['new NativeEventEmitter']);

export default withAuthenticator(App, { signUpConfig });