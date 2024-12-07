import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

export const storeMessages = async (groupId: string, messages: string) => {
    try {
        await AsyncStorage.setItem(groupId, messages)
    } catch (error) {
        console.log(`Error storing messages for ${groupId}: `, error.message)
    }
}

export const updateMessages = async(groupId: string, message: object) => {
    const messages = await getMessages(groupId)
    const parsedMessages  = JSON.parse(messages)
    const combined  = [message, ...parsedMessages].slice(0, 20)
    await storeMessages(groupId, JSON.stringify(combined))
}

export const getMessages = async (groupId: string) => {
    try {
        return await AsyncStorage.getItem(groupId)
    } catch (error) {
        console.log(`Error getting messages for ${groupId}: `, error.message)
    }
}