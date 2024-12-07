import { LOCAL_API_URL } from "@env"
import axios from 'axios';

const API_URL = `${LOCAL_API_URL}/api/chat`;

export const searchUsers = async (username, currentUser, cursor?) => {
    try {
        const response = await axios.post(`${API_URL}/search_users`, {
            username,
            currentUser,
            cursor
        })
        return response.data
    } catch (error) {
        console.log(error.message)
        throw error.response.data;
    }
}

export const createGroup = async (users, name) => {
    try {
        const response = await axios.post(`${API_URL}/create_group`, {
            users,
            name
        })
        return response.data
    } catch (error) {
        console.log(error.message)
        throw error.response.data;
    }
}

export const getUserGroups = async (userId) => {
    try {
        const response = await axios.post(`${API_URL}/get_user_groups`, {
            userId
        })
        return response.data
    } catch (error) {
        console.log(error.message)
        throw error.response.data;
    }
}

export const getMessagesForGroup = async (groupId) => {
    try {
        const response = await axios.post(`${API_URL}/get_messages_for_group`, {
            groupId
        })
        return response.data
    } catch (error) {
        console.log(error.message)
        throw error.response.data
    }
}

export const getNewestMessagesForGroup = async (groupId, timestamp) => {
    try {
        const response = await axios.post(`${API_URL}/get_newest_messages_for_group`, {
            groupId,
            timestamp
        })
        return response.data
    } catch (error) {
        console.log(error.message)
        throw error.response.data
    }
}

export const createMessage = async (messageData) => {
    const {content, url, mediaType, senderId, groupId} = messageData
    try {
        const response = await axios.post(`${API_URL}/create_message`, {
            content,
            url,
            mediaType,
            senderId,
            groupId
        })
        return response.data
    } catch (error) {
        console.log(error.message)
        throw error.response.data
    }
}