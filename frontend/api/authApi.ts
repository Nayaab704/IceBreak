import { LOCAL_API_URL } from "@env"
import axios from 'axios';

const API_URL = `${LOCAL_API_URL}/api/auth`;

export const register = async (email, username, password, age) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      email,
      username,
      password,
      age
    });
    return response.data;
  } catch (error) {
    console.log(error.message)
    throw error.response.data;
  }
};

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password
    })
    return response.data
  } catch (error) {
    console.log(error.message)
    throw error.response.data
  }
}

export const tokenLogin = async (token) => {
  try {
    const response = await axios.post(`${API_URL}/verify_token`, {
      token
    })
    return response.data
  } catch (error) {
    console.log(error)
    throw error.response.data
  }
}
