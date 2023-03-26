import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    page: {
      padding: 10,
    },
    name: {
      fontSize: 30,
      fontWeight: '700',
      marginVertical: 10,
    },
    description: {
      color: 'grey',
    },
    separator: {
      height: 1,
      backgroundColor: 'lightgrey',
      marginVertical: 10,
    },
    row: {
      flexDirection: 'row',
      alignItems:'center',
      justifyContent: 'center',
      marginVertical: 10,
    },
    quantity: {
      fontSize: 20,
      marginHorizontal: 20,
    },
    button: {
      backgroundColor: '#fca43a',
      marginTop: 'auto',
      padding: 15,
      alignItems: 'center',
      //borderRadius: 20,
      margin: 10,
    },
    buttonText: {
      color: 'white',
      fontSize: 14,
      fontWeight: '500',
    },
    input: {
      margin: 10,
      backgroundColor: "white",
      padding: 15,
      //borderRadius: 5,
      borderWidth: 1,
      borderColor: 'lightgrey',
      borderRadius: 5,
    },
  });

  export default styles;