import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

export const validateEmail = ( email: string ) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

export const validateUsername = ( username: string ) => {
    const regex = /^[a-zA-Z0-9]+$/;
    return username.length >= 5 && regex.test(username);
}

export const validatePassword = (password: string) => {
    return password.length >= 6
}

export const validateAge = (age: string) => {
    try {
        const numAge = parseInt(age)
        return numAge > 13 && numAge < 100
    } catch (error) {
        return false
    }
}

export const storeToken = async (token: string) => {
    try {
        await SecureStore.setItemAsync('userToken', token)
    } catch (error) {
        console.log('Failed to store token: ', error)
    }
}

export const getToken = async () => {
    return await SecureStore.getItemAsync('userToken')
}

export const removeToken = async () => {
    try {
        await SecureStore.deleteItemAsync('userToken')
    } catch (error) {
        console.log("Error removing token")
    }
}

export const clearAllStorageOnLogout = async () => {
    try {
        await SecureStore.deleteItemAsync('userToken')
        await AsyncStorage.clear()
    } catch (error) {
        console.error('Error clearing Secure Store:', error.message);
    }
}