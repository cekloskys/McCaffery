import { Text, TextInput, Alert, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Auth, DataStore } from 'aws-amplify';
import styles from './styles';
import { User } from '../../models';
import { useAuthContext } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const validator = require('validator');

const ProfileScreen = () => {
  const { dbUser, authUser } = useAuthContext();
  const [name, setName] = useState(dbUser?.name || "");
  const [eAddress, setEAddress] = useState(dbUser?.email || authUser?.attributes?.email || "");

  const { sub, setDBUser } = useAuthContext();

  const navigation = useNavigation();

  useEffect(() => {
    if (!sub){
      return;
    }
    const s = DataStore.observeQuery(User, (u) =>
      u.sub.eq(sub)
    ).subscribe(({ items }) => {
      setDBUser(items[0]);
    });

    return () => {
      s.unsubscribe();
    };
  }, [sub]);

  const onSave = async () => {
    if (!name) {
      alert('Please enter your fullname.');
      return;
    }
    if (!eAddress || !validator.isEmail(eAddress)) {
      alert('Please enter your valid email address.')
      return;
    }

    if (dbUser) {
      await updateUser();
      alert('Profile updated.');
    } else {
      await createUser();
      alert('Profile saved.');
    }
    navigation.navigate('Restaurants');
  };

  const updateUser = async () => {
    const user = await DataStore.save(
      User.copyOf(dbUser, (updated) => {
        updated.name = name;
        updated.email = eAddress;
      })
    );
    setDBUser(user);
  };

  const createUser = async () => {
    try {
      const user = await DataStore.save(new User({
        name,
        email: eAddress,
        sub
      }));
      setDBUser(user);
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  }

  const signOut = async () => {
    DataStore.clear();
    Auth.signOut()
  };

  return (
    <SafeAreaView style={styles.page}>
      <Text style={styles.title}>Profile</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Enter your fullname"
        style={styles.input}
      />
      <TextInput
        value={eAddress}
        onChangeText={setEAddress}
        placeholder="Enter your valid email address"
        style={styles.input}
        keyboardType='email-address'
      />
      <Pressable onPress={onSave} style={styles.button}>
        <Text style={styles.buttonText}>SAVE</Text>
      </Pressable>
      <Pressable onPress={signOut} style={styles.button}>
        <Text style={styles.buttonText}>SIGN OUT</Text>
      </Pressable>
    </SafeAreaView>
  );
}

export default ProfileScreen;